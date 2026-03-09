# 🧪 萌宠应用 - 完整测试指南

## 方案一：后端 API 测试（推荐先做）

### 方法 1：使用 curl 命令

```bash
# 1. 启动后端服务
cd backend
npm run dev   # 运行在 localhost:3000

# 2. 在另一个终端执行以下命令

# 注册用户
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","nickname":"小白","password":"123456"}'

# 响应示例：
# {
#   "id": 1,
#   "phone": "13800000001",
#   "nickname": "小白",
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
# }

# 3. 保存 token，用于后续请求
TOKEN="your_token_here"

# 登录
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800000001","password":"123456"}'

# 4. 获取当前用户信息（需要 token）
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"

# 5. 创建宠物
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"小汪","type":"狗"}'

# 6. 获取宠物列表
curl -X GET http://localhost:3000/api/pets \
  -H "Authorization: Bearer $TOKEN"

# 7. 获取单个宠物详情（id 从上面的响应获取）
curl -X GET http://localhost:3000/api/pets/1 \
  -H "Authorization: Bearer $TOKEN"

# 8. 更新宠物（喂食、增加经验等）
curl -X PUT http://localhost:3000/api/pets/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"hunger":80,"happiness":90,"experience":50}'

# 9. 删除宠物
curl -X DELETE http://localhost:3000/api/pets/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 方法 2：使用 Postman（推荐新手）

1. **下载 Postman**：https://www.postman.com/downloads/

2. **创建集合**：
   - New → Collection → 命名为 "萌宠API"

3. **添加请求**：
   
   **Request 1 - 注册**
   - Method: POST
   - URL: `http://localhost:3000/api/users/register`
   - Body (JSON):
   ```json
   {
     "phone": "13800000001",
     "nickname": "小白",
     "password": "123456"
   }
   ```
   - Send → 复制响应中的 token

   **Request 2 - 登录**
   - Method: POST
   - URL: `http://localhost:3000/api/users/login`
   - Body (JSON):
   ```json
   {
     "phone": "13800000001",
     "password": "123456"
   }
   ```

   **Request 3 - 创建宠物**
   - Method: POST
   - URL: `http://localhost:3000/api/pets`
   - Headers: 添加 `Authorization: Bearer {token}`
   - Body (JSON):
   ```json
   {
     "name": "小汪",
     "type": "狗"
   }
   ```

   **Request 4 - 获取宠物列表**
   - Method: GET
   - URL: `http://localhost:3000/api/pets`
   - Headers: 添加 `Authorization: Bearer {token}`

4. **保存并运行**

---

## 方案二：前端 H5 测试（推荐次之）

### 最快验证方式

```bash
# 1. 进入前端目录
cd frontend

# 2. 启动开发服务器（H5 模式）
npm run dev:h5

# 自动打开 http://localhost:5173

# 3. 在浏览器中：
#   - 注册账户（手机号：13800000001）
#   - 登录
#   - 创建、查看、编辑、删除宠物
#   - 测试个人中心
```

**调试前端代码**
- 打开浏览器开发者工具（F12）
- Console：查看 API 调用和错误日志
- Network：看请求/响应详情
- Storage：检查本地存储的 token

---

## 方案三：微信小程序测试

### 前置条件

1. **下载微信开发者工具**（必需）
   - 官网：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. **注册小程序账号**（可选，不注册也能本地测试）
   - 地址：https://mp.weixin.qq.com

### 测试步骤

```bash
# 1. 编译小程序代码
cd frontend
npm run dev:mp-weixin

# 输出目录通常在 dist/mp-weixin/

# 2. 打开微信开发者工具
#   - 选择 "导入项目"
#   - 选择 dist/mp-weixin 目录
#   - AppID 可以随意填（本地测试）
#   - 点击 "导入"

# 3. 在开发者工具中测试：
#   - 点击 "编译" 刷新模拟器
#   - 在左侧模拟器中测试应用流程
#   - 点击 "调试" 打开开发者工具查看日志
```

### 微信小程序调试技巧

**打开控制台**
- 在模拟器右下角点击 "调试"
- Console：查看 console.log 输出
- Network：查看网络请求
- Storage：查看本地存储

**常见问题**
```javascript
// 如果提示"域名未验证"，在开发者工具中：
// 右上角 ⚙️ 设置 → 项目设置 → 勾选 "不验证合法域名"（仅本地）
```

---

## 方案四：原生 App 测试

### HBuilderX 打包（推荐）

```bash
# 1. 下载 HBuilderX
# 地址：https://www.dcloud.io/hbuilderx.html

# 2. 用 HBuilderX 打开 frontend 目录
#   - File → Open Folder → 选择 frontend 目录

# 3. 编译模拟器运行
#   - 菜单：运行 → 运行到手机浏览器 → 选择 App 模式

# 4. iOS/Android 真机调试
#   - 需要下载对应 SDK
#   - iOS：需要 Xcode + 开发证书
#   - Android：需要 Android Studio + 调试签名
```

---

## 完整测试流程（15分钟快速验证）

### Step 1：启动前后端（5分钟）

**终端 1 - 启动后端**
```bash
cd backend
npm install    # 首次运行
npm run dev
# 输出：🚀 Server running on http://localhost:3000
```

**终端 2 - 启动前端 H5**
```bash
cd frontend
npm install    # 首次运行
npm run dev:h5
# 自动打开浏览器到 http://localhost:5173
```

### Step 2：前端功能测试（10分钟）

| 步骤 | 操作 | 预期结果 |
|------|------|--------|
| 1 | 点击"没有账号？注册" | 进入注册页面 |
| 2 | 填写注册表单 | 手机号：13800000001，昵称：小白，密码：123456 |
| 3 | 点击注册 | ✅ 自动登录，进入首页 |
| 4 | 点击"我的宠物" | 显示宠物列表（为空） |
| 5 | 点击"+ 添加新宠物" | 进入添加宠物页面 |
| 6 | 填写宠物信息 | 名字：小汪，类型：狗 |
| 7 | 点击创建 | ✅ 宠物列表显示新宠物 |
| 8 | 点击宠物卡片 | 进入宠物详情页 |
| 9 | 点击"🍗 喂食" | 宠物饱食度增加 ✅ |
| 10 | 点击"🎮 玩耍" | 宠物幸福度和经验增加 ✅ |

### Step 3：后端 API 验证（可选）

打开新终端，执行 curl 命令验证数据库：

```bash
# 获取宠物列表
curl -X GET http://localhost:3000/api/pets \
  -H "Authorization: Bearer {你的token}"

# 应该看到刚创建的宠物信息
# [{"id":1,"user_id":1,"name":"小汪","type":"狗",...}]
```

---

## 🔍 常见问题排查

### ❌ "无法连接到服务器"
```bash
# 检查后端是否运行
curl http://localhost:3000/api/health
# 应该返回 {"status":"Server is running"}
```

### ❌ "认证失败"
```javascript
// 检查 token 是否有效
// 打开浏览器 F12 → Console → 输入：
localStorage.getItem('auth_token')
// 如果为空或 null，需要重新登录
```

### ❌ "数据库错误"
```bash
# 删除旧数据库重新初始化
cd backend
rm petapp.db
npm run dev   # 会自动重建
```

### ❌ "小程序调试提示域名错误"
```
微信开发者工具 → 右上角 ⚙️ → 项目设置 → 勾选 "不验证合法域名"
```

---

## 📊 验证检查清单

- [ ] 后端 npm install 和 npm run dev 成功
- [ ] 前端 npm install 和 npm run dev:h5 成功
- [ ] 能打开 http://localhost:5173
- [ ] 注册新账号成功
- [ ] 登录成功进入首页
- [ ] 创建宠物成功
- [ ] 查看宠物列表成功
- [ ] 编辑宠物（喂食/玩耍）成功
- [ ] 删除宠物成功
- [ ] 个人中心页面能打开
- [ ] 退出登录成功回到登录页

---

## 下一步测试建议

1. **压力测试**：创建 100 只宠物，测试性能
2. **边界测试**：尝试非法输入（特殊字符、超长文本）
3. **并发测试**：多个浏览器标签页同时操作
4. **离线测试**：断网后再恢复，检查数据同步
5. **真机测试**：在真实手机上测试小程序版本

---

**祝测试顺利！如遇问题，查看浏览器 F12 控制台的错误信息。**
