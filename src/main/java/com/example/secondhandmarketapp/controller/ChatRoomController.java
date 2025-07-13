package com.example.secondhandmarketapp.controller;

import com.example.secondhandmarketapp.dto.ChatRoomRequest;
import com.example.secondhandmarketapp.dto.ChatRoomResponse;
import com.example.secondhandmarketapp.dto.ChatRoomSummaryResponse;
import com.example.secondhandmarketapp.entity.ChatRoomEntity;
import com.example.secondhandmarketapp.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatRooms")
public class ChatRoomController {

    @Autowired
    private ChatRoomService chatRoomService;

    // 1. 创建或返回已有聊天室
    @PostMapping
    public ChatRoomResponse createOrGetChatRoom(@RequestBody ChatRoomRequest request) {
        ChatRoomEntity room = chatRoomService.createOrGetChatRoom(
                request.buyer(),
                request.seller(),
                request.itemId()
        );

        return new ChatRoomResponse(
                room.getId(),
                room.getName(),
                room.getBuyer(),
                room.getSeller(),
                room.getItemId(),
                room.getClosed(),
                room.getCreatedAt()
        );
    }

    // 2. 获取用户参与的所有聊天室(对话列表)
    @GetMapping("/user/{username}")
    public List<ChatRoomSummaryResponse> getChatRoomsByUser(@PathVariable String username) {
        return chatRoomService.getChatRoomsByUser(username);
    }

    // 3. 获取某个聊天室详情
    @GetMapping("/{id}/info")
    public ChatRoomResponse getChatRoomInfo(@PathVariable Long id) {
        return chatRoomService.getChatRoomInfo(id);
    }

    // 4. 关闭聊天室
    @PutMapping("/{id}/close")
    public void closeChatRoom(@PathVariable Long id) {
        chatRoomService.closeChatRoom(id);
    }
}
