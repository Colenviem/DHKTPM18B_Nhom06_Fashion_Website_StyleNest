package modules.service.impl;

import modules.entity.Coupon;
import modules.repository.CouponRepository;
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
}
