package com.example.secondhandmarketapp.repository;

import com.example.secondhandmarketapp.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    // 根据聊天室ID查找消息
    List<MessageEntity> findByChatRoomId(Long chatRoomId);

    // 根据发送者查找消息
    List<MessageEntity> findBySender(String sender);
    
    // 根据发送者查找消息并按发送时间升序排序
    List<MessageEntity> findBySenderOrderBySentAtAsc(String sender);

    // 根据消息类型查找消息
    List<MessageEntity> findByMessageType(String messageType);

    // 根据聊天室ID和发送时间排序查找消息
    List<MessageEntity> findByChatRoomIdOrderBySentAtAsc(Long chatRoomId);
}
