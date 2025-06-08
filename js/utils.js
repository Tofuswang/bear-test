// Bearless MVP - Utility Functions

/**
 * 格式化時間顯示
 */
function formatTime(date = new Date()) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 格式化日期顯示
 */
function formatDate(date = new Date()) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 格式化相對時間
 */
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (days === 1) return '昨天';
    if (days < 7) return `${days} 天前`;
    return formatDate(date);
  }
  
  if (hours > 0) return `${hours} 小時前`;
  if (minutes > 0) return `${minutes} 分鐘前`;
  return '剛才';
}

/**
 * 生成隨機 ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 延遲執行
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 模擬觸覺回饋
 */
function hapticFeedback(type = 'light') {
  // 在真實設備上會觸發觸覺回饋
  if (navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate([30, 10, 30]);
        break;
    }
  }
  
  // 視覺回饋
  document.body.classList.add(`haptic-${type}`);
  setTimeout(() => {
    document.body.classList.remove(`haptic-${type}`);
  }, type === 'heavy' ? 200 : type === 'medium' ? 150 : 100);
}

/**
 * 深拷貝對象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 防抖函數
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 節流函數
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 檢查是否為 iOS 設備
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * 檢查是否為 Safari 瀏覽器
 */
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * 檢查是否為 PWA 模式
 */
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * 設置狀態欄時間
 */
function updateStatusBarTime() {
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = formatTime();
  }
}

/**
 * 模擬網路請求
 */
async function mockApiCall(endpoint, data = null, delay_ms = 1000) {
  await delay(delay_ms);
  
  // 模擬不同的 API 響應
  switch (endpoint) {
    case '/api/mydata/connect':
      return {
        success: true,
        data: {
          status: 'connected',
          user: {
            name: '王小明',
            id: 'A123456789',
            birth: '1990-05-15',
            address: '台北市大安區'
          }
        }
      };
      
    case '/api/identity/share':
      return {
        success: true,
        data: {
          qrCode: '📱',
          shareId: generateId(),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5分鐘後過期
        }
      };
      
    case '/api/identity/verify':
      return {
        success: Math.random() > 0.2, // 80% 成功率
        data: {
          verified: true,
          info: data?.requestedInfo || ['nationality'],
          result: {
            nationality: '中華民國',
            age: '33歲',
            address: '台北市'
          }
        }
      };
      
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}

/**
 * 顯示 Toast 通知
 */
function showToast(message, type = 'info', duration = 3000) {
  // 創建 toast 元素
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // 添加樣式
  Object.assign(toast.style, {
    position: 'fixed',
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: type === 'error' ? '#FF3B30' : type === 'success' ? '#34C759' : '#007AFF',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    maxWidth: '300px',
    textAlign: 'center'
  });
  
  document.body.appendChild(toast);
  
  // 顯示動畫
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // 自動隱藏
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

/**
 * 格式化身分證號碼（部分遮罩）
 */
function maskIdNumber(id) {
  if (!id || id.length < 8) return id;
  return id.substring(0, 4) + '******';
}

/**
 * 格式化出生日期（部分遮罩）
 */
function maskBirthDate(date) {
  if (!date) return '民國**年**月**日';
  const d = new Date(date);
  const year = d.getFullYear() - 1911; // 轉換為民國年
  return `民國${year}年**月**日`;
}

/**
 * 計算年齡
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * 驗證類型的中文名稱
 */
function getVerificationTypeName(type) {
  const names = {
    nationality: '國籍',
    age: '年齡',
    address: '戶籍地'
  };
  return names[type] || type;
}

/**
 * 驗證類型的圖標
 */
function getVerificationTypeIcon(type) {
  const icons = {
    nationality: '🇹🇼',
    age: '🎂',
    address: '🏠'
  };
  return icons[type] || '📋';
}

// 導出工具函數（如果需要模組化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatTime,
    formatDate,
    formatRelativeTime,
    generateId,
    delay,
    hapticFeedback,
    deepClone,
    debounce,
    throttle,
    isIOS,
    isSafari,
    isPWA,
    updateStatusBarTime,
    mockApiCall,
    showToast,
    maskIdNumber,
    maskBirthDate,
    calculateAge,
    getVerificationTypeName,
    getVerificationTypeIcon
  };
}
