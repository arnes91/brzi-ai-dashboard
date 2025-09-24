// BRZI AI Dashboard - Organization Controller
// Handles task management, scheduling, and optimization tools

class OrganizationController {
    constructor() {
        this.tasks = [];
        this.scheduleItems = [];
        this.currentFilter = 'all';
        this.sortBy = 'priority';
        this.sortOrder = 'desc';
        this.init();
    }

    init() {
        this.loadTasks();
        this.loadSchedule();
        this.setupEventListeners();
        this.renderTasks();
        this.renderSchedule();
        this.updateTaskStats();
    }

    setupEventListeners() {
        // Add task button
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.showAddTaskModal();
            });
        }

        // Task form submission
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTask();
            });
        }

        // Task filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('task-filter')) {
                const filter = e.target.dataset.filter;
                this.setTaskFilter(filter);
            }
        });

        // Task actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.task-action')) {
                const action = e.target.closest('.task-action').dataset.action;
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.handleTaskAction(action, taskId);
            }
        });

        // Task checkbox changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const taskId = e.target.closest('.task-item').dataset.taskId;
                this.toggleTaskCompletion(taskId);
            }
        });

        // Sort functionality
        document.addEventListener('change', (e) => {
            if (e.target.id === 'taskSort') {
                this.setSortBy(e.target.value);
            }
        });
    }

    loadTasks() {
        const storedTasks = localStorage.getItem('organizationTasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        } else {
            // Initialize with sample tasks
            this.tasks = this.getSampleTasks();
            this.saveTasks();
        }
    }

    loadSchedule() {
        const storedSchedule = localStorage.getItem('todaySchedule');
        if (storedSchedule) {
            this.scheduleItems = JSON.parse(storedSchedule);
        } else {
            // Initialize with sample schedule
            this.scheduleItems = this.getSampleSchedule();
            this.saveSchedule();
        }
    }

    getSampleTasks() {
        const now = new Date();
        return [
            {
                id: this.generateId(),
                title: 'Complete AI content generation workflow',
                description: 'Finalize the automated content generation system with quality checks and approval process',
                status: 'in-progress',
                priority: 'high',
                category: 'development',
                dueDate: new Date(now.getTime() + 172800000).toISOString(), // 2 days from now
                createdAt: new Date(now.getTime() - 259200000).toISOString(), // 3 days ago
                updatedAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
                estimatedTime: 4, // hours
                actualTime: 2.5,
                tags: ['AI', 'automation', 'content'],
                assignee: 'Current User',
                project: 'AI Content Pipeline'
            },
            {
                id: this.generateId(),
                title: 'Review and update knowledge base articles',
                description: 'Go through existing knowledge base articles and update outdated information, add new insights',
                status: 'pending',
                priority: 'medium',
                category: 'content',
                dueDate: new Date(now.getTime() + 432000000).toISOString(), // 5 days from now
                createdAt: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
                updatedAt: new Date(now.getTime() - 172800000).toISOString(),
                estimatedTime: 3,
                actualTime: 0,
                tags: ['knowledge', 'content', 'review'],
                assignee: 'Current User',
                project: 'Knowledge Management'
            },
            {
                id: this.generateId(),
                title: 'Optimize database queries for analytics dashboard',
                description: 'Improve performance of analytics queries to reduce load times and improve user experience',
                status: 'in-progress',
                priority: 'high',
                category: 'development',
                dueDate: new Date(now.getTime() + 86400000).toISOString(), // 1 day from now
                createdAt: new Date(now.getTime() - 345600000).toISOString(), // 4 days ago
                updatedAt: new Date(now.getTime() - 43200000).toISOString(), // 12 hours ago
                estimatedTime: 2,
                actualTime: 1.5,
                tags: ['database', 'performance', 'analytics'],
                assignee: 'Current User',
                project: 'Analytics Dashboard'
            },
            {
                id: this.generateId(),
                title: 'Create user onboarding documentation',
                description: 'Write comprehensive documentation for new users including setup guides and best practices',
                status: 'pending',
                priority: 'medium',
                category: 'documentation',
                dueDate: new Date(now.getTime() + 604800000).toISOString(), // 7 days from now
                createdAt: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
                updatedAt: new Date(now.getTime() - 86400000).toISOString(),
                estimatedTime: 5,
                actualTime: 0,
                tags: ['documentation', 'onboarding', 'user experience'],
                assignee: 'Current User',
                project: 'User Experience'
            },
            {
                id: this.generateId(),
                title: 'Set up automated backup system',
                description: 'Implement automated daily backups for all critical data and configurations',
                status: 'completed',
                priority: 'high',
                category: 'infrastructure',
                dueDate: new Date(now.getTime() - 86400000).toISOString(), // 1 day ago
                createdAt: new Date(now.getTime() - 604800000).toISOString(), // 7 days ago
                updatedAt: new Date(now.getTime() - 86400000).toISOString(),
                estimatedTime: 3,
                actualTime: 2.5,
                tags: ['backup', 'automation', 'infrastructure'],
                assignee: 'Current User',
                project: 'System Maintenance',
                completedAt: new Date(now.getTime() - 86400000).toISOString()
            },
            {
                id: this.generateId(),
                title: 'Research new AI model integrations',
                description: 'Investigate latest AI models and APIs that could enhance our automation capabilities',
                status: 'pending',
                priority: 'low',
                category: 'research',
                dueDate: new Date(now.getTime() + 1209600000).toISOString(), // 14 days from now
                createdAt: new Date(now.getTime() - 43200000).toISOString(), // 12 hours ago
                updatedAt: new Date(now.getTime() - 43200000).toISOString(),
                estimatedTime: 6,
                actualTime: 0,
                tags: ['AI', 'research', 'integration'],
                assignee: 'Current User',
                project: 'Innovation'
            },
            {
                id: this.generateId(),
                title: 'Update security protocols',
                description: 'Review and update all security protocols, implement new authentication measures',
                status: 'in-progress',
                priority: 'high',
                category: 'security',
                dueDate: new Date(now.getTime() + 259200000).toISOString(), // 3 days from now
                createdAt: new Date(now.getTime() - 432000000).toISOString(), // 5 days ago
                updatedAt: new Date(now.getTime() - 21600000).toISOString(), // 6 hours ago
                estimatedTime: 4,
                actualTime: 2,
                tags: ['security', 'authentication', 'protocols'],
                assignee: 'Current User',
                project: 'Security Enhancement'
            },
            {
                id: this.generateId(),
                title: 'Plan Q4 product roadmap',
                description: 'Define priorities and milestones for Q4 product development and feature releases',
                status: 'completed',
                priority: 'medium',
                category: 'planning',
                dueDate: new Date(now.getTime() - 172800000).toISOString(), // 2 days ago
                createdAt: new Date(now.getTime() - 1209600000).toISOString(), // 14 days ago
                updatedAt: new Date(now.getTime() - 172800000).toISOString(),
                estimatedTime: 8,
                actualTime: 6,
                tags: ['planning', 'roadmap', 'strategy'],
                assignee: 'Current User',
                project: 'Product Strategy',
                completedAt: new Date(now.getTime() - 172800000).toISOString()
            }
        ];
    }

    getSampleSchedule() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        return [
            {
                id: this.generateId(),
                title: 'Daily standup meeting',
                description: 'Team sync and progress updates',
                startTime: new Date(today.getTime() + 32400000).toISOString(), // 9:00 AM
                endTime: new Date(today.getTime() + 34200000).toISOString(), // 9:30 AM
                type: 'meeting',
                status: 'completed',
                priority: 'medium'
            },
            {
                id: this.generateId(),
                title: 'Focus time: AI workflow development',
                description: 'Deep work session for AI automation features',
                startTime: new Date(today.getTime() + 36000000).toISOString(), // 10:00 AM
                endTime: new Date(today.getTime() + 43200000).toISOString(), // 12:00 PM
                type: 'work',
                status: 'in-progress',
                priority: 'high'
            },
            {
                id: this.generateId(),
                title: 'Lunch break',
                description: 'Break and recharge',
                startTime: new Date(today.getTime() + 43200000).toISOString(), // 12:00 PM
                endTime: new Date(today.getTime() + 46800000).toISOString(), // 1:00 PM
                type: 'break',
                status: 'pending',
                priority: 'low'
            },
            {
                id: this.generateId(),
                title: 'Client presentation review',
                description: 'Review and finalize presentation materials',
                startTime: new Date(today.getTime() + 50400000).toISOString(), // 2:00 PM
                endTime: new Date(today.getTime() + 54000000).toISOString(), // 3:00 PM
                type: 'meeting',
                status: 'pending',
                priority: 'high'
            },
            {
                id: this.generateId(),
                title: 'Code review session',
                description: 'Review team code submissions and provide feedback',
                startTime: new Date(today.getTime() + 57600000).toISOString(), // 4:00 PM
                endTime: new Date(today.getTime() + 61200000).toISOString(), // 5:00 PM
                type: 'work',
                status: 'pending',
                priority: 'medium'
            }
        ];
    }

    addTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) {
            this.showNotification('Please enter a task title', 'error');
            return;
        }

        const newTask = {
            id: this.generateId(),
            title,
            description,
            status: 'pending',
            priority,
            category: this.categorizeTask(title + ' ' + description),
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedTime: 0,
            actualTime: 0,
            tags: this.extractTags(title + ' ' + description),
            assignee: 'Current User',
            project: 'General'
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateTaskStats();

        // Close modal and reset form
        this.closeAddTaskModal();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'blue',
                icon: 'fas fa-tasks',
                title: 'New task created',
                description: `Created "${title}" task`,
                time: 'Just now'
            });
        }

        this.showNotification('Task created successfully!', 'success');
    }

    categorizeTask(text) {
        const categories = {
            development: ['code', 'develop', 'build', 'implement', 'debug', 'fix', 'optimize'],
            content: ['write', 'create', 'content', 'article', 'blog', 'documentation'],
            research: ['research', 'analyze', 'investigate', 'study', 'explore'],
            planning: ['plan', 'strategy', 'roadmap', 'schedule', 'organize'],
            meeting: ['meeting', 'call', 'discussion', 'presentation', 'review'],
            security: ['security', 'authentication', 'encryption', 'protection'],
            infrastructure: ['server', 'database', 'backup', 'deployment', 'infrastructure']
        };

        const lowerText = text.toLowerCase();
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                return category;
            }
        }
        
        return 'general';
    }

    extractTags(text) {
        const commonTags = ['AI', 'automation', 'development', 'content', 'research', 'planning', 'security', 'database', 'documentation'];
        const tags = [];
        const lowerText = text.toLowerCase();
        
        commonTags.forEach(tag => {
            if (lowerText.includes(tag.toLowerCase())) {
                tags.push(tag);
            }
        });
        
        return tags;
    }

    toggleTaskCompletion(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'in-progress';
                delete task.completedAt;
            } else {
                task.status = 'completed';
                task.completedAt = new Date().toISOString();
            }
            
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.renderTasks();
            this.updateTaskStats();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: task.status === 'completed' ? 'green' : 'blue',
                    icon: task.status === 'completed' ? 'fas fa-check-circle' : 'fas fa-undo',
                    title: `Task ${task.status === 'completed' ? 'completed' : 'reopened'}`,
                    description: `${task.status === 'completed' ? 'Completed' : 'Reopened'} "${task.title}"`,
                    time: 'Just now'
                });
            }

            this.showNotification(`Task ${task.status === 'completed' ? 'completed' : 'reopened'}!`, 'success');
        }
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            const oldStatus = task.status;
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            
            if (newStatus === 'completed') {
                task.completedAt = new Date().toISOString();
            } else {
                delete task.completedAt;
            }
            
            this.saveTasks();
            this.renderTasks();
            this.updateTaskStats();
            
            this.showNotification(`Task status updated from ${oldStatus} to ${newStatus}`, 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate form with existing data
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        if (task.dueDate) {
            document.getElementById('taskDueDate').value = task.dueDate.split('T')[0];
        }

        // Show modal
        this.showAddTaskModal();

        // Update form to edit mode
        const form = document.getElementById('taskForm');
        form.dataset.editId = taskId;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Task';
    }

    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const deletedTask = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);
            this.saveTasks();
            this.renderTasks();
            this.updateTaskStats();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'yellow',
                    icon: 'fas fa-trash',
                    title: 'Task deleted',
                    description: `Deleted "${deletedTask.title}" task`,
                    time: 'Just now'
                });
            }

            this.showNotification('Task deleted successfully', 'success');
        }
    }

    handleTaskAction(action, taskId) {
        switch (action) {
            case 'edit':
                this.editTask(taskId);
                break;
            case 'delete':
                this.deleteTask(taskId);
                break;
            case 'start':
                this.updateTaskStatus(taskId, 'in-progress');
                break;
            case 'complete':
                this.updateTaskStatus(taskId, 'completed');
                break;
            case 'pause':
                this.updateTaskStatus(taskId, 'pending');
                break;
        }
    }

    setTaskFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
        
        // Update filter buttons
        document.querySelectorAll('.task-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-700', 'text-gray-300');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-600', 'text-white');
            activeBtn.classList.remove('bg-gray-700', 'text-gray-300');
        }
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.renderTasks();
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        let filteredTasks = this.tasks;

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === this.currentFilter);
        }

        // Sort tasks
        filteredTasks.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'priority': {
                    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    aValue = priorityOrder[a.priority] || 0;
                    bValue = priorityOrder[b.priority] || 0;
                    break;
                }
                case 'dueDate':
                    aValue = a.dueDate ? new Date(a.dueDate) : new Date('2099-12-31');
                    bValue = b.dueDate ? new Date(b.dueDate) : new Date('2099-12-31');
                    break;
                case 'created':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                case 'updated':
                default:
                    aValue = new Date(a.updatedAt);
                    bValue = new Date(b.updatedAt);
                    break;
            }
            
            if (this.sortOrder === 'desc') {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            } else {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            }
        });

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-tasks text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No tasks found</h3>
                    <p class="text-gray-500">Create your first task to get started</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task-item ${task.status}" data-task-id="${task.id}">
                <div class="flex items-start space-x-3">
                    <input type="checkbox" class="task-checkbox mt-1" ${task.status === 'completed' ? 'checked' : ''}>
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h4 class="task-title font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}">${task.title}</h4>
                            <span class="priority-${task.priority} text-xs font-medium px-2 py-1 rounded-full">
                                ${task.priority.toUpperCase()}
                            </span>
                            <span class="status-${task.status} text-xs font-medium px-2 py-1 rounded-full">
                                ${task.status.replace('-', ' ').toUpperCase()}
                            </span>
                        </div>
                        ${task.description ? `<p class="text-sm text-gray-400 mb-2">${task.description}</p>` : ''}
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4 text-sm text-gray-500">
                                ${task.dueDate ? `
                                    <span class="${this.isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-400' : ''}">
                                        <i class="fas fa-calendar mr-1"></i>Due ${this.formatDate(task.dueDate)}
                                    </span>
                                ` : ''}
                                <span><i class="fas fa-folder mr-1"></i>${task.category}</span>
                                ${task.project !== 'General' ? `<span><i class="fas fa-project-diagram mr-1"></i>${task.project}</span>` : ''}
                            </div>
                            <div class="flex items-center space-x-2">
                                ${task.status !== 'completed' ? `
                                    <button class="task-action p-1 text-gray-400 hover:text-green-400 transition-colors" 
                                            data-action="complete" title="Mark complete">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : ''}
                                <button class="task-action p-1 text-gray-400 hover:text-blue-400 transition-colors" 
                                        data-action="edit" title="Edit task">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="task-action p-1 text-gray-400 hover:text-red-400 transition-colors" 
                                        data-action="delete" title="Delete task">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        
                        ${task.tags.length > 0 ? `
                            <div class="mt-2 flex flex-wrap gap-1">
                                ${task.tags.map(tag => `
                                    <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">${tag}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderSchedule() {
        const scheduleContainer = document.getElementById('todaySchedule');
        if (!scheduleContainer) return;

        // Sort schedule items by start time
        const sortedSchedule = [...this.scheduleItems].sort((a, b) => 
            new Date(a.startTime) - new Date(b.startTime)
        );

        if (sortedSchedule.length === 0) {
            scheduleContainer.innerHTML = `
                <div class="text-center py-6">
                    <i class="fas fa-calendar text-2xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-400">No scheduled items for today</p>
                </div>
            `;
            return;
        }

        scheduleContainer.innerHTML = sortedSchedule.map(item => `
            <div class="schedule-item p-3 bg-gray-800 rounded-lg border-l-4 border-${this.getScheduleColor(item.type)}-500">
                <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-sm">${item.title}</h4>
                    <span class="status-${item.status} text-xs px-2 py-1 rounded-full">
                        ${item.status.replace('-', ' ')}
                    </span>
                </div>
                <p class="text-xs text-gray-400 mb-2">${item.description}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>
                        <i class="fas fa-clock mr-1"></i>
                        ${this.formatTime(item.startTime)} - ${this.formatTime(item.endTime)}
                    </span>
                    <span class="capitalize">
                        <i class="fas fa-${this.getScheduleIcon(item.type)} mr-1"></i>
                        ${item.type}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateTaskStats() {
        const stats = this.getTaskStats();
        
        // Update stat displays
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const inProgressTasksEl = document.getElementById('inProgressTasks');
        const pendingTasksEl = document.getElementById('pendingTasks');

        if (totalTasksEl) totalTasksEl.textContent = stats.total;
        if (completedTasksEl) completedTasksEl.textContent = stats.completed;
        if (inProgressTasksEl) inProgressTasksEl.textContent = stats.inProgress;
        if (pendingTasksEl) pendingTasksEl.textContent = stats.pending;
    }

    getTaskStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.status === 'completed').length,
            inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
            pending: this.tasks.filter(t => t.status === 'pending').length,
            overdue: this.tasks.filter(t => this.isOverdue(t.dueDate) && t.status !== 'completed').length
        };
    }

    getScheduleColor(type) {
        const colors = {
            meeting: 'blue',
            work: 'green',
            break: 'yellow',
            personal: 'purple',
            event: 'red'
        };
        return colors[type] || 'gray';
    }

    getScheduleIcon(type) {
        const icons = {
            meeting: 'users',
            work: 'laptop',
            break: 'coffee',
            personal: 'user',
            event: 'calendar'
        };
        return icons[type] || 'clock';
    }

    showAddTaskModal() {
        if (window.dashboardController) {
            window.dashboardController.showModal('addTaskModal');
        }
    }

    closeAddTaskModal() {
        if (window.dashboardController) {
            window.dashboardController.closeModal(document.getElementById('addTaskModal'));
        }
    }

    isOverdue(dueDate) {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'tomorrow';
        } else if (diffDays === -1) {
            return 'yesterday';
        } else if (diffDays > 0 && diffDays < 7) {
            return `in ${diffDays} days`;
        } else if (diffDays < 0 && diffDays > -7) {
            return `${Math.abs(diffDays)} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    formatTime(dateString) {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    saveTasks() {
        localStorage.setItem('organizationTasks', JSON.stringify(this.tasks));
    }

    saveSchedule() {
        localStorage.setItem('todaySchedule', JSON.stringify(this.scheduleItems));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }

    // Export tasks data
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully!', 'success');
    }

    // Get productivity insights
    getProductivityInsights() {
        const stats = this.getTaskStats();
        const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
        
        const insights = [];
        
        if (completionRate > 80) {
            insights.push({
                type: 'success',
                message: `Excellent! You've completed ${completionRate.toFixed(1)}% of your tasks.`
            });
        } else if (completionRate > 60) {
            insights.push({
                type: 'info',
                message: `Good progress! ${completionRate.toFixed(1)}% completion rate.`
            });
        } else {
            insights.push({
                type: 'warning',
                message: `Consider focusing on task completion. Current rate: ${completionRate.toFixed(1)}%`
            });
        }
        
        if (stats.overdue > 0) {
            insights.push({
                type: 'warning',
                message: `You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}. Consider prioritizing them.`
            });
        }
        
        return insights;
    }

    // Time tracking functionality
    startTimeTracking(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.timeTrackingStart = new Date().toISOString();
            task.status = 'in-progress';
            this.saveTasks();
            this.showNotification(`Started tracking time for "${task.title}"`, 'info');
        }
    }

    stopTimeTracking(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && task.timeTrackingStart) {
            const startTime = new Date(task.timeTrackingStart);
            const endTime = new Date();
            const duration = (endTime - startTime) / (1000 * 60 * 60); // hours
            
            task.actualTime += duration;
            delete task.timeTrackingStart;
            task.updatedAt = new Date().toISOString();
            
            this.saveTasks();
            this.showNotification(`Tracked ${duration.toFixed(2)} hours for "${task.title}"`, 'success');
        }
    }
}

// Initialize organization controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.organizationController = new OrganizationController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrganizationController;
}