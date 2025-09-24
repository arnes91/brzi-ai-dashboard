// BRZI AI Dashboard - Main Dashboard Controller
// Handles navigation, theme switching, and core dashboard functionality

class DashboardController {
    constructor() {
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.loadDashboardData();
        this.initializeCharts();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Navigation event listeners
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.navigateToSection(section);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal') || e.target.closest('[id$="Modal"]'));
            });
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.id.endsWith('Modal')) {
                this.closeModal(e.target);
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal:not(.hidden)');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    navigateToSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            targetSection.classList.add('fade-in');
        }

        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active', 'bg-blue-600', 'text-white');
            item.classList.add('text-gray-300', 'hover:bg-gray-700');
        });

        const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active', 'bg-blue-600', 'text-white');
            activeNavItem.classList.remove('text-gray-300', 'hover:bg-gray-700');
        }

        this.currentSection = sectionName;

        // Trigger section-specific initialization
        this.initializeSection(sectionName);
    }

    initializeSection(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.refreshDashboardCharts();
                break;
            case 'analytics':
                if (window.analyticsController) {
                    window.analyticsController.refreshCharts();
                }
                break;
            case 'projects':
                if (window.projectsController) {
                    window.projectsController.loadProjects();
                }
                break;
            case 'brainstorming':
                if (window.brainstormingController) {
                    window.brainstormingController.loadIdeas();
                }
                break;
            case 'knowledge':
                if (window.knowledgeController) {
                    window.knowledgeController.loadArticles();
                }
                break;
            case 'prompts':
                if (window.promptsController) {
                    window.promptsController.loadPrompts();
                }
                break;
            case 'automation':
                if (window.automationController) {
                    window.automationController.loadWorkflows();
                }
                break;
            case 'organization':
                if (window.organizationController) {
                    window.organizationController.loadTasks();
                }
                break;
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (this.theme === 'light') {
            body.classList.add('light-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            body.classList.remove('light-theme');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }

    loadDashboardData() {
        // Load dashboard metrics
        this.updateMetrics();
        this.loadRecentActivity();
    }

    updateMetrics() {
        const metrics = this.getDashboardMetrics();
        
        // Update metric cards
        const activeProjectsEl = document.getElementById('activeProjects');
        const ideasGeneratedEl = document.getElementById('ideasGenerated');
        const automationTasksEl = document.getElementById('automationTasks');
        const knowledgeArticlesEl = document.getElementById('knowledgeArticles');

        if (activeProjectsEl) activeProjectsEl.textContent = metrics.activeProjects;
        if (ideasGeneratedEl) ideasGeneratedEl.textContent = metrics.ideasGenerated;
        if (automationTasksEl) automationTasksEl.textContent = metrics.automationTasks;
        if (knowledgeArticlesEl) knowledgeArticlesEl.textContent = metrics.knowledgeArticles;
    }

    getDashboardMetrics() {
        // Get metrics from localStorage or return defaults
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
        const automations = JSON.parse(localStorage.getItem('automations') || '[]');
        const knowledge = JSON.parse(localStorage.getItem('knowledge') || '[]');

        return {
            activeProjects: projects.filter(p => p.status === 'active').length || 12,
            ideasGenerated: ideas.length || 247,
            automationTasks: automations.length || 89,
            knowledgeArticles: knowledge.length || 156
        };
    }

    loadRecentActivity() {
        const recentActivityEl = document.getElementById('recentActivity');
        if (!recentActivityEl) return;

        const activities = this.getRecentActivities();
        
        recentActivityEl.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <p class="font-medium">${activity.title}</p>
                        <span class="text-sm text-gray-400">${activity.time}</span>
                    </div>
                    <p class="text-sm text-gray-400 mt-1">${activity.description}</p>
                </div>
            </div>
        `).join('');
    }

    getRecentActivities() {
        // Get recent activities from localStorage or return sample data
        const storedActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        
        if (storedActivities.length > 0) {
            return storedActivities.slice(0, 5);
        }

        // Default activities
        return [
            {
                type: 'blue',
                icon: 'fas fa-project-diagram',
                title: 'New project created',
                description: 'AI Content Generation Pipeline project has been initialized',
                time: '2 hours ago'
            },
            {
                type: 'green',
                icon: 'fas fa-lightbulb',
                title: 'Idea brainstorming session',
                description: 'Generated 5 new ideas for automation workflows',
                time: '4 hours ago'
            },
            {
                type: 'yellow',
                icon: 'fas fa-robot',
                title: 'Automation completed',
                description: 'Data processing workflow finished successfully',
                time: '6 hours ago'
            },
            {
                type: 'blue',
                icon: 'fas fa-book',
                title: 'Knowledge base updated',
                description: 'Added new article about AI prompt engineering',
                time: '1 day ago'
            },
            {
                type: 'green',
                icon: 'fas fa-check-circle',
                title: 'Task completed',
                description: 'Research sprint documentation finalized',
                time: '1 day ago'
            }
        ];
    }

    initializeCharts() {
        this.initProjectProgressChart();
        this.initMonthlyActivityChart();
    }

    initProjectProgressChart() {
        const ctx = document.getElementById('projectProgressChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.projectProgress) {
            this.charts.projectProgress.destroy();
        }

        this.charts.projectProgress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Planning', 'On Hold'],
                datasets: [{
                    data: [30, 45, 15, 10],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#6b7280'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: this.theme === 'dark' ? '#ffffff' : '#374151',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    initMonthlyActivityChart() {
        const ctx = document.getElementById('monthlyActivityChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.monthlyActivity) {
            this.charts.monthlyActivity.destroy();
        }

        this.charts.monthlyActivity = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Projects',
                    data: [12, 19, 15, 25, 22, 30],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Ideas',
                    data: [8, 15, 12, 18, 25, 35],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: this.theme === 'dark' ? '#ffffff' : '#374151'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: this.theme === 'dark' ? '#9ca3af' : '#6b7280'
                        },
                        grid: {
                            color: this.theme === 'dark' ? '#374151' : '#e5e7eb'
                        }
                    },
                    y: {
                        ticks: {
                            color: this.theme === 'dark' ? '#9ca3af' : '#6b7280'
                        },
                        grid: {
                            color: this.theme === 'dark' ? '#374151' : '#e5e7eb'
                        }
                    }
                }
            }
        });
    }

    refreshDashboardCharts() {
        // Refresh charts when dashboard section is activated
        if (this.charts.projectProgress) {
            this.charts.projectProgress.update();
        }
        if (this.charts.monthlyActivity) {
            this.charts.monthlyActivity.update();
        }
    }

    startRealTimeUpdates() {
        // Update dashboard metrics every 30 seconds
        setInterval(() => {
            if (this.currentSection === 'dashboard') {
                this.updateMetrics();
            }
        }, 30000);
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Clear form data if it's a form modal
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full';
        
        // Set notification style based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-600', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-600', 'text-white');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-600', 'text-white');
                break;
            default:
                notification.classList.add('bg-blue-600', 'text-white');
        }

        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Utility method to format dates
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Utility method to generate unique IDs
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Method to add activity to recent activities
    addActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        activities.unshift({
            ...activity,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        });
        
        // Keep only the last 20 activities
        if (activities.length > 20) {
            activities.splice(20);
        }
        
        localStorage.setItem('recentActivities', JSON.stringify(activities));
        
        // Refresh activity display if on dashboard
        if (this.currentSection === 'dashboard') {
            this.loadRecentActivity();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardController = new DashboardController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardController;
}