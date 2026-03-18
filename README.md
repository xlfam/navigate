# My Nav Dashboard

一个轻量级、响应式、支持内网/外网切换的 Web 导航主页。纯 HTML/CSS/JS 实现，无需数据库，基于 JSON 配置文件驱动，适合作为个人浏览器起始页或 NAS 导航页。

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 特性

- 🚀 **零依赖**：纯原生 HTML/CSS/JavaScript，无需安装 Node.js 或 PHP 环境。
- 📱 **响应式设计**：完美适配 PC、平板和手机屏幕。移动端支持侧滑菜单，搜索栏常驻。
- 🌐 **双网模式**：一键切换内网（IP）和外网（域名）访问地址，方便管理家庭/办公服务。
- 🔍 **强大的搜索**：支持本地书签实时检索，支持切换 Google/Bing/Baidu 等外部搜索引擎。
- 💾 **本地缓存**：配置、图标和网络模式自动缓存到浏览器 LocalStorage，秒开无等待。
- ☁️ **远程同步**：支持从远程 URL 同步 JSON 配置，支持 HTTP Basic Auth 认证。
- 🎨 **极简风格**：无边框卡片设计，界面清爽，加载迅速。

## 📸 预览

![img](https://raw.githubusercontent.com/xlfam/navigate/refs/heads/main/images/screenshot1.png)
![img](https://raw.githubusercontent.com/xlfam/navigate/refs/heads/main/images/screenshot2.png)

## 🛠️ 快速开始

### 1. 获取文件
将项目中的 `index.html` 和 `nav.json` 放在 Web 服务器的同一目录下。

### 2. 访问
直接在浏览器中打开 `index.html`，或通过您的服务器域名/IP 访问。

### 3. 配置数据
编辑 `nav.json` 文件以添加您自己的书签和分类（详见下文配置说明）。

## 📝 配置说明

项目通过 `nav.json` 进行配置。以下是 JSON 结构说明及示例：

```json
{
  "version": "1.1",
  "searchEngines": [
    { 
      "name": "Google", 
      "url": "https://www.google.com/search?q=", 
      "icon": "fab fa-google" 
    }
  ],
  "categories": [
    {
      "id": "nas",
      "name": "我的服务",
      "icon": "fa-server",
      "items": [
        {
          "title": "NAS 管理界面",
          "icon": "https://example.com/icon.png",
          "url": "默认地址",
          "url_in": "http://192.168.1.10:5000", 
          "url_out": "https://nas.example.com"
        }
      ]
    }
  ]
}
```

### 字段详解

#### 搜索引擎 (`searchEngines`)
- `name`: 搜索引擎名称。
- `url`: 搜索接口地址（末尾需带查询参数，如 `?q=`）。
- `icon`: FontAwesome 图标类名（需引入 FontAwesome 库）。

#### 分类 (`categories`)
- `id`: 唯一标识符（英文），用于锚点定位。
- `name`: 显示的中文分类名称。
- `icon`: 分类图标（支持 FontAwesome 类名）。
- `items`: 该分类下的链接列表。

#### 链接 (`items`)
- `title`: 链接显示的标题。
- `icon`: 
  - 支持图片 URL（如 `https://.../icon.png`）。
  - 支持 FontAwesome 类名（如 `fas fa-link`, `si-google` 等）。
- `url`: 默认跳转地址。
- `url_in`: **内网模式**下访问的地址（通常是 IP:端口）。
- `url_out`: **外网模式**下访问的地址（通常是域名）。

**逻辑说明**：
- 当处于**外网模式**时，系统优先使用 `url_out`，若不存在则使用 `url`。
- 当处于**内网模式**时，系统优先使用 `url_in`，若不存在则使用 `url`。

## ☁️ 远程同步功能

本工具支持从远程服务器拉取最新的 `nav.json` 配置，实现多端数据同步。

1. **准备远程文件**：将您的 `nav.json` 上传至支持 CORS（跨域资源共享）的服务器或对象存储（如 GitHub Pages, OSS）。
2. **配置同步源**：
   - 点击页面右上角“设置”图标。
   - 点击“连接配置源”。
   - 输入远程 JSON 地址。
   - （可选）如果服务器开启了密码保护，输入用户名和密码（HTTP Basic Auth）。
3. **同步数据**：点击“同步数据”按钮，即可更新本地缓存并刷新页面。

## 🚀 部署建议

### Nginx / Apache
将 `index.html` 和 `nav.json` 上传至站点根目录即可。

### GitHub Pages
1. 创建一个 GitHub 仓库。
2. 上传 `index.html` 和 `nav.json`。
3. 在仓库设置中开启 GitHub Pages 服务。
4. 注意：如果要在本地直接访问 `file://` 协议下的 `index.html`，浏览器可能会因为 CORS 策略拦截 `fetch` 请求。建议使用本地服务器（如 `python -m http.server`）或部署到 Web 环境。

### 群晖 / 威联通 NAS
放置在 Web Station 或虚拟主机的 `web` 目录下。

## 🔧 常见问题

**Q: 为什么点击“同步数据”提示“网络错误或跨域限制”？**
A: 这是因为浏览器的同源策略。您的远程 JSON 服务器必须配置允许跨域访问（Response Header 包含 `Access-Control-Allow-Origin: *`）。如果使用 GitHub Pages 或 Gitee Pages 通常默认支持。

**Q: 如何更换主题颜色？**
A: 编辑 `index.html` 中的 `<style>` 部分，修改 `:root` 下的 CSS 变量，例如 `--primary-color`。

**Q: 手机端如何收起左侧菜单？**
A: 点击左侧菜单底部的“收起菜单”按钮，或点击菜单以外的遮罩区域即可收起。

## 📄 开源协议

本项目基于 MIT 协议开源，可自由修改和分发。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
