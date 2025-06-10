// Bearless MVP - Main Application
class BearlessApp {
    constructor() {
        this.currentTab = 'verify';
        this.isMyDataConnected = false;
        this.init();
    }

    init() {
        console.log('Initializing Bearless App...');
        try {
            this.setupEventListeners();
            this.updateTime();
            this.loadStoredData();
            this.hideLoadingScreen();
            
            // Update time every minute
            setInterval(() => this.updateTime(), 60000);
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            // 即使有錯誤也要隱藏載入畫面
            this.hideLoadingScreen();
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // History button
        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                window.modals.showHistory();
            });
        }

        // MyData connection
        const connectBtn = document.getElementById('connect-mydata-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                window.modals.showMyDataConnection();
            });
        }

        // Share identity button
        const shareBtn = document.getElementById('share-identity-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                window.modals.showShareIdentity();
            });
        }

        // Verify identity button
        const verifyBtn = document.getElementById('verify-identity-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                window.modals.showVerifyIdentity();
            });
        }

        // Quick verification buttons
        document.querySelectorAll('.quick-action-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                window.modals.showShareIdentity([type]);
            });
        });
    }

    switchTab(tabName) {
        // Update tab bar
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-TW', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        document.getElementById('current-time').textContent = timeString;
    }

    loadStoredData() {
        try {
            // Load MyData connection status
            if (window.storage) {
                this.isMyDataConnected = window.storage.getMyDataStatus();
                this.updateMyDataUI();
                
                // Load verification records
                this.updateRecordsUI();
            } else {
                console.warn('Storage module not available, using defaults');
                this.isMyDataConnected = false;
                this.updateMyDataUI();
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
            this.isMyDataConnected = false;
            this.updateMyDataUI();
        }
    }

    updateMyDataUI() {
        const mydataStatus = document.getElementById('mydata-status');
        const idCard = document.querySelector('.id-card-container');
        const actionButtons = document.querySelector('.action-buttons');
        const quickActions = document.querySelector('.quick-actions');
        const activitySummary = document.querySelector('.activity-summary');
        
        if (this.isMyDataConnected) {
            // Show connected state
            if (mydataStatus) {
                mydataStatus.innerHTML = `
                    <div class="mydata-status connected">
                        <div class="mydata-status-header">
                            <h3 class="mydata-status-title">數位身分已取得</h3>
                            <div class="mydata-status-indicator connected"></div>
                        </div>
                        <p class="mydata-status-description">您的身分證資料已安全連接，可以開始進行身份驗證。</p>
                    </div>
                `;
            }
            
            // Show ID card and other sections with animation
            setTimeout(() => {
                if (idCard) {
                    idCard.classList.remove('hidden');
                    idCard.classList.add('fade-in');
                }
            }, 100);
            
            setTimeout(() => {
                if (actionButtons) {
                    actionButtons.classList.remove('hidden');
                    actionButtons.classList.add('fade-in');
                }
            }, 200);
            
            setTimeout(() => {
                if (quickActions) {
                    quickActions.classList.remove('hidden');
                    quickActions.classList.add('fade-in');
                }
            }, 300);
            
            setTimeout(() => {
                if (activitySummary) {
                    activitySummary.classList.remove('hidden');
                    activitySummary.classList.add('fade-in');
                }
            }, 400);
            
            // Update card with stored data
            const userData = window.storage.getUserData();
            if (userData) {
                const userNameEl = document.getElementById('user-name');
                const userIdEl = document.getElementById('user-id');
                
                if (userNameEl) userNameEl.textContent = userData.name;
                if (userIdEl) userIdEl.textContent = userData.id.substring(0, 4) + '******';
            }
        } else {
            // Show disconnected state with connect button
            if (mydataStatus) {
                mydataStatus.innerHTML = `
                    <div class="mydata-status disconnected">
                        <div class="mydata-status-header">
                            <h3 class="mydata-status-title">尚未取得數位身分</h3>
                            <div class="mydata-status-indicator disconnected"></div>
                        </div>
                        <p class="mydata-status-description">請先取得您的數位身分以開始使用身份驗證功能。</p>
                        <button class="primary-button" id="connect-mydata-btn" style="margin-top: 16px;">
                            <span class="button-icon">🔗</span>
                            <span class="button-text">取得數位身分</span>
                            <span class="button-arrow">→</span>
                        </button>
                    </div>
                `;
                
                // Re-attach event listener for the new connect button
                const connectBtn = document.getElementById('connect-mydata-btn');
                if (connectBtn) {
                    connectBtn.addEventListener('click', () => {
                        window.modals.showMyDataConnection();
                    });
                }
            }
            
            // Hide other sections when not connected
            idCard?.classList.add('hidden');
            actionButtons?.classList.add('hidden');
            quickActions?.classList.add('hidden');
            activitySummary?.classList.add('hidden');
        }
    }

    updateRecordsUI() {
        const records = window.storage.getVerificationRecords();
        const todayRecords = records.filter(r => this.isToday(new Date(r.timestamp)));
        const shareCount = todayRecords.filter(r => r.type === 'share').length;
        const verifyCount = todayRecords.filter(r => r.type === 'verify').length;
        
        // Update today's activity stats
        const shareCountEl = document.getElementById('share-count');
        const verifyCountEl = document.getElementById('verify-count');
        
        if (shareCountEl) shareCountEl.textContent = shareCount;
        if (verifyCountEl) verifyCountEl.textContent = verifyCount;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isThisMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    hideLoadingScreen() {
        console.log('Hiding loading screen...');
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (mainApp) {
                        mainApp.classList.remove('hidden');
                    }
                    console.log('Loading screen hidden, main app shown');
                }, 500);
            } else {
                console.error('Loading screen element not found');
            }
        }, 1000); // 縮短到 1 秒
    }

    // Public methods for modals to call
    connectMyData() {
        this.isMyDataConnected = true;
        window.storage.setMyDataStatus(true);
        
        // Set mock user data
        const mockUserData = {
            name: '王小明',
            id: 'A123456789',
            nationality: '中華民國',
            age: '28歲',
            address: '台北市信義區信義路五段7號',
            issueDate: '2020-01-15',
            expiryDate: '2030-01-15'
        };
        
        window.storage.setUserData(mockUserData);
        this.updateMyDataUI();
    }

    addVerificationRecord(type, data, success = true) {
        const record = {
            id: Date.now().toString(),
            type: type, // 'share' or 'verify'
            data: data,
            success: success,
            timestamp: new Date().toISOString()
        };
        
        window.storage.addVerificationRecord(record);
        this.updateRecordsUI();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BearlessApp();
});
