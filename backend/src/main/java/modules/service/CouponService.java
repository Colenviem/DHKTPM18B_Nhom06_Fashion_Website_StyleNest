package modules.service;

import modules.entity.Coupon;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CouponService {
    List<Coupon> findAll();

    Coupon findById(String id);

    Coupon addCoupon(Coupon coupon);
    Coupon updateCoupon(String code, Coupon updatedCoupon);
    ResponseEntity<String> deleteCoupon(String code);
}
