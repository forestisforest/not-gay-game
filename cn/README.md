# 国内可访问版本

本目录为国内发布包：单文件可离线玩，也可部署到码云等国内静态托管。

> 请勿使用 jsDelivr 等 CDN 直接打开 `.html`，会显示源代码而非游戏。请用 GitHub Pages、码云 Pages，或本地双击 `index-standalone.html`。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index-standalone.html` | **推荐** 单文件版，双击或任意静态托管即可 |
| `index.html` + `style.css` + `game.js` | 多文件版，适合码云 Pages / 对象存储 |

## 使用方式

### 1. 本机直接玩（最快）

双击打开 `index-standalone.html`，或用浏览器拖入该文件。

### 2. 码云 Gitee Pages（推荐线上）

1. 在 https://gitee.com 新建仓库
2. 上传本目录全部文件（或只上传 `index-standalone.html` 并重命名为 `index.html`）
3. 仓库 → 服务 → Gitee Pages → 启用，分支 `master`/`main`，目录 `/`
4. 访问 `https://你的用户名.gitee.io/仓库名/`

### 3. 腾讯云 / 阿里云静态托管

将 `index-standalone.html` 上传为 `index.html`，开启静态网站与 CDN 即可。

## 重新构建

```bash
python3 scripts/build-cn.py
```
