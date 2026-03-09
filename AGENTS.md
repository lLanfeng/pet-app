# AGENTS.md - 项目上下文指南

本文档为 AI 代理提供项目的关键上下文信息，以便更有效地协助开发工作。

---

## 项目概述

**萌宠应用** - 一个全栈宠物养成 Web 应用，支持用户注册、登录、创建和管理虚拟宠物。采用前后端分离架构，支持跨平台部署。

| 属性 | 值 |
|------|-----|
| 项目类型 | 全栈 Web 应用 |
| 前端框架 | Vue 3 + TypeScript + Pinia |
| 后端框架 | Express.js |
| 数据库 | SQLite |
| 构建工具 | Vite |
| 状态 | 生产就绪 |

---

## 目录结构

```
小程序/
├── backend/                    # 后端服务
│   ├── server.js               # 应用入口，端口 3000
│   ├── db.js                   # SQLite 数据库初始化
│   ├── middleware.js           # 错误处理中间件
│   ├── validators.js           # 数据验证
│   ├── models/                 # 数据模型
│   │   ├── user.js             # 用户 CRUD
│   │   ├── pet.js              # 宠物 CRUD
│   │   └── stats.js            # 统计数据
│   └── routes/                 # API 路由
│       ├── users.js            # /api/users
│       ├── pets.js             # /api/pets
│       ├── tasks.js            # /api/tasks
│       ├── shop.js             # /api/shop
│       └── achievements.js     # /api/achievements
│
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── App.vue             # 根组件
│   │   ├── main.ts             # 入口文件
│   │   ├── pages/              # 页面组件 (13 个页面)
│   │   ├── stores/             # Pinia 状态管理
│   │   │   ├── auth.ts         # 认证状态
│   │   │   └── pets.ts         # 宠物状态
│   │   ├── services/           # API 服务
│   │   │   ├── api.ts          # API 方法定义
│   │   │   └── http.ts         # Axios 封装
│   │   └── router/             # Vue Router
│   ├── pages.json              # uni-app 页面配置
│   └── vite.config.ts          # Vite 配置
│
├── docs/                       # 文档
├── README.md                   # 项目说明
├── USAGE.md                    # 使用指南
└── TEST_RESULTS.md             # 测试报告
```

---

## 构建与运行命令

### 后端服务

```bash
# 进入后端目录
cd backend

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run dev
# 或
node server.js

# 服务地址: http://localhost:3000
```

### 前端应用

```bash
# 进入前端目录
cd frontend

# 安装依赖（首次）
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 开发地址: http://localhost:5173
```

### 完整启动流程

```bash
# 终端 1: 启动后端
cd backend && node server.js

# 终端 2: 启动前端
cd frontend && npm run dev
```

---

## API 端点

### 用户管理 (`/api/users`)

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/register` | 用户注册 |
| POST | `/login` | 用户登录 |
| GET | `/:id` | 获取用户信息 |
| PUT | `/:id` | 更新用户信息 |
| POST | `/:id/sign` | 每日签到 |
| GET | `/:id/assets` | 获取用户资产 |

### 宠物管理 (`/api/pets`)

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/` | 创建宠物 |
| GET | `/user/:userId` | 获取用户宠物列表 |
| GET | `/types` | 获取可领养宠物类型 |
| GET | `/:id` | 获取宠物详情 |
| PUT | `/:id` | 更新宠物属性 |
| POST | `/:id/action` | 宠物互动 (feed/play/train/clean) |
| DELETE | `/:id` | 删除宠物 |

### 任务系统 (`/api/tasks`)

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/` | 获取任务列表 |
| GET | `/daily` | 获取每日任务 |
| POST | `/:id/claim` | 领取任务奖励 |

### 商店系统 (`/api/shop`)

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/categories` | 获取商品分类 |
| GET | `/` | 获取商品列表 |
| POST | `/buy` | 购买商品 |
| GET | `/inventory` | 获取用户背包 |
| POST | `/use` | 使用物品 |

### 成就系统 (`/api/achievements`)

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/categories` | 获取成就分类 |
| GET | `/` | 获取成就列表 |
| POST | `/:id/claim` | 领取成就奖励 |

### 其他

| 方法 | 端点 | 功能 |
|------|------|------|
| GET | `/api/health` | 健康检查 |

---

## 数据库结构

### 主要表

| 表名 | 说明 |
|------|------|
| `users` | 用户信息 (id, phone, nickname, password_hash, coins, diamonds, level) |
| `pets` | 宠物信息 (id, user_id, name, type, level, experience, hunger, happiness, energy) |
| `user_stats` | 用户统计数据 |
| `user_daily_stats` | 用户每日统计 |
| `user_task_claims` | 任务领取记录 |
| `user_achievement_claims` | 成就领取记录 |
| `user_inventory` | 用户背包 |
| `purchases` | 购买记录 |

### 数据库文件

- 位置: `backend/petapp.db`
- 类型: SQLite
- 自动创建: 是

---

## 前端页面结构

| 页面路径 | 功能 |
|---------|------|
| `pages/index/index` | 首页仪表板 |
| `pages/login/login` | 登录页 |
| `pages/register/register` | 注册页 |
| `pages/pets/pets` | 宠物列表 |
| `pages/pets/detail` | 宠物详情 |
| `pages/pets/add` | 添加宠物 |
| `pages/shop/shop` | 宠物商店 |
| `pages/rankings/rankings` | 排行榜 |
| `pages/tasks/tasks` | 每日任务 |
| `pages/settings/settings` | 设置中心 |
| `pages/profile/profile` | 个人中心 |
| `pages/community/community` | 社区 |
| `pages/mail/mail` | 消息中心 |
| `pages/achievements/achievements` | 成就系统 |

### TabBar 配置

底部导航栏包含 4 个页面：
1. 首页 (`pages/index/index`)
2. 宠物 (`pages/pets/pets`)
3. 商店 (`pages/shop/shop`)
4. 我的 (`pages/profile/profile`)

---

## 状态管理

### auth.ts - 认证状态

```typescript
// 主要状态
token: string          // 认证令牌
userId: number         // 用户ID
userInfo: object       // 用户信息 (nickname, avatar, level, coins, diamonds)
isLoggedIn: boolean    // 登录状态

// 主要方法
register(phone, nickname, password)
login(phone, password)
logout()
loadUserInfo()
updateCoins(amount)
updateDiamonds(amount)
```

### pets.ts - 宠物状态

```typescript
// 主要状态
pets: Pet[]            // 宠物列表
currentPet: Pet        // 当前选中的宠物

// 主要方法
loadPets(userId)
createPet(data)
updatePet(id, data)
deletePet(id)
```

---

## 开发规范

### 前端代码风格

- 使用 TypeScript 编写
- 组件使用 `<script setup lang="ts">` 语法
- 样式使用 `<style scoped>`
- API 调用通过 `src/services/api.ts` 统一管理
- 状态管理使用 Pinia Composition API 风格

### 后端代码风格

- 使用 CommonJS 模块规范
- 路由处理器使用回调函数
- 错误处理通过 `middleware.js` 统一处理
- 数据库操作封装在 `models/` 目录

### 路径别名

前端项目配置了 `@` 别名指向 `src/` 目录：

```typescript
import { useAuthStore } from '@/stores/auth';
import http from '@/services/http';
```

---

## 环境变量

### 后端 (.env)

```
PORT=3000
```

### 前端 (.env)

```
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 测试

### 后端测试

```bash
cd backend
node -e "require('./server.js')"  # 检查启动
```

### 前端测试

```bash
cd frontend
npm run build  # 构建测试
```

### 健康检查

```bash
curl http://localhost:3000/api/health
```

---

## 已知待优化项

| 问题 | 优先级 | 说明 |
|------|--------|------|
| 无 JWT 身份认证 | 高 | 当前使用简单 token |
| 密码未加密存储 | 高 | 建议使用 bcryptjs |
| 无请求速率限制 | 中 | 建议添加 rate-limit |
| 缺少日志系统 | 低 | 建议添加 winston |

---

## 常见开发任务

### 添加新页面

1. 在 `frontend/src/pages/` 创建 Vue 组件
2. 在 `frontend/pages.json` 添加页面配置
3. 如需底部导航，更新 `tabBar.list`

### 添加新 API

1. 在 `backend/routes/` 添加路由处理器
2. 在 `backend/models/` 添加数据模型方法
3. 在 `frontend/src/services/api.ts` 添加 API 方法

### 添加新数据库表

1. 在 `backend/db.js` 的 `initSql` 中添加 CREATE TABLE
2. 在 `backend/models/` 创建对应模型

---

## 相关文档

- [README.md](./README.md) - 项目完整说明
- [USAGE.md](./USAGE.md) - 详细使用指南
- [TEST_RESULTS.md](./TEST_RESULTS.md) - 测试报告
- [docs/原型设计v2.md](./docs/原型设计v2.md) - 原型设计文档
