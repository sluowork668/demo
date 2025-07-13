package com.example.secondhandmarketapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final String uploadDir = "uploads/";

    public FileUploadController() {
        // 确保上传目录存在
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/images")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("images") MultipartFile[] files) {
        List<String> imageUrls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    // 生成唯一文件名
                    String originalFilename = file.getOriginalFilename();
                    String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String filename = UUID.randomUUID().toString() + extension;
                    
                    // 保存文件
                    Path filePath = Paths.get(uploadDir + filename);
                    Files.write(filePath, file.getBytes());
                    
                    // 返回文件URL
                    String imageUrl = "/api/images/" + filename;
                    imageUrls.add(imageUrl);
                    
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.badRequest().build();
                }
            }
        }
        
        return ResponseEntity.ok(imageUrls);
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir + filename);
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok()
                    .header("Content-Type", "image/jpeg")
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 