package com.example.secondhandmarketapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ItemDto(
        Long id,
        String title,
        String description,
        BigDecimal price,
        String category,
        Long sellerId,
        List<String> imageUrls,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
