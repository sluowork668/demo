package com.example.secondhandmarketapp.repository;

import com.example.secondhandmarketapp.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Long> {

    // 根据买家查找聊天室
    List<ChatRoomEntity> findByBuyer(String buyer);
    // 根据卖家查找聊天室
    List<ChatRoomEntity> findBySeller(String seller);

    // 根据商品ID查找聊天室
    List<ChatRoomEntity> findByItemId(Long itemId);

    // 根据是否关闭查找聊天室
    List<ChatRoomEntity> findByClosed(Boolean closed);

    // 根据买家和卖家查找聊天室
    List<ChatRoomEntity> findByBuyerAndSeller(String buyer, String seller);

    // 根据商品ID和买家查找聊天室
    List<ChatRoomEntity> findByItemIdAndBuyer(Long itemId, String buyer);
}
