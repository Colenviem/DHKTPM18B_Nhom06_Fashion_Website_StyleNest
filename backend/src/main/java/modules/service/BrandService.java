package modules.service;

import modules.entity.Brand;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BrandService {
    List<Brand> findAll();

    Brand findById(String id);

    List<Brand> findByName(String name);

    Brand save(Brand brand);

    Brand update(String id, Brand brand);

    void deleteById(String id);
}
