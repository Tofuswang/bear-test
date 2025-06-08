# User Flow: 身分證錄入流程

## 概述
這個 user flow 描述用戶從首次使用 Bearless 到成功錄入身分證並可以進行身份驗證的完整過程。

## 流程階段

### 階段 1: 初次進入應用 (Empty State)

#### 畫面狀態
- **位置**: 身份驗證 Tab (主頁面)
- **視覺狀態**: 空狀態畫面
- **核心元素**:
  - 大型插圖/圖標 (身分證圖示)
  - 標題: "開始使用 Bearless"
  - 副標題: "連接您的 MyData 帳戶以開始身份驗證"
  - 主要 CTA: "連接 MyData" (大按鈕)
  - 次要說明: "安全、隱私、完全由您控制"

#### 用戶心理狀態
- 初次使用，需要清楚的引導
- 對隱私和安全有疑慮
- 需要了解產品價值

#### 設計要點
- 使用溫暖的藍色調建立信任感
- 簡潔的文案避免認知負荷
- 清楚的價值主張

---

### 階段 2: MyData 連接流程 (Modal 序列)

#### 2.1 連接說明 Modal
**觸發**: 點擊 "連接 MyData" 按鈕

**Modal 內容**:
```
標題: 連接 MyData 帳戶
圖示: MyData Logo + 連接圖示

說明文字:
"MyData 是政府提供的數位身分服務，讓您安全地管理個人資料。"

功能說明:
✓ 安全取得您的身分證資訊
✓ 資料加密保護，完全隱私
✓ 隨時可以中斷連接

按鈕:
- [繼續] (主要)
- [取消] (次要)
```

#### 2.2 資料授權確認 Modal
**觸發**: 點擊 "繼續"

**Modal 內容**:
```
標題: 資料使用授權
圖示: 盾牌 + 勾選圖示

授權項目:
□ 姓名 (用於身份確認)
□ 出生日期 (用於年齡驗證)
□ 戶籍地址 (用於戶籍驗證)
□ 國籍 (用於國籍驗證)

隱私說明:
"這些資料僅用於生成驗證憑證，不會被儲存或分享給第三方。"

按鈕:
- [授權並連接] (主要)
- [返回] (次要)
```

#### 2.3 連接進度 Modal
**觸發**: 點擊 "授權並連接"

**Modal 內容**:
```
標題: 正在連接 MyData
圖示: 載入動畫

進度指示:
🔄 連接 MyData 服務...
⏳ 驗證身份資訊...
🔐 生成驗證憑證...

狀態文字: "請稍候，正在安全地處理您的資料..."

註: 此階段無按鈕，自動進行
```

#### 2.4 連接成功 Modal
**觸發**: 連接完成

**Modal 內容**:
```
標題: 設定完成！
圖示: 綠色勾選 + 慶祝動畫

成功訊息:
"您的身分證已成功連接，現在可以開始使用身份驗證功能。"

功能預覽:
✓ 可驗證國籍 (中華民國)
✓ 可驗證年齡 (基於出生日期)
✓ 可驗證戶籍 (戶籍地址)

按鈕:
- [開始使用] (主要)
```

---

### 階段 3: 已連接狀態 (Active State)

#### 畫面轉換
**觸發**: 點擊 "開始使用"
**動畫**: Modal 關閉，主頁面內容滑入

#### 新的主頁面狀態

**身分證卡片區域**:
```
┌─────────────────────────────────┐
│ 🆔 中華民國身分證                    │
│                                 │
│ 姓名: 王○○                       │
│ 狀態: ✅ 已連接並驗證               │
│ 有效期限: 2034/12/31              │
│                                 │
│ [管理連接] [重新整理]               │
└─────────────────────────────────┘
```

**主要操作按鈕**:
```
┌─────────────────────────────────┐
│ 🆔 分享我的身份                    │
│ 讓他人驗證您的身份資訊               │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🔍 驗證他人身份                    │
│ 掃描 QR Code 驗證他人身份          │
└─────────────────────────────────┘
```

**快速驗證選項**:
```
快速分享選項:
[🇹🇼 國籍] [📅 年齡] [🏠 戶籍]
```

**今日活動摘要**:
```
今日活動
分享次數: 0  |  驗證次數: 0
```

---

## 錯誤處理流程

### MyData 連接失敗

**觸發條件**:
- 網路連接問題
- MyData 服務暫時無法使用
- 用戶取消授權

**錯誤 Modal**:
```
標題: 連接失敗
圖示: 橙色警告圖示

錯誤說明:
"無法連接到 MyData 服務，請檢查網路連接或稍後再試。"

解決方案:
• 確認網路連接正常
• 檢查 MyData 服務狀態
• 稍後重新嘗試

按鈕:
- [重新嘗試] (主要)
- [稍後再試] (次要)
```

### 資料驗證失敗

**錯誤 Modal**:
```
標題: 資料驗證失敗
圖示: 橙色警告圖示

錯誤說明:
"身分證資料驗證失敗，請確認您的 MyData 帳戶資料是否正確。"

解決方案:
• 檢查 MyData 帳戶資料
• 確認身分證資料完整
• 聯繫客服支援

按鈕:
- [重新驗證] (主要)
- [聯繫客服] (次要)
```

---

## 技術實現要點

### 狀態管理
```javascript
// 應用狀態
const appState = {
  myDataConnection: {
    status: 'disconnected', // disconnected, connecting, connected, error
    userData: null,
    lastUpdated: null,
    expiryDate: null
  },
  ui: {
    currentModal: null,
    isLoading: false
  }
}
```

### Modal 管理
```javascript
// Modal 序列管理
const modalSequence = [
  'mydata-intro',
  'data-authorization', 
  'connection-progress',
  'connection-success'
];

function showNextModal(currentModal) {
  const currentIndex = modalSequence.indexOf(currentModal);
  const nextModal = modalSequence[currentIndex + 1];
  if (nextModal) {
    showModal(nextModal);
  }
}
```

### 動畫轉場
```css
/* Modal 進入動畫 */
.modal-enter {
  transform: translateY(100%);
  opacity: 0;
}

.modal-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.3s ease-out;
}

/* 主頁面狀態轉換 */
.main-content-transition {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 設計原則遵循

### iOS Human Interface Guidelines
- **Modal Presentation**: 使用 iOS 標準的 Modal 呈現方式
- **Progressive Disclosure**: 逐步揭露資訊，避免認知負荷
- **Clear Hierarchy**: 清楚的視覺層級和資訊架構
- **Consistent Navigation**: 一致的導航模式和互動方式

### 隱私設計原則
- **Transparency**: 清楚說明資料使用方式
- **User Control**: 用戶完全控制資料分享
- **Minimal Data**: 只收集必要的資料
- **Secure by Default**: 預設最高安全等級

### 信任建立策略
- **Professional Design**: 專業可靠的視覺設計
- **Clear Communication**: 清楚的溝通和說明
- **Error Handling**: 友善的錯誤處理和解決方案
- **Feedback**: 即時的操作回饋和狀態更新

---

## 成功指標

### 用戶體驗指標
- **完成率**: 用戶成功完成身分證錄入的比例
- **放棄率**: 在各個階段放棄的比例
- **錯誤率**: 遇到錯誤的頻率
- **重試率**: 失敗後重新嘗試的比例

### 技術指標
- **載入時間**: Modal 和頁面載入時間
- **API 成功率**: MyData 連接成功率
- **錯誤恢復**: 錯誤處理和恢復機制效果

這個 user flow 確保了用戶能夠順暢地從初次使用到成功設定身分證，並為後續的身份驗證功能做好準備。
