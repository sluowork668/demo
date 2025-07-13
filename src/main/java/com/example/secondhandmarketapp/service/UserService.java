package com.example.secondhandmarketapp.service;

import com.example.secondhandmarketapp.entity.UserEntity;
import com.example.secondhandmarketapp.repository.UserRepository;
import com.example.secondhandmarketapp.dto.RegisterReq;
import com.example.secondhandmarketapp.dto.LoginReq;
import com.example.secondhandmarketapp.dto.AuthTokenDTO;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;
import java.util.Date;
import java.util.Optional;

/**
 * Service layer handling registration, authentication and profile retrieval.
 */
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsManager userDetailsManager;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserDetailsManager userDetailsManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userDetailsManager = userDetailsManager;
    }

    /**
     * Register a new user and return a JWT token.
     */
    @Transactional
    public AuthTokenDTO signUp(RegisterReq req) {
        String email = req.email().toLowerCase();
        String username = req.username();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already registered");
        }

        // 1. Persist domain entity (for business data)
        UserEntity entity = new UserEntity();
        entity.setUsername(username);
        entity.setEmail(email);
        entity.setPassword(passwordEncoder.encode(req.password()));
        entity.setFirstName(req.firstName());
        entity.setLastName(req.lastName());
        entity.setPhoneNumber(req.phoneNumber());
        entity.setAddress(req.address());
        entity.setCity(req.city());
        entity.setState(req.state());
        entity.setZipCode(req.zipCode());
        entity.setCountry(req.country());
        entity.setRole(req.role());
        entity.setEnabled(true);
        
        userRepository.save(entity);

        // 2. Create Spring‑Security user for authentication
        UserDetails userDetails = User.builder()
                .username(username)
                .password(passwordEncoder.encode(req.password()))
                .roles("USER")
                .build();
        userDetailsManager.createUser(userDetails);

        // 3. Produce JWT token
        String token = generateSimpleToken(username);
        return new AuthTokenDTO(token);
    }

    /**
     * Authenticate user and return JWT token.
     */
    @Transactional(readOnly = true)
    public AuthTokenDTO login(LoginReq req) {
        String usernameOrEmail = req.usernameOrEmail();
        UserEntity user = null;
        
        // 先查用户名
        var byUsername = userRepository.findByUsername(usernameOrEmail);
        if (byUsername != null && !byUsername.isEmpty()) {
            user = byUsername.get(0);
        } else {
            var byEmail = userRepository.findByEmail(usernameOrEmail);
            if (byEmail.isPresent()) {
                user = byEmail.get();
            } else {
                throw new IllegalArgumentException("User not found");
            }
        }

        // 1. Verify credentials via Spring Security
        UserDetails userDetails = userDetailsManager.loadUserByUsername(user.getUsername());
        if (!passwordEncoder.matches(req.password(), userDetails.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        // 2. Issue token
        String token = generateSimpleToken(user.getUsername());
        return new AuthTokenDTO(token);
    }

    /**
     * 从token中获取用户ID
     */
    @Transactional(readOnly = true)
    public Long getUserIdFromToken(String token) {
        try {
            // 解析token获取用户名
            String[] parts = token.split("\\.");
            if (parts.length >= 2) {
                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                // 简单的JSON解析，提取sub字段
                String username = extractUsernameFromPayload(payload);
                
                // 根据用户名查找用户
                var users = userRepository.findByUsername(username);
                if (users != null && !users.isEmpty()) {
                    return users.get(0).getId();
                }
            }
            throw new IllegalArgumentException("Invalid token");
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token");
        }
    }

    /**
     * 从payload中提取用户名
     */
    private String extractUsernameFromPayload(String payload) {
        // 简单的字符串解析，查找"sub":"username"模式
        int subIndex = payload.indexOf("\"sub\":\"");
        if (subIndex != -1) {
            int startIndex = subIndex + 7;
            int endIndex = payload.indexOf("\"", startIndex);
            if (endIndex != -1) {
                return payload.substring(startIndex, endIndex);
            }
        }
        throw new IllegalArgumentException("Invalid token payload");
    }

    /**
     * 生成简单的JWT token
     */
    private String generateSimpleToken(String username) {
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = "{\"sub\":\"" + username + "\",\"iat\":" + new Date().getTime() + "}";
        
        String encodedHeader = Base64.getUrlEncoder().withoutPadding().encodeToString(header.getBytes());
        String encodedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes());
        
        return encodedHeader + "." + encodedPayload + ".signature";
    }

    /**
     * 为没有username的用户添加username
     */
    @Transactional
    public void updateMissingUsernames() {
        // 获取所有用户
        var allUsers = userRepository.findAll();
        
        for (UserEntity user : allUsers) {
            String currentUsername = user.getUsername();
            
            // 如果username为空或null，生成一个新的
            if (currentUsername == null || currentUsername.trim().isEmpty()) {
                String newUsername = generateUsernameFromEmail(user.getEmail(), user.getId());
                user.setUsername(newUsername);
                userRepository.save(user);
                System.out.println("Updated user " + user.getEmail() + " with username: " + newUsername);
            }
        }
    }

    /**
     * 从email生成username
     */
    private String generateUsernameFromEmail(String email, Long userId) {
        String emailPrefix = email.split("@")[0];
        String baseUsername = emailPrefix.replaceAll("[^a-zA-Z0-9]", "");
        
        // 确保username不为空
        if (baseUsername.isEmpty()) {
            baseUsername = "user";
        }
        
        // 检查username是否已存在
        String finalUsername = baseUsername;
        int counter = 1;
        
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = baseUsername + "_" + counter;
            counter++;
        }
        
        return finalUsername;
    }
}

