package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.dto.request.ReturnRequestDTO;
import modules.dto.request.ReturnUpdateDTO; // Import mới
import modules.entity.ReturnOrder;
import modules.service.ReturnOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReturnOrderController {

    private final ReturnOrderService returnOrderService;

    // ... (Các API create, get giữ nguyên) ...
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

    @GetMapping
    public ResponseEntity<List<ReturnOrder>> getAllReturns() {
        return ResponseEntity.ok(returnOrderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnOrder> getReturnById(@PathVariable String id) {
        return ResponseEntity.ok(returnOrderService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReturnOrder>> getReturnsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(returnOrderService.findByUserId(userId));
    }

    // --- API SỬA ĐỔI ---
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReturnStatus(
            @PathVariable String id,
            @RequestBody ReturnUpdateDTO body // Nhận DTO thay vì Map
    ) {
        try {
            ReturnOrder updatedReturn = returnOrderService.updateStatus(id, body);
            return ResponseEntity.ok(updatedReturn);
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi server để debug
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}