# Bearless 資訊架構 (Information Architecture)
## iOS App 風格的 Web App 設計

> **設計原則指導**：本資訊架構遵循 `DESIGN_PRINCIPLES.md` 中的核心原則，特別強調**個人身分主權**和**選擇性揭露**，確保用戶在每個操作環節都擁有完全的控制權。

## 🏗️ 整體架構概覽

Bearless MVP 採用 **iOS 原生 App 的資訊架構模式**，提供熟悉的移動端體驗。

```
📱 Tab Bar Navigation (底部導航)
├── 🔄 身份驗證 (Identity) - 整合分享+驗證功能
└── ⚙️ 設定 (Settings)

主要流程 (Modal Presentation):
分享身份: 🔄 選擇驗證項目 → ✅ 確認分享 → 📱 QR Code → ✅ 完成
驗證他人: 🔄 掃描 QR Code → 📋 驗證資訊 → ✅ 驗證結果 → 📝 記錄儲存
```

## 📱 iOS App 導航模式

### Tab Bar Controller (底部標籤導航)
```
┌─────────────────────────────────┐
│                                 │
│         Content Area            │
│                                 │
├─────────────────────────────────┤
│   🔄      ⚙️          │
│  Identity  Settings       │
└─────────────────────────────────┘
```

#### Tab 1: 🔄 身份驗證 (Identity) - 整合分享+驗證功能
```
Navigation Bar:
├── Title: "身份驗證"
├── Right Button: 📋 記錄 (History)
└── Large Title Style

Content:
├── 身分證卡片 (Card View)
│   ├── 證件圖像
│   ├── 基本資訊
│   ├── 狀態指示
│   └── MyData 連接狀態
├── 主要操作區域
│   ├── [🆔 分享我的身份] (大按鈕)
│   └── [🔍 驗證他人身份] (大按鈕)
└── 今日活動摘要
    ├── 分享次數統計
    └── 驗證次數統計
```

### 🔄 身份驗證 Tab 詳細設計

#### 主畫面：身份驗證 Tab
```
🔄 身份驗證頁面
┌─────────────────────────────────┐
│ 身份驗證            📋 記錄     │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│      [身分證卡片視覺化]           │
│                                 │
│  姓名: 王小明                    │
│  國籍: 中華民國                  │
│  狀態: ✅ 有效 (到期: 2025/06)   │
│  MyData: 🔗 已連接              │
│                                 │
├─────────────────────────────────┤
│                                 │
│     [🆔 分享我的身份]            │
│                                 │
│     [🔍 驗證他人身份]            │
│                                 │
├─────────────────────────────────┤
│ 📊 今日活動                     │
│ • 分享了 2 次身份驗證            │
│ • 驗證了 1 位用戶               │
│                                 │
│ 💡 快速操作：                    │
│ • 🇹🇼 國籍驗證                 │
│ • 🔞 年齡驗證                   │
│ • 🏠 地址驗證                   │
└─────────────────────────────────┘
```

#### 狀態 1: 尚未取得數位身分
```
🔄 身份驗證頁面
┌─────────────────────────────────┐
│ 身份驗證            📋 記錄     │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│      [空白證件卡片佔位]           │
│                                 │
│  🔗 尚未取得數位身分            │
│  透過 MyData 安全取得您的身分資料  │
│                                 │
│     [🚀 取得數位身分]            │
│                                 │
├─────────────────────────────────┤
│ 💡 取得後您可以：                │
│ • 🆔 分享身份給他人驗證          │
│ • 🔍 驗證他人的身份資訊          │
│ • 🇹🇼 證明國籍身分              │
│ • 🔞 證明年齡資格                │
│ • 🏠 證明戶籍地址                │
│ • 🔒 完全保護隱私                │
└─────────────────────────────────┘
```

#### Tab 2: ⚙️ 設定 (Settings)
```
Navigation Controller:
├── 個人資料設定
├── 隱私與安全
├── 通知設定
└── 關於 Bearless
```

## 🎯 iOS 風格的頁面結構

### Level 1: Tab Bar 層級

#### 🔄 身份驗證 Tab
```
Navigation Bar:
├── Title: "身份驗證"
├── Right Button: 📋 記錄 (History)
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

### Level 2: Modal Presentation (驗證流程)

#### 🆔 分享身份流程 (Modal 模式)

**Modal 1: 選擇驗證項目**
```
┌─────────────────────────────────┐
│ 取消              分享身份       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│      👤 選擇要分享的資訊         │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ☑️ 🇹🇼 國籍：中華民國       │ │
│ │ ☑️ 🔞 年齡：25歲以上        │ │
│ │ ☐ 🏠 戶籍：台北市           │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🔒 隱私保護：                    │
│ • 只分享您選擇的資訊             │
│ • 不會洩露完整身分證號碼         │
│ • 使用零知識證明技術             │
│                                 │
│         [繼續分享]               │
│                                 │
└─────────────────────────────────┘
```

**Modal 2: 確認分享**
```
┌─────────────────────────────────┐
│ 返回              確認分享       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│      📋 即將分享的資訊           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ✅ 國籍：中華民國            │ │
│ │ ✅ 年齡：25歲以上           │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⏰ 分享有效期限：10 分鐘         │
│ 🔒 零知識驗證：已啟用           │
│                                 │
│ ⚠️ 請確認：                     │
│ • 只與信任的對象分享             │
│ • 分享後無法撤回                 │
│                                 │
│     [✅ 確認分享] [❌ 取消]      │
│                                 │
└─────────────────────────────────┘
```

**Modal 3: QR Code 顯示**
```
┌─────────────────────────────────┐
│ 完成              分享 QR Code   │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐      │
│    │                     │      │
│    │    📱 QR Code       │      │
│    │                     │      │
│    │   [動態 QR Code]     │      │
│    │                     │      │
│    └─────────────────────┘      │
│                                 │
│    請讓對方掃描此 QR Code        │
│                                 │
│ ⏰ 剩餘時間：09:45               │
│ 🔄 [重新生成] [📤 分享連結]      │
│                                 │
└─────────────────────────────────┘
```

#### 🔍 驗證他人流程 (Modal 模式)

**Modal 1: QR Code 掃描器**
```
┌─────────────────────────────────┐
│ 取消              掃描 QR Code   │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐      │
│    │                     │      │
│    │    📱 相機預覽       │      │
│    │                     │      │
│    │  [掃描框動畫效果]    │      │
│    │                     │      │
│    └─────────────────────┘      │
│                                 │
│    請將 QR Code 對準掃描框       │
│                                 │
│         [💡 開啟手電筒]          │
│         [📝 手動輸入驗證碼]       │
│                                 │
└─────────────────────────────────┘
```

**Modal 2: 驗證資訊確認**
```
┌─────────────────────────────────┐
│ 返回              驗證資訊       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│      👤 對方分享的資訊           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🇹🇼 國籍：中華民國          │ │
│ │ 🔞 年齡：25歲以上           │ │
│ │ 🏠 戶籍：台北市             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⏰ 資訊有效期限：2024/12/31     │
│ 🔒 零知識驗證：已通過           │
│                                 │
│ 💡 驗證說明：                    │
│ • 此資訊經過加密驗證             │
│ • 確保資料真實性                 │
│                                 │
│     [✅ 確認驗證] [❌ 取消]      │
│                                 │
└─────────────────────────────────┘
```

**Modal 3: 驗證結果**
```
┌─────────────────────────────────┐
│ 完成              驗證結果       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│         ✅ 驗證成功              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 驗證項目：                   │ │
│ │ ✅ 國籍：中華民國            │ │
│ │ ✅ 年齡：25歲以上            │ │
│ │ ✅ 戶籍：台北市              │ │
│ │                             │ │
│ │ 驗證時間：2024/06/08 13:36  │ │
│ │ 驗證狀態：有效               │ │
│ └─────────────────────────────┘ │
│                                 │
│   [📝 儲存記錄] [🔄 再次驗證]    │
│                                 │
└─────────────────────────────────┘
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

```

## 🔍 驗證他人功能 (Verify Others)

### 功能概述
「驗證他人」功能讓用戶可以掃描並驗證其他人分享的身份資訊，確保資訊的真實性和有效性。

### 使用場景
- 🏢 **商家驗證顧客年齡**：酒類、菸品銷售時驗證顧客是否滿18歲
- 🏠 **房東驗證租客身份**：確認租客國籍和戶籍地
- 🎫 **活動主辦方驗證參與者**：確認參與者符合活動資格
- 🚗 **共享服務驗證用戶**：確認用戶年齡和居住地區

### 驗證流程設計

#### 主畫面：驗證他人 Tab
```
🔍 驗證他人頁面
┌─────────────────────────────────┐
│ 驗證他人            📋 記錄     │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│         📱 QR Code 掃描框        │
│                                 │
│     [📷 掃描 QR Code]           │
│                                 │
│ ─────────── 或 ───────────      │
│                                 │
│     [📝 手動輸入驗證碼]          │
│                                 │
├─────────────────────────────────┤
│ 💡 如何使用：                    │
│ 1. 請對方開啟 Bearless App      │
│ 2. 選擇要分享的身份資訊          │
│ 3. 掃描對方的 QR Code           │
│ 4. 查看驗證結果                 │
└─────────────────────────────────┘
```

#### Modal 1: QR Code 掃描器
```
┌─────────────────────────────────┐
│ 取消              掃描 QR Code   │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐      │
│    │                     │      │
│    │    📱 相機預覽       │      │
│    │                     │      │
│    │  [掃描框動畫效果]    │      │
│    │                     │      │
│    └─────────────────────┘      │
│                                 │
│    請將 QR Code 對準掃描框       │
│                                 │
│         [💡 開啟手電筒]          │
│                                 │
└─────────────────────────────────┘
```

#### Modal 2: 驗證資訊確認
```
┌─────────────────────────────────┐
│ 返回              驗證資訊       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│      👤 對方分享的資訊           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🇹🇼 國籍：中華民國          │ │
│ │ 🔞 年齡：25歲以上           │ │
│ │ 🏠 戶籍：台北市             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⏰ 資訊有效期限：2024/12/31     │
│ 🔒 零知識驗證：已通過           │
│                                 │
│ 💡 驗證說明：                    │
│ • 此資訊經過加密驗證             │
│ • 確保資料真實性                 │
│                                 │
│     [✅ 確認驗證] [❌ 取消]      │
│                                 │
└─────────────────────────────────┘
```

#### Modal 3: 驗證結果
```
┌─────────────────────────────────┐
│ 完成              驗證結果       │ ← Modal Navigation
├─────────────────────────────────┤
│                                 │
│         ✅ 驗證成功              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 驗證項目：                   │ │
│ │ ✅ 國籍：中華民國            │ │
│ │ ✅ 年齡：25歲以上            │ │
│ │ ✅ 戶籍：台北市              │ │
│ │                             │ │
│ │ 驗證時間：2024/06/08 13:36  │ │
│ │ 驗證狀態：有效               │ │
│ └─────────────────────────────┘ │
│                                 │
│   [📝 儲存記錄] [🔄 再次驗證]    │
│                                 │
└─────────────────────────────────┘
```

### 驗證記錄頁面
```
📋 驗證記錄
┌─────────────────────────────────┐
│ ← 返回              🔍 搜尋     │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│ 📅 今天                         │
│ ┌─────────────────────────────┐ │
│ │ 🆔 我分享了身份 - 14:30      │ │
│ │ 給商家驗證年齡 ✅             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔍 我驗證了他人 - 13:36      │ │
│ │ 國籍+年齡+戶籍 ✅            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🆔 我分享了身份 - 10:15      │ │
│ │ 給房東驗證戶籍 ✅             │ │
│ └─────────────────────────────┘ │
│                                 │
│ 📅 昨天                         │
│ ┌─────────────────────────────┐ │
│ │ 🔍 我驗證了他人 - 15:22      │ │
│ │ 國籍驗證 ✅                  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔍 驗證失敗 - 09:15          │ │
│ │ 資訊過期 ❌                  │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ 📊 本月統計：                    │
│ • 我分享了 8 次身份驗證          │
│ • 我驗證了 5 位用戶             │
│ • 成功率：92%                   │
│ • 最常分享：年齡驗證 (5次)       │
│ • 最常驗證：國籍驗證 (3次)       │
└─────────────────────────────────┘
```

#### 記錄詳情頁面 (點擊任一記錄)
```
📋 記錄詳情
┌─────────────────────────────────┐
│ ← 返回              記錄詳情     │ ← Navigation Bar
├─────────────────────────────────┤
│                                 │
│ 🆔 我分享了身份                  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 分享時間：2024/06/08 14:30  │ │
│ │ 分享對象：商家驗證           │ │
│ │ 分享項目：年齡驗證           │ │
│ │ 驗證結果：✅ 成功            │ │
│ │ 有效期限：10分鐘             │ │
│ │ 狀態：已過期                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🔒 隱私保護：                    │
│ • 使用零知識證明技術             │
│ • 未洩露完整身分證號碼           │
│ • 分享後自動過期                 │
│                                 │
│ 📱 分享方式：QR Code            │
│ 🌐 網路狀態：已連線              │
│                                 │
│         [🗑️ 刪除記錄]           │
│                                 │
└─────────────────────────────────┘
```
