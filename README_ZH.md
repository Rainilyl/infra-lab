# infra-lab

一个面向初学者的 Web 端 YAML 交互式练习平台，涵盖 **Ansible Playbook** 和 **Kubernetes** 两大类。

[English](README.md) | [中文](README_ZH.md)

## 界面预览

![中文界面](docs/images/screenshot-zh.png)

## 功能特性

- **Monaco 编辑器** — 与 VS Code 相同的编辑器，支持 YAML 语法高亮和自动缩进
- **12 道练习题** — 6 道 Ansible Playbook + 6 道 Kubernetes，从初级到中级
- **实时校验** — 语法检查，精确到行号的错误提示，以及结构性检查
- **答案对比** — 提交后与参考答案的并排差异对比
- **进度追踪** — 已完成的练习保存在浏览器本地
- **自由练习（沙箱）** — 自由编写任意 YAML，仅做语法校验，无题目无答案
- **亮色 / 暗色主题** — 默认亮色，一键切换暗色模式，偏好本地保存
- **中英文切换** — 支持中文 / 英文界面切换，自动检测浏览器语言
- **一键启动** — Windows 双击 `.bat`，Linux 运行 `.sh`，或使用 Docker；自动检测网络，国内自动切换淘宝镜像源

## 快速开始

### 方式一：Windows 双击启动（推荐）

> 需要先安装 [Node.js](https://nodejs.org/)（v18 以上），没装的话脚本会提示。

**首次使用：**

1. 双击 **`start.bat`**
2. 等待自动安装依赖和构建（仅首次，约 1-2 分钟）
3. 浏览器自动打开 http://localhost:3000

**再次使用：**

1. 双击 **`start.bat`** — 跳过安装和构建，秒启动
2. 浏览器自动打开

**停止服务：** 关闭命令提示符窗口即可。

### 方式二：Linux / macOS

```bash
chmod +x install.sh
./install.sh
```

浏览器自动打开。按 `Ctrl+C` 停止。

### 方式三：npm 命令

```bash
npm run install:all
npm start
```

浏览器打开 http://localhost:3000 。按 `Ctrl+C` 停止。

### 方式四：Docker

```bash
docker compose up -d
docker compose down
```

浏览器打开 http://localhost:3000

## 练习题

### Ansible Playbook

| # | 标题 | 难度 |
|---|------|------|
| 1 | 基础 Playbook | 初级 |
| 2 | 软件包安装 | 初级 |
| 3 | 文件操作 | 初级 |
| 4 | 变量与模板 | 中级 |
| 5 | Handlers | 中级 |
| 6 | 条件判断与循环 | 中级 |

### Kubernetes

| # | 标题 | 难度 |
|---|------|------|
| 1 | Pod | 初级 |
| 2 | Deployment | 初级 |
| 3 | Service | 初级 |
| 4 | ConfigMap & Secret | 中级 |
| 5 | PersistentVolumeClaim | 中级 |
| 6 | Ingress | 中级 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + Vite 8 + Monaco Editor |
| 后端 | Node.js + Express |
| 校验 | js-yaml（语法 + 结构检查） |
| 差异对比 | react-diff-viewer-continued |
| 安全 | helmet、CORS、请求大小限制 |
| 国际化 | React Context + 语言文件 |

## 添加练习题

编辑 `server/data/exercises.json`，按照现有格式添加即可。每道题包含中英文标题和描述。修改后重启服务器生效。
