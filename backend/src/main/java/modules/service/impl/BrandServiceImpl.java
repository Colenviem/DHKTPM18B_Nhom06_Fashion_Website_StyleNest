package modules.service.impl;

import modules.entity.Brand;
import modules.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandServiceImpl implements modules.service.BrandService {
    private final BrandRepository repository;

    public BrandServiceImpl(BrandRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Brand> findAll() {
        return repository.findAll();
    }

    @Override
    public Brand findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
