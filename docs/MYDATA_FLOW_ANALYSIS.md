# MyData 流程與資料流動分析

## 概述
本文檔分析 Bearless MVP 中前往 MyData 頁面的使用者流程，以及從 MyData 取得身分證資料後的資料流動機制。

## 1. 前往 MyData 頁面的流程設計

### 1.1 觸發場景
```
使用者情境：
- 首次使用 Bearless，需要建立身份證 VC
- 現有 VC 過期或需要更新
- 手動重新同步身份資料
```

### 1.2 流程步驟

#### Step 1: 觸發點
- **位置**: 首頁 Tab 或證件 Tab
- **觸發方式**: 
  - 點擊「新增證件」按鈕
  - 點擊「更新身份資料」
  - 系統提示 VC 即將過期

#### Step 2: 身份驗證準備
```
Modal 呈現流程：
1. 說明頁面 - 解釋為什麼需要取得數位身分
2. 隱私聲明 - 明確告知會取得哪些資料
3. 同意授權 - 用戶確認同意連接
```

#### Step 3: 導向 MyData
```
技術實作：
- 使用 OAuth 2.0 / OpenID Connect 流程
- 在新視窗/Tab 開啟 MyData 登入頁面
- 或使用 Deep Link 導向 MyData App (iOS)
```

#### Step 4: MyData 授權流程
```
MyData 端操作：
1. 用戶登入 MyData 帳號
2. 選擇要分享的身分證資料項目
3. 確認授權給 Bearless
4. 重新導向回 Bearless
```

## 2. 資料流動機制

### 2.1 從 MyData 取得的資料結構
```json
{
  "nationalId": {
    "idNumber": "A123456789",
    "name": "王小明",
    "birthDate": "1990-05-15",
    "address": "台北市信義區信義路五段7號",
    "issueDate": "2020-01-01",
    "nationality": "中華民國"
  },
  "metadata": {
    "source": "MyData",
    "timestamp": "2024-06-08T00:26:18+08:00",
    "expiryDate": "2025-06-08T00:26:18+08:00"
  }
}
```

### 2.2 資料處理流程

#### Phase 1: 資料接收與驗證
```
1. 接收 MyData 回傳的授權碼
2. 使用授權碼換取 Access Token
3. 呼叫 MyData API 取得身分證資料
4. 驗證資料完整性和格式
```

#### Phase 2: VC 生成
```
1. 提取核心驗證資訊：
   - 國籍：中華民國
   - 年齡：基於 birthDate 計算
   - 戶籍地：address 欄位
   
2. 使用 DID 技術生成 Verifiable Credential
3. 數位簽章確保資料完整性
```

#### Phase 3: 本地儲存
```
儲存策略：
- 使用瀏覽器 IndexedDB 加密儲存
- 只儲存必要的驗證資訊，不儲存完整身分證號
- 設定自動過期機制
```

## 3. ZKP 轉換與 VC 生成詳細流程

### 3.1 Zero-Knowledge Proof 處理
```
ZKP 轉換步驟：
1. 原始資料預處理
   - 從 MyData 取得完整身分證資料
   - 驗證資料完整性和數位簽章
   - 提取需要證明的屬性

2. 電路設計 (Circuit Design)
   - 年齡證明電路：證明 age >= 18 而不透露確切年齡
   - 國籍證明電路：證明國籍 = "中華民國"
   - 地區證明電路：證明戶籍地屬於特定區域

3. 見證生成 (Witness Generation)
   - 私密輸入：完整身分證資料
   - 公開輸入：驗證條件 (如最低年齡要求)
   - 生成滿足電路約束的見證

4. 證明生成 (Proof Generation)
   - 使用 zk-SNARKs 或 zk-STARKs
   - 生成零知識證明
   - 證明大小優化 (< 1KB)
```

### 3.2 VC 結構設計
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://bearless.app/contexts/identity/v1"
  ],
  "id": "urn:uuid:12345678-1234-5678-9012-123456789abc",
  "type": ["VerifiableCredential", "IdentityCredential"],
  "issuer": {
    "id": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    "name": "Bearless Identity Service"
  },
  "issuanceDate": "2024-06-08T00:29:25Z",
  "expirationDate": "2025-06-08T00:29:25Z",
  "credentialSubject": {
    "id": "did:key:z6MkfrQWqmuVsEP2ab18nkw...", // 用戶的 DID
    "zkProofs": {
      "nationalityProof": {
        "type": "zk-SNARK",
        "proof": "0x1a2b3c4d...", // ZK 證明
        "publicSignals": ["nationality_hash"],
        "verificationKey": "0x5e6f7g8h..."
      },
      "ageProof": {
        "type": "zk-SNARK", 
        "proof": "0x9i0j1k2l...",
        "publicSignals": ["min_age_18"],
        "verificationKey": "0xm3n4o5p6..."
      },
      "residenceProof": {
        "type": "zk-SNARK",
        "proof": "0xq7r8s9t0...",
        "publicSignals": ["region_hash"],
        "verificationKey": "0xu1v2w3x4..."
      }
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-06-08T00:29:25Z",
    "verificationMethod": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK#z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    "proofPurpose": "assertionMethod",
    "proofValue": "z5vgY1Q1HxqLkqjKWgWUzEQw2..."
  }
}
```

### 3.3 VC 儲存架構

#### 本地儲存 (Primary)
```javascript
// IndexedDB 結構
const vcStore = {
  storeName: 'verifiable_credentials',
  keyPath: 'id',
  indexes: [
    { name: 'type', keyPath: 'type' },
    { name: 'issuer', keyPath: 'issuer.id' },
    { name: 'expirationDate', keyPath: 'expirationDate' }
  ]
};

// 加密儲存實作
class SecureVCStorage {
  async store(vc) {
    const encryptedVC = await this.encrypt(vc);
    return await this.indexedDB.put(encryptedVC);
  }
  
  async retrieve(id) {
    const encryptedVC = await this.indexedDB.get(id);
    return await this.decrypt(encryptedVC);
  }
  
  async encrypt(data) {
    // 使用 Web Crypto API
    const key = await this.deriveKey();
    return await crypto.subtle.encrypt('AES-GCM', key, data);
  }
}
```

#### 備份儲存 (Optional)
```
選項 1: IPFS 分散式儲存
- 將加密的 VC 上傳到 IPFS
- 只儲存 IPFS Hash 在本地
- 提供跨設備同步能力

選項 2: 用戶控制的雲端儲存
- 整合 iCloud/Google Drive
- 端到端加密
- 用戶完全控制資料

選項 3: 去中心化身份錢包
- 整合 MetaMask 等錢包
- 使用錢包的安全儲存機制
- 支援多鏈 DID 系統
```

### 3.4 VC 生命週期管理

#### 自動更新機制
```javascript
class VCLifecycleManager {
  async checkExpiration() {
    const vcs = await this.storage.getAllVCs();
    const expiringSoon = vcs.filter(vc => 
      this.isExpiringSoon(vc.expirationDate)
    );
    
    for (const vc of expiringSoon) {
      await this.scheduleRenewal(vc);
    }
  }
  
  async renewVC(vcId) {
    // 重新取得數位身分
    // 重新生成 ZK 證明
    // 更新 VC
    // 通知用戶
  }
}
```

#### 隱私保護機制
```javascript
class PrivacyManager {
  async selectiveDisclosure(vc, requiredClaims) {
    // 只揭露必要的 ZK 證明
    const filteredProofs = {};
    
    if (requiredClaims.includes('age')) {
      filteredProofs.ageProof = vc.credentialSubject.zkProofs.ageProof;
    }
    
    if (requiredClaims.includes('nationality')) {
      filteredProofs.nationalityProof = vc.credentialSubject.zkProofs.nationalityProof;
    }
    
    return this.createPresentationVC(filteredProofs);
  }
}
```

## 4. 技術實作細節

### 4.1 ZK 電路實作 (Circom)
```circom
pragma circom 2.0.0;

template AgeVerification() {
    signal input birthYear;
    signal input currentYear;
    signal input minAge;
    signal output isValid;
    
    component geq = GreaterEqThan(8);
    geq.in[0] <== currentYear - birthYear;
    geq.in[1] <== minAge;
    
    isValid <== geq.out;
}

component main = AgeVerification();
```

### 4.2 前端整合
```javascript
import { groth16 } from 'snarkjs';

class ZKProofGenerator {
  async generateAgeProof(birthDate, minAge) {
    const circuit = await this.loadCircuit('age_verification');
    const input = {
      birthYear: new Date(birthDate).getFullYear(),
      currentYear: new Date().getFullYear(),
      minAge: minAge
    };
    
    const { proof, publicSignals } = await groth16.fullProve(
      input,
      circuit.wasm,
      circuit.zkey
    );
    
    return { proof, publicSignals };
  }
}
```

## 3. 使用者體驗設計

### 3.1 載入狀態管理
```
狀態序列：
1. "正在取得數位身分..." (3-5秒)
2. "正在取得您的身份資料..." (5-10秒)
3. "正在生成數位證件..." (2-3秒)
4. "完成！您的數位身分證已準備就緒"
```

### 3.2 錯誤處理
```
常見錯誤情境：
- MyData 連線失敗 → 提供重試選項
- 授權被拒絕 → 說明為什麼需要這些資料
- 資料格式錯誤 → 聯繫客服支援
- 網路中斷 → 自動重試機制
```

### 3.3 成功回饋
```
完成後動作：
1. 顯示成功動畫 (iOS 風格的勾選動畫)
2. 簡要展示生成的 VC 內容
3. 自動導向到證件 Tab 查看新證件
4. 提供分享或使用證件的快速入口
```

## 4. 安全性考量

### 4.1 資料最小化原則
```
只取得必要資料：
✓ 出生日期 (用於年齡計算)
✓ 戶籍地址 (用於地區驗證)
✓ 國籍資訊
✗ 完整身分證號碼
✗ 其他個人敏感資訊
```

### 4.2 傳輸安全
```
- 全程使用 HTTPS
- OAuth 2.0 PKCE 流程
- JWT Token 有時效性
- 不在 URL 中傳遞敏感資料
```

### 4.3 儲存安全
```
- 客戶端加密儲存
- 定期清理過期資料
- 不儲存 MyData 的 Access Token
- 使用者可隨時刪除本地資料
```

## 5. 技術實作重點

### 5.1 PWA 整合
```javascript
// 檢測是否在 iOS Safari 中
const isIOSPWA = window.navigator.standalone;

// 針對 PWA 優化的 MyData 連接流程
if (isIOSPWA) {
  // 使用 Custom URL Scheme 或 Universal Links
  window.location.href = 'mydata://auth?client_id=bearless';
} else {
  // 使用傳統的 OAuth 重導向
  window.open(mydataAuthUrl, '_blank');
}
```

### 5.2 狀態管理
```javascript
// 使用 React Context 或 Zustand 管理 MyData 流程狀態
const mydataStates = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  AUTHORIZING: 'authorizing',
  FETCHING_DATA: 'fetching_data',
  GENERATING_VC: 'generating_vc',
  SUCCESS: 'success',
  ERROR: 'error'
};
```

## 6. 未來擴展考量

### 6.1 多證件支援準備
```
雖然 MVP 只支援身分證，但架構應考慮：
- 可擴展的資料結構設計
- 通用的 VC 生成機制
- 靈活的權限管理系統
```

### 6.2 離線支援
```
- 快取 MyData 連接狀態
- 離線時顯示已有的 VC
- 網路恢復時自動同步
```

## 結論

MyData 整合是 Bearless 的核心功能，需要在使用者體驗、安全性和技術實作之間取得平衡。重點是保持流程簡潔明瞭，同時確保資料安全和隱私保護。

---
*文檔建立時間: 2024-06-08*
*最後更新: 2024-06-08*
