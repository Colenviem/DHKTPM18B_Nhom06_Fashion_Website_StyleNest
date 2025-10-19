package modules.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    private double average;
    private int count;

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}