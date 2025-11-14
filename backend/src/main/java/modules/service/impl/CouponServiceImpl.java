package modules.service.impl;

import lombok.RequiredArgsConstructor;
import modules.entity.Coupon;
import modules.repository.CouponRepository;
import modules.service.CouponService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

  private final CouponRepository repository;

  @Override
  public List<Coupon> findAll() {
    return repository.findAll();
  }

  @Override
  public Coupon findById(String id) {
    return repository.findById(id).orElse(null);
  }

  @Override
  public Coupon addCoupon(Coupon coupon) {
    // tạo id nếu null
    if (coupon.getId() == null) {
      coupon.setId(coupon.getCode());
    }
    return repository.save(coupon);
  }

  @Override
  public Coupon updateCoupon(String code, Coupon updatedCoupon) {
    return repository.findById(code)
        .map(existing -> {
          existing.setType(updatedCoupon.getType());
          existing.setDiscount(updatedCoupon.getDiscount());
          existing.setDescription(updatedCoupon.getDescription());
          existing.setMinimumOrderAmount(updatedCoupon.getMinimumOrderAmount());
          existing.setExpirationDate(updatedCoupon.getExpirationDate());
          existing.setUsageLimit(updatedCoupon.getUsageLimit());
          existing.setUsedCount(updatedCoupon.getUsedCount());
          existing.setActive(updatedCoupon.isActive());
          return repository.save(existing);
        })
        .orElseGet(() -> {
          updatedCoupon.setCode(code);
          return repository.save(updatedCoupon);
        });
  }

  @Override
  public boolean deleteCoupon(String code) {
    return repository.findById(code)
        .map(existing -> {
          repository.delete(existing);
          return true;
        })
        .orElse(false);
  }
}