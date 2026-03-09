# 萌宠小程序 - 完整项目文档

## 项目状态：✅ 开发完成

### 运行地址
- **前端**: http://localhost:5173
- **后端**: http://localhost:3000

## 功能清单

### 后端 API (已完成)
| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/users/register` | POST | 用户注册 |
| `/api/users/login` | POST | 用户登录 |
| `/api/users/:id` | GET | 获取用户信息 |
| `/api/users/:id/sign` | POST | 签到 |
| `/api/users/:id/assets` | GET | 获取用户资产 |
| `/api/pets` | GET/POST | 宠物列表/创建 |
| `/api/pets/user/:id` | GET | 用户宠物列表 |
| `/api/pets/:id` | GET/PUT/DELETE | 宠物详情/更新/删除 |
| `/api/pets/:id/action` | POST | 宠物互动操作 |
| `/api/pets/types` | GET | 可领养宠物类型 |
| `/api/tasks` | GET | 任务列表 |
| `/api/tasks/:id/claim` | POST | 领取任务奖励 |
| `/api/shop` | GET | 商品列表 |
| `/api/shop/categories` | GET | 商品分类 |
| `/api/shop/buy` | POST | 购买商品 |
| `/api/achievements` | GET | 成就列表 |
| `/api/achievements/claim` | POST | 领取成就奖励 |

### 前端页面 (已完成)
| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 轮播图、快捷功能、宠物预览、任务进度 |
| 登录 | `/login` | 手机号登录 + 快速试玩 |
| 注册 | `/register` | 用户注册 |
| 宠物列表 | `/pets` | 宠物卡片网格 |
| 宠物详情 | `/pets/detail` | 宠物状态、互动操作 |
| 添加宠物 | `/pets/add` | 领养新宠物 |
| 商店 | `/shop` | 商品购买 |
| 任务 | `/tasks` | 每日任务 |
| 排行榜 | `/rankings` | 宠物排名 |
| 个人中心 | `/profile` | 用户资料、资产 |
| 设置 | `/settings` | 应用设置 |
| 社区 | `/community` | 帖子、话题 |
| 消息中心 | `/mail` | 系统通知 |
| 成就 | `/achievements` | 成就系统 |

### 功能亮点
- ✅ 登录/注册（支持Demo模式）
- ✅ 签到系统
- ✅ 宠物养成（喂食/玩耍/训练/清洁）
- ✅ 任务系统
- ✅ 成就系统
- ✅ 商店购买
- ✅ 排行榜
- ✅ 社区帖子
- ✅ 消息通知

### 技术栈
- **前端**: Vue3 + TypeScript + Vite + UniApp
- **后端**: Node.js + Express + SQLite
- **状态管理**: Pinia

### 启动方式
```bash
# 启动后端
cd backend
node server.js

# 启动前端
cd frontend
npm run dev
```
