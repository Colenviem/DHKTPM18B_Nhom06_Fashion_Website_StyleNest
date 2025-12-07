package modules.controller;

import lombok.RequiredArgsConstructor;
import modules.entity.Coupon;
import modules.service.CouponService;
import modules.service.impl.CouponServiceImpl;
import org.springframework.beans.factory.annotation.Qualifier;
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
        Coupon coupon = service.findByCode(code);
        return coupon != null
            ? ResponseEntity.ok(coupon)
            : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Coupon> create(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(service.addCoupon(coupon));
    }

    @PutMapping("/{code}")
    public ResponseEntity<Coupon> update(@RequestBody Coupon updatedCoupon) {
        System.out.println("Received update request for coupon: " + updatedCoupon);
        Coupon updated = service.updateCoupon(updatedCoupon);
        return updated != null
            ? ResponseEntity.ok(updated)
            : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = service.deleteCoupon(id);
        return deleted
            ? ResponseEntity.noContent().build()
            : ResponseEntity.notFound().build();
    }
}