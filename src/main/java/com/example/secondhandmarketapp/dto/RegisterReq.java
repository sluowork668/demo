package com.example.secondhandmarketapp.dto;

//注册请求体 DTO

public record RegisterReq(
        String username,
        String email,
        String password,
        String firstName,
        String lastName,
        String phoneNumber,
        String address,
        String city,
        String state,
        String zipCode,
        String country,
        String role
) {}
