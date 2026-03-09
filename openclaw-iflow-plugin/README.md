# OpenClaw iFlow-CLI Plugin

将 iFlow-CLI 集成到 OpenClaw 中，实现代码开发和仓库分析功能。

## 安装

### 方式 1：手动安装

```bash
# 复制插件到 OpenClaw 扩展目录
cp -r openclaw-iflow-plugin ~/.openclaw/extensions/iflow-cli

# 重启 OpenClaw Gateway
openclaw gateway --restart
```

### 方式 2：使用 OpenClaw 插件命令

```bash
openclaw plugins install ./openclaw-iflow-plugin
```

## 功能

| Action | 描述 | 参数 |
|--------|------|------|
| `analyze` | 分析代码仓库 | `path` - 项目路径 |
| `generate` | 生成代码 | `prompt`, `language` |
| `execute` | 执行命令 | `command` |
| `review` | 代码审查 | `file` - 文件路径 |
| `chat` | 与 iFlow 对话 | `message` |

## 使用示例

在 OpenClaw 中使用：

```
用户: 用 iflow 分析当前项目
→ OpenClaw 调用 iflow analyze

用户: 帮我生成一个 Vue 登录组件
→ OpenClaw 调用 iflow generate

用户: 审查 src/main.ts 文件
→ OpenClaw 调用 iflow review
```

## 配置

在 `~/.openclaw/openclaw.json` 中添加：

```json
{
  "plugins": {
    "allow": ["iflow-cli"],
    "entries": {
      "iflow-cli": {
        "enabled": true,
        "config": {
          "iflowPath": "iflow",
          "defaultModel": "auto"
        }
      }
    }
  }
}
```

## 依赖

- Node.js >= 22
- OpenClaw >= 2026.0.0
- iFlow CLI (`npm install -g @iflow-ai/iflow-cli`)

## 文件结构

```
openclaw-iflow-plugin/
├── index.ts                 # 插件主入口
├── openclaw.plugin.json     # 插件配置
├── package.json             # NPM 配置
├── README.md                # 说明文档
└── skills/
    └── iflow/
        └── SKILL.md         # 技能描述
```

## 许可证

MIT
