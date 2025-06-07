# 🎨 Bearless MVP UI/UX 設計指南

## 🎯 設計原則

### 核心理念
- **簡單直接**：像 Signal 一樣打開就會用，無需教學
- **信任感強**：乾淨的視覺風格，建立用戶信任
- **儀式感**：在關鍵操作點體現重要性和安全感
- **行動支付體驗**：熟悉的操作流程和視覺語言

### 設計價值觀
1. **安全第一**：視覺設計強化安全感知
2. **用戶控制**：清楚展示用戶的選擇權
3. **透明度**：明確告知每個操作的後果
4. **效率**：最少的步驟完成任務

## 🎨 視覺設計系統

### 色彩系統
```scss
// 主色調 - 信任藍
$primary-blue: #2196F3;      // 主要按鈕、重要元素
$primary-blue-light: #64B5F6; // 次要狀態
$primary-blue-dark: #1976D2;  // 按下狀態

// 輔助色彩
$success-green: #4CAF50;     // 成功狀態、驗證通過
$warning-orange: #FF9800;    // 警告、注意事項
$error-red: #F44336;         // 錯誤、危險操作
$info-cyan: #00BCD4;         // 資訊提示

// 中性色彩
$background: #FFFFFF;        // 主背景
$surface: #F8F9FA;           // 卡片背景
$surface-dark: #E9ECEF;      // 分隔線、邊框
$text-primary: #212529;      // 主要文字
$text-secondary: #6C757D;    // 次要文字
$text-disabled: #ADB5BD;     // 禁用文字
```

### 字體系統
```scss
// 字體大小
$font-size-h1: 28px;         // 頁面標題
$font-size-h2: 24px;         // 區塊標題
$font-size-h3: 20px;         // 小標題
$font-size-body: 16px;       // 正文
$font-size-caption: 14px;    // 說明文字
$font-size-small: 12px;      // 次要資訊

// 字重
$font-weight-bold: 700;      // 重要標題
$font-weight-medium: 500;    // 次要標題
$font-weight-regular: 400;   // 正文

// 行高
$line-height-tight: 1.2;    // 標題
$line-height-normal: 1.5;   // 正文
$line-height-loose: 1.8;    // 說明文字
```

### 間距系統
```scss
// 間距單位（8px 基準）
$spacing-xs: 4px;            // 極小間距
$spacing-sm: 8px;            // 小間距
$spacing-md: 16px;           // 中等間距
$spacing-lg: 24px;           // 大間距
$spacing-xl: 32px;           // 極大間距
$spacing-xxl: 48px;          // 超大間距

// 組件間距
$component-padding: 16px;    // 組件內邊距
$section-margin: 24px;       // 區塊間距
$page-padding: 20px;         // 頁面邊距
```

### 圓角和陰影
```scss
// 圓角
$border-radius-sm: 4px;      // 小元素
$border-radius-md: 8px;      // 按鈕、輸入框
$border-radius-lg: 12px;     // 卡片
$border-radius-xl: 16px;     // 大卡片

// 陰影
$shadow-sm: 0 1px 3px rgba(0,0,0,0.1);      // 輕微陰影
$shadow-md: 0 4px 6px rgba(0,0,0,0.1);      // 中等陰影
$shadow-lg: 0 10px 15px rgba(0,0,0,0.1);    // 重陰影
$shadow-xl: 0 20px 25px rgba(0,0,0,0.15);   // 極重陰影
```

## 📱 組件設計規範

### 按鈕設計
```typescript
// 主要按鈕
interface PrimaryButton {
  backgroundColor: '#2196F3';
  color: '#FFFFFF';
  padding: '12px 24px';
  borderRadius: '8px';
  fontSize: '16px';
  fontWeight: '500';
  minHeight: '48px';
  shadow: 'shadow-md';
}

// 次要按鈕
interface SecondaryButton {
  backgroundColor: 'transparent';
  color: '#2196F3';
  border: '1px solid #2196F3';
  padding: '12px 24px';
  borderRadius: '8px';
  fontSize: '16px';
  fontWeight: '500';
  minHeight: '48px';
}

// 危險按鈕
interface DangerButton {
  backgroundColor: '#F44336';
  color: '#FFFFFF';
  padding: '12px 24px';
  borderRadius: '8px';
  fontSize: '16px';
  fontWeight: '500';
  minHeight: '48px';
}
```

### 卡片設計
```typescript
// 證件卡片
interface CredentialCard {
  backgroundColor: '#FFFFFF';
  borderRadius: '12px';
  padding: '16px';
  margin: '8px 0';
  shadow: 'shadow-md';
  border: '1px solid #E9ECEF';
  
  // 卡片內容結構
  header: {
    title: string;      // 證件名稱
    issuer: string;     // 發行機構
    status: 'valid' | 'expired' | 'expiring';
  };
  
  body: {
    expiryDate: string;
    fieldCount: number;
  };
  
  footer: {
    actions: ['view', 'edit', 'delete'];
  };
}
```

### 輸入框設計
```typescript
interface InputField {
  backgroundColor: '#F8F9FA';
  border: '1px solid #E9ECEF';
  borderRadius: '8px';
  padding: '12px 16px';
  fontSize: '16px';
  minHeight: '48px';
  
  // 狀態變化
  states: {
    default: { borderColor: '#E9ECEF' };
    focus: { borderColor: '#2196F3', shadow: '0 0 0 3px rgba(33,150,243,0.1)' };
    error: { borderColor: '#F44336', backgroundColor: '#FFEBEE' };
    success: { borderColor: '#4CAF50', backgroundColor: '#E8F5E8' };
  };
}
```

## 📱 頁面佈局規範

### Landing Page
```
┌─────────────────────────────────┐
│           Status Bar            │
├─────────────────────────────────┤
│                                 │
│         🐻 Bearless            │
│                                 │
│    數位證件，安全簡單            │
│                                 │
│    [插圖：手機中的證件]          │
│                                 │
│                                 │
│      [ Get Started ]            │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### 主頁面 - 我的證件
```
┌─────────────────────────────────┐
│  ← 我的證件              + 新增  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🆔 中華民國身分證           ││
│  │ 內政部                      ││
│  │ 有效期限：2030/12/31        ││
│  │                    [查看]   ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🎓 學生證                   ││
│  │ 國立台灣大學                ││
│  │ 有效期限：2024/06/30        ││
│  │                    [查看]   ││
│  └─────────────────────────────┘│
│                                 │
│                                 │
├─────────────────────────────────┤
│    [驗證/使用 Pass]  [Show Pass] │
└─────────────────────────────────┘
```

### 驗證流程頁面
```
┌─────────────────────────────────┐
│  ← 選擇揭露資訊                 │
├─────────────────────────────────┤
│                                 │
│  驗證方要求以下資訊：            │
│  銀行櫃台 - 開戶驗證            │
│                                 │
│  ┌─────────────────────────────┐│
│  │ ☑️ 姓名                     ││
│  │ ☑️ 年齡                     ││
│  │ ☐ 身分證字號                ││
│  │ ☐ 地址                      ││
│  └─────────────────────────────┘│
│                                 │
│  ⚠️ 只會分享您勾選的資訊         │
│                                 │
│                                 │
│        [ 生成驗證條碼 ]          │
│                                 │
└─────────────────────────────────┘
```

### QR Code 顯示頁面
```
┌─────────────────────────────────┐
│  ← 出示驗證條碼                 │
├─────────────────────────────────┤
│                                 │
│        請對方掃描此條碼          │
│                                 │
│     ┌─────────────────────┐     │
│     │                     │     │
│     │    [QR CODE 圖像]    │     │
│     │                     │     │
│     └─────────────────────┘     │
│                                 │
│     已分享資訊：                │
│     • 姓名：王小明              │
│     • 年齡：25歲                │
│                                 │
│     ⏰ 5分鐘後自動失效           │
│                                 │
│           [ 重新生成 ]           │
└─────────────────────────────────┘
```

## 🎭 互動設計規範

### 動畫效果
```typescript
// 頁面轉場
const pageTransition = {
  type: 'slide',
  duration: 300,
  easing: 'ease-out'
};

// 按鈕點擊
const buttonPress = {
  scale: 0.95,
  duration: 150,
  easing: 'ease-in-out'
};

// 卡片展開
const cardExpand = {
  height: 'auto',
  duration: 250,
  easing: 'ease-out'
};

// 載入動畫
const loadingSpinner = {
  rotation: '360deg',
  duration: 1000,
  repeat: 'infinite',
  easing: 'linear'
};
```

### 手勢操作
```typescript
// 卡片滑動操作
interface SwipeGesture {
  direction: 'left' | 'right';
  threshold: 100; // px
  actions: {
    left: 'delete';
    right: 'edit';
  };
}

// 下拉刷新
interface PullToRefresh {
  threshold: 80; // px
  resistance: 2.5;
  snapBackDuration: 300;
}

// 長按操作
interface LongPress {
  duration: 500; // ms
  feedback: 'haptic';
  action: 'showContextMenu';
}
```

### 回饋機制
```typescript
// 觸覺回饋
interface HapticFeedback {
  success: 'notificationSuccess';
  warning: 'notificationWarning';
  error: 'notificationError';
  selection: 'selectionChanged';
  impact: 'impactLight';
}

// 視覺回饋
interface VisualFeedback {
  success: {
    color: '#4CAF50';
    icon: 'checkmark-circle';
    duration: 2000;
  };
  error: {
    color: '#F44336';
    icon: 'alert-circle';
    duration: 3000;
  };
  loading: {
    color: '#2196F3';
    icon: 'loading-spinner';
    duration: 'infinite';
  };
}
```

## 🔒 安全感設計

### 信任指標
```typescript
// 安全狀態指示器
interface SecurityIndicator {
  secure: {
    color: '#4CAF50';
    icon: 'shield-checkmark';
    text: '安全連線';
  };
  warning: {
    color: '#FF9800';
    icon: 'shield-warning';
    text: '注意安全';
  };
  danger: {
    color: '#F44336';
    icon: 'shield-alert';
    text: '不安全';
  };
}

// 隱私保護提示
interface PrivacyIndicator {
  dataLocal: '資料僅存於本機';
  noTracking: '不追蹤個人行為';
  userControl: '您完全控制資料分享';
  encryption: '資料已加密保護';
}
```

### 重要操作確認
```typescript
// 危險操作確認對話框
interface ConfirmationDialog {
  title: string;
  message: string;
  primaryAction: {
    text: string;
    style: 'destructive' | 'default';
    color: '#F44336' | '#2196F3';
  };
  secondaryAction: {
    text: '取消';
    style: 'cancel';
  };
  
  // 特殊確認機制
  requiresTyping?: string; // 需要輸入特定文字
  requiresBiometric?: boolean; // 需要生物識別
  countdown?: number; // 倒數秒數
}
```

## 📐 響應式設計

### 螢幕尺寸適配
```typescript
// 斷點定義
const breakpoints = {
  small: 320,    // iPhone SE
  medium: 375,   // iPhone 12
  large: 414,    // iPhone 12 Pro Max
  tablet: 768    // iPad
};

// 組件尺寸適配
interface ResponsiveComponent {
  small: {
    fontSize: 14,
    padding: 12,
    margin: 8
  };
  medium: {
    fontSize: 16,
    padding: 16,
    margin: 12
  };
  large: {
    fontSize: 18,
    padding: 20,
    margin: 16
  };
}
```

### 可訪問性設計
```typescript
// 無障礙設計規範
interface AccessibilityGuidelines {
  // 最小觸控目標
  minTouchTarget: 44; // px
  
  // 色彩對比度
  contrastRatio: {
    normal: 4.5;
    large: 3.0;
  };
  
  // 語音輔助
  screenReader: {
    labels: true;
    hints: true;
    roles: true;
  };
  
  // 動態字體支持
  dynamicType: true;
  
  // 減少動畫選項
  respectsReduceMotion: true;
}
```

## 🎯 用戶體驗檢查清單

### 首次使用體驗
- [ ] 無需註冊即可開始使用
- [ ] 引導流程不超過 3 個步驟
- [ ] 提供示例證件快速體驗
- [ ] 清楚說明應用價值主張

### 日常使用體驗
- [ ] 主要功能在 2 次點擊內完成
- [ ] 載入時間不超過 2 秒
- [ ] 離線狀態下仍可查看證件
- [ ] 錯誤訊息清楚且可操作

### 安全體驗
- [ ] 每次分享資料前都有確認步驟
- [ ] 清楚顯示將要分享的資訊
- [ ] 提供撤銷或修改選擇的機會
- [ ] 操作完成後有明確的成功回饋

### 效能體驗
- [ ] 應用啟動時間 < 3 秒
- [ ] 頁面切換流暢無卡頓
- [ ] 圖片載入使用漸進式載入
- [ ] 記憶體使用量控制在合理範圍
