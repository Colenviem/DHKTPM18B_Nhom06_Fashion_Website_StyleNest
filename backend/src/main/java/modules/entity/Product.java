package modules.entity;

import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private String image;
    private String shortDescription;
    private CategoryRef category;
    private double price;
    private double discount;
    private int sold;
    private List<ProductVariant> variants;
    private List<String> tags;
    private boolean isAvailable;
    private Rating rating;
    private String brand;
    private String material;
    private String origin;
    private long views;
    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}