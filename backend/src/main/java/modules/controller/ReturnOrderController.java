package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.dto.request.ReturnRequestDTO;
import modules.entity.ReturnOrder;
import modules.service.ReturnOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "http://localhost:5173") // Cấu hình CORS cho React
@RequiredArgsConstructor
public class ReturnOrderController {

    private final ReturnOrderService returnOrderService;

    // User: Tạo yêu cầu trả hàng
    @PostMapping
    public ResponseEntity<?> createReturnRequest(@RequestBody ReturnRequestDTO request) {
        try {
            ReturnOrder newReturn = returnOrderService.createReturnRequest(request);
            return ResponseEntity.ok(newReturn);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Admin: Xem tất cả yêu cầu
    @GetMapping
    public ResponseEntity<List<ReturnOrder>> getAllReturns() {
        return ResponseEntity.ok(returnOrderService.findAll());
    }

    // User/Admin: Xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<ReturnOrder> getReturnById(@PathVariable String id) {
        return ResponseEntity.ok(returnOrderService.findById(id));
    }

    // User: Xem lịch sử trả hàng của mình
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReturnOrder>> getReturnsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(returnOrderService.findByUserId(userId));
    }

    // Admin: Duyệt/Từ chối yêu cầu
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReturnStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        try {
            String status = body.get("status");
            String note = body.get("adminNote");
            ReturnOrder updatedReturn = returnOrderService.updateStatus(id, status, note);
            return ResponseEntity.ok(updatedReturn);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}