package modules.service.impl;

import modules.entity.Coupon;
import modules.repository.CouponRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponServiceImpl implements modules.service.CouponService {
    private final CouponRepository repository;

    public CouponServiceImpl(CouponRepository repository) {
        this.repository = repository;
    }

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
        return repository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(String code, Coupon updatedCoupon) {
        return repository.findById(code).map(existingCoupon -> {
            existingCoupon.setType(updatedCoupon.getType());
            existingCoupon.setDiscount(updatedCoupon.getDiscount());
            existingCoupon.setDescription(updatedCoupon.getDescription());
            existingCoupon.setMinimumOrderAmount(updatedCoupon.getMinimumOrderAmount());
            existingCoupon.setExpirationDate(updatedCoupon.getExpirationDate());
            existingCoupon.setUsageLimit(updatedCoupon.getUsageLimit());
            existingCoupon.setUsedCount(updatedCoupon.getUsedCount());
            existingCoupon.setActive(updatedCoupon.isActive());
            return repository.save(existingCoupon);
        }).orElseGet(() -> {
            updatedCoupon.setCode(code);
            return repository.save(updatedCoupon);
        });
    }


    @Override
    public ResponseEntity<String> deleteCoupon(String code) {
        return repository.findById(code).map(existingCoupon -> {
            repository.delete(existingCoupon);
            return ResponseEntity.ok("Coupon deleted successfully");
        }).orElseGet(() -> ResponseEntity.status(404).body("Coupon not found"));
    }
}
