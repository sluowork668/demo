package com.example.secondhandmarketapp.controller;

import com.example.secondhandmarketapp.dto.ItemDto;
import com.example.secondhandmarketapp.model.AddItemBody;
import com.example.secondhandmarketapp.service.ItemService;
import com.example.secondhandmarketapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/items")
@CrossOrigin(origins = "*")
public class ItemController {

    private final ItemService itemService;
    private final UserService userService;

    public ItemController(ItemService itemService, UserService userService) {
        this.itemService = itemService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ItemDto> addItem(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            // 从token中获取用户ID
            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            // 处理图片上传（这里简化处理，实际应该调用文件上传服务）
            List<String> imageUrls = new ArrayList<>();
            if (images != null) {
                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        // 这里应该调用文件上传服务
                        // 暂时使用占位符
                        imageUrls.add("/api/images/placeholder.jpg");
                    }
                }
            }
            
            AddItemBody body = new AddItemBody(
                    title,
                    description,
                    new java.math.BigDecimal(price),
                    category,
                    userId,
                    imageUrls
            );
            
            ItemDto result = itemService.addItem(body);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<ItemDto> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{id}")
    public ItemDto getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    @PutMapping("/{id}")
    public ItemDto updateItem(@PathVariable Long id, @RequestBody AddItemBody body) {
        return itemService.updateItem(id, body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // 从token中获取用户ID
            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            // 检查商品是否存在且属于当前用户
            ItemDto item = itemService.getItemById(id);
            if (item == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (!item.sellerId().equals(userId)) {
                return ResponseEntity.status(403).body("You can only delete your own items");
            }
            
            itemService.deleteItem(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete item: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/mark-sold")
    public ItemDto markAsSold(@PathVariable Long id) {
        return itemService.markAsSold(id);
    }

    // 删除test商品的API端点
    @DeleteMapping("/test-items")
    public ResponseEntity<String> deleteTestItems() {
        try {
            itemService.deleteTestItems();
            return ResponseEntity.ok("Test items deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete test items: " + e.getMessage());
        }
    }
}
