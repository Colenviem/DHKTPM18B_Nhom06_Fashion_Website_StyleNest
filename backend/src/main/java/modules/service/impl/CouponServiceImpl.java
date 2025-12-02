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
      System.out.println("Adding coupon: " + coupon);
    return repository.save(coupon);
  }

  @Override
    public Coupon findByCode(String code) {
        return repository.findAll().stream()
            .filter(coupon -> coupon.getCode().equals(code))
            .findFirst()
            .orElse(null);
    }

  @Override
  public Coupon updateCoupon(Coupon updatedCoupon) {
    return repository.findById(updatedCoupon.getId())
        .map(existing -> {
          existing.setCode(updatedCoupon.getCode());
          existing.setType(updatedCoupon.getType());
          existing.setDiscount(updatedCoupon.getDiscount());
          existing.setDescription(updatedCoupon.getDescription());
          existing.setMinimumOrderAmount(updatedCoupon.getMinimumOrderAmount());
          existing.setExpirationDate(updatedCoupon.getExpirationDate());
          existing.setUsageLimit(updatedCoupon.getUsageLimit());
          existing.setUsedCount(updatedCoupon.getUsedCount());
          existing.setActive(updatedCoupon.isActive());
          return repository.save(existing);
        }).orElse(null);
  }

  @Override
  public boolean deleteCoupon(String id) {
    return repository.findById(id)
        .map(existing -> {
          repository.delete(existing);
          return true;
        })
        .orElse(false);
  }
}