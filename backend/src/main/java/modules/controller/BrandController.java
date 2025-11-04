package modules.controller;

import modules.entity.Brand;
import modules.service.BrandService;
import modules.service.impl.BrandServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<Brand> getAll() {
        return brandService.findAll();
    }

    @GetMapping("/{id}")
    public Brand getById(@PathVariable String id) {
        return brandService.findById(id);
    }

    @GetMapping("/search")
    public List<Brand> searchBrands(@RequestParam String keyword) {

        return brandService.findByName(keyword);
    }

    @PostMapping
    public Brand createBrand(@RequestBody Brand brand) {
        brand.setCreatedAt(Instant.now());
        brand.setUpdatedAt(Instant.now());
        return brandService.save(brand);
    }

    @PutMapping("/{id}")
    public Brand updateBrand(@PathVariable String id, @RequestBody Brand brand) {
        Brand existing = brandService.findById(id);
        if (existing != null) {
            existing.setName(brand.getName());
            existing.setDescription(brand.getDescription());
            existing.setLogoUrl(brand.getLogoUrl());
            existing.setActive(brand.isActive());
            existing.setFeatured(brand.isFeatured());
            existing.setUpdatedAt(Instant.now());
            return brandService.save(existing);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        brandService.deleteById(id);
    }

    @PutMapping("/{id}/toggleActive")
    public Brand toggleActive(@PathVariable String id) {
        return brandService.toggleActive(id);
    }
}