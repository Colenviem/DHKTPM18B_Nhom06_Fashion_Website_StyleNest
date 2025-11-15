package modules.service;

import modules.entity.Coupon;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CouponService {
    List<Coupon> findAll();

    Coupon findById(String id);

    Coupon addCoupon(Coupon coupon);

    Coupon updateCoupon(String code, Coupon updatedCoupon);

    boolean deleteCoupon(String code);
}