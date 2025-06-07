# 🔌 Bearless MVP API 設計文件

## 📋 API 架構概述

Bearless MVP 採用離線優先的設計，主要依賴本地存儲。API 設計著重於數據結構的一致性和擴展性，為未來的雲端整合做準備。

## 🗄️ 數據模型 API

### 證件管理 API

#### 獲取所有證件
```typescript
// GET /api/credentials
interface GetCredentialsResponse {
  success: boolean;
  data: Credential[];
  total: number;
  page?: number;
  limit?: number;
}

// 本地實現
class CredentialAPI {
  async getCredentials(options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<GetCredentialsResponse> {
    // 從 AsyncStorage 獲取證件列表
  }
}
```

#### 創建新證件
```typescript
// POST /api/credentials
interface CreateCredentialRequest {
  name: string;
  issuer: string;
  expiryDate: string;
  fields: CredentialField[];
  metadata?: Record<string, any>;
}

interface CreateCredentialResponse {
  success: boolean;
  data: Credential;
  message?: string;
}

// 本地實現
class CredentialAPI {
  async createCredential(
    request: CreateCredentialRequest
  ): Promise<CreateCredentialResponse> {
    // 驗證數據格式
    // 生成唯一 ID
    // 存儲到 AsyncStorage
  }
}
```

#### 更新證件
```typescript
// PUT /api/credentials/:id
interface UpdateCredentialRequest {
  name?: string;
  issuer?: string;
  expiryDate?: string;
  fields?: CredentialField[];
  metadata?: Record<string, any>;
}

interface UpdateCredentialResponse {
  success: boolean;
  data: Credential;
  message?: string;
}
```

#### 刪除證件
```typescript
// DELETE /api/credentials/:id
interface DeleteCredentialResponse {
  success: boolean;
  message: string;
}
```

### 驗證流程 API

#### 處理驗證請求
```typescript
// POST /api/verification/request
interface VerificationRequestPayload {
  requester: string;
  requestedFields: string[];
  purpose: string;
  challenge?: string;
  metadata?: Record<string, any>;
}

interface VerificationRequestResponse {
  success: boolean;
  data: {
    requestId: string;
    availableCredentials: Credential[];
    matchingFields: FieldMatch[];
  };
}

interface FieldMatch {
  credentialId: string;
  fieldKey: string;
  fieldLabel: string;
  available: boolean;
}
```

#### 生成驗證響應
```typescript
// POST /api/verification/response
interface GenerateVerificationRequest {
  requestId: string;
  credentialId: string;
  selectedFields: SelectedField[];
  userConsent: boolean;
}

interface GenerateVerificationResponse {
  success: boolean;
  data: {
    qrCode: string;
    payload: QRPayload;
    expiresAt: string;
  };
}
```

#### 驗證 QR Code
```typescript
// POST /api/verification/verify
interface VerifyQRCodeRequest {
  qrData: string;
  verifierInfo?: {
    name: string;
    purpose: string;
  };
}

interface VerifyQRCodeResponse {
  success: boolean;
  data: {
    valid: boolean;
    payload: QRPayload;
    verificationResult: VerificationResult;
  };
}

interface VerificationResult {
  credentialValid: boolean;
  fieldsVerified: VerifiedField[];
  timestamp: string;
  signature?: string;
}

interface VerifiedField {
  key: string;
  label: string;
  value: string;
  verified: boolean;
  reason?: string;
}
```

## 🔐 安全 API

### 加密服務 API
```typescript
interface EncryptionAPI {
  // 加密敏感數據
  async encryptData(data: string, key?: string): Promise<string>;
  
  // 解密敏感數據
  async decryptData(encryptedData: string, key?: string): Promise<string>;
  
  // 生成數字簽名
  async signData(data: string): Promise<string>;
  
  // 驗證數字簽名
  async verifySignature(data: string, signature: string): Promise<boolean>;
  
  // 生成密鑰對
  async generateKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
  }>;
}
```

### 生物識別 API
```typescript
interface BiometricAPI {
  // 檢查生物識別可用性
  async isAvailable(): Promise<{
    available: boolean;
    biometryType: 'TouchID' | 'FaceID' | 'Fingerprint' | 'None';
  }>;
  
  // 生物識別驗證
  async authenticate(reason: string): Promise<{
    success: boolean;
    error?: string;
  }>;
  
  // 使用生物識別保護數據
  async secureWithBiometric(
    key: string, 
    data: string
  ): Promise<boolean>;
  
  // 使用生物識別解鎖數據
  async unlockWithBiometric(key: string): Promise<string>;
}
```

## 📱 設備 API

### 相機和檔案 API
```typescript
interface MediaAPI {
  // 拍照
  async takePhoto(options?: {
    quality: number;
    allowsEditing: boolean;
  }): Promise<{
    uri: string;
    width: number;
    height: number;
    fileSize: number;
  }>;
  
  // 選擇圖片
  async pickImage(options?: {
    mediaTypes: 'Images' | 'Videos' | 'All';
    allowsEditing: boolean;
    quality: number;
  }): Promise<{
    uri: string;
    width: number;
    height: number;
    fileSize: number;
  }>;
  
  // 掃描 QR Code
  async scanQRCode(): Promise<{
    data: string;
    type: string;
  }>;
}
```

### 存儲 API
```typescript
interface StorageAPI {
  // 基本存儲
  async setItem(key: string, value: string): Promise<void>;
  async getItem(key: string): Promise<string | null>;
  async removeItem(key: string): Promise<void>;
  async clear(): Promise<void>;
  
  // 安全存儲
  async setSecureItem(
    key: string, 
    value: string, 
    options?: {
      requireBiometric?: boolean;
      accessGroup?: string;
    }
  ): Promise<void>;
  
  async getSecureItem(
    key: string,
    options?: {
      promptMessage?: string;
    }
  ): Promise<string | null>;
  
  // 批量操作
  async multiGet(keys: string[]): Promise<Array<[string, string | null]>>;
  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void>;
  async multiRemove(keys: string[]): Promise<void>;
}
```

## 🔄 同步 API（未來擴展）

### 雲端同步 API
```typescript
interface SyncAPI {
  // 上傳證件到雲端
  async uploadCredential(
    credentialId: string,
    options?: {
      encrypt: boolean;
      backup: boolean;
    }
  ): Promise<{
    success: boolean;
    cloudId: string;
    syncedAt: string;
  }>;
  
  // 從雲端下載證件
  async downloadCredential(cloudId: string): Promise<{
    success: boolean;
    credential: Credential;
    syncedAt: string;
  }>;
  
  // 同步狀態檢查
  async getSyncStatus(): Promise<{
    lastSyncAt: string;
    pendingUploads: number;
    pendingDownloads: number;
    conflicts: SyncConflict[];
  }>;
  
  // 解決同步衝突
  async resolveSyncConflict(
    conflictId: string,
    resolution: 'local' | 'remote' | 'merge'
  ): Promise<{
    success: boolean;
    resolvedCredential: Credential;
  }>;
}

interface SyncConflict {
  id: string;
  credentialId: string;
  localVersion: Credential;
  remoteVersion: Credential;
  conflictType: 'update' | 'delete' | 'create';
  timestamp: string;
}
```

## 📊 分析 API

### 使用統計 API
```typescript
interface AnalyticsAPI {
  // 記錄事件（匿名化）
  async trackEvent(
    eventName: string,
    properties?: Record<string, any>
  ): Promise<void>;
  
  // 記錄頁面瀏覽
  async trackScreen(screenName: string): Promise<void>;
  
  // 記錄用戶行為
  async trackUserAction(
    action: string,
    context?: Record<string, any>
  ): Promise<void>;
  
  // 記錄性能指標
  async trackPerformance(
    metric: string,
    value: number,
    unit?: string
  ): Promise<void>;
  
  // 記錄錯誤
  async trackError(
    error: Error,
    context?: Record<string, any>
  ): Promise<void>;
}
```

## 🧪 測試 API

### Mock API 服務
```typescript
interface MockAPI {
  // 生成模擬證件
  async generateMockCredential(
    type: 'id_card' | 'passport' | 'driver_license' | 'student_id'
  ): Promise<Credential>;
  
  // 生成模擬驗證請求
  async generateMockVerificationRequest(
    scenario: 'age_verification' | 'identity_check' | 'address_proof'
  ): Promise<VerificationRequest>;
  
  // 模擬網絡延遲
  async simulateNetworkDelay(ms: number): Promise<void>;
  
  // 模擬錯誤情況
  async simulateError(
    errorType: 'network' | 'storage' | 'permission' | 'validation'
  ): Promise<never>;
}
```

## 🔧 工具 API

### 實用工具 API
```typescript
interface UtilityAPI {
  // 生成唯一 ID
  generateId(): string;
  
  // 格式化日期
  formatDate(date: Date, format?: string): string;
  
  // 驗證數據格式
  validateCredentialData(data: any): {
    valid: boolean;
    errors: string[];
  };
  
  // 壓縮圖片
  async compressImage(
    uri: string,
    options?: {
      quality: number;
      maxWidth: number;
      maxHeight: number;
    }
  ): Promise<string>;
  
  // 生成 QR Code
  async generateQRCode(
    data: string,
    options?: {
      size: number;
      backgroundColor: string;
      color: string;
    }
  ): Promise<string>;
  
  // 解析 QR Code
  async parseQRCode(imageUri: string): Promise<string>;
}
```

## 📝 API 使用範例

### 完整的證件添加流程
```typescript
// 1. 用戶選擇添加方式
const addCredentialFlow = async () => {
  try {
    // 拍照或選擇圖片
    const image = await MediaAPI.takePhoto({
      quality: 0.8,
      allowsEditing: true
    });
    
    // 解析圖片中的 QR Code（如果有）
    const qrData = await UtilityAPI.parseQRCode(image.uri);
    
    // 創建證件
    const credential = await CredentialAPI.createCredential({
      name: "身分證",
      issuer: "內政部",
      expiryDate: "2030-12-31",
      fields: [
        {
          key: "name",
          label: "姓名",
          value: "王小明",
          type: "text",
          sensitive: false
        },
        {
          key: "id_number",
          label: "身分證字號",
          value: "A123456789",
          type: "text",
          sensitive: true
        }
      ]
    });
    
    console.log("證件添加成功:", credential);
  } catch (error) {
    console.error("添加證件失敗:", error);
  }
};
```

### 完整的驗證流程
```typescript
// 2. 處理驗證請求
const verificationFlow = async () => {
  try {
    // 接收驗證請求
    const request = await VerificationAPI.processRequest({
      requester: "銀行櫃台",
      requestedFields: ["name", "id_number", "age"],
      purpose: "開戶驗證"
    });
    
    // 用戶選擇要揭露的欄位
    const selectedFields = [
      { key: "name", value: "王小明", disclosed: true },
      { key: "age", value: "25", disclosed: true },
      { key: "id_number", value: "A123456789", disclosed: false }
    ];
    
    // 生成驗證響應
    const response = await VerificationAPI.generateResponse({
      requestId: request.data.requestId,
      credentialId: "credential-123",
      selectedFields,
      userConsent: true
    });
    
    console.log("QR Code 已生成:", response.data.qrCode);
  } catch (error) {
    console.error("驗證流程失敗:", error);
  }
};
```
