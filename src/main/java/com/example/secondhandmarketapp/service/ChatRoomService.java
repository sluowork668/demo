package com.example.secondhandmarketapp.service;

import com.example.secondhandmarketapp.entity.ChatRoomEntity;
import com.example.secondhandmarketapp.repository.ChatRoomRepository;
import com.example.secondhandmarketapp.dto.ChatRoomResponse;
import com.example.secondhandmarketapp.dto.ChatRoomSummaryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    // 1. 创建新的聊天室或返回已有聊天室
    public ChatRoomEntity createOrGetChatRoom(String buyer, String seller, Long itemId) {
        // 查找是否已存在
        List<ChatRoomEntity> existing = chatRoomRepository.findByBuyerAndSeller(buyer, seller);
        Optional<ChatRoomEntity> match = existing.stream().filter(r -> r.getItemId().equals(itemId)).findFirst();

        if (match.isPresent()) {
            return match.get();
        }

        // 构造新聊天室
        ChatRoomEntity newRoom = new ChatRoomEntity(
                null,
                "chat-" + buyer + "-" + seller + "-" + itemId,
                buyer,
                seller,
                itemId,
                false,
                LocalDateTime.now()
        );

        return chatRoomRepository.save(newRoom);
    }

    // 2. 获取用户参与的所有聊天室
    public List<ChatRoomSummaryResponse> getChatRoomsByUser(String username) {
        List<ChatRoomEntity> rooms = chatRoomRepository.findByBuyer(username);
        rooms.addAll(chatRoomRepository.findBySeller(username));

        return rooms.stream()
                .map(room -> new ChatRoomSummaryResponse(
                        room.getId(),
                        room.getName(),
                        room.getBuyer(),
                        room.getSeller(),
                        room.getItemId(),
                        room.getClosed(),
                        room.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // 3. 获取聊天室详细信息
    public ChatRoomResponse getChatRoomInfo(Long id) {
        ChatRoomEntity room = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found with id: " + id));

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

    // 4. 关闭聊天室
    public void closeChatRoom(Long id) {
        ChatRoomEntity room = chatRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat room not found with id: " + id));

        ChatRoomEntity updated = new ChatRoomEntity(
                room.getId(),
                room.getName(),
                room.getBuyer(),
                room.getSeller(),
                room.getItemId(),
                true, // 改为已关闭
                room.getCreatedAt()
        );

        chatRoomRepository.save(updated);
    }
}
