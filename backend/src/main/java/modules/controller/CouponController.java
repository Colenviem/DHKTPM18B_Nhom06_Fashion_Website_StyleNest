package modules.controller;

import modules.entity.Coupon;
import modules.service.CouponService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {
    private final CouponService service;

    public CouponController(CouponService service) {
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
}
