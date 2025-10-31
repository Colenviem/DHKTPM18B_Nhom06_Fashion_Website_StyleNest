package modules.service;

import modules.entity.Brand;

import java.util.List;

public interface BrandService {
    List<Brand> findAll();

    Brand findById(String id);
}
