package modules.service;

import modules.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> findAll();

    Product findById(String id);

    List<Product> findOutOfStockProducts();

    List<Product> findProductsBySize(String size);
}
