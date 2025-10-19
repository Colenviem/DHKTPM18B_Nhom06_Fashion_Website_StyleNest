package modules.entity;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private ProductRef product;
    private int quantity;
    private long priceAtTime;

    public ProductRef getProduct() {
        return product;
    }

    public void setProduct(ProductRef product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public long getPriceAtTime() {
        return priceAtTime;
    }

    public void setPriceAtTime(long priceAtTime) {
        this.priceAtTime = priceAtTime;
    }
}
