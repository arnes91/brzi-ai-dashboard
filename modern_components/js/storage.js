// BRZI AI Dashboard - Storage Controller
// Handles data persistence, local storage management, and data synchronization

class StorageController {
    constructor() {
        this.storageKeys = {
            ideas: 'ideas',
            projects: 'projects',
            knowledgeArticles: 'knowledgeArticles',
            aiPrompts: 'aiPrompts',
            analyticsMetrics: 'analyticsMetrics',
            activeAutomations: 'activeAutomations',
            automationWorkflows: 'automationWorkflows',
            organizationTasks: 'organizationTasks',
            todaySchedule: 'todaySchedule',
            recentActivities: 'recentActivities',
            userSettings: 'userSettings',
            theme: 'theme'
        };
        this.compressionEnabled = true;
        this.encryptionEnabled = false; // Can be enabled for sensitive data
        this.backupEnabled = true;
        this.maxBackups = 5;
        this.init();
    }

    init() {
        this.checkStorageAvailability();
        this.setupStorageEventListeners();
        this.performMaintenanceTasks();
        this.setupAutoBackup();
    }

    checkStorageAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            this.storageAvailable = true;
        } catch (e) {
            this.storageAvailable = false;
            console.warn('Local storage is not available:', e);
            this.showNotification('Local storage is not available. Data will not persist between sessions.', 'warning');
        }
    }

    setupStorageEventListeners() {
        // Listen for storage events from other tabs/windows
        window.addEventListener('storage', (e) => {
            this.handleStorageChange(e);
        });

        // Listen for beforeunload to save any pending data
        window.addEventListener('beforeunload', () => {
            this.saveAllPendingData();
        });

        // Periodic storage cleanup
        setInterval(() => {
            this.performMaintenanceTasks();
        }, 300000); // Every 5 minutes
    }

    handleStorageChange(event) {
        // Handle changes from other tabs/windows
        if (event.key && this.isTrackedKey(event.key)) {
            this.notifyControllers(event.key, event.newValue);
        }
    }

    isTrackedKey(key) {
        return Object.values(this.storageKeys).includes(key);
    }

    notifyControllers(key) {
        // Notify relevant controllers about data changes
        const controllerMap = {
            [this.storageKeys.ideas]: 'brainstormingController',
            [this.storageKeys.projects]: 'projectsController',
            [this.storageKeys.knowledgeArticles]: 'knowledgeController',
            [this.storageKeys.aiPrompts]: 'promptsController',
            [this.storageKeys.analyticsMetrics]: 'analyticsController',
            [this.storageKeys.activeAutomations]: 'automationController',
            [this.storageKeys.organizationTasks]: 'organizationController'
        };

        const controllerName = controllerMap[key];
        if (controllerName && window[controllerName]) {
            // Trigger a refresh in the relevant controller
            if (typeof window[controllerName].refresh === 'function') {
                window[controllerName].refresh();
            }
        }
    }

    // Core storage operations
    setItem(key, value, options = {}) {
        if (!this.storageAvailable) {
            console.warn('Storage not available, data will not persist');
            return false;
        }

        try {
            let processedValue = value;

            // Add metadata
            const dataWithMetadata = {
                data: processedValue,
                timestamp: new Date().toISOString(),
                version: '1.0',
                compressed: false,
                encrypted: false
            };

            // Compression (if enabled and data is large)
            if (this.compressionEnabled && JSON.stringify(processedValue).length > 1000) {
                try {
                    dataWithMetadata.data = this.compress(processedValue);
                    dataWithMetadata.compressed = true;
                } catch (e) {
                    console.warn('Compression failed, storing uncompressed:', e);
                }
            }

            // Encryption (if enabled)
            if (this.encryptionEnabled && options.encrypt) {
                try {
                    dataWithMetadata.data = this.encrypt(dataWithMetadata.data);
                    dataWithMetadata.encrypted = true;
                } catch (e) {
                    console.warn('Encryption failed, storing unencrypted:', e);
                }
            }

            localStorage.setItem(key, JSON.stringify(dataWithMetadata));

            // Create backup if enabled
            if (this.backupEnabled && options.backup !== false) {
                this.createBackup(key, dataWithMetadata);
            }

            return true;
        } catch (e) {
            console.error('Failed to store data:', e);
            this.handleStorageError(e, key);
            return false;
        }
    }

    getItem(key, defaultValue = null) {
        if (!this.storageAvailable) {
            return defaultValue;
        }

        try {
            const storedData = localStorage.getItem(key);
            if (!storedData) {
                return defaultValue;
            }

            const parsedData = JSON.parse(storedData);

            // Handle legacy data (without metadata)
            if (!Object.prototype.hasOwnProperty.call(parsedData, 'data')) {
                return parsedData;
            }

            let processedData = parsedData.data;

            // Decompression
            if (parsedData.compressed) {
                try {
                    processedData = this.decompress(processedData);
                } catch (e) {
                    console.warn('Decompression failed:', e);
                    return defaultValue;
                }
            }

            // Decryption
            if (parsedData.encrypted) {
                try {
                    processedData = this.decrypt(processedData);
                } catch (e) {
                    console.warn('Decryption failed:', e);
                    return defaultValue;
                }
            }

            return processedData;
        } catch (e) {
            console.error('Failed to retrieve data:', e);
            return defaultValue;
        }
    }

    removeItem(key) {
        if (!this.storageAvailable) {
            return false;
        }

        try {
            localStorage.removeItem(key);
            this.removeBackups(key);
            return true;
        } catch (e) {
            console.error('Failed to remove data:', e);
            return false;
        }
    }

    // Backup operations
    createBackup(key, data) {
        try {
            const backupKey = `${key}_backup`;
            const existingBackups = this.getItem(backupKey, []);
            
            // Add new backup
            existingBackups.unshift({
                timestamp: new Date().toISOString(),
                data: data
            });

            // Keep only the latest backups
            if (existingBackups.length > this.maxBackups) {
                existingBackups.splice(this.maxBackups);
            }

            localStorage.setItem(backupKey, JSON.stringify(existingBackups));
        } catch (e) {
            console.warn('Failed to create backup:', e);
        }
    }

    restoreFromBackup(key, backupIndex = 0) {
        try {
            const backupKey = `${key}_backup`;
            const backups = this.getItem(backupKey, []);
            
            if (backups.length > backupIndex) {
                const backup = backups[backupIndex];
                this.setItem(key, backup.data.data, { backup: false });
                
                this.showNotification(`Data restored from backup (${this.formatDate(backup.timestamp)})`, 'success');
                return true;
            } else {
                this.showNotification('No backup available for restoration', 'warning');
                return false;
            }
        } catch (e) {
            console.error('Failed to restore from backup:', e);
            this.showNotification('Failed to restore from backup', 'error');
            return false;
        }
    }

    removeBackups(key) {
        try {
            const backupKey = `${key}_backup`;
            localStorage.removeItem(backupKey);
        } catch (e) {
            console.warn('Failed to remove backups:', e);
        }
    }

    getBackupInfo(key) {
        const backupKey = `${key}_backup`;
        const backups = this.getItem(backupKey, []);
        
        return backups.map((backup, index) => ({
            index,
            timestamp: backup.timestamp,
            size: JSON.stringify(backup.data).length,
            formattedDate: this.formatDate(backup.timestamp)
        }));
    }

    // Compression methods (simple implementation)
    compress(data) {
        // Simple compression using JSON stringification and basic encoding
        // In a real application, you might use a proper compression library
        const jsonString = JSON.stringify(data);
        return btoa(jsonString);
    }

    decompress(compressedData) {
        try {
            const jsonString = atob(compressedData);
            return JSON.parse(jsonString);
        } catch {
            throw new Error('Decompression failed');
        }
    }

    // Basic encryption methods (for demonstration - use proper encryption in production)
    encrypt(data) {
        // This is a very basic encryption for demonstration
        // In production, use proper encryption libraries
        const jsonString = JSON.stringify(data);
        return btoa(jsonString.split('').reverse().join(''));
    }

    decrypt(encryptedData) {
        try {
            const reversedString = atob(encryptedData);
            const jsonString = reversedString.split('').reverse().join('');
            return JSON.parse(jsonString);
        } catch (_e) {
            throw new Error('Decryption failed');
        }
    }

    // Storage management
    getStorageUsage() {
        if (!this.storageAvailable) {
            return { used: 0, available: 0, total: 0, percentage: 0 };
        }

        let totalSize = 0;
        const itemSizes = {};

        for (let key in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
                const size = localStorage.getItem(key).length;
                totalSize += size;
                itemSizes[key] = size;
            }
        }

        // Estimate available storage (5MB is typical localStorage limit)
        const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
        const available = Math.max(0, estimatedLimit - totalSize);
        const percentage = (totalSize / estimatedLimit) * 100;

        return {
            used: totalSize,
            available: available,
            total: estimatedLimit,
            percentage: Math.min(100, percentage),
            itemSizes: itemSizes
        };
    }

    clearStorage(confirmationRequired = true) {
        if (confirmationRequired && !confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
            return false;
        }

        try {
            // Create a final backup before clearing
            if (this.backupEnabled) {
                this.createFullBackup();
            }

            localStorage.clear();
            this.showNotification('All data cleared successfully', 'success');
            
            // Reload the page to reset all controllers
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
            return true;
        } catch (e) {
            console.error('Failed to clear storage:', e);
            this.showNotification('Failed to clear storage', 'error');
            return false;
        }
    }

    // Data export/import
    exportAllData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: {}
        };

        // Export all tracked data
        Object.entries(this.storageKeys).forEach(([name, key]) => {
            const data = this.getItem(key);
            if (data !== null) {
                exportData.data[name] = data;
            }
        });

        // Include storage metadata
        exportData.metadata = {
            storageUsage: this.getStorageUsage(),
            backupInfo: this.getAllBackupInfo()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `brzi-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!', 'success');
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.data || !importData.version) {
                    throw new Error('Invalid export file format');
                }

                // Confirm import
                if (!confirm(`Import data from ${this.formatDate(importData.timestamp)}? This will overwrite existing data.`)) {
                    return;
                }

                // Create backup before import
                this.createFullBackup();

                // Import data
                let importedCount = 0;
                Object.entries(importData.data).forEach(([name, data]) => {
                    const key = this.storageKeys[name];
                    if (key && data !== null) {
                        this.setItem(key, data);
                        importedCount++;
                    }
                });

                this.showNotification(`Successfully imported ${importedCount} data sets`, 'success');
                
                // Reload to refresh all controllers
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Failed to import data: Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Maintenance tasks
    performMaintenanceTasks() {
        this.cleanupExpiredData();
        this.optimizeStorage();
        this.validateDataIntegrity();
    }

    cleanupExpiredData() {
        // Remove old temporary data, expired sessions, etc.
        const now = new Date();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('temp_') || key.startsWith('session_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && (now - new Date(data.timestamp)) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (_e) {
                    // Remove invalid data
                    localStorage.removeItem(key);
                }
            }
        });
    }

    optimizeStorage() {
        const usage = this.getStorageUsage();
        
        // If storage is getting full (>80%), perform optimization
        if (usage.percentage > 80) {
            this.showNotification('Storage is getting full. Performing optimization...', 'info');
            
            // Remove old backups
            this.cleanupOldBackups();
            
            // Compress large items
            this.compressLargeItems();
            
            const newUsage = this.getStorageUsage();
            const savedSpace = usage.used - newUsage.used;
            
            if (savedSpace > 0) {
                this.showNotification(`Optimization complete. Saved ${this.formatBytes(savedSpace)}`, 'success');
            }
        }
    }

    cleanupOldBackups() {
        Object.values(this.storageKeys).forEach(key => {
            const backupKey = `${key}_backup`;
            const backups = this.getItem(backupKey, []);
            
            if (backups.length > this.maxBackups) {
                const trimmedBackups = backups.slice(0, this.maxBackups);
                localStorage.setItem(backupKey, JSON.stringify(trimmedBackups));
            }
        });
    }

    compressLargeItems() {
        Object.values(this.storageKeys).forEach(key => {
            try {
                const data = localStorage.getItem(key);
                if (data && data.length > 5000) { // Compress items larger than 5KB
                    const parsedData = JSON.parse(data);
                    if (!parsedData.compressed) {
                        this.setItem(key, parsedData.data || parsedData, { backup: false });
                    }
                }
            } catch (e) {
                console.warn(`Failed to compress ${key}:`, e);
            }
        });
    }

    validateDataIntegrity() {
        // Check for corrupted data and attempt recovery
        Object.values(this.storageKeys).forEach(key => {
            try {
                const data = this.getItem(key);
                if (data === null) {
                    // Try to restore from backup
                    const backupInfo = this.getBackupInfo(key);
                    if (backupInfo.length > 0) {
                        console.warn(`Data corruption detected for ${key}, attempting restore from backup`);
                        this.restoreFromBackup(key, 0);
                    }
                }
            } catch (e) {
                console.error(`Data integrity check failed for ${key}:`, e);
            }
        });
    }

    // Auto-backup functionality
    setupAutoBackup() {
        // Create backups every hour
        setInterval(() => {
            this.createFullBackup();
        }, 3600000); // 1 hour
    }

    createFullBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            data: {}
        };

        Object.entries(this.storageKeys).forEach(([name, key]) => {
            const data = this.getItem(key);
            if (data !== null) {
                backupData.data[name] = data;
            }
        });

        // Store full backup
        const fullBackupKey = 'full_backup_history';
        const existingBackups = this.getItem(fullBackupKey, []);
        existingBackups.unshift(backupData);

        // Keep only the latest 3 full backups
        if (existingBackups.length > 3) {
            existingBackups.splice(3);
        }

        localStorage.setItem(fullBackupKey, JSON.stringify(existingBackups));
    }

    getAllBackupInfo() {
        const backupInfo = {};
        
        Object.entries(this.storageKeys).forEach(([name, key]) => {
            backupInfo[name] = this.getBackupInfo(key);
        });

        return backupInfo;
    }

    // Error handling
    handleStorageError(error, key) {
        if (error.name === 'QuotaExceededError') {
            this.showNotification(`Storage quota exceeded for ${key}. Performing cleanup...`, 'warning');
            this.performMaintenanceTasks();
            
            // Try again after cleanup
            setTimeout(() => {
                this.showNotification('Please try your action again after cleanup', 'info');
            }, 1000);
        } else {
            console.error('Storage error:', error);
            this.showNotification('Storage operation failed', 'error');
        }
    }

    saveAllPendingData() {
        // Save any pending data from controllers before page unload
        try {
            // Trigger save in all controllers
            const controllers = [
                'brainstormingController',
                'projectsController', 
                'knowledgeController',
                'promptsController',
                'analyticsController',
                'automationController',
                'organizationController'
            ];

            controllers.forEach(controllerName => {
                if (window[controllerName] && typeof window[controllerName].save === 'function') {
                    window[controllerName].save();
                }
            });
        } catch (e) {
            console.warn('Failed to save pending data:', e);
        }
    }

    // Utility methods
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Public API methods
    getStorageStats() {
        const usage = this.getStorageUsage();
        const backupInfo = this.getAllBackupInfo();
        
        return {
            usage: usage,
            backups: backupInfo,
            settings: {
                compressionEnabled: this.compressionEnabled,
                encryptionEnabled: this.encryptionEnabled,
                backupEnabled: this.backupEnabled,
                maxBackups: this.maxBackups
            }
        };
    }

    updateSettings(settings) {
        if (Object.prototype.hasOwnProperty.call(settings, 'compressionEnabled')) {
            this.compressionEnabled = settings.compressionEnabled;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'encryptionEnabled')) {
            this.encryptionEnabled = settings.encryptionEnabled;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'backupEnabled')) {
            this.backupEnabled = settings.backupEnabled;
        }
        if (Object.prototype.hasOwnProperty.call(settings, 'maxBackups')) {
            this.maxBackups = Math.max(1, Math.min(10, settings.maxBackups));
        }

        // Save settings
        this.setItem('storageSettings', {
            compressionEnabled: this.compressionEnabled,
            encryptionEnabled: this.encryptionEnabled,
            backupEnabled: this.backupEnabled,
            maxBackups: this.maxBackups
        });

        this.showNotification('Storage settings updated', 'success');
    }

    loadSettings() {
        const settings = this.getItem('storageSettings');
        if (settings) {
            this.compressionEnabled = settings.compressionEnabled ?? this.compressionEnabled;
            this.encryptionEnabled = settings.encryptionEnabled ?? this.encryptionEnabled;
            this.backupEnabled = settings.backupEnabled ?? this.backupEnabled;
            this.maxBackups = settings.maxBackups ?? this.maxBackups;
        }
    }
}

// Initialize storage controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.storageController = new StorageController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageController;
}