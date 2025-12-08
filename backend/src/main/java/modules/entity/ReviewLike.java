package modules.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ReviewLikes")
public class ReviewLike {

    @Id
    private String id;

    @Indexed
    private String reviewId;

    @Indexed
    private String userId;

    @CreatedDate
    private Instant createdAt;
}

