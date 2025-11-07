package modules.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRef {

    @NotBlank(message = "ID danh mục không được để trống")
    @Field("id")
    private String id;

    @NotBlank(message = "Tên danh mục không được để trống")
    @Pattern(regexp = "^[\\p{L}\\p{N}\\s\\-.,'()]+$", message = "Tên danh mục chỉ chứa chữ cái, số, khoảng trắng và các ký tự -.,'()")
    private String name;
}