// Bearless MVP - Component Management

/**
 * 數位身分狀態組件
 */
class MyDataStatusComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    const userData = storage.getUserData();
    const isConnected = storage.isMyDataConnected();
    
    let statusClass, statusText, statusDescription;
    
    if (isConnected) {
      statusClass = 'connected';
      statusText = '數位身分已取得';
      statusDescription = `已於 ${formatRelativeTime(new Date(userData.connectedAt))} 取得成功`;
    } else {
      statusClass = 'disconnected';
      statusText = '數位身分未取得';
      statusDescription = '請取得數位身分以使用完整功能';
    }

    this.container.innerHTML = `
      <div class="mydata-status ${statusClass}">
        <div class="mydata-status-header">
          <span class="mydata-status-title">${statusText}</span>
          <span class="mydata-status-indicator ${statusClass}"></span>
        </div>
        <div class="mydata-status-description">${statusDescription}</div>
      </div>
    `;
  }

  update() {
    this.render();
  }
}

/**
 * 身分證卡片組件
 */
class IdCardComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    const userData = storage.getUserData();
    const isConnected = storage.isMyDataConnected();
    
    this.container.innerHTML = `
      <div class="card-header">
        <span class="card-title">中華民國身分證</span>
        <span class="card-status ${isConnected ? 'connected' : 'disconnected'}">
          ${isConnected ? '已連接' : '未連接'}
        </span>
      </div>
      <div class="card-content">
        <div class="card-photo">
          <div class="photo-placeholder">👤</div>
        </div>
        <div class="card-info">
          <div class="info-row">
            <span class="label">姓名</span>
            <span class="value">${userData.name || '未設定'}</span>
          </div>
          <div class="info-row">
            <span class="label">身分證字號</span>
            <span class="value masked">${maskIdNumber(userData.id)}</span>
          </div>
          <div class="info-row">
            <span class="label">出生日期</span>
            <span class="value masked">${maskBirthDate(userData.birth)}</span>
          </div>
        </div>
      </div>
    `;
  }

  update() {
    this.render();
  }
}

/**
 * 今日活動統計組件
 */
class ActivityStatsComponent {
  constructor() {
    this.shareCountElement = document.getElementById('share-count');
    this.verifyCountElement = document.getElementById('verify-count');
    this.render();
  }

  render() {
    const stats = storage.getTodayStats();
    
    if (this.shareCountElement) {
      this.shareCountElement.textContent = stats.shareCount;
    }
    
    if (this.verifyCountElement) {
      this.verifyCountElement.textContent = stats.verifyCount;
    }
  }

  update() {
    this.render();
  }

  increment(type) {
    storage.updateTodayStats(type);
    this.render();
    
    // 添加動畫效果
    const element = type === 'share' ? this.shareCountElement : this.verifyCountElement;
    if (element) {
      element.style.transform = 'scale(1.2)';
      element.style.color = 'var(--ios-blue)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
      }, 300);
    }
  }
}

/**
 * 歷史記錄組件
 */
class HistoryComponent {
  constructor() {
    this.records = storage.getGroupedHistoryRecords();
  }

  render() {
    const monthlyStats = storage.getMonthlyStats();
    
    let html = `
      <div class="history-stats">
        <h3 class="section-title">本月統計</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">${monthlyStats.totalActions}</span>
            <span class="stat-label">總操作次數</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${monthlyStats.shareCount}</span>
            <span class="stat-label">分享次數</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${monthlyStats.verifyCount}</span>
            <span class="stat-label">驗證次數</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">${monthlyStats.successRate}%</span>
            <span class="stat-label">成功率</span>
          </div>
        </div>
      </div>
    `;

    // 渲染分組記錄
    const groups = [
      { key: 'today', title: '今天' },
      { key: 'yesterday', title: '昨天' },
      { key: 'thisWeek', title: '本週' },
      { key: 'older', title: '更早' }
    ];

    groups.forEach(group => {
      const records = this.records[group.key];
      if (records && records.length > 0) {
        html += `
          <div class="history-group">
            <h3 class="section-title">${group.title}</h3>
            <div class="history-list">
              ${records.map(record => this.renderRecord(record)).join('')}
            </div>
          </div>
        `;
      }
    });

    if (Object.values(this.records).every(group => group.length === 0)) {
      html += `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>尚無記錄</h3>
          <p>開始使用身份驗證功能後，記錄會顯示在這裡</p>
        </div>
      `;
    }

    return html;
  }

  renderRecord(record) {
    const typeIcon = record.type === 'share' ? '🆔' : '🔍';
    const typeText = record.type === 'share' ? '分享身份' : '驗證他人';
    const statusClass = record.status === 'completed' ? 'success' : 'pending';
    const statusText = record.status === 'completed' ? '已完成' : '進行中';
    
    const verificationText = record.verificationTypes
      .map(type => getVerificationTypeName(type))
      .join('、');

    const targetText = record.type === 'share' 
      ? `給 ${record.recipient || '未知對象'}`
      : `來自 ${record.target || '未知用戶'}`;

    return `
      <div class="history-item">
        <div class="history-icon">${typeIcon}</div>
        <div class="history-content">
          <div class="history-title">${typeText}</div>
          <div class="history-details">
            <span class="verification-types">${verificationText}</span>
            <span class="history-target">${targetText}</span>
          </div>
          <div class="history-time">${formatRelativeTime(new Date(record.timestamp))}</div>
        </div>
        <div class="history-status ${statusClass}">${statusText}</div>
      </div>
    `;
  }

  addRecord(record) {
    storage.addHistoryRecord(record);
    this.records = storage.getGroupedHistoryRecords();
  }
}

/**
 * 快速操作組件
 */
class QuickActionsComponent {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const quickActionItems = document.querySelectorAll('.quick-action-item');
    
    quickActionItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        this.handleQuickAction(type);
      });
    });
  }

  handleQuickAction(type) {
    hapticFeedback('light');
    
    // 直接觸發分享流程，預選該驗證類型
    const shareModal = new ShareIdentityModal();
    shareModal.show([type]);
  }
}

/**
 * Tab 切換組件
 */
class TabController {
  constructor() {
    this.currentTab = 'identity';
    this.setupEventListeners();
  }

  setupEventListeners() {
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    if (this.currentTab === tabName) return;
    
    hapticFeedback('light');
    
    // 更新 tab 狀態
    document.querySelectorAll('.tab-item').forEach(item => {
      item.classList.toggle('active', item.dataset.tab === tabName);
    });
    
    // 切換內容
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    this.currentTab = tabName;
  }
}

/**
 * 設定頁面組件
 */
class SettingsComponent {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const settingsItems = document.querySelectorAll('.settings-item');
    
    settingsItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const label = e.currentTarget.querySelector('.settings-label').textContent;
        this.handleSettingsAction(label);
      });
    });
  }

  handleSettingsAction(action) {
    hapticFeedback('light');
    
    switch (action) {
      case '個人資料':
        this.showPersonalInfo();
        break;
      case '隱私設定':
        this.showPrivacySettings();
        break;
      case '重新連接':
        this.reconnectMyData();
        break;
      case '通知設定':
        this.showNotificationSettings();
        break;
      case '關於 Bearless':
        this.showAbout();
        break;
      default:
        showToast(`${action} 功能開發中`, 'info');
    }
  }

  showPersonalInfo() {
    const userData = storage.getUserData();
    showToast(`姓名：${userData.name}\n年齡：${calculateAge(userData.birth)}歲`, 'info', 4000);
  }

  showPrivacySettings() {
    showToast('隱私設定功能開發中', 'info');
  }

  async reconnectMyData() {
    showToast('正在重新取得數位身分...', 'info');
    
    try {
      await delay(2000); // 模擬連接過程
      storage.updateMyDataConnection(true);
      
      // 更新 UI
      if (window.myDataStatus) {
        window.myDataStatus.update();
      }
      if (window.idCard) {
        window.idCard.update();
      }
      
      showToast('數位身分重新取得成功', 'success');
    } catch (error) {
      showToast('連接失敗，請稍後再試', 'error');
    }
  }

  showNotificationSettings() {
    showToast('通知設定功能開發中', 'info');
  }

  showAbout() {
    showToast('Bearless v1.0.0\n簡單安全的身份驗證', 'info', 4000);
  }
}

// CSS 樣式補充（添加到 components.css）
const additionalStyles = `
/* History Components */
.history-stats {
  margin-bottom: var(--spacing-xl);
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.stat-card {
  text-align: center;
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border-radius: var(--radius-sm);
}

.stat-card .stat-number {
  display: block;
  font-size: var(--font-size-title2);
  font-weight: 700;
  color: var(--ios-blue);
  margin-bottom: var(--spacing-xs);
}

.stat-card .stat-label {
  font-size: var(--font-size-caption);
  color: var(--text-secondary);
  font-weight: 500;
}

.history-group {
  margin-bottom: var(--spacing-xl);
}

.history-list {
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.history-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 0.5px solid var(--ios-gray-5);
}

.history-item:last-child {
  border-bottom: none;
}

.history-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--ios-gray-6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: var(--spacing-md);
}

.history-content {
  flex: 1;
}

.history-title {
  font-size: var(--font-size-body);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.history-details {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.verification-types {
  font-size: var(--font-size-footnote);
  color: var(--ios-blue);
  font-weight: 500;
}

.history-target {
  font-size: var(--font-size-footnote);
  color: var(--text-secondary);
}

.history-time {
  font-size: var(--font-size-caption);
  color: var(--text-tertiary);
}

.history-status {
  font-size: var(--font-size-caption);
  font-weight: 500;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.history-status.success {
  color: var(--ios-green);
  background-color: rgba(52, 199, 89, 0.1);
}

.history-status.pending {
  color: var(--ios-orange);
  background-color: rgba(255, 149, 0, 0.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: var(--spacing-xxl) var(--spacing-lg);
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: var(--font-size-title3);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.empty-state p {
  font-size: var(--font-size-subhead);
  line-height: 1.4;
}
`;

// 動態添加樣式
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
