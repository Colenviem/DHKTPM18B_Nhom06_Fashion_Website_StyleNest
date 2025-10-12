package modules.service;

import modules.entity.Brand;
import modules.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {
    private final BrandRepository repository;

    public BrandService(BrandRepository repository) {
        this.repository = repository;
    }

    public List<Brand> findAll() {
        return repository.findAll();
    }

    public Brand findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
