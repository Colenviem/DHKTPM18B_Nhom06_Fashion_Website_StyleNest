package modules.service;

import modules.entity.Brand;

import java.util.List;

public interface BrandService {
    List<Brand> findAll();

    Brand findById(String id);

    List<Brand> findByName(String name);

    Brand save(Brand brand);

    Brand update(String id, Brand brand);

    void deleteById(String id);

    Brand toggleActive(String id);
}
