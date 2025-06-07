# Bearless 資訊架構 (Information Architecture)
## iOS App 風格的 Web App 設計

## 🏗️ 整體架構概覽

Bearless MVP 採用 **iOS 原生 App 的資訊架構模式**，提供熟悉的移動端體驗。

```
📱 Tab Bar Navigation (底部導航)
├── 🏠 首頁 (Home)
├── 🆔 我的證件 (Wallet) - 主要功能
└── ⚙️ 設定 (Settings)

主要流程 (Modal Presentation):
🆔 證件 → 🔍 驗證請求 → ✅ 確認分享 → 📱 QR Code → ✅ 完成
```

## 📱 iOS App 導航模式

### Tab Bar Controller (底部標籤導航)
```
┌─────────────────────────────────┐
│                                 │
│         Content Area            │
│                                 │
├─────────────────────────────────┤
│   🏠      🆔      ⚙️          │
│  Home   Wallet  Settings       │
└─────────────────────────────────┘
```

#### Tab 1: 🏠 首頁 (Home)
```
Navigation Controller:
├── 歡迎畫面 (Welcome)
├── 快速操作 (Quick Actions)
├── 最近驗證 (Recent Activity)
└── 幫助與支援 (Help)
```

#### Tab 2: 🆔 我的證件 (Wallet) - 主要功能
```
Navigation Controller:
├── 證件列表 (只有身分證)
├── 身分證詳情 (Card Detail)
├── 驗證流程 (Modal Presentation)
└── 驗證記錄 (History) - 右上角進入
```

#### Tab 3: ⚙️ 設定 (Settings)
```
Navigation Controller:
├── 個人資料設定
├── 隱私與安全
├── 通知設定
└── 關於 Bearless
```

## 🎯 iOS 風格的頁面結構

### Level 1: Tab Bar 層級

#### 🏠 首頁 Tab
```
Navigation Bar:
├── Title: "Bearless"
├── Right Button: 通知 (🔔)
└── Large Title Style

Content:
├── Hero Section (大標題 + 描述)
├── Quick Actions Card
│   ├── 🇹🇼 快速國籍驗證
│   ├── 🔞 快速年齡驗證
│   └── 🏠 快速地址驗證
├── Recent Activity
└── Tips & Help
```

#### 🆔 證件 Tab (主要功能)
```
Navigation Bar:
├── Title: "我的證件"
├── Right Button: 設定 (⚙️)
└── Large Title Style

Content:
├── 身分證卡片 (Card View)
│   ├── 證件圖像
│   ├── 基本資訊
│   ├── 狀態指示
│   └── 主要操作按鈕
├── 驗證記錄按鈕 (右上角)
└── 操作選項
    ├── 🔍 開始驗證
    ├── 📱 掃描 QR Code
    └── 📋 查看記錄
```

### Level 2: Modal Presentation (驗證流程)

#### 驗證流程採用 iOS Modal 模式
```
Modal Stack:
┌─────────────────────────────────┐
│ ❌ 取消              完成 ✅    │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│         Modal Content           │
│                                 │
├─────────────────────────────────┤
│         Action Button           │ ← Bottom Safe Area
└─────────────────────────────────┘
```

#### Step 1: 驗證請求 Modal
```
Modal Navigation:
├── Title: "驗證請求"
├── Left: 取消按鈕
├── Right: 下一步 (disabled until selection)

Content:
├── 請求方資訊卡片
├── 驗證類型選擇
│   ├── 🇹🇼 國籍驗證
│   ├── 🔞 年齡驗證
│   └── 🏠 戶籍地驗證
└── 隱私說明
```

#### Step 2: 確認分享 Modal
```
Modal Navigation:
├── Title: "確認分享資訊"
├── Left: 返回按鈕
├── Right: 生成 QR Code

Content:
├── 將要分享的資訊預覽
├── 隱私等級指示
├── 使用目的說明
└── 確認勾選框
```

#### Step 3: QR Code Modal
```
Modal Navigation:
├── Title: "驗證 QR Code"
├── Left: 關閉按鈕
├── Right: 分享按鈕

Content:
├── QR Code 圖像 (大尺寸)
├── 倒數計時器
├── 分享資訊摘要
└── 重新生成按鈕
```

## 📱 iOS 設計元素

### Navigation Bar 樣式
```css
/* iOS 風格導航欄 */
.ios-nav-bar {
  height: 44px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
}

.ios-large-title {
  font-size: 34px;
  font-weight: 700;
  margin: 0;
  padding: 0 16px;
}
```

### Card 組件樣式
```css
/* iOS 風格卡片 */
.ios-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 8px 16px;
}

.ios-list-item {
  padding: 12px 16px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Button 樣式
```css
/* iOS 風格按鈕 */
.ios-button-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 600;
}

.ios-button-secondary {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
}
```

### Tab Bar 樣式
```css
/* iOS 風格標籤欄 */
.ios-tab-bar {
  height: 83px; /* 49px + 34px safe area */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-top: 0.5px solid rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.ios-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0 30px 0; /* 30px for safe area */
}
```

## 🎨 iOS 視覺設計系統

### 色彩系統 (iOS Human Interface Guidelines)
```css
/* iOS 系統色彩 */
:root {
  --ios-blue: #007AFF;
  --ios-green: #34C759;
  --ios-orange: #FF9500;
  --ios-red: #FF3B30;
  --ios-gray: #8E8E93;
  --ios-gray2: #AEAEB2;
  --ios-gray3: #C7C7CC;
  --ios-gray4: #D1D1D6;
  --ios-gray5: #E5E5EA;
  --ios-gray6: #F2F2F7;
  
  /* 語義化色彩 */
  --primary: var(--ios-blue);
  --success: var(--ios-green);
  --warning: var(--ios-orange);
  --danger: var(--ios-red);
}
```

### 字體系統 (SF Pro)
```css
/* iOS 字體層級 */
.ios-text-large-title { font-size: 34px; font-weight: 700; }
.ios-text-title1 { font-size: 28px; font-weight: 700; }
.ios-text-title2 { font-size: 22px; font-weight: 700; }
.ios-text-title3 { font-size: 20px; font-weight: 600; }
.ios-text-headline { font-size: 17px; font-weight: 600; }
.ios-text-body { font-size: 17px; font-weight: 400; }
.ios-text-callout { font-size: 16px; font-weight: 400; }
.ios-text-subhead { font-size: 15px; font-weight: 400; }
.ios-text-footnote { font-size: 13px; font-weight: 400; }
.ios-text-caption1 { font-size: 12px; font-weight: 400; }
.ios-text-caption2 { font-size: 11px; font-weight: 400; }
```

### 間距系統 (iOS Grid)
```css
/* iOS 標準間距 */
--spacing-xs: 4px;   /* 極小間距 */
--spacing-sm: 8px;   /* 小間距 */
--spacing-md: 16px;  /* 標準間距 */
--spacing-lg: 24px;  /* 大間距 */
--spacing-xl: 32px;  /* 超大間距 */
```

## 🔄 iOS 互動模式

### 手勢支援
```typescript
interface iOSGestures {
  tap: boolean;           // 點擊
  longPress: boolean;     // 長按
  swipeBack: boolean;     // 右滑返回
  pullToRefresh: boolean; // 下拉刷新
  swipeActions: boolean;  // 滑動操作 (列表項目)
}
```

### 轉場動畫
```css
/* iOS 風格轉場 */
.ios-slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.ios-modal-present {
  animation: modalPresent 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes modalPresent {
  from { 
    transform: translateY(100%);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 觸覺回饋 (Haptic Feedback)
```typescript
// iOS 觸覺回饋
interface HapticFeedback {
  light: () => void;    // 輕微震動
  medium: () => void;   // 中等震動  
  heavy: () => void;    // 強烈震動
  success: () => void;  // 成功回饋
  warning: () => void;  // 警告回饋
  error: () => void;    // 錯誤回饋
}
```

## 📱 PWA 配置 (iOS App-like)

### App Manifest
```json
{
  "name": "Bearless",
  "short_name": "Bearless",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#007AFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-180x180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### iOS Safari 特殊配置
```html
<!-- iOS Safari 配置 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Bearless">
<link rel="apple-touch-icon" href="/icons/icon-180x180.png">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
