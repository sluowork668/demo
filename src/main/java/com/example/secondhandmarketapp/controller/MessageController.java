package com.example.secondhandmarketapp.controller;

import com.example.secondhandmarketapp.dto.MessageRequest;
import com.example.secondhandmarketapp.entity.MessageEntity;
import com.example.secondhandmarketapp.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chatRooms")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // 1. 获取某个聊天室的所有消息
    @GetMapping("/{chatRoomId}")
    public List<MessageEntity> listMessages(@PathVariable Long chatRoomId) {
        return messageService.listMessages(chatRoomId);
    }

    // 2. 发送一条消息
    @PostMapping("/{chatRoomId}/messages")
    public MessageEntity sendMessage(
            @PathVariable Long chatRoomId,
            @RequestBody MessageRequest request
    ) {
        return messageService.sendMessage(
                chatRoomId,
                request.sender(),
                request.content(),
                request.messageType()
        );
    }

    // 3. 查询某个用户发送的所有消息，按聊天室分组再按时间排序
    @GetMapping("/messages/bySender/{sender}")
    public Map<Long, List<MessageEntity>> getMessagesGroupedByChatRoom(@PathVariable String sender) {
        return messageService.getMessagesGroupedByChatRoom(sender);
    }
}
