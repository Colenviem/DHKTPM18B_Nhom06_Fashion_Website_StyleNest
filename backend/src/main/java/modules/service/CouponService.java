package modules.service;

import modules.entity.Coupon;

import java.util.List;

public interface CouponService {
    List<Coupon> findAll();

    Coupon findById(String id);
}
