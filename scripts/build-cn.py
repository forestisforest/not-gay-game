#!/usr/bin/env python3
"""Build China offline bundle: single HTML + split files in cn/."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "cn"
CSS = (ROOT / "style.css").read_text(encoding="utf-8")
JS = (ROOT / "game.js").read_text(encoding="utf-8")

SPLIT_HTML = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="点击图标证明你不是GAY - 国内可访问版" />
  <title>证明你不是 GAY（国内版）</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="banner">
    <h1>点击图标证明你不是GAY</h1>
    <p class="hint" id="hint">靠近试试？它可不会乖乖让你点中。</p>
    <p class="mirror">国内版 · 无需访问 GitHub</p>
  </header>
  <main class="arena" id="arena"></main>
  <div class="logo" id="logo" inert tabindex="-1" aria-hidden="true">
    <span class="logo-text">我不是GAY</span>
    <span class="logo-shine"></span>
  </div>
  <script src="game.js"></script>
</body>
</html>
"""

README = """# 国内可访问版本

本目录为**不依赖 GitHub Pages** 的发布包，适合中国大陆用户。

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
"""


def main() -> None:
    single = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="点击图标证明你不是GAY - 国内单文件离线版" />
  <title>证明你不是 GAY（国内单文件版）</title>
  <style>
{CSS}
  </style>
</head>
<body>
  <header class="banner">
    <h1>点击图标证明你不是GAY</h1>
    <p class="hint" id="hint">靠近试试？它可不会乖乖让你点中。</p>
    <p class="mirror">国内单文件版 · 可离线打开 · 无外链依赖</p>
  </header>
  <main class="arena" id="arena"></main>
  <div class="logo" id="logo" inert tabindex="-1" aria-hidden="true">
    <span class="logo-text">我不是GAY</span>
    <span class="logo-shine"></span>
  </div>
  <script>
{JS}
  </script>
</body>
</html>
"""

    OUT.mkdir(exist_ok=True)
    (OUT / "index.html").write_text(SPLIT_HTML, encoding="utf-8")
    (OUT / "style.css").write_text(CSS, encoding="utf-8")
    (OUT / "game.js").write_text(JS, encoding="utf-8")
    (OUT / "index-standalone.html").write_text(single, encoding="utf-8")
    (OUT / "README.md").write_text(README, encoding="utf-8")
    print(f"Built {OUT}/")


if __name__ == "__main__":
    main()
