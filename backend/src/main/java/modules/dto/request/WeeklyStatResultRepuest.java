package modules.dto.request;

import lombok.Data;

@Data
public class WeeklyStatResultRepuest {
    private final long orderCount;
    private final long totalAmount;
}