# Notion Life Dashboard 个人生命管理仪表盘

一个基于 Notion API 的综合性个人生命管理仪表盘，使用 React、TypeScript 和 Vite 构建。

## 🌟 功能特点

- 📊 综合生命数据追踪仪表盘
- 🔄 每小时自动同步 Notion 数据库
- 📱 响应式设计，支持所有设备
- 🎨 使用 Tailwind CSS 的现代化 UI
- ⚡ 基于 Vite 的极速性能
- 🔐 安全的 API 密钥管理
- 📈 支持 17 个不同的生命维度数据库

## 🚀 快速开始 - GitHub 设置

### 1. 在 GitHub 创建仓库

1. 打开 [GitHub.com](https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 仓库名称填写：`notion-life-dashboard`
4. 选择 "Public"（公开）
5. **不要**勾选 "Add a README file"
6. 点击 "Create repository"

### 2. 推送代码到 GitHub

在本地项目目录运行以下命令：

```bash
git remote add origin https://github.com/YOUR_USERNAME/notion-life-dashboard.git
git branch -M main
git push -u origin main
```

把 `YOUR_USERNAME` 替换为你的 GitHub 用户名。

### 3. 设置 GitHub Secrets

1. 在 GitHub 仓库页面，点击 "Settings" (设置)
2. 在左侧菜单找到 "Secrets and variables" → "Actions"
3. 点击 "New repository secret"
4. 添加以下 secret：
   - Name: `NOTION_API_KEY`
   - Value: 你的 Notion API 密钥（就是 .env 文件中的那个）

### 4. 启用 GitHub Actions

1. 点击仓库的 "Actions" 标签
2. 如果看到提示，点击 "I understand my workflows, go ahead and enable them"
3. GitHub Actions 会自动每小时运行一次，同步 Notion 数据

## 📦 本地开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

## 🌐 已部署地址

你的仪表盘已经部署在：https://notion-life-dashboard.vercel.app

## 📝 数据库列表

仪表盘连接了以下 17 个 Notion 数据库：

- 价值观、价值观检验
- 目标库、项目库、行动库
- 每日日志、情绪记录、健康日记
- 注意力记录、创造记录、互动记录
- 财务记录、成长复盘
- 欲望数据库、知识库
- 思维模型、关系网

## 🔧 技术栈

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Notion API
- GitHub Actions
- Vercel

## 📄 许可证

MIT
