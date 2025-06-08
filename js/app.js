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
        document.querySelectorAll('.quick-verify-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                window.modals.showShareIdentity(type);
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
        const idCard = document.querySelector('.id-card');
        const connectSection = document.querySelector('.connect-section');
        
        if (this.isMyDataConnected) {
            idCard?.classList.remove('hidden');
            connectSection?.classList.add('hidden');
            
            // Update card with stored data
            const userData = window.storage.getUserData();
            if (userData) {
                document.getElementById('user-name').textContent = userData.name;
                document.getElementById('user-id').textContent = userData.id;
                document.getElementById('user-nationality').textContent = userData.nationality;
                document.getElementById('user-age').textContent = userData.age;
                document.getElementById('user-address').textContent = userData.address;
            }
        } else {
            idCard?.classList.add('hidden');
            connectSection?.classList.remove('hidden');
        }
    }

    updateRecordsUI() {
        const records = window.storage.getVerificationRecords();
        const todayCount = records.filter(r => this.isToday(new Date(r.timestamp))).length;
        const monthCount = records.filter(r => this.isThisMonth(new Date(r.timestamp))).length;
        
        // Update today's activity
        document.getElementById('today-count').textContent = todayCount;
        document.getElementById('month-count').textContent = monthCount;
        
        // Update success rate
        const successCount = records.filter(r => r.success).length;
        const successRate = records.length > 0 ? Math.round((successCount / records.length) * 100) : 100;
        document.getElementById('success-rate').textContent = `${successRate}%`;
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
