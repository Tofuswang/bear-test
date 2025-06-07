# 🐻 Bearless MVP

*數位證件管理應用 - 讓證件驗證像行動支付一樣簡單*

## 📋 項目概述

Bearless 是一個數位證件管理應用，讓用戶可以安全地將證件存放在手機中，並在需要時選擇性地揭露資訊進行驗證。整體使用體驗類似行動支付，操作簡單、流程清楚。

## 🎯 核心功能

### 1. 證件管理
- 將證件放入手機（掃描 QR code、上傳檔案、建立模擬證件）
- 查看已存放的證件列表
- 管理證件資訊和有效期限

### 2. 驗證流程
- **被動驗證**：接收驗證需求 → 選擇揭露欄位 → 生成 QR code
- **主動出示**：選擇證件 → 選擇揭露欄位 → 顯示 QR code

## 🚀 快速開始

### 環境需求
- Node.js 18+
- React Native CLI 或 Expo CLI
- iOS Simulator / Android Emulator

### 安裝步驟
```bash
# 克隆項目
git clone [repository-url]
cd bearless-mvp

# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 運行 iOS
npm run ios

# 運行 Android
npm run android
```

## 📱 用戶流程

### 首次使用
1. 打開應用 → Landing Page
2. 點擊 "Get Started" → 進入主頁面
3. 點擊 "新增證件" → 選擇新增方式

### 日常使用
1. **查看證件**：主頁面顯示所有證件卡片
2. **驗證身份**：點擊 "驗證/使用 pass" → 選擇揭露欄位 → 出示 QR code
3. **主動出示**：點擊 "Show My Pass" → 選擇證件和欄位 → 顯示 QR code

## 🏗️ 技術架構

### 前端技術棧
- **框架**：React Native
- **狀態管理**：Redux Toolkit
- **導航**：React Navigation
- **UI 組件**：React Native Elements
- **QR Code**：react-native-qrcode-generator

### 數據存儲
- **本地存儲**：AsyncStorage
- **證件資料**：JSON 格式本地存儲
- **不需要**：雲端同步、用戶帳號系統

### 安全考量
- 證件資料僅存儲在本地設備
- QR code 包含選擇性揭露的資訊
- 暫時使用簡單 JSON 格式（非正式 ZKP）

## 📊 MVP 完成標準

- ✅ 用戶可將 1 張以上證件放入手機
- ✅ 完整的被動驗證流程（challenge → 選擇欄位 → QR code）
- ✅ 完整的主動出示流程（選擇證件 → 選擇欄位 → QR code）
- ✅ 操作體驗簡單直接，無需教學

## 📁 項目結構

```
bearless-mvp/
├── src/
│   ├── components/          # 可重用組件
│   ├── screens/            # 頁面組件
│   ├── navigation/         # 導航配置
│   ├── store/             # Redux store
│   ├── services/          # 業務邏輯服務
│   ├── utils/             # 工具函數
│   └── types/             # TypeScript 類型定義
├── docs/                  # 開發文件
├── assets/               # 靜態資源
└── __tests__/           # 測試文件
```

## 🎨 設計原則

- **簡單直接**：像 Signal 一樣打開就會用
- **信任感強**：乾淨的視覺風格，避免 geek 風格
- **儀式感**：在「放入證件」與「選擇揭露欄位」體現重要性

## 📝 開發指南

詳細的開發指南請參考：
- [技術規格文件](./docs/TECHNICAL_SPEC.md)
- [API 設計文件](./docs/API_DESIGN.md)
- [UI/UX 指南](./docs/UI_UX_GUIDE.md)
- [測試指南](./docs/TESTING_GUIDE.md)

## 🤝 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打開 Pull Request

## 📄 授權

本項目採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件
