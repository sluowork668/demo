package com.example.secondhandmarketapp.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, backend is working!";
    }

    @PostMapping("/signup-test")
    public String signupTest(@RequestBody String body) {
        return "Signup test received: " + body;
    }
} 