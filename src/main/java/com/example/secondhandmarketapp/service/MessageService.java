package com.example.secondhandmarketapp.service;

import com.example.secondhandmarketapp.entity.MessageEntity;
import com.example.secondhandmarketapp.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.LinkedHashMap;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // 1. 发送一条消息
    public MessageEntity sendMessage(Long chatRoomId, String sender, String content, String messageType) {
        MessageEntity message = new MessageEntity(
                null,
                messageType,
                content,
                chatRoomId,
                sender,
                LocalDateTime.now()
        );

        return messageRepository.save(message);
    }

    // 2. 获取某个聊天室的消息列表
    public List<MessageEntity> listMessages(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId);
    }

    // 3. 获取某个用户发送的所有消息，按聊天室分组，时间升序
    public Map<Long, List<MessageEntity>> getMessagesGroupedByChatRoom(String sender) {
        List<MessageEntity> messages = messageRepository.findBySenderOrderBySentAtAsc(sender);

        return messages.stream()
                .collect(Collectors.groupingBy(
                        message -> message.getChatRoomId(),
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
    }
}
