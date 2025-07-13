package com.example.secondhandmarketapp.dto;

public record LoginReq(
        String usernameOrEmail,
        String password
) {}
