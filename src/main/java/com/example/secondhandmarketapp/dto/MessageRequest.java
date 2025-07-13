package com.example.secondhandmarketapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MessageRequest(
        @JsonProperty("sender")
        String sender,

        @JsonProperty("content")
        String content,

        @JsonProperty("messageType")
        String messageType
) {}
