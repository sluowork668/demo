package com.example.secondhandmarketapp.dto;

import java.time.LocalDateTime;

public record ChatRoomResponse(
        Long id,
        String name,
        String buyer,
        String seller,
        Long itemId,
        Boolean closed,
        LocalDateTime createdAt
) {}
