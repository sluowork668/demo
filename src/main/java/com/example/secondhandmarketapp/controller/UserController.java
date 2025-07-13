package com.example.secondhandmarketapp.controller;

import com.example.secondhandmarketapp.dto.AuthTokenDTO;
import com.example.secondhandmarketapp.dto.RegisterReq;
import com.example.secondhandmarketapp.dto.LoginReq;
import com.example.secondhandmarketapp.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthTokenDTO signup(@RequestBody RegisterReq req) {
        return userService.signUp(req);
    }

    @PostMapping("/login")
    public AuthTokenDTO login(@RequestBody LoginReq req) {
        return userService.login(req);
    }

    @PostMapping("/update-usernames")
    public String updateUsernames() {
        userService.updateMissingUsernames();
        return "Username update completed successfully";
    }
}
