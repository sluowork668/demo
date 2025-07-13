package com.example.secondhandmarketapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "message")
public class MessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_type")
    private String messageType;

    private String content;

    @Column(name = "chat_room_id")
    private Long chatRoomId;

    private String sender;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    // 默认构造函数
    public MessageEntity() {}

    // 全参数构造函数
    public MessageEntity(Long id, String messageType, String content, 
                        Long chatRoomId, String sender, LocalDateTime sentAt) {
        this.id = id;
        this.messageType = messageType;
        this.content = content;
        this.chatRoomId = chatRoomId;
        this.sender = sender;
        this.sentAt = sentAt;
    }

    // Getter和Setter方法
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getChatRoomId() { return chatRoomId; }
    public void setChatRoomId(Long chatRoomId) { this.chatRoomId = chatRoomId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
