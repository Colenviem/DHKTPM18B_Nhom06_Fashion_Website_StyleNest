package modules.controller;

import modules.entity.Brand;
import modules.service.BrandService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {
    private final BrandService service;

    public BrandController(BrandService service) {
        this.service = service;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Brand findById(@PathVariable String id) {
        return service.findById(id);
    }
}
