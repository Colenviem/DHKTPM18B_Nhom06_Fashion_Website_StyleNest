package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.entity.Coupon;
import modules.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService service;

    @GetMapping
    public ResponseEntity<List<Coupon>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getByCode(@PathVariable String code) {
        Coupon coupon = service.updateCoupon(code, null); // tạm lấy bằng service repo.findByCode
        return coupon != null
            ? ResponseEntity.ok(coupon)
            : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Coupon> create(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(service.addCoupon(coupon));
    }

    @PutMapping("/{code}")
    public ResponseEntity<Coupon> update(
        @PathVariable String code,
        @RequestBody Coupon updatedCoupon
    ) {
        Coupon updated = service.updateCoupon(code, updatedCoupon);
        return updated != null
            ? ResponseEntity.ok(updated)
            : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        boolean deleted = service.deleteCoupon(code);
        return deleted
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}
