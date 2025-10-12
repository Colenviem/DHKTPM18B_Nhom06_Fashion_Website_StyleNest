package modules.service;

import modules.entity.Coupon;
import modules.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponService {
    private final CouponRepository repository;

    public CouponService(CouponRepository repository) {
        this.repository = repository;
    }

    public List<Coupon> findAll() {
        return repository.findAll();
    }

    public Coupon findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
