# 我不是 GAY — 点不到的图标游戏

点击图标证明你不是 GAY（但你永远点不到）。

## 在线游玩

| 线路 | 链接 | 适合 |
|------|------|------|
| 国际（GitHub Pages） | https://forestisforest.github.io/not-gay-game/ | 海外、港澳台、已翻墙 |
| **国内镜像（jsDelivr）** | https://gcore.jsdelivr.net/gh/forestisforest/not-gay-game@main/index.html | **中国大陆用户首选** |
| 备用 CDN | https://fastly.jsdelivr.net/gh/forestisforest/not-gay-game@main/index.html | jsDelivr 备用节点 |

> 国内用户若打不开 GitHub 链接，请使用 **gcore.jsdelivr.net** 那一行，内容与 GitHub Pages 一致，每次推送到 `main` 后会自动更新（约 1–5 分钟）。

## 为什么国内打不开 GitHub Pages？

`*.github.io` 在中国大陆经常无法访问或极不稳定，浏览器会显示「已丢失网络连接」等提示。这不是游戏 bug，而是网络环境限制。

## 更稳定的国内方案：码云 Gitee Pages（可选）

若希望使用 `https://你的用户名.gitee.io/not-gay-game/` 这类国内域名：

1. 注册 [Gitee](https://gitee.com) 并新建仓库 `not-gay-game`（与 GitHub 同名即可）
2. 在 Gitee **设置 → SSH 公钥** 添加公钥；在 GitHub 仓库 **Settings → Secrets** 添加：
   - `GITEE_PRIVATE_KEY`：对应私钥
   - `GITEE_PUBLIC_KEY`：对应公钥（部分 Action 需要）
3. 编辑 `.github/workflows/sync-gitee.yml`，将 `dst` 里的 `YOUR_GITEE_USERNAME` 改成你的码云用户名
4. 推送后 Action 会自动同步；在 Gitee 仓库 **服务 → Gitee Pages** 中启用，分支选 `main`、目录 `/`

## 本地运行

```bash
python3 -m http.server 8080
# 打开 http://localhost:8080
```
