package com.example.secondhandmarketapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
public class ChatRoomEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String buyer;
    private String seller;
    
    @Column(name = "item_id")
    private Long itemId;
    
    private Boolean closed;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // 默认构造函数
    public ChatRoomEntity() {}

    // 全参数构造函数
    public ChatRoomEntity(Long id, String name, String buyer, String seller, 
                         Long itemId, Boolean closed, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.buyer = buyer;
        this.seller = seller;
        this.itemId = itemId;
        this.closed = closed;
        this.createdAt = createdAt;
    }

    // Getter和Setter方法
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }

    public String getSeller() { return seller; }
    public void setSeller(String seller) { this.seller = seller; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Boolean getClosed() { return closed; }
    public void setClosed(Boolean closed) { this.closed = closed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
