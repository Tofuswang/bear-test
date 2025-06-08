// Bearless MVP - Modal Management

/**
 * 基礎 Modal 類
 */
class BaseModal {
  constructor(modalId) {
    this.modalId = modalId;
    this.overlay = document.getElementById('modal-overlay');
    this.modal = document.getElementById(modalId);
    this.isVisible = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 關閉按鈕
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    // 點擊背景關閉
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    // ESC 鍵關閉
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  show() {
    this.overlay.classList.remove('hidden');
    this.modal.classList.remove('hidden');
    
    // 觸發動畫
    setTimeout(() => {
      this.overlay.classList.add('show');
    }, 10);
    
    this.isVisible = true;
    hapticFeedback('medium');
    
    // 防止背景滾動
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.overlay.classList.remove('show');
    
    setTimeout(() => {
      this.overlay.classList.add('hidden');
      this.modal.classList.add('hidden');
      this.isVisible = false;
      
      // 恢復背景滾動
      document.body.style.overflow = '';
    }, 300);
    
    hapticFeedback('light');
  }

  setContent(html) {
    const body = this.modal.querySelector('.modal-body');
    if (body) {
      body.innerHTML = html;
    }
  }
}

/**
 * 分享身份 Modal
 */
class ShareIdentityModal extends BaseModal {
  constructor() {
    super('share-modal');
    this.selectedTypes = [];
    this.currentStep = 'select'; // select, confirm, qrcode, complete
  }

  show(preselectedTypes = []) {
    this.selectedTypes = preselectedTypes;
    this.currentStep = 'select';
    this.renderSelectStep();
    super.show();
  }

  renderSelectStep() {
    const userData = storage.getUserData();
    const verificationOptions = [
      { type: 'nationality', icon: '🇹🇼', label: '國籍', value: '中華民國' },
      { type: 'age', icon: '🎂', label: '年齡', value: `${calculateAge(userData.birth)}歲` },
      { type: 'address', icon: '🏠', label: '戶籍地', value: '台北市大安區' }
    ];

    const html = `
      <div class="verification-selection">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <p class="step-text">選擇要分享的資訊</p>
        </div>

        <div class="selection-description">
          <p>請選擇您要分享的身份資訊項目。您可以選擇一個或多個項目。</p>
        </div>

        <div class="verification-options">
          ${verificationOptions.map(option => `
            <div class="verification-option ${this.selectedTypes.includes(option.type) ? 'selected' : ''}" 
                 data-type="${option.type}">
              <div class="option-icon">${option.icon}</div>
              <div class="option-content">
                <div class="option-label">${option.label}</div>
                <div class="option-value">${option.value}</div>
              </div>
              <div class="option-toggle">
                <label class="toggle-switch">
                  <input type="checkbox" ${this.selectedTypes.includes(option.type) ? 'checked' : ''}>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="shareModal.hide()">取消</button>
          <button class="modal-button primary" onclick="shareModal.proceedToConfirm()" 
                  ${this.selectedTypes.length === 0 ? 'disabled' : ''}>
            下一步
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
    this.setupSelectionListeners();
  }

  setupSelectionListeners() {
    const toggles = this.modal.querySelectorAll('.option-toggle input[type="checkbox"]');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('change', () => {
        const type = toggle.parentNode.parentNode.dataset.type;
        
        if (toggle.checked) {
          this.selectedTypes.push(type);
          toggle.parentNode.parentNode.classList.add('selected');
        } else {
          this.selectedTypes = this.selectedTypes.filter(t => t !== type);
          toggle.parentNode.parentNode.classList.remove('selected');
        }
        
        // 更新下一步按鈕狀態
        const nextBtn = this.modal.querySelector('.modal-button.primary');
        nextBtn.disabled = this.selectedTypes.length === 0;
        
        hapticFeedback('light');
      });
    });
  }

  proceedToConfirm() {
    this.currentStep = 'confirm';
    this.renderConfirmStep();
  }

  renderConfirmStep() {
    const userData = storage.getUserData();
    const selectedInfo = this.selectedTypes.map(type => {
      switch (type) {
        case 'nationality': return { label: '國籍', value: '中華民國' };
        case 'age': return { label: '年齡', value: `${calculateAge(userData.birth)}歲` };
        case 'address': return { label: '戶籍地', value: '台北市大安區' };
        default: return { label: type, value: '未知' };
      }
    });

    const html = `
      <div class="verification-confirm">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot completed">✓</span>
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <p class="step-text">確認分享資訊</p>
        </div>

        <div class="confirm-description">
          <p>請確認您要分享的資訊內容。確認後將生成 QR Code 供對方掃描。</p>
        </div>

        <div class="confirm-info-card">
          <div class="card-header">
            <span class="card-icon">🆔</span>
            <span class="card-title">即將分享的資訊</span>
          </div>
          <div class="info-list">
            ${selectedInfo.map(info => `
              <div class="info-item">
                <span class="info-label">${info.label}</span>
                <span class="info-value">${info.value}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="privacy-notice">
          <div class="notice-icon">🔒</div>
          <div class="notice-content">
            <h4>隱私保護</h4>
            <p>您的資訊將透過零知識證明技術分享，確保隱私安全。QR Code 將在 5 分鐘後自動失效。</p>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="shareModal.backToSelect()">返回</button>
          <button class="modal-button primary" onclick="shareModal.generateQRCode()">確認分享</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  backToSelect() {
    this.currentStep = 'select';
    this.renderSelectStep();
  }

  async generateQRCode() {
    this.currentStep = 'qrcode';
    this.renderLoadingStep();
    
    try {
      // 模擬 API 調用
      const response = await mockApiCall('/api/identity/share', {
        types: this.selectedTypes
      }, 2000);
      
      if (response.success) {
        this.renderQRCodeStep(response.data);
        
        // 5分鐘後自動關閉
        setTimeout(() => {
          if (this.isVisible && this.currentStep === 'qrcode') {
            this.completeSharing();
          }
        }, 5 * 60 * 1000);
      } else {
        throw new Error('生成失敗');
      }
    } catch (error) {
      this.renderErrorStep(error.message);
    }
  }

  renderLoadingStep() {
    const html = `
      <div class="loading-state">
        <div class="loading-spinner-large"></div>
        <div class="loading-text">
          <h3>正在生成 QR Code</h3>
          <p>請稍候，正在建立安全連接...</p>
        </div>
      </div>
    `;
    
    this.setContent(html);
  }

  renderQRCodeStep(data) {
    const html = `
      <div class="qr-code-display">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot completed">✓</span>
            <span class="dot completed">✓</span>
            <span class="dot active"></span>
          </div>
          <p class="step-text">請對方掃描 QR Code</p>
        </div>

        <div class="qr-code-container">
          <div class="qr-code">${data.qrCode}</div>
          <div class="qr-code-description">
            請將此 QR Code 提供給需要驗證的對方掃描
          </div>
          <div class="qr-code-timer">
            <div class="timer-circle"></div>
            <span>QR Code 將在 5 分鐘後失效</span>
          </div>
        </div>

        <div class="sharing-info">
          <h4>分享的資訊</h4>
          <div class="shared-items">
            ${this.selectedTypes.map(type => `
              <span class="shared-item">
                ${getVerificationTypeIcon(type)} ${getVerificationTypeName(type)}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="shareModal.hide()">取消分享</button>
          <button class="modal-button primary" onclick="shareModal.completeSharing()">完成</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  renderErrorStep(message) {
    const html = `
      <div class="result-container">
        <div class="result-icon error">❌</div>
        <h3 class="result-title error">分享失敗</h3>
        <p class="result-description">${message}</p>
        
        <div class="modal-actions">
          <button class="modal-button secondary" onclick="shareModal.hide()">關閉</button>
          <button class="modal-button primary" onclick="shareModal.generateQRCode()">重試</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  completeSharing() {
    // 記錄分享操作
    const record = {
      type: 'share',
      action: '分享身份',
      verificationTypes: this.selectedTypes,
      status: 'completed',
      recipient: '驗證方'
    };
    
    if (window.historyComponent) {
      window.historyComponent.addRecord(record);
    }
    
    // 更新統計
    if (window.activityStats) {
      window.activityStats.increment('share');
    }
    
    showToast('身份資訊分享完成', 'success');
    this.hide();
  }
}

/**
 * 驗證他人身份 Modal
 */
class VerifyIdentityModal extends BaseModal {
  constructor() {
    super('verify-modal');
    this.currentStep = 'select'; // select, scan, verify, result
    this.selectedItems = [];
    this.cameraStream = null;
    this.scanInterval = null;
  }

  show() {
    this.currentStep = 'select';
    this.selectedItems = [];
    this.renderSelectStep();
    super.show();
  }

  renderSelectStep() {
    const html = `
      <div class="verify-select">
        <div class="modal-header">
          <h3>選擇驗證項目</h3>
          <p>請選擇您要驗證對方的身份資訊</p>
        </div>

        <div class="verification-options">
          <div class="option-item" data-type="nationality">
            <div class="option-content">
              <div class="option-icon">🏳️</div>
              <div class="option-info">
                <div class="option-title">國籍</div>
                <div class="option-description">驗證國籍資訊</div>
              </div>
            </div>
            <div class="option-toggle">
              <label class="toggle-switch">
                <input type="checkbox" id="verify-nationality" value="nationality">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="option-item" data-type="age">
            <div class="option-content">
              <div class="option-icon">🎂</div>
              <div class="option-info">
                <div class="option-title">年齡</div>
                <div class="option-description">驗證年齡資訊</div>
              </div>
            </div>
            <div class="option-toggle">
              <label class="toggle-switch">
                <input type="checkbox" id="verify-age" value="age">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="option-item" data-type="address">
            <div class="option-content">
              <div class="option-icon">🏠</div>
              <div class="option-info">
                <div class="option-title">戶籍地</div>
                <div class="option-description">驗證戶籍地址</div>
              </div>
            </div>
            <div class="option-toggle">
              <label class="toggle-switch">
                <input type="checkbox" id="verify-address" value="address">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="privacy-notice">
          <div class="notice-icon">🔒</div>
          <div class="notice-content">
            <p><strong>隱私保護</strong></p>
            <p>只會驗證您選擇的項目，其他個人資訊不會被存取或顯示。</p>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="verifyModal.hide()">取消</button>
          <button class="modal-button primary" onclick="verifyModal.proceedToScan()" id="proceed-verify-btn" disabled>
            繼續掃描
            <span class="button-arrow">→</span>
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
    this.setupSelectStepListeners();
  }

  setupSelectStepListeners() {
    const checkboxes = this.modal.querySelectorAll('input[type="checkbox"]');
    const proceedBtn = this.modal.querySelector('#proceed-verify-btn');

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateSelectedItems();
        proceedBtn.disabled = this.selectedItems.length === 0;
        
        // 更新按鈕文字
        if (this.selectedItems.length > 0) {
          proceedBtn.innerHTML = `
            驗證 ${this.selectedItems.length} 個項目
            <span class="button-arrow">→</span>
          `;
        } else {
          proceedBtn.innerHTML = `
            繼續掃描
            <span class="button-arrow">→</span>
          `;
        }
      });
    });
  }

  updateSelectedItems() {
    const checkboxes = this.modal.querySelectorAll('input[type="checkbox"]:checked');
    this.selectedItems = Array.from(checkboxes).map(cb => cb.value);
  }

  proceedToScan() {
    if (this.selectedItems.length === 0) {
      showToast('請至少選擇一個驗證項目', 'warning');
      return;
    }
    
    this.currentStep = 'scan';
    this.renderScanStep();
  }

  renderScanStep() {
    const selectedItemsText = this.selectedItems.map(item => getVerificationTypeName(item)).join('、');
    
    const html = `
      <div class="verify-scan">
        <div class="scan-description">
          <h3>掃描對方的 QR Code</h3>
          <p>請使用相機掃描對方提供的身份驗證 QR Code</p>
          <div class="selected-items">
            <span class="selected-label">將驗證：</span>
            <span class="selected-values">${selectedItemsText}</span>
          </div>
        </div>

        <div class="camera-container">
          <video id="camera-preview" class="camera-preview" autoplay playsinline></video>
          <div class="camera-overlay">
            <div class="scan-frame">
              <div class="scan-corners">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>
              <div class="scan-line"></div>
            </div>
          </div>
          <div class="camera-placeholder hidden">
            <div class="camera-icon">📷</div>
            <p>相機功能</p>
            <small>正在啟動相機...</small>
          </div>
        </div>

        <div class="scan-tips">
          <h4>掃描提示</h4>
          <ul>
            <li>將 QR Code 對準掃描框內</li>
            <li>保持適當距離（10-30cm）</li>
            <li>確保光線充足</li>
            <li>保持手機穩定</li>
          </ul>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="verifyModal.show()">重新選擇</button>
          <button class="modal-button tertiary" onclick="verifyModal.toggleFlashlight()" id="flashlight-btn">
            <span class="button-icon">🔦</span>
            開啟手電筒
          </button>
          <button class="modal-button primary" onclick="verifyModal.simulateScan()">模擬掃描</button>
        </div>
      </div>
    `;

    this.setContent(html);
    this.startCamera();
  }

  async startCamera() {
    const video = this.modal.querySelector('#camera-preview');
    const placeholder = this.modal.querySelector('.camera-placeholder');
    
    try {
      // 請求相機權限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 使用後置相機
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      video.srcObject = stream;
      this.cameraStream = stream;
      
      // 隱藏佔位符，顯示相機畫面
      placeholder.classList.add('hidden');
      video.classList.remove('hidden');
      
      // 開始 QR Code 掃描
      this.startQRScanning(video);
      
    } catch (error) {
      console.error('無法啟動相機:', error);
      placeholder.innerHTML = `
        <div class="camera-icon">❌</div>
        <p>無法啟動相機</p>
        <small>${error.message}</small>
        <button class="retry-camera-btn" onclick="verifyModal.startCamera()">重試</button>
      `;
      
      showToast('相機啟動失敗，請檢查權限設定', 'error');
    }
  }

  startQRScanning(video) {
    // 創建 canvas 用於圖像處理
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 在實際應用中，這裡會使用 QR Code 掃描庫
        // 例如 jsQR 或 qr-scanner
        // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        // const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        
        // 模擬掃描成功（實際應用中會檢測到真實的 QR Code）
        // if (qrCode) {
        //   clearInterval(scanInterval);
        //   this.handleQRCodeDetected(qrCode.data);
        // }
      }
    }, 100);
    
    this.scanInterval = scanInterval;
  }

  handleQRCodeDetected(qrData) {
    // 停止相機和掃描
    this.stopCamera();
    
    // 顯示掃描成功提示
    showToast('QR Code 掃描成功！', 'success');
    
    // 處理 QR Code 數據並進行驗證
    this.processQRCode(qrData);
  }

  processQRCode(qrData) {
    // 在實際應用中，這裡會解析 QR Code 中的驗證請求
    // 並與選擇的驗證項目進行比對
    this.simulateScan();
  }

  stopCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  toggleFlashlight() {
    const flashlightBtn = this.modal.querySelector('#flashlight-btn');
    
    if (this.cameraStream) {
      const track = this.cameraStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        const settings = track.getSettings();
        const newTorchState = !settings.torch;
        
        track.applyConstraints({
          advanced: [{ torch: newTorchState }]
        }).then(() => {
          flashlightBtn.innerHTML = newTorchState 
            ? '<span class="button-icon">🔦</span>關閉手電筒'
            : '<span class="button-icon">🔦</span>開啟手電筒';
        }).catch(error => {
          console.error('無法控制手電筒:', error);
          showToast('手電筒控制失敗', 'error');
        });
      } else {
        showToast('此設備不支援手電筒功能', 'warning');
      }
    }
  }

  hide() {
    // 關閉相機
    this.stopCamera();
    super.hide();
  }

  async simulateScan() {
    this.renderScanningStep();
    
    try {
      // 模擬掃描和驗證過程
      await delay(2000);
      
      const response = await mockApiCall('/api/identity/verify', {
        requestedInfo: this.selectedItems
      }, 1500);
      
      if (response.success) {
        this.renderResultStep(response.data);
      } else {
        throw new Error('驗證失敗');
      }
    } catch (error) {
      this.renderErrorStep(error.message);
    }
  }

  renderScanningStep() {
    const html = `
      <div class="scanning-state">
        <div class="verification-steps">
          <div class="verification-step">
            <div class="step-icon active">📱</div>
            <div class="step-content">
              <div class="step-title">掃描 QR Code</div>
              <div class="step-description">正在讀取身份資訊...</div>
            </div>
          </div>
          <div class="verification-step">
            <div class="step-icon pending">🔍</div>
            <div class="step-content">
              <div class="step-title">驗證身份</div>
              <div class="step-description">等待驗證完成</div>
            </div>
          </div>
          <div class="verification-step">
            <div class="step-icon pending">✅</div>
            <div class="step-content">
              <div class="step-title">顯示結果</div>
              <div class="step-description">準備顯示驗證結果</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  renderResultStep(data) {
    const html = `
      <div class="verify-result">
        <div class="result-container">
          <div class="result-icon success">✅</div>
          <h3 class="result-title success">驗證成功</h3>
          <p class="result-description">身份資訊驗證完成</p>
        </div>

        <div class="verified-info-card">
          <div class="card-header">
            <span class="card-icon">🔍</span>
            <span class="card-title">驗證結果</span>
          </div>
          <div class="info-list">
            ${Object.entries(data.result).map(([key, value]) => `
              <div class="info-item verified">
                <span class="info-label">${getVerificationTypeName(key)}</span>
                <span class="info-value">
                  <span class="verified-badge">✓</span>
                  ${value}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="verification-details">
          <div class="detail-item">
            <span class="detail-label">驗證時間</span>
            <span class="detail-value">${formatTime()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">驗證方式</span>
            <span class="detail-value">零知識證明</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button primary" onclick="verifyModal.completeVerification()">完成</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  renderErrorStep(message) {
    const html = `
      <div class="result-container">
        <div class="result-icon error">❌</div>
        <h3 class="result-title error">驗證失敗</h3>
        <p class="result-description">${message}</p>
        
        <div class="modal-actions">
          <button class="modal-button secondary" onclick="verifyModal.hide()">關閉</button>
          <button class="modal-button primary" onclick="verifyModal.show()">重新掃描</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  completeVerification() {
    // 記錄驗證操作
    const record = {
      type: 'verify',
      action: '驗證他人',
      verificationTypes: this.selectedItems,
      status: 'completed',
      target: '身份持有者'
    };
    
    if (window.historyComponent) {
      window.historyComponent.addRecord(record);
    }
    
    // 更新統計
    if (window.activityStats) {
      window.activityStats.increment('verify');
    }
    
    showToast('身份驗證完成', 'success');
    this.hide();
  }
}

/**
 * MyData 連接 Modal
 */
class MyDataConnectionModal extends BaseModal {
  constructor() {
    super('mydata-modal');
    this.currentStep = 'intro'; // intro, authorization, progress, success, error
    this.connectionData = null;
  }

  show() {
    this.currentStep = 'intro';
    this.renderIntroStep();
    super.show();
  }

  renderIntroStep() {
    const html = `
      <div class="mydata-connection-intro">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <p class="step-text">步驟 1/4</p>
        </div>

        <div class="intro-content">
          <div class="intro-icon">
            <div class="mydata-logo">
              <span class="logo-icon">🆔</span>
              <span class="connection-icon">🔗</span>
            </div>
          </div>
          
          <h3 class="intro-title">連接 MyData 帳戶</h3>
          <p class="intro-description">
            MyData 是政府提供的數位身分服務，讓您安全地管理個人資料。
          </p>

          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">🔒</span>
              <span class="feature-text">安全取得您的身分證資訊</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🛡️</span>
              <span class="feature-text">資料加密保護，完全隱私</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <span class="feature-text">隨時可以中斷連接</span>
            </div>
          </div>

          <div class="privacy-notice">
            <div class="notice-icon">ℹ️</div>
            <div class="notice-text">
              <strong>隱私保護</strong><br>
              您的資料僅用於生成驗證憑證，不會被儲存或分享給第三方。
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="mydataModal.hide()">取消</button>
          <button class="modal-button primary" onclick="mydataModal.proceedToAuthorization()">
            繼續
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  proceedToAuthorization() {
    this.currentStep = 'authorization';
    this.renderAuthorizationStep();
  }

  renderAuthorizationStep() {
    const html = `
      <div class="mydata-authorization">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot completed">✓</span>
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <p class="step-text">步驟 2/4</p>
        </div>

        <div class="authorization-content">
          <div class="auth-icon">
            <span class="shield-icon">🛡️</span>
          </div>
          
          <h3 class="auth-title">資料使用授權</h3>
          <p class="auth-description">
            請確認您同意 Bearless 存取以下資料項目：
          </p>

          <div class="permission-list">
            <div class="permission-item">
              <div class="permission-checkbox">
                <input type="checkbox" id="perm-name" checked disabled>
                <label for="perm-name">
                  <span class="checkbox-icon">✓</span>
                </label>
              </div>
              <div class="permission-content">
                <div class="permission-title">姓名</div>
                <div class="permission-desc">用於身份確認</div>
              </div>
            </div>

            <div class="permission-item">
              <div class="permission-checkbox">
                <input type="checkbox" id="perm-birth" checked disabled>
                <label for="perm-birth">
                  <span class="checkbox-icon">✓</span>
                </label>
              </div>
              <div class="permission-content">
                <div class="permission-title">出生日期</div>
                <div class="permission-desc">用於年齡驗證</div>
              </div>
            </div>

            <div class="permission-item">
              <div class="permission-checkbox">
                <input type="checkbox" id="perm-address" checked disabled>
                <label for="perm-address">
                  <span class="checkbox-icon">✓</span>
                </label>
              </div>
              <div class="permission-content">
                <div class="permission-title">戶籍地址</div>
                <div class="permission-desc">用於戶籍驗證</div>
              </div>
            </div>

            <div class="permission-item">
              <div class="permission-checkbox">
                <input type="checkbox" id="perm-nationality" checked disabled>
                <label for="perm-nationality">
                  <span class="checkbox-icon">✓</span>
                </label>
              </div>
              <div class="permission-content">
                <div class="permission-title">國籍</div>
                <div class="permission-desc">用於國籍驗證</div>
              </div>
            </div>
          </div>

          <div class="privacy-guarantee">
            <div class="guarantee-icon">🔐</div>
            <div class="guarantee-text">
              <strong>隱私保證</strong><br>
              這些資料僅用於生成驗證憑證，不會被儲存或分享給第三方。您可以隨時撤銷授權。
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="mydataModal.backToIntro()">返回</button>
          <button class="modal-button primary" onclick="mydataModal.startConnection()">
            授權並連接
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  backToIntro() {
    this.currentStep = 'intro';
    this.renderIntroStep();
  }

  startConnection() {
    this.currentStep = 'progress';
    this.renderProgressStep();
    
    // 模擬連接過程
    this.simulateConnection();
  }

  renderProgressStep() {
    const html = `
      <div class="mydata-progress">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot completed">✓</span>
            <span class="dot completed">✓</span>
            <span class="dot active"></span>
            <span class="dot"></span>
          </div>
          <p class="step-text">步驟 3/4</p>
        </div>

        <div class="progress-content">
          <div class="progress-icon">
            <div class="loading-spinner">
              <div class="spinner"></div>
            </div>
          </div>
          
          <h3 class="progress-title">正在連接 MyData</h3>
          <p class="progress-description">
            請稍候，正在安全地處理您的資料...
          </p>

          <div class="progress-steps">
            <div class="progress-step active" id="step-connect">
              <div class="step-status">
                <span class="step-icon loading">🔄</span>
                <span class="step-text">連接 MyData 服務...</span>
              </div>
            </div>
            
            <div class="progress-step" id="step-verify">
              <div class="step-status">
                <span class="step-icon pending">⏳</span>
                <span class="step-text">驗證身份資訊...</span>
              </div>
            </div>
            
            <div class="progress-step" id="step-generate">
              <div class="step-status">
                <span class="step-icon pending">🔐</span>
                <span class="step-text">生成驗證憑證...</span>
              </div>
            </div>
          </div>

          <div class="progress-note">
            <div class="note-icon">💡</div>
            <div class="note-text">
              首次連接可能需要 10-30 秒，請耐心等候。
            </div>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  simulateConnection() {
    // 第一步：連接 MyData 服務
    setTimeout(() => {
      this.updateProgressStep('step-connect', 'completed', '✅', '連接 MyData 服務完成');
      this.updateProgressStep('step-verify', 'active', '🔄', '驗證身份資訊...');
    }, 2000);

    // 第二步：驗證身份資訊
    setTimeout(() => {
      this.updateProgressStep('step-verify', 'completed', '✅', '身份資訊驗證完成');
      this.updateProgressStep('step-generate', 'active', '🔄', '生成驗證憑證...');
    }, 4000);

    // 第三步：生成驗證憑證
    setTimeout(() => {
      this.updateProgressStep('step-generate', 'completed', '✅', '驗證憑證生成完成');
      
      // 模擬成功或失敗
      const isSuccess = Math.random() > 0.1; // 90% 成功率
      
      if (isSuccess) {
        this.connectionData = {
          name: '王小明',
          id: 'A123456789',
          nationality: '中華民國',
          birth: '1995-03-15',
          address: '台北市信義區信義路五段7號',
          issueDate: '2020-01-15',
          expiryDate: '2030-01-15'
        };
        
        setTimeout(() => {
          this.renderSuccessStep();
        }, 1000);
      } else {
        setTimeout(() => {
          this.renderErrorStep('連接失敗，請稍後再試');
        }, 1000);
      }
    }, 6000);
  }

  updateProgressStep(stepId, status, icon, text) {
    const step = document.getElementById(stepId);
    if (step) {
      step.className = `progress-step ${status}`;
      const iconSpan = step.querySelector('.step-icon');
      const textSpan = step.querySelector('.step-text');
      
      if (iconSpan) iconSpan.textContent = icon;
      if (textSpan) textSpan.textContent = text;
    }
  }

  renderSuccessStep() {
    this.currentStep = 'success';
    
    const html = `
      <div class="mydata-success">
        <div class="step-indicator">
          <div class="step-dots">
            <span class="dot completed">✓</span>
            <span class="dot completed">✓</span>
            <span class="dot completed">✓</span>
            <span class="dot active">✓</span>
          </div>
          <p class="step-text">步驟 4/4</p>
        </div>

        <div class="success-content">
          <div class="success-animation">
            <div class="success-icon">
              <span class="checkmark">✅</span>
              <div class="celebration-particles">
                <span class="particle">🎉</span>
                <span class="particle">✨</span>
                <span class="particle">🎊</span>
              </div>
            </div>
          </div>
          
          <h3 class="success-title">設定完成！</h3>
          <p class="success-description">
            您的身分證已成功連接，現在可以開始使用身份驗證功能。
          </p>

          <div class="capability-preview">
            <h4 class="preview-title">現在您可以驗證：</h4>
            <div class="capability-list">
              <div class="capability-item">
                <span class="capability-icon">🇹🇼</span>
                <span class="capability-text">國籍 (中華民國)</span>
              </div>
              <div class="capability-item">
                <span class="capability-icon">📅</span>
                <span class="capability-text">年齡 (基於出生日期)</span>
              </div>
              <div class="capability-item">
                <span class="capability-icon">🏠</span>
                <span class="capability-text">戶籍 (戶籍地址)</span>
              </div>
            </div>
          </div>

          <div class="next-steps">
            <div class="steps-icon">💡</div>
            <div class="steps-text">
              <strong>接下來您可以：</strong><br>
              • 分享身份資訊給他人驗證<br>
              • 掃描他人的 QR Code 進行驗證<br>
              • 在設定中管理您的連接
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button primary large" onclick="mydataModal.completeConnection()">
            開始使用
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  renderErrorStep(message) {
    this.currentStep = 'error';
    
    const html = `
      <div class="mydata-error">
        <div class="error-content">
          <div class="error-icon">
            <span class="warning-icon">⚠️</span>
          </div>
          
          <h3 class="error-title">連接失敗</h3>
          <p class="error-description">${message}</p>

          <div class="error-solutions">
            <h4 class="solutions-title">請嘗試以下解決方案：</h4>
            <div class="solution-list">
              <div class="solution-item">
                <span class="solution-icon">📶</span>
                <span class="solution-text">確認網路連接正常</span>
              </div>
              <div class="solution-item">
                <span class="solution-icon">🔄</span>
                <span class="solution-text">檢查 MyData 服務狀態</span>
              </div>
              <div class="solution-item">
                <span class="solution-icon">⏰</span>
                <span class="solution-text">稍後重新嘗試</span>
              </div>
            </div>
          </div>

          <div class="support-info">
            <div class="support-icon">🆘</div>
            <div class="support-text">
              如果問題持續發生，請聯繫客服支援。
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="mydataModal.hide()">稍後再試</button>
          <button class="modal-button primary" onclick="mydataModal.retryConnection()">
            重新嘗試
          </button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  retryConnection() {
    this.startConnection();
  }

  completeConnection() {
    // 調用 app 的連接方法
    if (window.app) {
      window.app.connectMyData();
    }
    
    // 顯示成功提示
    showToast('MyData 連接成功！', 'success');
    
    // 關閉 Modal
    this.hide();
  }
}

/**
 * 歷史記錄 Modal
 */
class HistoryModal extends BaseModal {
  constructor() {
    super('history-modal');
    this.historyComponent = new HistoryComponent();
  }

  show() {
    this.renderHistory();
    super.show();
  }

  renderHistory() {
    const html = this.historyComponent.render();
    this.setContent(html);
  }
}

// 全域 Modal 實例
let shareModal, verifyModal, mydataModal, historyModal;

// 初始化 Modal
document.addEventListener('DOMContentLoaded', () => {
  shareModal = new ShareIdentityModal();
  verifyModal = new VerifyIdentityModal();
  mydataModal = new MyDataConnectionModal();
  historyModal = new HistoryModal();
  
  // 全域 modals 對象
  window.modals = {
    showShareIdentity: (preselectedTypes) => shareModal.show(preselectedTypes),
    showVerifyIdentity: () => verifyModal.show(),
    showMyDataConnection: () => mydataModal.show(),
    showHistory: () => historyModal.show()
  };
});

// 工具函數
function hapticFeedback(intensity = 'medium') {
  // 模擬觸覺回饋
  if (navigator.vibrate) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[intensity] || patterns.medium);
  }
}

function showToast(message, type = 'info') {
  // 創建 toast 元素
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  
  // 添加到頁面
  document.body.appendChild(toast);
  
  // 顯示動畫
  setTimeout(() => toast.classList.add('show'), 100);
  
  // 自動隱藏
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function formatTime() {
  return new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function getVerificationTypeName(type) {
  const names = {
    nationality: '國籍',
    age: '年齡',
    address: '戶籍地'
  };
  return names[type] || type;
}

function getVerificationTypeIcon(type) {
  const icons = {
    nationality: '🇹🇼',
    age: '📅',
    address: '🏠'
  };
  return icons[type] || '';
}
