package com.example.secondhandmarketapp.service;

import com.example.secondhandmarketapp.dto.ItemDto;
import com.example.secondhandmarketapp.entity.ItemEntity;
import com.example.secondhandmarketapp.model.AddItemBody;
import com.example.secondhandmarketapp.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public ItemDto addItem(AddItemBody body) {
        ItemEntity entity = new ItemEntity(
                null,
                body.title(),
                body.description(),
                body.price(),
                body.category(),
                body.sellerId(),
                LocalDateTime.now(),
                false,
                body.imageUrls() != null ? body.imageUrls() : new ArrayList<>()
        );
        return toDto(itemRepository.save(entity));
    }

    public List<ItemDto> getAllItems() {
        Iterable<ItemEntity> itemEntities = itemRepository.findAll();
        List<ItemDto> itemDtos = new ArrayList<>();
        for (ItemEntity item : itemEntities) {
            itemDtos.add(toDto(item));
        }
        return itemDtos;
    }

    public ItemDto getItemById(Long id) {
        Optional<ItemEntity> optional = itemRepository.findById(id);
        return optional.map(this::toDto).orElse(null);
    }

    public ItemDto updateItem(Long id, AddItemBody body) {
        Optional<ItemEntity> optional = itemRepository.findById(id);
        if (optional.isPresent()) {
            ItemEntity existing = optional.get();
            ItemEntity updated = new ItemEntity(
                    existing.getId(),
                    body.title(),
                    body.description(),
                    body.price(),
                    body.category(),
                    body.sellerId(),
                    existing.getCreatedAt(),
                    existing.getSold(),
                    body.imageUrls() != null ? body.imageUrls() : new ArrayList<>()
            );
            return toDto(itemRepository.save(updated));
        }
        return null;
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    // 删除test用户发布的test商品
    public void deleteTestItems() {
        // 查找所有test用户发布的test商品
        List<ItemEntity> testItems = itemRepository.findByTitleContainingIgnoreCase("test");
        
        // 过滤出test用户发布的商品
        List<ItemEntity> itemsToDelete = testItems.stream()
                .filter(item -> {
                    // 这里可以根据需要调整过滤条件
                    // 比如检查sellerId是否对应test用户
                    return item.getTitle().equalsIgnoreCase("test");
                })
                .toList();
        
        // 删除找到的商品
        for (ItemEntity item : itemsToDelete) {
            System.out.println("Deleting test item: " + item.getTitle() + " (ID: " + item.getId() + ")");
            itemRepository.deleteById(item.getId());
        }
        
        System.out.println("Deleted " + itemsToDelete.size() + " test items");
    }

    public ItemDto markAsSold(Long id) {
        Optional<ItemEntity> optional = itemRepository.findById(id);
        if (optional.isPresent()) {
            ItemEntity existing = optional.get();
            ItemEntity updated = new ItemEntity(
                    existing.getId(),
                    existing.getTitle(),
                    existing.getDescription(),
                    existing.getPrice(),
                    existing.getCategory(),
                    existing.getSellerId(),
                    existing.getCreatedAt(),
                    true, // replace isSold with true
                    existing.getImageUrls()
            );
            return toDto(itemRepository.save(updated));
        }
        return null;
    }


    private ItemDto toDto(ItemEntity item) {
        String status = item.getIsSold() ? "SOLD" : "AVAILABLE";
        return new ItemDto(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getPrice(),
                item.getCategory(),
                item.getSellerId(),
                item.getImageUrls() != null ? item.getImageUrls() : new ArrayList<>(),
                status,
                item.getCreatedAt(),
                item.getCreatedAt() // 暂时使用createdAt作为updatedAt
        );
    }
}