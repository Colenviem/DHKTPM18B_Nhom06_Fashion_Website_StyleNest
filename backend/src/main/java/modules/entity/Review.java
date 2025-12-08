package modules.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    private int rating;
    private String comment;
    private List<String> images;
    @JsonProperty("isApproved")
    private boolean isApproved;
    @CreatedDate
    private Instant createdAt;
}