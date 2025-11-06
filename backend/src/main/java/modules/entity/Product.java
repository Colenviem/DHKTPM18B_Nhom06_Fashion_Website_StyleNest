package modules.entity;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-.,'()]+$", message = "Tên sản phẩm chỉ chứa chữ cái, số, khoảng trắng và các ký tự -.,'()")
    private String name;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(min = 10, max = 2000, message = "Mô tả phải từ 10 đến 2000 ký tự")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\p{P}\\p{S}]+$", message = "Mô tả chỉ chứa chữ cái, số, khoảng trắng, dấu câu và ký tự đặc biệt cơ bản")
    private String description;

    @NotBlank(message = "Mô tả ngắn không được để trống")
    @Size(max = 255, message = "Mô tả ngắn tối đa 255 ký tự")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\p{P}\\p{S}]+$", message = "Mô tả ngắn chỉ chứa chữ cái, số, khoảng trắng, dấu câu và ký tự đặc biệt cơ bản")
    private String shortDescription;

    @NotNull(message = "Danh mục sản phẩm không được để trống")
    @Valid
    private CategoryRef category;

    @Positive(message = "Giá sản phẩm phải lớn hơn 0")
    private double price;

    @DecimalMin(value = "0.0", inclusive = true, message = "Giảm giá không được nhỏ hơn 0")
    @DecimalMax(value = "100", inclusive = true, message = "Giảm giá tối đa là 100%")
    private double discount;

    @Min(value = 0, message = "Số lượng bán không được âm")
    private int sold;

    @Valid
    @NotEmpty(message = "Phải có ít nhất một biến thể sản phẩm (variant)")
    private List<ProductVariant> variants;

    @Size(max = 10, message = "Tối đa 10 thẻ tag cho sản phẩm")
    private List<@NotBlank(message = "Tag không được để trống") @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-]+$", message = "Tag chỉ chứa chữ cái, số, khoảng trắng và dấu gạch ngang") String> tags;

    private boolean isAvailable = true;

    @Valid
    private Rating rating;

    @NotBlank(message = "Thương hiệu không được để trống")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-.,'()]+$", message = "Thương hiệu chỉ chứa chữ cái, số, khoảng trắng và các ký tự -.,'()")
    private String brand;

    @NotBlank(message = "Chất liệu không được để trống")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-.,'()]+$", message = "Chất liệu chỉ chứa chữ cái, số, khoảng trắng và các ký tự -.,'()")
    private String material;

    @NotBlank(message = "Xuất xứ không được để trống")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-.,'()]+$", message = "Xuất xứ chỉ chứa chữ cái, số, khoảng trắng và các ký tự -.,'()")
    private String origin;

    @Min(value = 0, message = "Lượt xem không được âm")
    private long views = 0;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}