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
@CrossOrigin(origins = "${FRONTEND_URL}")
@RequiredArgsConstructor
public class ReturnOrderController {

    private final ReturnOrderService returnOrderService;

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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateReturnStatus(
            @PathVariable String id,
            @RequestBody ReturnUpdateDTO body
    ) {
        try {
            ReturnOrder updatedReturn = returnOrderService.updateStatus(id, body);
            return ResponseEntity.ok(updatedReturn);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}