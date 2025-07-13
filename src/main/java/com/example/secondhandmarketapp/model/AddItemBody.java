package com.example.secondhandmarketapp.model;

import java.math.BigDecimal;
import java.util.List;

public record AddItemBody(
        String title,
        String description,
        BigDecimal price,
        String category,
        Long sellerId,
        List<String> imageUrls
) {}
