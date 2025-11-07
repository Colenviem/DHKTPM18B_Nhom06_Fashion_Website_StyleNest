package modules.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Reviews")
public class Review {
    @Id
    private String id;
    private UserRef user;
    private ProductRef product;
    private Integer rating;
    private String comment;
    private List<String> images;
    private Boolean isApproved;
    private Integer likes;
    @CreatedDate
    private Instant createdAt;
}