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
              <div class="option-checkbox">
                <span class="checkbox ${this.selectedTypes.includes(option.type) ? 'checked' : ''}">
                  ${this.selectedTypes.includes(option.type) ? '✓' : ''}
                </span>
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
    const options = this.modal.querySelectorAll('.verification-option');
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        const type = option.dataset.type;
        
        if (this.selectedTypes.includes(type)) {
          this.selectedTypes = this.selectedTypes.filter(t => t !== type);
          option.classList.remove('selected');
          option.querySelector('.checkbox').classList.remove('checked');
          option.querySelector('.checkbox').textContent = '';
        } else {
          this.selectedTypes.push(type);
          option.classList.add('selected');
          option.querySelector('.checkbox').classList.add('checked');
          option.querySelector('.checkbox').textContent = '✓';
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
    this.currentStep = 'scan'; // scan, verify, result
  }

  show() {
    this.currentStep = 'scan';
    this.renderScanStep();
    super.show();
  }

  renderScanStep() {
    const html = `
      <div class="verify-scan">
        <div class="scan-description">
          <h3>掃描對方的 QR Code</h3>
          <p>請使用相機掃描對方提供的身份驗證 QR Code</p>
        </div>

        <div class="camera-placeholder">
          <div class="camera-icon">📷</div>
          <p>相機功能</p>
          <small>在實際應用中這裡會顯示相機畫面</small>
        </div>

        <div class="scan-tips">
          <h4>掃描提示</h4>
          <ul>
            <li>確保 QR Code 清晰可見</li>
            <li>保持適當距離</li>
            <li>確保光線充足</li>
          </ul>
        </div>

        <div class="modal-actions">
          <button class="modal-button secondary" onclick="verifyModal.hide()">取消</button>
          <button class="modal-button primary" onclick="verifyModal.simulateScan()">模擬掃描</button>
        </div>
      </div>
    `;

    this.setContent(html);
  }

  async simulateScan() {
    this.renderScanningStep();
    
    try {
      // 模擬掃描和驗證過程
      await delay(2000);
      
      const response = await mockApiCall('/api/identity/verify', {
        requestedInfo: ['nationality', 'age']
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
      verificationTypes: ['nationality', 'age'],
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
let shareModal, verifyModal, historyModal;

// 初始化 Modal
document.addEventListener('DOMContentLoaded', () => {
  shareModal = new ShareIdentityModal();
  verifyModal = new VerifyIdentityModal();
  historyModal = new HistoryModal();
});
