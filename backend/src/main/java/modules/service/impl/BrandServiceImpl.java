package modules.service.impl;

import modules.entity.Brand;
import modules.repository.BrandRepository;
import modules.service.BrandService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    private final BrandRepository repository;

    public BrandServiceImpl(BrandRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Brand> findAll() {
        return repository.findAll(
                Sort.by(
                        Sort.Order.desc("isFeatured")
                )
        );
    }

    @Override
    public Brand findById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<Brand> findByName(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public Brand save(Brand brand) {
        Instant now = Instant.now();

        if (brand.getCreatedAt() == null) {
            brand.setCreatedAt(now);
        }
        brand.setUpdatedAt(now);

        return repository.save(brand);
    }

    @Override
    public Brand update(String id, Brand brand) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(brand.getName());
                    existing.setDescription(brand.getDescription());
                    existing.setLogoUrl(brand.getLogoUrl());
                    existing.setActive(brand.isActive());
                    existing.setFeatured(brand.isFeatured());
                    existing.setUpdatedAt(Instant.now());
                    return repository.save(existing);
                })
                .orElse(null);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public Brand toggleActive(String id) {
        return repository.findById(id)
                .map(brand -> {
                    brand.setActive(!brand.isActive());
                    brand.setUpdatedAt(Instant.now());
                    return repository.save(brand);
                })
                .orElse(null);
    }
}