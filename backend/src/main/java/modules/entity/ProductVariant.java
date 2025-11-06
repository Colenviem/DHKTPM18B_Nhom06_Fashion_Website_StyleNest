package modules.entity;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @NotBlank(message = "SKU không được để trống")
    @Pattern(regexp = "^[A-Z0-9\\-]+$", message = "SKU chỉ chứa chữ cái in hoa, số và dấu gạch ngang")
    private String sku;

    @NotBlank(message = "Màu sắc không được để trống")
    @Pattern(regexp = "^[\\p{L}\\s\\-]+$", message = "Màu sắc chỉ chứa chữ cái, khoảng trắng và dấu gạch ngang")
    private String color;

    @NotBlank(message = "Kích cỡ không được để trống")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-]+$", message = "Kích cỡ chỉ chứa chữ cái, số, khoảng trắng và dấu gạch ngang")
    private String size;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Tồn kho không được âm")
    private Integer inStock;

    @NotEmpty(message = "Phải có ít nhất một hình ảnh cho biến thể sản phẩm")
    private List<@NotBlank(message = "Đường dẫn ảnh không được để trống") @Pattern(regexp = "^https?://.*", message = "Đường dẫn ảnh phải là URL hợp lệ bắt đầu bằng http hoặc https") String> images;

    private boolean isAvailable = true;
}