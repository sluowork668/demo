package com.example.secondhandmarketapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ChatRoomRequest(
        String buyer,
        String seller,
        @JsonProperty("itemId")
        Long itemId
) {}
