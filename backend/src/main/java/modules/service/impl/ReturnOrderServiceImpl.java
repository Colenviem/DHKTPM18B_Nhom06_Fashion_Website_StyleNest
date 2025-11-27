package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.dto.request.ReturnRequestDTO;
import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ReturnOrderRepository;
import modules.repository.UserRepository;
import modules.service.ReturnOrderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects; // <--- QUAN TRỌNG: Import thư viện này để so sánh null an toàn

@Service
@RequiredArgsConstructor
public class ReturnOrderServiceImpl implements ReturnOrderService {

    private final ReturnOrderRepository returnOrderRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    // Hàm lấy UserID hiện tại
    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) throw new RuntimeException("No authentication found");

        Object principal = authentication.getPrincipal();
        if (principal instanceof modules.entity.Account) {
            return ((modules.entity.Account) principal).getUserId();
        } else if (principal instanceof String) {
            User user = userRepo.findByEmail((String) principal)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return user.getId();
        }
        throw new RuntimeException("Cannot extract user ID");
    }

    @Override
    @Transactional
    public ReturnOrder createReturnRequest(ReturnRequestDTO request) {
        String userId = getCurrentUserId();

        // 1. Kiểm tra đơn hàng gốc
        Order originalOrder = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found: " + request.getOrderId()));

        // 2. Validate quyền sở hữu
        if (originalOrder.getUser() == null || !originalOrder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền trả hàng cho đơn này");
        }

        // 3. Validate trạng thái (Chấp nhận Delivered hoặc Completed)
        if (!"Delivered".equalsIgnoreCase(originalOrder.getStatus()) && !"Completed".equalsIgnoreCase(originalOrder.getStatus())) {
            throw new RuntimeException("Đơn hàng phải được giao thành công mới có thể trả hàng");
        }

        long totalRefundCalculated = 0;
        List<ReturnItem> returnItems = new ArrayList<>();

        // 4. Xử lý từng sản phẩm khách chọn trả
        for (ReturnRequestDTO.ReturnItemRequest reqItem : request.getItems()) {

            // --- ĐOẠN CODE ĐÃ SỬA LỖI NULL POINTER ---
            // Sử dụng Objects.equals để so sánh an toàn, tránh lỗi khi variantId bị null
            OrderItem originalItem = originalOrder.getItems().stream()
                    .filter(item ->
                            Objects.equals(item.getProduct().getId(), reqItem.getProductId()) &&
                                    Objects.equals(item.getVariantId(), reqItem.getVariantId())
                    )
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong đơn hàng (ProductId: " + reqItem.getProductId() + ")"));
            // ------------------------------------------

            // Validate số lượng
            if (reqItem.getQuantity() > originalItem.getQuantity()) {
                throw new RuntimeException("Số lượng trả vượt quá số lượng mua: " + originalItem.getProduct().getName());
            }

            // Tính tiền hoàn lại (Giá lúc mua * Số lượng trả)
            long itemRefundAmount = reqItem.getQuantity() * originalItem.getUnitPrice();
            totalRefundCalculated += itemRefundAmount;

            // Tạo Entity ReturnItem
            ReturnItem returnItem = new ReturnItem();
            returnItem.setProduct(originalItem.getProduct());
            returnItem.setVariantId(reqItem.getVariantId());
            returnItem.setQuantity(reqItem.getQuantity());
            returnItem.setRefundPrice(itemRefundAmount);
            returnItem.setNote(reqItem.getNote());

            returnItems.add(returnItem);
        }

        // 5. Tạo ReturnOrder
        ReturnOrder returnOrder = new ReturnOrder();
        returnOrder.setOrderId(originalOrder.getId());
        returnOrder.setUserId(userId);
        returnOrder.setItems(returnItems);
        returnOrder.setImages(request.getImages());
        returnOrder.setReason(request.getReason());
        returnOrder.setTotalRefundAmount(totalRefundCalculated);
        returnOrder.setStatus("PENDING"); // Trạng thái mặc định: Chờ duyệt
        returnOrder.setCreatedAt(Instant.now());
        returnOrder.setUpdatedAt(Instant.now());

        // (Tùy chọn) Cập nhật trạng thái đơn gốc
        // originalOrder.setStatus("ReturnRequested");
        // orderRepo.save(originalOrder);

        return returnOrderRepo.save(returnOrder);
    }

    @Override
    public List<ReturnOrder> findAll() {
        return returnOrderRepo.findAll();
    }

    @Override
    public ReturnOrder findById(String id) {
        return returnOrderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu trả hàng"));
    }

    @Override
    public List<ReturnOrder> findByUserId(String userId) {
        return returnOrderRepo.findByUserId(userId);
    }

    @Override
    public ReturnOrder updateStatus(String returnOrderId, String status, String adminNote) {
        ReturnOrder returnOrder = findById(returnOrderId);
        returnOrder.setStatus(status);
        returnOrder.setAdminNote(adminNote);
        returnOrder.setUpdatedAt(Instant.now());

        return returnOrderRepo.save(returnOrder);
    }
}