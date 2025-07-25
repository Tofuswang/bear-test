# UI 控制權主權設計調整

## 基於設計原則的 UI 調整建議

### 1. 資料授權確認 Modal 重新設計

#### 原設計問題
```
授權項目:
□ 姓名 (用於身份確認)
□ 出生日期 (用於年齡驗證)  
□ 戶籍地址 (用於戶籍驗證)
□ 國籍 (用於國籍驗證)
```
**問題**：這是「全有全無」的設計，不符合選擇性揭露原則

#### 新設計方案
```
標題: 您完全掌控要分享的資訊
副標題: 選擇您願意用於驗證的資料項目

┌─────────────────────────────────────┐
│ 🇹🇼 國籍驗證                          │
│ ✅ 啟用   用於證明中華民國國籍           │
│ 需要：國籍資訊                         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📅 年齡驗證                          │
│ ⚪ 可選   用於證明是否成年              │
│ 需要：出生年份（不含具體日期）           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🏠 戶籍驗證                          │
│ ⚪ 可選   用於證明戶籍所在縣市           │
│ 需要：戶籍縣市（不含詳細地址）           │
└─────────────────────────────────────┘

底部說明：
🔒 您的完整個人資料永遠不會被分享
📱 這些資料儲存在您的設備上，由您控制
⏰ 您隨時可以修改或撤回這些設定
```

### 2. 新增「資料儲存位置選擇」功能

#### 連接成功 Modal 調整
```
標題: 設定完成！您擁有完全控制權

成功訊息:
"您的身分憑證已準備就緒，所有資料由您掌控。"

🔧 進階設定（可選）：
┌─────────────────────────────────────┐
│ 📱 資料儲存位置                        │
│ ● 僅儲存在此設備（推薦）                │
│ ○ 加密備份到您選擇的雲端服務             │
│ ○ 同時儲存在多個設備                   │
└─────────────────────────────────────┘

隱私保證：
✓ 無論選擇哪種方式，我們都無法存取您的資料
✓ 您隨時可以更改儲存設定
✓ 您可以隨時完全刪除所有資料
```

### 3. 主頁面加入「控制權儀表板」

#### 身分證卡片區域調整
```
┌─────────────────────────────────────┐
│ 🆔 您的數位身分憑證                     │
│                                     │
│ 狀態: ✅ 由您完全掌控                  │
│ 儲存: 📱 僅在此設備                    │
│ 建立: 2024/06/10                     │
│                                     │
│ [🔧 隱私設定] [📊 使用記錄] [🗑️ 管理資料] │
└─────────────────────────────────────┘
```

### 4. 新增「選擇性分享」介面

#### 分享身份流程調整
```
當用戶點擊「分享我的身份」時：

標題: 選擇要分享的驗證項目
副標題: 只分享回答問題所需的最少資訊

┌─────────────────────────────────────┐
│ 對方想要驗證：                        │
│ "您是否為中華民國國民且已成年？"         │
│                                     │
│ 建議分享：                           │
│ ✅ 國籍：是/否（中華民國）              │
│ ✅ 年齡：是/否（已成年）                │
│ ❌ 姓名：不需要                       │
│ ❌ 詳細出生日期：不需要                 │
│ ❌ 詳細地址：不需要                    │
│                                     │
│ [自訂分享內容] [使用建議設定]           │
└─────────────────────────────────────┘
```

### 5. 加入「退出權」的明顯入口

#### 設定頁面新增
```
隱私與控制權
┌─────────────────────────────────────┐
│ 🔒 資料控制權                         │
│ 查看和管理您的所有資料                  │
│ [進入] >                            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📤 資料匯出                          │
│ 下載您的所有資料副本                   │
│ [匯出] >                            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🗑️ 完全移除                          │
│ 刪除所有資料並停用服務                  │
│ [移除] >                            │
└─────────────────────────────────────┘
```

### 6. 透明度增強

#### 每個操作都要顯示「資料流向」
```
當用戶進行任何驗證操作時，顯示：

┌─────────────────────────────────────┐
│ 🔍 這次分享的資料流向                   │
│                                     │
│ 從：您的設備                          │
│ 到：驗證請求方                        │
│ 內容：國籍（是/否）                    │
│ 時效：5分鐘後自動失效                   │
│                                     │
│ ❌ 我們不會收到任何資料                 │
│ ❌ 不會儲存任何記錄到我們的伺服器         │
└─────────────────────────────────────┘
```

## 設計語言調整

### 文案調整
- **從「連接 MyData」→「取得數位身分」**
- **從「授權」→「選擇分享」**  
- **從「設定完成」→「您現在擁有完全控制權」**
- **強調「由您掌控」「您的選擇」「隨時可撤回」**

### 視覺元素調整
- **加入更多「控制權」相關圖示**：🔧⚙️🎛️
- **用顏色區分「必要」vs「可選」**：藍色（必要）vs 灰色（可選）
- **加入「資料流向」視覺化**：箭頭、流程圖

### 互動模式調整
- **所有「全選」改為「個別選擇」**
- **加入「為什麼需要這個資料」的說明**
- **每個選項都要有「了解更多」連結**

這些調整將讓你的 UI 真正體現「個人身分主權」的核心理念！
