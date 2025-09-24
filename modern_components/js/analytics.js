// BRZI AI Dashboard - Analytics Controller
// Handles metrics dashboard with charts and data visualization

class AnalyticsController {
    constructor() {
        this.charts = {};
        this.metrics = {};
        this.timeRange = '7d'; // 7d, 30d, 90d, 1y
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.loadMetrics();
        this.setupEventListeners();
        this.initializeCharts();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Time range selector
        document.addEventListener('change', (e) => {
            if (e.target.id === 'timeRangeSelector') {
                this.timeRange = e.target.value;
                this.refreshCharts();
            }
        });

        // Refresh button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refreshAnalytics') {
                this.refreshAllData();
            }
        });

        // Export button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'exportAnalytics') {
                this.exportAnalyticsData();
            }
        });
    }

    loadMetrics() {
        // Load metrics from localStorage or generate sample data
        const storedMetrics = localStorage.getItem('analyticsMetrics');
        if (storedMetrics) {
            this.metrics = JSON.parse(storedMetrics);
        } else {
            this.metrics = this.generateSampleMetrics();
            this.saveMetrics();
        }
    }

    generateSampleMetrics() {
        const now = new Date();
        const metrics = {
            productivity: {
                current: 87,
                previous: 82,
                trend: 'up',
                history: this.generateTimeSeriesData(30, 70, 95)
            },
            tasksCompleted: {
                current: 142,
                previous: 130,
                trend: 'up',
                history: this.generateTimeSeriesData(30, 100, 180)
            },
            timeSaved: {
                current: 24, // hours
                previous: 21,
                trend: 'up',
                history: this.generateTimeSeriesData(30, 15, 30)
            },
            automationRate: {
                current: 73,
                previous: 65,
                trend: 'up',
                history: this.generateTimeSeriesData(30, 50, 80)
            },
            weeklyPerformance: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Tasks Completed',
                        data: [23, 19, 25, 31, 28, 15, 12],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    },
                    {
                        label: 'Ideas Generated',
                        data: [8, 12, 15, 18, 22, 10, 6],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)'
                    }
                ]
            },
            taskDistribution: {
                labels: ['Content Creation', 'Development', 'Research', 'Marketing', 'Analysis'],
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ]
            },
            projectProgress: {
                labels: ['Completed', 'In Progress', 'Planning', 'On Hold'],
                data: [30, 45, 15, 10],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#6b7280'
                ]
            },
            monthlyTrends: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Productivity Score',
                        data: [75, 78, 82, 85, 83, 87],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Automation Rate',
                        data: [45, 52, 58, 62, 68, 73],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            heatmapData: this.generateHeatmapData(),
            topPerformers: [
                { name: 'Content Generation', value: 95, change: '+12%' },
                { name: 'Data Analysis', value: 88, change: '+8%' },
                { name: 'Task Automation', value: 82, change: '+15%' },
                { name: 'Research Tasks', value: 76, change: '+5%' },
                { name: 'Email Processing', value: 71, change: '+3%' }
            ],
            recentInsights: [
                {
                    type: 'improvement',
                    title: 'Productivity Increase',
                    description: 'Your productivity score increased by 5% this week, primarily due to better task prioritization.',
                    timestamp: new Date(now - 3600000).toISOString() // 1 hour ago
                },
                {
                    type: 'warning',
                    title: 'Automation Opportunity',
                    description: 'Detected repetitive pattern in email responses. Consider creating an automation workflow.',
                    timestamp: new Date(now - 7200000).toISOString() // 2 hours ago
                },
                {
                    type: 'achievement',
                    title: 'Weekly Goal Achieved',
                    description: 'Congratulations! You completed 142 tasks this week, exceeding your goal by 18%.',
                    timestamp: new Date(now - 86400000).toISOString() // 1 day ago
                }
            ]
        };

        return metrics;
    }

    generateTimeSeriesData(days, min, max) {
        const data = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now - (i * 24 * 60 * 60 * 1000));
            const value = Math.floor(Math.random() * (max - min + 1)) + min;
            data.push({
                date: date.toISOString().split('T')[0],
                value: value
            });
        }
        
        return data;
    }

    generateHeatmapData() {
        const data = [];
        const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        days.forEach((day, dayIndex) => {
            hours.forEach((hour, hourIndex) => {
                data.push({
                    day: dayIndex,
                    hour: hourIndex,
                    value: Math.floor(Math.random() * 100)
                });
            });
        });
        
        return data;
    }

    initializeCharts() {
        this.initWeeklyPerformanceChart();
        this.initTaskDistributionChart();
        this.initMonthlyTrendsChart();
        this.initProductivityGaugeChart();
    }

    initWeeklyPerformanceChart() {
        const ctx = document.getElementById('weeklyPerformanceChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.weeklyPerformance) {
            this.charts.weeklyPerformance.destroy();
        }

        this.charts.weeklyPerformance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.metrics.weeklyPerformance.labels,
                datasets: this.metrics.weeklyPerformance.datasets.map(dataset => ({
                    ...dataset,
                    tension: 0.4,
                    fill: true
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: '#374151'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: '#374151'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    initTaskDistributionChart() {
        const ctx = document.getElementById('taskDistributionChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.taskDistribution) {
            this.charts.taskDistribution.destroy();
        }

        this.charts.taskDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.metrics.taskDistribution.labels,
                datasets: [{
                    data: this.metrics.taskDistribution.data,
                    backgroundColor: this.metrics.taskDistribution.backgroundColor,
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
                            color: '#ffffff',
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    initMonthlyTrendsChart() {
        const ctx = document.getElementById('monthlyTrendsChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.monthlyTrends) {
            this.charts.monthlyTrends.destroy();
        }

        this.charts.monthlyTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.metrics.monthlyTrends.labels,
                datasets: this.metrics.monthlyTrends.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: '#374151'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#9ca3af'
                        },
                        grid: {
                            color: '#374151'
                        },
                        min: 0,
                        max: 100
                    }
                }
            }
        });
    }

    initProductivityGaugeChart() {
        const ctx = document.getElementById('productivityGaugeChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.productivityGauge) {
            this.charts.productivityGauge.destroy();
        }

        this.charts.productivityGauge = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [this.metrics.productivity.current, 100 - this.metrics.productivity.current],
                    backgroundColor: [
                        '#3b82f6',
                        '#374151'
                    ],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                    
                    ctx.save();
                    ctx.font = 'bold 24px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${chart.data.datasets[0].data[0]}%`, centerX, centerY);
                    
                    ctx.font = '14px Arial';
                    ctx.fillStyle = '#9ca3af';
                    ctx.fillText('Productivity', centerX, centerY + 25);
                    ctx.restore();
                }
            }]
        });
    }

    refreshCharts() {
        // Update data based on time range
        this.loadMetricsForTimeRange(this.timeRange);
        
        // Refresh all charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update();
            }
        });

        // Update metric cards
        this.updateMetricCards();
        
        // Update insights
        this.updateInsights();
    }

    loadMetricsForTimeRange(timeRange) {
        // In a real application, this would fetch data from an API
        // For now, we'll simulate different data based on time range
        const multiplier = timeRange === '7d' ? 1 : timeRange === '30d' ? 1.2 : timeRange === '90d' ? 1.5 : 2;
        
        // Update current values based on time range
        this.metrics.productivity.current = Math.min(95, Math.floor(this.metrics.productivity.current * multiplier));
        this.metrics.tasksCompleted.current = Math.floor(this.metrics.tasksCompleted.current * multiplier);
        this.metrics.timeSaved.current = Math.floor(this.metrics.timeSaved.current * multiplier);
        this.metrics.automationRate.current = Math.min(95, Math.floor(this.metrics.automationRate.current * multiplier));
    }

    updateMetricCards() {
        // Update productivity score
        const productivityEl = document.querySelector('[data-metric="productivity"] .metric-value');
        const productivityChangeEl = document.querySelector('[data-metric="productivity"] .metric-change');
        if (productivityEl) {
            productivityEl.textContent = `${this.metrics.productivity.current}%`;
        }
        if (productivityChangeEl) {
            const change = this.metrics.productivity.current - this.metrics.productivity.previous;
            productivityChangeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
            productivityChangeEl.className = `metric-change ${change > 0 ? 'text-green-400' : 'text-red-400'}`;
        }

        // Update tasks completed
        const tasksEl = document.querySelector('[data-metric="tasks"] .metric-value');
        const tasksChangeEl = document.querySelector('[data-metric="tasks"] .metric-change');
        if (tasksEl) {
            tasksEl.textContent = this.metrics.tasksCompleted.current;
        }
        if (tasksChangeEl) {
            const change = this.metrics.tasksCompleted.current - this.metrics.tasksCompleted.previous;
            tasksChangeEl.textContent = `+${change}`;
        }

        // Update time saved
        const timeEl = document.querySelector('[data-metric="time"] .metric-value');
        const timeChangeEl = document.querySelector('[data-metric="time"] .metric-change');
        if (timeEl) {
            timeEl.textContent = `${this.metrics.timeSaved.current}h`;
        }
        if (timeChangeEl) {
            const change = this.metrics.timeSaved.current - this.metrics.timeSaved.previous;
            timeChangeEl.textContent = `+${change}h`;
        }

        // Update automation rate
        const automationEl = document.querySelector('[data-metric="automation"] .metric-value');
        const automationChangeEl = document.querySelector('[data-metric="automation"] .metric-change');
        if (automationEl) {
            automationEl.textContent = `${this.metrics.automationRate.current}%`;
        }
        if (automationChangeEl) {
            const change = this.metrics.automationRate.current - this.metrics.automationRate.previous;
            automationChangeEl.textContent = `+${change}%`;
        }
    }

    updateInsights() {
        const insightsContainer = document.getElementById('analyticsInsights');
        if (!insightsContainer) return;

        insightsContainer.innerHTML = this.metrics.recentInsights.map(insight => `
            <div class="insight-card p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div class="flex items-start space-x-3">
                    <div class="insight-icon w-8 h-8 rounded-full flex items-center justify-center ${this.getInsightIconClass(insight.type)}">
                        <i class="${this.getInsightIcon(insight.type)}"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold mb-1">${insight.title}</h4>
                        <p class="text-sm text-gray-400 mb-2">${insight.description}</p>
                        <span class="text-xs text-gray-500">${this.formatRelativeTime(insight.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getInsightIconClass(type) {
        switch (type) {
            case 'improvement':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'achievement':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    }

    getInsightIcon(type) {
        switch (type) {
            case 'improvement':
                return 'fas fa-arrow-up';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            case 'achievement':
                return 'fas fa-trophy';
            default:
                return 'fas fa-info';
        }
    }

    refreshAllData() {
        // Show loading state
        this.showLoadingState();
        
        // Simulate API call delay
        setTimeout(() => {
            this.loadMetrics();
            this.refreshCharts();
            this.hideLoadingState();
            
            if (window.dashboardController) {
                window.dashboardController.showNotification('Analytics data refreshed', 'success');
            }
        }, 1000);
    }

    showLoadingState() {
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...';
            refreshBtn.disabled = true;
        }
    }

    hideLoadingState() {
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Refresh';
            refreshBtn.disabled = false;
        }
    }

    startAutoRefresh() {
        // Auto-refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refreshAllData();
        }, 300000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    exportAnalyticsData() {
        const exportData = {
            metrics: this.metrics,
            exportDate: new Date().toISOString(),
            timeRange: this.timeRange
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        if (window.dashboardController) {
            window.dashboardController.showNotification('Analytics data exported successfully!', 'success');
        }
    }

    generateReport() {
        const report = {
            summary: {
                productivity: this.metrics.productivity.current,
                tasksCompleted: this.metrics.tasksCompleted.current,
                timeSaved: this.metrics.timeSaved.current,
                automationRate: this.metrics.automationRate.current
            },
            trends: {
                productivityTrend: this.calculateTrend(this.metrics.productivity.history),
                tasksTrend: this.calculateTrend(this.metrics.tasksCompleted.history),
                automationTrend: this.calculateTrend(this.metrics.automationRate.history)
            },
            insights: this.metrics.recentInsights,
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    calculateTrend(data) {
        if (data.length < 2) return 'stable';
        
        const recent = data.slice(-7); // Last 7 data points
        const older = data.slice(-14, -7); // Previous 7 data points
        
        const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.value, 0) / older.length;
        
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (change > 5) return 'increasing';
        if (change < -5) return 'decreasing';
        return 'stable';
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.metrics.productivity.current < 80) {
            recommendations.push({
                type: 'improvement',
                title: 'Boost Productivity',
                description: 'Consider implementing time-blocking techniques and reducing distractions during work hours.'
            });
        }
        
        if (this.metrics.automationRate.current < 70) {
            recommendations.push({
                type: 'automation',
                title: 'Increase Automation',
                description: 'Identify repetitive tasks that can be automated to save time and reduce errors.'
            });
        }
        
        if (this.metrics.tasksCompleted.current > this.metrics.tasksCompleted.previous * 1.2) {
            recommendations.push({
                type: 'achievement',
                title: 'Great Progress!',
                description: 'You\'re completing tasks at an excellent rate. Consider taking on more challenging projects.'
            });
        }
        
        return recommendations;
    }

    saveMetrics() {
        localStorage.setItem('analyticsMetrics', JSON.stringify(this.metrics));
    }

    formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffHours < 24) {
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
    }

    // Cleanup method
    destroy() {
        this.stopAutoRefresh();
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    // Get analytics summary for dashboard
    getAnalyticsSummary() {
        return {
            productivity: this.metrics.productivity.current,
            tasksCompleted: this.metrics.tasksCompleted.current,
            timeSaved: this.metrics.timeSaved.current,
            automationRate: this.metrics.automationRate.current,
            trends: {
                productivity: this.metrics.productivity.trend,
                tasks: this.metrics.tasksCompleted.trend,
                automation: this.metrics.automationRate.trend
            }
        };
    }
}

// Initialize analytics controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsController = new AnalyticsController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.analyticsController) {
        window.analyticsController.destroy();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsController;
}