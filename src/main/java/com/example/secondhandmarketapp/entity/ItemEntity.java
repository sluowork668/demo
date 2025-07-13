package com.example.secondhandmarketapp.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "items")
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    
    @Column(name = "seller_id")
    private Long sellerId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "is_sold")
    private Boolean isSold = false;
    
    @ElementCollection
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    // 默认构造函数
    public ItemEntity() {}

    // 全参数构造函数
    public ItemEntity(Long id, String title, String description, BigDecimal price, 
                     String category, Long sellerId, LocalDateTime createdAt, Boolean isSold, List<String> imageUrls) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.sellerId = sellerId;
        this.createdAt = createdAt;
        this.isSold = isSold != null ? isSold : false;
        this.imageUrls = imageUrls;
    }

    // Getter和Setter方法
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getIsSold() { return isSold; }
    public void setIsSold(Boolean isSold) { this.isSold = isSold; }
    
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    // 兼容性方法
    public Boolean getSold() { return isSold; }
    public void setSold(Boolean isSold) { this.isSold = isSold; }
}