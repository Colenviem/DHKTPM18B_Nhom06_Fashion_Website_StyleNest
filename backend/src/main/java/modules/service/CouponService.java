package modules.service;

import modules.entity.Coupon;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CouponService {
    List<Coupon> findAll();

    Coupon findById(String id);

    Coupon findByCode(String code);

    Coupon addCoupon(Coupon coupon);

    Coupon updateCoupon(Coupon updatedCoupon);

    boolean deleteCoupon(String code);
}