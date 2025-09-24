// BRZI AI Dashboard - Projects Controller
// Handles project tracking, management, and progress visualization

class ProjectsController {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.sortBy = 'updated';
        this.sortOrder = 'desc';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
    }

    setupEventListeners() {
        // Add project button
        const addProjectBtn = document.getElementById('addProjectBtn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                this.showAddProjectModal();
            });
        }

        // Project form submission
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addProject();
            });
        }

        // Project status filters
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-filter')) {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            }
        });

        // Sort functionality
        document.addEventListener('change', (e) => {
            if (e.target.id === 'projectSort') {
                this.setSortBy(e.target.value);
            }
        });
    }

    loadProjects() {
        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
            this.projects = JSON.parse(storedProjects);
        } else {
            // Initialize with sample projects
            this.projects = this.getSampleProjects();
            this.saveProjects();
        }
    }

    getSampleProjects() {
        return [
            {
                id: this.generateId(),
                name: 'AI Content Generation Pipeline',
                description: 'Develop an automated content generation system using advanced AI models for blog posts, social media, and marketing materials.',
                status: 'active',
                priority: 'high',
                progress: 75,
                startDate: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
                dueDate: new Date(Date.now() + 1209600000).toISOString(), // 14 days from now
                createdAt: new Date(Date.now() - 2592000000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                tags: ['AI', 'Content', 'Automation', 'Pipeline'],
                team: ['John Doe', 'Jane Smith'],
                tasks: [
                    { id: '1', title: 'Research AI models', status: 'completed', assignee: 'John Doe' },
                    { id: '2', title: 'Design pipeline architecture', status: 'completed', assignee: 'Jane Smith' },
                    { id: '3', title: 'Implement content generation', status: 'in-progress', assignee: 'John Doe' },
                    { id: '4', title: 'Quality assurance testing', status: 'pending', assignee: 'Jane Smith' },
                    { id: '5', title: 'Deploy to production', status: 'pending', assignee: 'John Doe' }
                ]
            },
            {
                id: this.generateId(),
                name: 'Customer Analytics Dashboard',
                description: 'Build a comprehensive analytics dashboard to track customer behavior, engagement metrics, and conversion rates.',
                status: 'active',
                priority: 'medium',
                progress: 45,
                startDate: new Date(Date.now() - 1814400000).toISOString(), // 21 days ago
                dueDate: new Date(Date.now() + 2419200000).toISOString(), // 28 days from now
                createdAt: new Date(Date.now() - 1814400000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                tags: ['Analytics', 'Dashboard', 'Customer', 'Metrics'],
                team: ['Alice Johnson', 'Bob Wilson'],
                tasks: [
                    { id: '1', title: 'Define analytics requirements', status: 'completed', assignee: 'Alice Johnson' },
                    { id: '2', title: 'Set up data collection', status: 'completed', assignee: 'Bob Wilson' },
                    { id: '3', title: 'Create dashboard UI', status: 'in-progress', assignee: 'Alice Johnson' },
                    { id: '4', title: 'Implement data visualization', status: 'pending', assignee: 'Bob Wilson' }
                ]
            },
            {
                id: this.generateId(),
                name: 'Automated Email Marketing System',
                description: 'Create an intelligent email marketing automation system with personalization, A/B testing, and performance tracking.',
                status: 'on-hold',
                priority: 'low',
                progress: 20,
                startDate: new Date(Date.now() - 3456000000).toISOString(), // 40 days ago
                dueDate: new Date(Date.now() + 4320000000).toISOString(), // 50 days from now
                createdAt: new Date(Date.now() - 3456000000).toISOString(),
                updatedAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
                tags: ['Email', 'Marketing', 'Automation', 'Personalization'],
                team: ['Carol Davis', 'David Brown'],
                tasks: [
                    { id: '1', title: 'Research email platforms', status: 'completed', assignee: 'Carol Davis' },
                    { id: '2', title: 'Design email templates', status: 'in-progress', assignee: 'David Brown' },
                    { id: '3', title: 'Implement automation logic', status: 'pending', assignee: 'Carol Davis' }
                ]
            },
            {
                id: this.generateId(),
                name: 'Voice Assistant Integration',
                description: 'Integrate voice assistant capabilities into existing applications for hands-free interaction and improved accessibility.',
                status: 'completed',
                priority: 'medium',
                progress: 100,
                startDate: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
                dueDate: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
                createdAt: new Date(Date.now() - 5184000000).toISOString(),
                updatedAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
                tags: ['Voice', 'Assistant', 'Integration', 'Accessibility'],
                team: ['Eve Wilson', 'Frank Miller'],
                tasks: [
                    { id: '1', title: 'Voice recognition setup', status: 'completed', assignee: 'Eve Wilson' },
                    { id: '2', title: 'Command processing logic', status: 'completed', assignee: 'Frank Miller' },
                    { id: '3', title: 'Integration testing', status: 'completed', assignee: 'Eve Wilson' },
                    { id: '4', title: 'User acceptance testing', status: 'completed', assignee: 'Frank Miller' }
                ]
            }
        ];
    }

    addProject() {
        const name = document.getElementById('projectName').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const priority = document.getElementById('projectPriority').value;

        if (!name) {
            this.showNotification('Please enter a project name', 'error');
            return;
        }

        const newProject = {
            id: this.generateId(),
            name,
            description,
            status: 'active',
            priority,
            progress: 0,
            startDate: new Date().toISOString(),
            dueDate: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: this.extractTags(name + ' ' + description),
            team: [],
            tasks: []
        };

        this.projects.unshift(newProject);
        this.saveProjects();
        this.renderProjects();

        // Close modal and reset form
        this.closeAddProjectModal();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'blue',
                icon: 'fas fa-project-diagram',
                title: 'New project created',
                description: `Created "${name}" project`,
                time: 'Just now'
            });
        }

        this.showNotification('Project created successfully!', 'success');
    }

    updateProject(projectId, updates) {
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex > -1) {
            this.projects[projectIndex] = {
                ...this.projects[projectIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveProjects();
            this.renderProjects();
        }
    }

    updateProjectProgress(projectId, progress) {
        this.updateProject(projectId, { progress: Math.max(0, Math.min(100, progress)) });
        
        // Add activity for significant progress updates
        const project = this.projects.find(p => p.id === projectId);
        if (project && progress % 25 === 0) {
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'green',
                    icon: 'fas fa-chart-line',
                    title: 'Project progress updated',
                    description: `${project.name} is now ${progress}% complete`,
                    time: 'Just now'
                });
            }
        }
    }

    updateProjectStatus(projectId, status) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const oldStatus = project.status;
            this.updateProject(projectId, { status });
            
            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: status === 'completed' ? 'green' : 'yellow',
                    icon: 'fas fa-flag',
                    title: 'Project status changed',
                    description: `${project.name} changed from ${oldStatus} to ${status}`,
                    time: 'Just now'
                });
            }
            
            this.showNotification(`Project status updated to ${status}`, 'success');
        }
    }

    deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex > -1) {
            const deletedProject = this.projects[projectIndex];
            this.projects.splice(projectIndex, 1);
            this.saveProjects();
            this.renderProjects();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'yellow',
                    icon: 'fas fa-trash',
                    title: 'Project deleted',
                    description: `Deleted "${deletedProject.name}" project`,
                    time: 'Just now'
                });
            }

            this.showNotification('Project deleted successfully', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderProjects();
        
        // Update filter buttons
        document.querySelectorAll('.project-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600');
            btn.classList.add('bg-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-600');
            activeBtn.classList.remove('bg-gray-700');
        }
    }

    setSortBy(sortBy) {
        this.sortBy = sortBy;
        this.renderProjects();
    }

    renderProjects() {
        const projectsList = document.getElementById('projectsList');
        if (!projectsList) return;

        let filteredProjects = this.projects;

        // Apply status filter
        if (this.currentFilter !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.status === this.currentFilter);
        }

        // Sort projects
        filteredProjects.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'priority': {
                    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                    aValue = priorityOrder[a.priority] || 0;
                    bValue = priorityOrder[b.priority] || 0;
                    break;
                }
                case 'progress':
                    aValue = a.progress;
                    bValue = b.progress;
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

        if (filteredProjects.length === 0) {
            projectsList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-project-diagram text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No projects found</h3>
                    <p class="text-gray-500">Create your first project to get started</p>
                </div>
            `;
            return;
        }

        projectsList.innerHTML = filteredProjects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="text-xl font-semibold">${project.name}</h3>
                            <span class="status-${project.status} text-sm font-medium px-2 py-1 rounded-full bg-gray-700">
                                ${project.status.replace('-', ' ').toUpperCase()}
                            </span>
                            <span class="priority-${project.priority} text-sm font-medium">
                                <i class="fas fa-flag mr-1"></i>${project.priority.toUpperCase()}
                            </span>
                        </div>
                        <p class="text-gray-400 mb-3">${project.description}</p>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="projectsController.editProject('${project.id}')" 
                                class="p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                title="Edit project">
                            <i class="fas fa-edit"></i>
                        </button>
                        <div class="relative">
                            <button onclick="projectsController.toggleProjectMenu('${project.id}')" 
                                    class="p-2 text-gray-400 hover:text-white transition-colors" 
                                    title="More options">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div id="menu-${project.id}" class="hidden absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                                <button onclick="projectsController.updateProjectStatus('${project.id}', 'active')" 
                                        class="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg">
                                    <i class="fas fa-play mr-2"></i>Set Active
                                </button>
                                <button onclick="projectsController.updateProjectStatus('${project.id}', 'on-hold')" 
                                        class="w-full text-left px-4 py-2 hover:bg-gray-700">
                                    <i class="fas fa-pause mr-2"></i>Put On Hold
                                </button>
                                <button onclick="projectsController.updateProjectStatus('${project.id}', 'completed')" 
                                        class="w-full text-left px-4 py-2 hover:bg-gray-700">
                                    <i class="fas fa-check mr-2"></i>Mark Complete
                                </button>
                                <hr class="border-gray-700">
                                <button onclick="projectsController.deleteProject('${project.id}')" 
                                        class="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 rounded-b-lg">
                                    <i class="fas fa-trash mr-2"></i>Delete Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium">Progress</span>
                        <span class="text-sm text-gray-400">${project.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress}%"></div>
                    </div>
                </div>

                <!-- Project Details -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <span class="text-sm text-gray-400">Start Date</span>
                        <p class="text-sm font-medium">${this.formatDate(project.startDate)}</p>
                    </div>
                    <div>
                        <span class="text-sm text-gray-400">Due Date</span>
                        <p class="text-sm font-medium ${this.isOverdue(project.dueDate) ? 'text-red-400' : ''}">${this.formatDate(project.dueDate)}</p>
                    </div>
                </div>

                <!-- Tasks Summary -->
                ${project.tasks && project.tasks.length > 0 ? `
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium">Tasks</span>
                            <span class="text-sm text-gray-400">
                                ${project.tasks.filter(t => t.status === 'completed').length}/${project.tasks.length} completed
                            </span>
                        </div>
                        <div class="space-y-1">
                            ${project.tasks.slice(0, 3).map(task => `
                                <div class="flex items-center space-x-2 text-sm">
                                    <i class="fas fa-${task.status === 'completed' ? 'check-circle text-green-400' : task.status === 'in-progress' ? 'clock text-yellow-400' : 'circle text-gray-400'}"></i>
                                    <span class="${task.status === 'completed' ? 'line-through text-gray-400' : ''}">${task.title}</span>
                                </div>
                            `).join('')}
                            ${project.tasks.length > 3 ? `<div class="text-sm text-gray-400">+${project.tasks.length - 3} more tasks</div>` : ''}
                        </div>
                    </div>
                ` : ''}

                <!-- Tags and Team -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        ${project.tags.map(tag => `
                            <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="text-xs text-gray-500">
                        Updated ${this.formatRelativeDate(project.updatedAt)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    toggleProjectMenu(projectId) {
        const menu = document.getElementById(`menu-${projectId}`);
        if (menu) {
            menu.classList.toggle('hidden');
        }
        
        // Close other menus
        document.querySelectorAll('[id^="menu-"]').forEach(otherMenu => {
            if (otherMenu.id !== `menu-${projectId}`) {
                otherMenu.classList.add('hidden');
            }
        });
    }

    showAddProjectModal() {
        if (window.dashboardController) {
            window.dashboardController.showModal('addProjectModal');
        }
    }

    closeAddProjectModal() {
        if (window.dashboardController) {
            window.dashboardController.closeModal(document.getElementById('addProjectModal'));
        }
    }

    editProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        // Populate form with existing data
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectPriority').value = project.priority;

        // Show modal
        this.showAddProjectModal();

        // Update form to edit mode
        const form = document.getElementById('projectForm');
        form.dataset.editId = projectId;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Project';
    }

    extractTags(text) {
        const keywords = ['AI', 'automation', 'dashboard', 'content', 'marketing', 'analytics', 'email', 'voice', 'integration'];
        const tags = [];
        const lowerText = text.toLowerCase();
        
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                tags.push(keyword);
            }
        });
        
        return tags;
    }

    isOverdue(dueDate) {
        return new Date(dueDate) < new Date();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatRelativeDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return this.formatDate(dateString);
        }
    }

    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }

    // Export projects data
    exportProjects() {
        const dataStr = JSON.stringify(this.projects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `projects-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Projects exported successfully!', 'success');
    }

    // Get project statistics
    getProjectStats() {
        const stats = {
            total: this.projects.length,
            active: this.projects.filter(p => p.status === 'active').length,
            completed: this.projects.filter(p => p.status === 'completed').length,
            onHold: this.projects.filter(p => p.status === 'on-hold').length,
            overdue: this.projects.filter(p => this.isOverdue(p.dueDate) && p.status !== 'completed').length
        };
        
        return stats;
    }
}

// Close project menus when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('[id^="menu-"]') && !e.target.closest('button[onclick*="toggleProjectMenu"]')) {
        document.querySelectorAll('[id^="menu-"]').forEach(menu => {
            menu.classList.add('hidden');
        });
    }
});

// Initialize projects controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsController = new ProjectsController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsController;
}