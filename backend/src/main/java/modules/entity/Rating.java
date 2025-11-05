package modules.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    private double average;
    private int count;
}