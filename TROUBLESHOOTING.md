# 🔧 问题排查指南

## 已修复的问题

### ✅ 问题 1: Body padding 导致主页布局错乱
**症状**: DuoLume 主页顶部有大量空白，内容被推到下方
**原因**: `globals.css` 为所有页面设置了 `padding-top: 9rem`
**解决**: 使用 CSS `:has()` 选择器，只为 market 页面添加 padding

## 常见问题排查

### 1. 页面完全空白

**可能原因**:
- Next.js 开发服务器未启动
- 编译错误

**解决方法**:
```bash
# 停止所有运行的进程
# 重新启动
cd market
npm run dev
```

检查终端是否有报错信息。

### 2. 动态背景不显示

**可能原因**:
- `dynamic-bg.css` 文件未加载
- CSS import 路径错误

**检查**:
1. 确认文件存在: `market/public/dynamic-bg.css`
2. 检查 `globals.css` 是否有: `@import url('/dynamic-bg.css');`
3. 打开浏览器开发者工具 → Network → 查看是否加载成功

**临时解决**: 刷新页面并清除缓存 (Ctrl + Shift + R)

### 3. 图片无法加载 (404)

**症状**: Logo 或其他图片显示为 broken image
**可能原因**: 图片路径错误

**检查路径**:
```
主页 Logo: /images/Dute2.png  ✅
Market Logo: /image/LUMI1.png  ✅
```

**验证**:
```bash
# 检查文件是否存在
dir market\public\images\Dute2.png
dir market\public\image\LUMI1.png
```

### 4. WebSocket 连接失败

**症状**: 控制台显示 "WebSocket connection failed"
**原因**: WebSocket 服务器未启动

**解决**:
```bash
# 启动 WebSocket 服务器
cd duolume-master
node alert_server.js
```

**注意**: 如果不需要实时警报功能，可以忽略此错误。

### 5. API 请求失败 (500/404)

**症状**: 警报数据不显示，控制台有 API 错误
**原因**: Flask 后端未启动

**解决**:
```bash
# 启动 Flask 后端
cd duolume-master/crypto_alert_api
python src/main.py
```

### 6. 样式错乱 / 布局混乱

**可能原因**:
- Tailwind CSS 未正确编译
- 样式冲突

**解决**:
```bash
# 清除 Next.js 缓存
cd market
rm -rf .next
npm run dev
```

### 7. "Module not found" 错误

**原因**: 依赖未安装

**解决**:
```bash
cd market
rm -rf node_modules package-lock.json
npm install
```

### 8. 路由 404 错误

**症状**: 访问 `/market` 显示 404

**检查**:
1. 确认文件存在: `market/app/market/page.tsx`
2. 重启开发服务器

### 9. TypeScript 类型错误

**解决**:
```bash
cd market
npm run lint
```

查看具体的类型错误并修复。

### 10. 中文字符显示为乱码

**原因**: 文件编码问题

**解决**:
- 确保所有文件使用 UTF-8 编码
- VS Code: 右下角点击编码 → "通过编码重新打开" → UTF-8

## 浏览器开发者工具调试

### 打开开发者工具
- Chrome: F12 或 Ctrl + Shift + I
- Firefox: F12
- Edge: F12

### 检查项目
1. **Console**: 查看 JavaScript 错误
2. **Network**: 查看资源加载状态
3. **Elements**: 检查 DOM 结构和样式
4. **Application**: 查看 localStorage 数据

## 常用调试命令

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 检查 npm 版本
npm --version

# 清除所有缓存
rm -rf .next node_modules package-lock.json
npm install

# 生产环境构建测试
npm run build
npm start

# 检查端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5000
```

## 具体错误信息收集

如果以上方法都无法解决，请提供以下信息：

1. **错误截图**: 浏览器页面 + 控制台
2. **终端输出**: `npm run dev` 的完整输出
3. **浏览器**: Chrome/Firefox/Edge 版本
4. **Node.js**: 版本号
5. **具体操作**: 重现问题的步骤

## 快速重置项目

如果问题严重，可以完全重置：

```bash
# 进入 market 目录
cd market

# 删除缓存和依赖
rm -rf .next node_modules package-lock.json

# 重新安装
npm install

# 启动
npm run dev
```

## 联系支持

如果问题仍未解决，请描述：
- ✅ 具体的错误信息
- ✅ 尝试过的解决方法
- ✅ 系统环境（Windows/Mac/Linux）
- ✅ 浏览器版本

---

**最后更新**: 2025-10-19

