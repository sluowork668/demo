# 注册功能测试指南

## 问题分析
您遇到的 "Something went wrong" 错误主要是由于以下问题：

1. **前后端数据结构不匹配**
   - 前端只发送 email 和 password
   - 后端期望完整的用户信息（username, firstName, lastName 等）

2. **实体类配置问题**
   - UserEntity 使用了错误的注解（Spring Data JDBC vs JPA）
   - Repository 接口类型不匹配

3. **数据库表结构问题**
   - 缺少 authorities 表
   - users 表结构与实体类不匹配

## 已修复的问题

### 1. 实体类修复
- 将 `UserEntity` 从 record 改为 class
- 使用 JPA 注解 (`@Entity`, `@Table`, `@Id`)
- 添加了完整的 getter/setter 方法

### 2. Repository 修复
- 将 `UserRepository` 从 `CrudRepository` 改为 `JpaRepository`
- 确保与 JPA 实体兼容

### 3. 前端表单修复
- 在注册模式下添加了所有必需字段
- 修改了 API 调用，发送完整数据
- 更新了 TypeScript 类型定义

### 4. 数据库脚本修复
- 更新了 `users` 表结构，添加了所有必需字段
- 添加了 `authorities` 表用于 Spring Security
- 修复了外键约束

### 5. 服务层修复
- 修复了实体创建方式
- 添加了简单的 JWT token 生成逻辑
- 修复了方法调用

## 测试步骤

### 1. 启动服务
```bash
# 启动后端
./gradlew bootRun

# 启动前端
cd frontend
npm run dev
```

### 2. 访问注册页面
- 打开浏览器访问：http://localhost:5173/register
- 填写完整的注册信息：
  - Email: test@example.com
  - Password: password123
  - First Name: 测试
  - Last Name: 用户
  - 其他字段可选

### 3. 验证注册
- 点击注册按钮
- 应该看到成功消息
- 自动跳转到首页

### 4. 测试登录
- 访问：http://localhost:5173/login
- 使用刚注册的邮箱和密码登录

## 常见问题排查

### 如果仍然出现 "Something went wrong"
1. 检查浏览器开发者工具的网络面板
2. 查看具体的错误响应
3. 检查后端日志输出

### 如果后端启动失败
1. 检查端口 8080 是否被占用
2. 查看 Gradle 构建日志
3. 确认数据库配置正确

### 如果前端启动失败
1. 检查 Node.js 版本
2. 确认所有依赖已安装：`npm install`
3. 查看 Vite 启动日志

## 技术细节

### 修复的关键文件
- `src/main/java/com/example/secondhandmarketapp/entity/UserEntity.java`
- `src/main/java/com/example/secondhandmarketapp/repository/UserRepository.java`
- `src/main/java/com/example/secondhandmarketapp/service/UserService.java`
- `frontend/src/components/AuthForm.tsx`
- `frontend/src/services/authApi.ts`
- `src/main/resources/db-init.sql`

### API 接口
- `POST /api/auth/signup` - 用户注册
- `POST /api/auth/login` - 用户登录

### 数据流程
1. 前端收集用户输入
2. 发送完整数据到后端
3. 后端验证数据
4. 创建 Spring Security 用户
5. 保存 JPA 实体
6. 生成 JWT token
7. 返回成功响应 