package modules.controller;

import modules.entity.Coupon;
import modules.service.impl.CouponServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponServiceImpl service;

    public CouponController(CouponServiceImpl service) {
        this.service = service;
    }

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Coupon findById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Coupon addCoupon(@RequestBody Coupon coupon) {
        if (coupon.getId() == null) {
            coupon.setId(coupon.getCode());
        }
        return service.addCoupon(coupon);
    }

    @PutMapping("/{code}")
    public Coupon updateCoupon(@PathVariable String code, @RequestBody Coupon updatedCoupon) {
        return service.updateCoupon(code, updatedCoupon);
    }


    @DeleteMapping("/{code}")
    public String deleteCoupon(@PathVariable String code) {
        return service.deleteCoupon(code).getBody();
    }
}
