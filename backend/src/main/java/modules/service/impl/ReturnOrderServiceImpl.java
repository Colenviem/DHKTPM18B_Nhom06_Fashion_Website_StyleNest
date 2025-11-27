package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.dto.request.ReturnRequestDTO;
import modules.dto.request.ReturnUpdateDTO;
import modules.entity.*;
import modules.repository.OrderRepository;
import modules.repository.ProductRepository;
import modules.repository.ReturnOrderRepository;
import modules.repository.UserRepository;
import modules.service.ReturnOrderService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReturnOrderServiceImpl implements ReturnOrderService {

    private final ReturnOrderRepository returnOrderRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    private static final List<String> DAMAGED_KEYWORDS = Arrays.asList(
            "hư", "hỏng", "rách", "vỡ", "lỗi", "bẩn", "cũ",
            "móp", "méop", "trầy", "xước", "không hoạt động"
    );

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) throw new RuntimeException("Chưa đăng nhập");
        Object principal = authentication.getPrincipal();
        if (principal instanceof modules.entity.Account) {
            return ((modules.entity.Account) principal).getUserId();
        } else if (principal instanceof String) {
            User user = userRepo.findByEmail((String) principal).orElseThrow(() -> new RuntimeException("Không tìm thấy User"));
            return user.getId();
        }
        throw new RuntimeException("Không thể xác thực người dùng");
    }

    @Override
    @Transactional
    public ReturnOrder createReturnRequest(ReturnRequestDTO request) {
        String userId = getCurrentUserId();

        Order originalOrder = orderRepo.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + request.getOrderId()));

        if (originalOrder.getUser() == null || !originalOrder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền thao tác trên đơn hàng này.");
        }

        String status = originalOrder.getStatus();
        if ("ReturnRequested".equalsIgnoreCase(status)) {
            throw new RuntimeException("Đơn hàng này đang chờ xử lý trả hàng.");
        }
        if ("Returned".equalsIgnoreCase(status) || "Refunded".equalsIgnoreCase(status)) {
            throw new RuntimeException("Đơn hàng này đã hoàn tất thủ tục trả hàng/hoàn tiền.");
        }
        if (!"Delivered".equalsIgnoreCase(status) && !"Completed".equalsIgnoreCase(status)) {
            throw new RuntimeException("Đơn hàng chưa được giao thành công.");
        }

        Instant deliveryTime = originalOrder.getUpdatedAt() != null ? originalOrder.getUpdatedAt() : originalOrder.getCreatedAt();
        long daysBetween = ChronoUnit.DAYS.between(deliveryTime, Instant.now());

        if (daysBetween > 7) {
            throw new RuntimeException("Đã quá hạn đổi trả (7 ngày).");
        }

        List<ReturnOrder> existingRequests = returnOrderRepo.findByOrderId(originalOrder.getId());
        if (!existingRequests.isEmpty()) {
            throw new RuntimeException("Bạn đã gửi yêu cầu trả hàng cho đơn này rồi.");
        }

        long totalRefundCalculated = 0;
        List<ReturnItem> returnItems = new ArrayList<>();

        for (ReturnRequestDTO.ReturnItemRequest reqItem : request.getItems()) {
            OrderItem originalItem = originalOrder.getItems().stream()
                    .filter(item -> Objects.equals(item.getProduct().getId(), reqItem.getProductId()) &&
                            Objects.equals(item.getVariantId(), reqItem.getVariantId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại trong đơn hàng"));

            if (reqItem.getQuantity() > originalItem.getQuantity()) {
                throw new RuntimeException("Số lượng trả vượt quá số lượng đã mua");
            }

            long itemRefundAmount = reqItem.getQuantity() * originalItem.getUnitPrice();
            totalRefundCalculated += itemRefundAmount;

            ReturnItem returnItem = new ReturnItem();
            returnItem.setProduct(originalItem.getProduct());
            returnItem.setVariantId(reqItem.getVariantId());
            returnItem.setQuantity(reqItem.getQuantity());
            returnItem.setRefundPrice(itemRefundAmount);
            returnItem.setNote(reqItem.getNote());
            returnItem.setStatus("PENDING");

            returnItems.add(returnItem);
        }

        ReturnOrder returnOrder = new ReturnOrder();
        returnOrder.setOrderId(originalOrder.getId());
        returnOrder.setUserId(userId);
        returnOrder.setItems(returnItems);
        returnOrder.setImages(request.getImages());
        returnOrder.setReason(request.getReason());
        returnOrder.setTotalRefundAmount(totalRefundCalculated);
        returnOrder.setStatus("PENDING");
        returnOrder.setCreatedAt(Instant.now());
        returnOrder.setUpdatedAt(Instant.now());

        originalOrder.setStatus("ReturnRequested");
        orderRepo.save(originalOrder);

        return returnOrderRepo.save(returnOrder);
    }

    @Override
    public List<ReturnOrder> findAll() {
        return returnOrderRepo.findAll();
    }

    @Override
    public ReturnOrder findById(String id) {
        return returnOrderRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));
    }

    @Override
    public List<ReturnOrder> findByUserId(String userId) {
        return returnOrderRepo.findByUserId(userId);
    }

    @Override
    @Transactional
    public ReturnOrder updateStatus(String returnOrderId, ReturnUpdateDTO request) {
        ReturnOrder returnOrder = findById(returnOrderId);
        returnOrder.setAdminNote(request.getAdminNote());

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            long newTotalRefundAmount = 0;
            boolean hasApprovedItem = false;

            for (ReturnItem item : returnOrder.getItems()) {
                for (ReturnUpdateDTO.ItemDecision decision : request.getItems()) {
                    if (Objects.equals(item.getProduct().getId(), decision.getProductId()) &&
                            Objects.equals(item.getVariantId(), decision.getVariantId())) {

                        item.setStatus(decision.getStatus());
                        if ("APPROVED".equalsIgnoreCase(decision.getStatus())) {
                            newTotalRefundAmount += item.getRefundPrice();
                            hasApprovedItem = true;
                        }
                    }
                }
            }
            returnOrder.setTotalRefundAmount(newTotalRefundAmount);
            returnOrder.setStatus(hasApprovedItem ? "APPROVED" : "REJECTED");
        }
        else {
            if (request.getStatus() != null) {
                if ("REFUNDED".equalsIgnoreCase(request.getStatus()) && !"REFUNDED".equalsIgnoreCase(returnOrder.getStatus())) {
                    restockProductInventory(returnOrder);

                    Order originalOrder = orderRepo.findById(returnOrder.getOrderId()).orElse(null);
                    if (originalOrder != null) {
                        originalOrder.setStatus("Returned");
                        orderRepo.save(originalOrder);
                    }
                }

                returnOrder.setStatus(request.getStatus());
            }
        }

        returnOrder.setUpdatedAt(Instant.now());
        return returnOrderRepo.save(returnOrder);
    }

    /**
     * Hàm xử lý hoàn kho thông minh:
     * 1. Luôn trừ số lượng đã bán (sold) vì đơn hàng bị hủy một phần/toàn bộ.
     * 2. Chỉ cộng lại tồn kho (inStock) nếu sản phẩm KHÔNG bị hư hỏng.
     */
    private void restockProductInventory(ReturnOrder returnOrder) {
        for (ReturnItem item : returnOrder.getItems()) {
            if ("APPROVED".equalsIgnoreCase(item.getStatus())) {
                Product product = productRepo.findById(item.getProduct().getId()).orElse(null);

                if (product != null) {
                    boolean isUpdated = false;
                    boolean isDamaged = isProductDamaged(item.getNote());
                    if (!isDamaged && product.getVariants() != null) {
                        for (ProductVariant variant : product.getVariants()) {
                            if (Objects.equals(variant.getSku(), item.getVariantId())) {
                                int currentStock = variant.getInStock() != null ? variant.getInStock() : 0;
                                variant.setInStock(currentStock + item.getQuantity());
                                isUpdated = true;
                                break;
                            }
                        }
                    } else {
                        isUpdated = true;
                    }
                    if (isUpdated) {
                        int currentSold = product.getSold();
                        product.setSold(Math.max(0, currentSold - item.getQuantity()));
                        productRepo.save(product);
                    }
                }
            }
        }
    }

    private boolean isProductDamaged(String note) {
        if (note == null || note.trim().isEmpty()) {
            return false;
        }
        String lowerNote = note.toLowerCase();
        return DAMAGED_KEYWORDS.stream().anyMatch(lowerNote::contains);
    }
}