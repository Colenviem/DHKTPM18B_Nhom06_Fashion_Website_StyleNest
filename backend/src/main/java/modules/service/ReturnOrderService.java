package modules.service;

import modules.dto.request.ReturnRequestDTO;
import modules.dto.request.ReturnUpdateDTO; // Import mới
import modules.entity.ReturnOrder;

import java.util.List;

public interface ReturnOrderService {
    ReturnOrder createReturnRequest(ReturnRequestDTO request);

    List<ReturnOrder> findAll();

    ReturnOrder findById(String id);

    List<ReturnOrder> findByUserId(String userId);

    // Sửa dòng này: nhận ReturnUpdateDTO thay vì String lẻ
    ReturnOrder updateStatus(String returnOrderId, ReturnUpdateDTO request);
}