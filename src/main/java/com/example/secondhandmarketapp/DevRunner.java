package com.example.secondhandmarketapp;

import com.example.secondhandmarketapp.dto.RegisterReq;
import com.example.secondhandmarketapp.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DevRunner implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(DevRunner.class);

    private final UserService userService;

    public DevRunner(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // RegisterReq testUser = new RegisterReq("team3@mail.com", "password", "Team", "Three");
        // userService.signUp(testUser);
        // logger.info("Test user created at startup: {}", testUser.email());
    }
}