package com.example.secondhandmarketapp.repository;

import com.example.secondhandmarketapp.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

    // 根据卖家ID查找商品
    List<ItemEntity> findBySellerId(Long sellerId);

    // 根据类别查找商品
    List<ItemEntity> findByCategory(String category);

    // 根据是否已售出查找商品
    List<ItemEntity> findByIsSold(Boolean isSold);

    // 根据标题模糊查找商品
    List<ItemEntity> findByTitleContainingIgnoreCase(String title);

    // 根据价格范围查找商品
    List<ItemEntity> findByPriceBetween(java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice);
}
