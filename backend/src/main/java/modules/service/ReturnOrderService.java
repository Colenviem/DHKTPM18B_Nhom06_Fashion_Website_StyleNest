package modules.service;

import modules.dto.request.ReturnRequestDTO;
import modules.entity.ReturnOrder;

import java.util.List;

public interface ReturnOrderService {
    ReturnOrder createReturnRequest(ReturnRequestDTO request);

    List<ReturnOrder> findAll();

    ReturnOrder findById(String id);

    List<ReturnOrder> findByUserId(String userId);

    ReturnOrder updateStatus(String returnOrderId, String status, String adminNote);
}