---
name: iflow
description: |
  iFlow CLI 代码开发和仓库分析助手。当用户需要代码开发、仓库分析、自动化任务时激活。
  支持：代码生成、代码审查、仓库分析、自动化工作流。
---

# iFlow CLI Tool

iFlow CLI 是一个强大的 AI 命令行助手，可以在终端中直接运行，帮助完成代码开发和自动化任务。

## 功能特性

- 🔍 **代码仓库分析** - 分析项目结构、依赖关系
- 💻 **代码生成** - 自动生成代码、组件
- 🔧 **自动化任务** - 执行复杂工作流
- 🤖 **SubAgent** - 专业智能体团队
- 📦 **MCP 支持** - 一键安装工具和扩展

## 使用场景

### 代码开发
```
用户: 帮我创建一个 Vue 组件
→ 使用 iflow 生成代码
```

### 仓库分析
```
用户: 分析这个项目的结构
→ 使用 iflow 分析代码库
```

### 自动化任务
```
用户: 帮我执行构建和测试
→ 使用 iflow 执行自动化任务
```

## Actions

### 分析代码仓库
```json
{ "action": "analyze", "path": "/path/to/project" }
```

### 生成代码
```json
{ "action": "generate", "prompt": "创建一个登录表单组件", "language": "vue" }
```

### 执行任务
```json
{ "action": "execute", "command": "npm run build" }
```

### 代码审查
```json
{ "action": "review", "file": "src/components/Login.vue" }
```

## 配置

确保 iFlow CLI 已安装：
```bash
npm install -g @iflow-ai/iflow-cli
iflow --version
```

## 依赖

- Node.js >= 22
- iFlow CLI (@iflow-ai/iflow-cli)
