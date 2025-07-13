package com.example.secondhandmarketapp.repository;

import com.example.secondhandmarketapp.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // 按用户名查找
    List<UserEntity> findByUsername(String username);

    // 按用户名和密码查找
    List<UserEntity> findByUsernameAndPassword(String username, String password);

    // 根据姓名查找
    List<UserEntity> findByFirstNameAndLastName(String firstName, String lastName);

    //根据名查找
    List<UserEntity> findByFirstName(String firstName);

    //根据姓查找
    List<UserEntity> findByLastName(String lastName);

    Optional<UserEntity> findByEmail(String email);

    // 检查邮箱是否存在
    boolean existsByEmail(String email);

    // 检查用户名是否存在
    boolean existsByUsername(String username);
}
