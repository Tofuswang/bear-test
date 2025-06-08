// Bearless MVP - Local Storage Management

/**
 * 本地存儲管理類
 */
class StorageManager {
  constructor() {
    this.prefix = 'bearless_';
    this.init();
  }

  /**
   * 初始化存儲
   */
  init() {
    // 檢查是否首次使用
    if (!this.get('initialized')) {
      this.initializeDefaultData();
      this.set('initialized', true);
    }
    
    // 開發階段：強制重置資料以確保最新設定
    // 可以在生產環境中移除這段代碼
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Development mode: Resetting storage data');
      this.clear();
      this.initializeDefaultData();
      this.set('initialized', true);
    }
  }

  /**
   * 初始化預設資料
   */
  initializeDefaultData() {
    // 使用者資料
    const userData = {
      name: '王小明',
      id: 'A123456789',
      birth: '1990-05-15',
      address: '台北市大安區忠孝東路四段123號',
      nationality: '中華民國',
      myDataConnected: false,
      connectedAt: null
    };

    // 今日統計
    const todayStats = {
      date: formatDate(),
      shareCount: 3,
      verifyCount: 1
    };

    // 歷史記錄
    const historyRecords = [
      {
        id: generateId(),
        type: 'share',
        action: '分享身份',
        verificationTypes: ['nationality', 'age'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
        status: 'completed',
        recipient: '台北銀行'
      },
      {
        id: generateId(),
        type: 'share',
        action: '分享身份',
        verificationTypes: ['age'],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小時前
        status: 'completed',
        recipient: '便利商店'
      },
      {
        id: generateId(),
        type: 'verify',
        action: '驗證他人',
        verificationTypes: ['nationality'],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小時前
        status: 'completed',
        target: '張小華',
        result: {
          nationality: '中華民國'
        }
      },
      {
        id: generateId(),
        type: 'share',
        action: '分享身份',
        verificationTypes: ['address'],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 昨天
        status: 'completed',
        recipient: '房屋仲介'
      }
    ];

    // 設定資料
    const settings = {
      notifications: true,
      biometric: false,
      autoShare: false,
      theme: 'light'
    };

    // 儲存預設資料
    this.set('user', userData);
    this.set('todayStats', todayStats);
    this.set('historyRecords', historyRecords);
    this.set('settings', settings);
  }

  /**
   * 設置資料
   */
  set(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  /**
   * 獲取資料
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  /**
   * 刪除資料
   */
  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }

  /**
   * 清空所有資料
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * 獲取使用者資料
   */
  getUserData() {
    return this.get('user', {});
  }

  /**
   * 更新使用者資料
   */
  updateUserData(data) {
    const currentData = this.getUserData();
    const updatedData = { ...currentData, ...data };
    return this.set('user', updatedData);
  }

  /**
   * 獲取今日統計
   */
  getTodayStats() {
    const stats = this.get('todayStats', { date: formatDate(), shareCount: 0, verifyCount: 0 });
    
    // 檢查是否為今天的資料
    if (stats.date !== formatDate()) {
      // 重置為今天的統計
      const newStats = {
        date: formatDate(),
        shareCount: 0,
        verifyCount: 0
      };
      this.set('todayStats', newStats);
      return newStats;
    }
    
    return stats;
  }

  /**
   * 更新今日統計
   */
  updateTodayStats(type) {
    const stats = this.getTodayStats();
    
    if (type === 'share') {
      stats.shareCount += 1;
    } else if (type === 'verify') {
      stats.verifyCount += 1;
    }
    
    this.set('todayStats', stats);
    return stats;
  }

  /**
   * 獲取歷史記錄
   */
  getHistoryRecords() {
    return this.get('historyRecords', []);
  }

  /**
   * 添加歷史記錄
   */
  addHistoryRecord(record) {
    const records = this.getHistoryRecords();
    const newRecord = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      ...record
    };
    
    records.unshift(newRecord); // 添加到開頭
    
    // 限制記錄數量（保留最近100條）
    if (records.length > 100) {
      records.splice(100);
    }
    
    this.set('historyRecords', records);
    return newRecord;
  }

  /**
   * 獲取分組的歷史記錄
   */
  getGroupedHistoryRecords() {
    const records = this.getHistoryRecords();
    const grouped = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    records.forEach(record => {
      const recordDate = new Date(record.timestamp);
      const recordDay = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());

      if (recordDay.getTime() === today.getTime()) {
        grouped.today.push(record);
      } else if (recordDay.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(record);
      } else if (recordDate >= thisWeek) {
        grouped.thisWeek.push(record);
      } else {
        grouped.older.push(record);
      }
    });

    return grouped;
  }

  /**
   * 獲取設定
   */
  getSettings() {
    return this.get('settings', {
      notifications: true,
      biometric: false,
      autoShare: false,
      theme: 'light'
    });
  }

  /**
   * 更新設定
   */
  updateSettings(settings) {
    const currentSettings = this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    return this.set('settings', updatedSettings);
  }

  /**
   * 檢查 MyData 連接狀態
   */
  isMyDataConnected() {
    const userData = this.getUserData();
    return userData.myDataConnected === true;
  }

  /**
   * 更新 MyData 連接狀態
   */
  updateMyDataConnection(connected) {
    const updateData = {
      myDataConnected: connected,
      connectedAt: connected ? new Date().toISOString() : null
    };
    return this.updateUserData(updateData);
  }

  /**
   * 獲取月度統計
   */
  getMonthlyStats() {
    const records = this.getHistoryRecords();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyRecords = records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= thisMonth;
    });

    const stats = {
      totalActions: monthlyRecords.length,
      shareCount: monthlyRecords.filter(r => r.type === 'share').length,
      verifyCount: monthlyRecords.filter(r => r.type === 'verify').length,
      successRate: 0
    };

    const completedActions = monthlyRecords.filter(r => r.status === 'completed').length;
    stats.successRate = stats.totalActions > 0 ? Math.round((completedActions / stats.totalActions) * 100) : 0;

    return stats;
  }

  /**
   * 導出資料（用於備份）
   */
  exportData() {
    const data = {
      user: this.getUserData(),
      historyRecords: this.getHistoryRecords(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * 導入資料（用於恢復）
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) this.set('user', data.user);
      if (data.historyRecords) this.set('historyRecords', data.historyRecords);
      if (data.settings) this.set('settings', data.settings);
      
      return true;
    } catch (error) {
      console.error('Import data error:', error);
      return false;
    }
  }
}

// 創建全域存儲管理實例
const storage = new StorageManager();

// 為了向後兼容，添加方法別名
storage.getMyDataStatus = function() {
  return this.isMyDataConnected();
};

storage.setMyDataStatus = function(status) {
  return this.updateMyDataConnection(status);
};

storage.setUserData = function(userData) {
  return this.set('user', userData);
};

storage.getVerificationRecords = function() {
  return this.getHistoryRecords();
};

storage.addVerificationRecord = function(record) {
  return this.addHistoryRecord(record);
};

// 暴露到全域
window.storage = storage;
