// BRZI AI Dashboard - Automation Controller
// Handles workflow automation tools, templates, and management

class AutomationController {
    constructor() {
        this.workflows = [];
        this.activeAutomations = [];
        this.workflowTemplates = [];
        this.executionHistory = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadWorkflows();
        this.loadWorkflowTemplates();
        this.loadActiveAutomations();
        this.setupEventListeners();
        this.renderWorkflowTemplates();
        this.renderActiveAutomations();
    }

    setupEventListeners() {
        // Create workflow button
        const createWorkflowBtn = document.getElementById('createWorkflowBtn');
        if (createWorkflowBtn) {
            createWorkflowBtn.addEventListener('click', () => {
                this.showCreateWorkflowModal();
            });
        }

        // Workflow template clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.workflow-template')) {
                const templateId = e.target.closest('.workflow-template').dataset.templateId;
                this.useWorkflowTemplate(templateId);
            }
        });

        // Automation actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.automation-action')) {
                const action = e.target.closest('.automation-action').dataset.action;
                const automationId = e.target.closest('.automation-item').dataset.automationId;
                this.handleAutomationAction(action, automationId);
            }
        });

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('automation-filter')) {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            }
        });
    }

    loadWorkflows() {
        const storedWorkflows = localStorage.getItem('automationWorkflows');
        if (storedWorkflows) {
            this.workflows = JSON.parse(storedWorkflows);
        } else {
            this.workflows = [];
        }
    }

    loadWorkflowTemplates() {
        // Load workflow templates based on BRZI AI framework workflows from the resource inventory
        this.workflowTemplates = [
            {
                id: 'automation_agents',
                name: 'Automation Agents Workflow',
                description: 'Deploy and manage AI agents for automated task execution and process optimization.',
                category: 'ai-agents',
                complexity: 'advanced',
                estimatedTime: '2-4 hours',
                icon: 'fas fa-robot',
                color: 'blue',
                steps: [
                    'Define automation objectives and scope',
                    'Select appropriate AI agent types',
                    'Configure agent parameters and triggers',
                    'Set up monitoring and feedback loops',
                    'Deploy agents and monitor performance',
                    'Optimize based on execution results'
                ],
                requirements: ['AI model access', 'API integrations', 'Monitoring tools'],
                benefits: ['24/7 automated execution', 'Reduced manual errors', 'Scalable operations'],
                useCases: ['Customer support automation', 'Data processing', 'Content generation']
            },
            {
                id: 'content_pipeline',
                name: 'Content Creation Pipeline',
                description: 'Automated content generation, review, and publishing workflow for consistent content delivery.',
                category: 'content',
                complexity: 'intermediate',
                estimatedTime: '1-2 hours',
                icon: 'fas fa-edit',
                color: 'green',
                steps: [
                    'Set content strategy and guidelines',
                    'Configure content generation parameters',
                    'Implement review and approval process',
                    'Set up publishing schedules',
                    'Monitor content performance',
                    'Iterate based on analytics'
                ],
                requirements: ['Content management system', 'AI writing tools', 'Analytics platform'],
                benefits: ['Consistent content output', 'Reduced production time', 'Quality assurance'],
                useCases: ['Blog post automation', 'Social media content', 'Email campaigns']
            },
            {
                id: 'data_spreadsheet_assistant',
                name: 'Data Spreadsheet Assistant',
                description: 'Intelligent data processing and analysis automation for spreadsheets and databases.',
                category: 'data',
                complexity: 'intermediate',
                estimatedTime: '1-3 hours',
                icon: 'fas fa-table',
                color: 'purple',
                steps: [
                    'Connect to data sources',
                    'Define data processing rules',
                    'Set up automated calculations',
                    'Configure data validation',
                    'Implement reporting automation',
                    'Schedule regular updates'
                ],
                requirements: ['Database access', 'Spreadsheet software', 'Data validation rules'],
                benefits: ['Error-free calculations', 'Real-time updates', 'Automated reporting'],
                useCases: ['Financial reporting', 'Inventory management', 'Performance tracking']
            },
            {
                id: 'deep_research_sprint',
                name: 'Deep Research Sprint',
                description: 'Comprehensive research automation workflow for gathering, analyzing, and synthesizing information.',
                category: 'research',
                complexity: 'advanced',
                estimatedTime: '3-6 hours',
                icon: 'fas fa-search',
                color: 'yellow',
                steps: [
                    'Define research objectives and scope',
                    'Set up automated data collection',
                    'Configure analysis parameters',
                    'Implement source verification',
                    'Generate research summaries',
                    'Create actionable insights'
                ],
                requirements: ['Research databases', 'AI analysis tools', 'Citation management'],
                benefits: ['Comprehensive coverage', 'Unbiased analysis', 'Time efficiency'],
                useCases: ['Market research', 'Competitive analysis', 'Academic research']
            },
            {
                id: 'drive_management',
                name: 'Drive Management & Organization',
                description: 'Automated file organization, backup, and management system for cloud storage.',
                category: 'organization',
                complexity: 'beginner',
                estimatedTime: '30-60 minutes',
                icon: 'fas fa-cloud',
                color: 'indigo',
                steps: [
                    'Analyze current file structure',
                    'Define organization rules',
                    'Set up automated sorting',
                    'Configure backup schedules',
                    'Implement access controls',
                    'Monitor storage usage'
                ],
                requirements: ['Cloud storage access', 'File management tools', 'Backup solution'],
                benefits: ['Organized file structure', 'Automated backups', 'Easy file retrieval'],
                useCases: ['Document management', 'Project organization', 'Team collaboration']
            },
            {
                id: 'monetization_outreach',
                name: 'Monetization & Outreach Automation',
                description: 'Automated lead generation, outreach, and monetization workflow for business growth.',
                category: 'business',
                complexity: 'advanced',
                estimatedTime: '2-4 hours',
                icon: 'fas fa-dollar-sign',
                color: 'red',
                steps: [
                    'Identify target audience segments',
                    'Create outreach templates',
                    'Set up lead scoring system',
                    'Configure follow-up sequences',
                    'Implement conversion tracking',
                    'Optimize based on results'
                ],
                requirements: ['CRM system', 'Email automation', 'Analytics tools'],
                benefits: ['Scalable outreach', 'Higher conversion rates', 'Revenue growth'],
                useCases: ['Sales automation', 'Partnership outreach', 'Customer acquisition']
            },
            {
                id: 'music_agent_track_release',
                name: 'Music Track Release Automation',
                description: 'Automated music production, distribution, and promotion workflow for artists.',
                category: 'creative',
                complexity: 'intermediate',
                estimatedTime: '2-3 hours',
                icon: 'fas fa-music',
                color: 'pink',
                steps: [
                    'Prepare track metadata and assets',
                    'Configure distribution channels',
                    'Set up promotional campaigns',
                    'Schedule social media posts',
                    'Monitor streaming analytics',
                    'Optimize promotion strategy'
                ],
                requirements: ['Music distribution platform', 'Social media accounts', 'Analytics tools'],
                benefits: ['Streamlined releases', 'Consistent promotion', 'Performance tracking'],
                useCases: ['Single releases', 'Album launches', 'Playlist submissions']
            },
            {
                id: 'rapid_saas_experiment',
                name: 'Rapid SaaS Experiment',
                description: 'Fast-track SaaS product development and testing workflow for quick market validation.',
                category: 'product',
                complexity: 'advanced',
                estimatedTime: '4-8 hours',
                icon: 'fas fa-rocket',
                color: 'orange',
                steps: [
                    'Define MVP requirements',
                    'Set up development environment',
                    'Implement core features',
                    'Configure user analytics',
                    'Launch beta testing',
                    'Analyze user feedback and iterate'
                ],
                requirements: ['Development tools', 'Cloud hosting', 'Analytics platform'],
                benefits: ['Rapid prototyping', 'Market validation', 'User feedback'],
                useCases: ['Product validation', 'Feature testing', 'Market research']
            }
        ];
    }

    loadActiveAutomations() {
        const storedAutomations = localStorage.getItem('activeAutomations');
        if (storedAutomations) {
            this.activeAutomations = JSON.parse(storedAutomations);
        } else {
            // Initialize with sample active automations
            this.activeAutomations = this.getSampleActiveAutomations();
            this.saveActiveAutomations();
        }
    }

    getSampleActiveAutomations() {
        return [
            {
                id: this.generateId(),
                name: 'Daily Content Generation',
                description: 'Automatically generates blog post ideas and outlines every morning',
                type: 'content_pipeline',
                status: 'running',
                schedule: 'daily',
                nextRun: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                lastRun: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                successRate: 95,
                executionCount: 28,
                createdAt: new Date(Date.now() - 2419200000).toISOString(), // 28 days ago
                settings: {
                    contentTypes: ['blog', 'social'],
                    targetAudience: 'professionals',
                    tone: 'informative'
                }
            },
            {
                id: this.generateId(),
                name: 'Lead Qualification Bot',
                description: 'Automatically qualifies and scores incoming leads from website forms',
                type: 'automation_agents',
                status: 'running',
                schedule: 'continuous',
                nextRun: 'continuous',
                lastRun: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                successRate: 88,
                executionCount: 156,
                createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
                settings: {
                    scoringCriteria: ['company_size', 'budget', 'timeline'],
                    threshold: 70,
                    notifications: true
                }
            },
            {
                id: this.generateId(),
                name: 'Weekly Data Backup',
                description: 'Backs up all project files and databases to cloud storage',
                type: 'drive_management',
                status: 'running',
                schedule: 'weekly',
                nextRun: new Date(Date.now() + 518400000).toISOString(), // 6 days from now
                lastRun: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                successRate: 100,
                executionCount: 12,
                createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
                settings: {
                    backupLocation: 'cloud_storage',
                    retention: '30_days',
                    compression: true
                }
            },
            {
                id: this.generateId(),
                name: 'Market Research Digest',
                description: 'Compiles weekly market research reports from multiple sources',
                type: 'deep_research_sprint',
                status: 'paused',
                schedule: 'weekly',
                nextRun: null,
                lastRun: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
                successRate: 92,
                executionCount: 8,
                createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
                settings: {
                    sources: ['industry_reports', 'news_feeds', 'competitor_analysis'],
                    keywords: ['AI', 'automation', 'productivity'],
                    outputFormat: 'summary'
                }
            },
            {
                id: this.generateId(),
                name: 'Social Media Scheduler',
                description: 'Automatically posts content across social media platforms',
                type: 'monetization_outreach',
                status: 'running',
                schedule: 'daily',
                nextRun: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
                lastRun: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                successRate: 97,
                executionCount: 45,
                createdAt: new Date(Date.now() - 3888000000).toISOString(), // 45 days ago
                settings: {
                    platforms: ['twitter', 'linkedin', 'facebook'],
                    postTimes: ['09:00', '13:00', '17:00'],
                    contentTypes: ['articles', 'updates', 'promotions']
                }
            }
        ];
    }

    useWorkflowTemplate(templateId) {
        const template = this.workflowTemplates.find(t => t.id === templateId);
        if (!template) return;

        // Show workflow creation modal with template pre-filled
        this.showCreateWorkflowModal(template);
    }

    showCreateWorkflowModal(template = null) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg max-w-2xl w-full max-h-full overflow-y-auto">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold">${template ? 'Create Workflow from Template' : 'Create New Workflow'}</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>
                <div class="p-6">
                    <form id="workflowForm">
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Workflow Name</label>
                            <input type="text" id="workflowName" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500" 
                                   value="${template ? template.name : ''}" required>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea id="workflowDescription" rows="3" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">${template ? template.description : ''}</textarea>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Category</label>
                                <select id="workflowCategory" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                                    <option value="ai-agents" ${template?.category === 'ai-agents' ? 'selected' : ''}>AI Agents</option>
                                    <option value="content" ${template?.category === 'content' ? 'selected' : ''}>Content</option>
                                    <option value="data" ${template?.category === 'data' ? 'selected' : ''}>Data Processing</option>
                                    <option value="research" ${template?.category === 'research' ? 'selected' : ''}>Research</option>
                                    <option value="organization" ${template?.category === 'organization' ? 'selected' : ''}>Organization</option>
                                    <option value="business" ${template?.category === 'business' ? 'selected' : ''}>Business</option>
                                    <option value="creative" ${template?.category === 'creative' ? 'selected' : ''}>Creative</option>
                                    <option value="product" ${template?.category === 'product' ? 'selected' : ''}>Product</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Schedule</label>
                                <select id="workflowSchedule" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500">
                                    <option value="manual">Manual</option>
                                    <option value="continuous">Continuous</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </div>
                        ${template ? `
                            <div class="mb-4">
                                <label class="block text-sm font-medium mb-2">Workflow Steps</label>
                                <div class="bg-gray-900 rounded-lg p-4">
                                    <ol class="list-decimal list-inside space-y-2 text-sm">
                                        ${template.steps.map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                </div>
                            </div>
                            <div class="mb-4">
                                <label class="block text-sm font-medium mb-2">Requirements</label>
                                <div class="flex flex-wrap gap-2">
                                    ${template.requirements.map(req => `
                                        <span class="text-xs bg-yellow-600 px-2 py-1 rounded-full">${req}</span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        <div class="flex space-x-3">
                            <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Create Workflow</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#workflowForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createWorkflow(template);
            modal.remove();
        });
    }

    createWorkflow(template = null) {
        const name = document.getElementById('workflowName').value.trim();
        const description = document.getElementById('workflowDescription').value.trim();
        const category = document.getElementById('workflowCategory').value;
        const schedule = document.getElementById('workflowSchedule').value;

        if (!name) {
            this.showNotification('Please enter a workflow name', 'error');
            return;
        }

        const newAutomation = {
            id: this.generateId(),
            name,
            description,
            type: template ? template.id : 'custom',
            category,
            status: 'created',
            schedule,
            nextRun: schedule === 'manual' ? null : this.calculateNextRun(schedule),
            lastRun: null,
            successRate: 0,
            executionCount: 0,
            createdAt: new Date().toISOString(),
            settings: template ? this.getDefaultSettings(template) : {}
        };

        this.activeAutomations.unshift(newAutomation);
        this.saveActiveAutomations();
        this.renderActiveAutomations();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'blue',
                icon: 'fas fa-robot',
                title: 'New automation created',
                description: `Created "${name}" workflow`,
                time: 'Just now'
            });
        }

        this.showNotification('Workflow created successfully!', 'success');
    }

    getDefaultSettings(template) {
        // Return default settings based on template type
        const defaultSettings = {
            automation_agents: {
                agentType: 'general',
                maxConcurrency: 5,
                retryAttempts: 3
            },
            content_pipeline: {
                contentTypes: ['blog', 'social'],
                tone: 'professional',
                wordCount: 500
            },
            data_spreadsheet_assistant: {
                dataSource: 'csv',
                validationRules: true,
                backupEnabled: true
            },
            deep_research_sprint: {
                sources: ['web', 'databases'],
                depth: 'comprehensive',
                outputFormat: 'report'
            },
            drive_management: {
                backupLocation: 'cloud',
                retention: '30_days',
                compression: true
            },
            monetization_outreach: {
                platforms: ['email', 'social'],
                frequency: 'daily',
                tracking: true
            }
        };

        return defaultSettings[template.id] || {};
    }

    calculateNextRun(schedule) {
        const now = new Date();
        switch (schedule) {
            case 'hourly':
                return new Date(now.getTime() + 3600000).toISOString();
            case 'daily':
                return new Date(now.getTime() + 86400000).toISOString();
            case 'weekly':
                return new Date(now.getTime() + 604800000).toISOString();
            case 'monthly':
                return new Date(now.getTime() + 2592000000).toISOString();
            case 'continuous':
                return 'continuous';
            default:
                return null;
        }
    }

    handleAutomationAction(action, automationId) {
        const automation = this.activeAutomations.find(a => a.id === automationId);
        if (!automation) return;

        switch (action) {
            case 'start':
                this.startAutomation(automationId);
                break;
            case 'pause':
                this.pauseAutomation(automationId);
                break;
            case 'stop':
                this.stopAutomation(automationId);
                break;
            case 'edit':
                this.editAutomation(automationId);
                break;
            case 'delete':
                this.deleteAutomation(automationId);
                break;
            case 'run':
                this.runAutomationNow(automationId);
                break;
        }
    }

    startAutomation(automationId) {
        const automation = this.activeAutomations.find(a => a.id === automationId);
        if (automation) {
            automation.status = 'running';
            automation.nextRun = this.calculateNextRun(automation.schedule);
            this.saveActiveAutomations();
            this.renderActiveAutomations();
            this.showNotification(`${automation.name} started successfully`, 'success');
        }
    }

    pauseAutomation(automationId) {
        const automation = this.activeAutomations.find(a => a.id === automationId);
        if (automation) {
            automation.status = 'paused';
            automation.nextRun = null;
            this.saveActiveAutomations();
            this.renderActiveAutomations();
            this.showNotification(`${automation.name} paused`, 'info');
        }
    }

    stopAutomation(automationId) {
        const automation = this.activeAutomations.find(a => a.id === automationId);
        if (automation) {
            automation.status = 'stopped';
            automation.nextRun = null;
            this.saveActiveAutomations();
            this.renderActiveAutomations();
            this.showNotification(`${automation.name} stopped`, 'warning');
        }
    }

    editAutomation(automationId) {
        // This would open an edit modal
        console.log('Editing automation:', automationId);
        this.showNotification('Edit functionality would open here', 'info');
    }

    deleteAutomation(automationId) {
        if (!confirm('Are you sure you want to delete this automation?')) {
            return;
        }

        const automationIndex = this.activeAutomations.findIndex(a => a.id === automationId);
        if (automationIndex > -1) {
            const deletedAutomation = this.activeAutomations[automationIndex];
            this.activeAutomations.splice(automationIndex, 1);
            this.saveActiveAutomations();
            this.renderActiveAutomations();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'yellow',
                    icon: 'fas fa-trash',
                    title: 'Automation deleted',
                    description: `Removed "${deletedAutomation.name}" workflow`,
                    time: 'Just now'
                });
            }

            this.showNotification('Automation deleted successfully', 'success');
        }
    }

    runAutomationNow(automationId) {
        const automation = this.activeAutomations.find(a => a.id === automationId);
        if (automation) {
            // Simulate running the automation
            automation.lastRun = new Date().toISOString();
            automation.executionCount += 1;
            
            // Simulate success/failure (90% success rate)
            const success = Math.random() > 0.1;
            if (success) {
                automation.successRate = Math.min(100, automation.successRate + 1);
                this.showNotification(`${automation.name} executed successfully`, 'success');
            } else {
                automation.successRate = Math.max(0, automation.successRate - 2);
                this.showNotification(`${automation.name} execution failed`, 'error');
            }

            this.saveActiveAutomations();
            this.renderActiveAutomations();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: success ? 'green' : 'yellow',
                    icon: 'fas fa-play',
                    title: 'Automation executed',
                    description: `${automation.name} ${success ? 'completed successfully' : 'failed'}`,
                    time: 'Just now'
                });
            }
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderActiveAutomations();
        
        // Update filter buttons
        document.querySelectorAll('.automation-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600');
            btn.classList.add('bg-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-600');
            activeBtn.classList.remove('bg-gray-700');
        }
    }

    renderWorkflowTemplates() {
        const templatesContainer = document.getElementById('workflowTemplates');
        if (!templatesContainer) return;

        templatesContainer.innerHTML = this.workflowTemplates.map(template => `
            <div class="workflow-card workflow-template" data-template-id="${template.id}">
                <div class="text-center">
                    <div class="w-16 h-16 bg-${template.color}-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <i class="${template.icon} text-2xl text-white"></i>
                    </div>
                    <h3 class="font-semibold mb-2">${template.name}</h3>
                    <p class="text-sm text-gray-400 mb-4 line-clamp-3">${template.description}</p>
                    <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span class="complexity-${template.complexity}">${template.complexity}</span>
                        <span><i class="fas fa-clock mr-1"></i>${template.estimatedTime}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mb-4">
                        ${template.useCases.slice(0, 2).map(useCase => `
                            <span class="text-xs bg-gray-700 px-2 py-1 rounded-full">${useCase}</span>
                        `).join('')}
                        ${template.useCases.length > 2 ? `<span class="text-xs text-gray-400">+${template.useCases.length - 2}</span>` : ''}
                    </div>
                    <button class="w-full bg-${template.color}-600 hover:bg-${template.color}-700 px-4 py-2 rounded-lg transition-colors text-sm">
                        Use Template
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderActiveAutomations() {
        const automationsContainer = document.getElementById('activeAutomations');
        if (!automationsContainer) return;

        let filteredAutomations = this.activeAutomations;

        // Apply filter
        if (this.currentFilter !== 'all') {
            filteredAutomations = filteredAutomations.filter(automation => automation.status === this.currentFilter);
        }

        if (filteredAutomations.length === 0) {
            automationsContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-robot text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No automations found</h3>
                    <p class="text-gray-500">Create your first automation workflow to get started</p>
                </div>
            `;
            return;
        }

        automationsContainer.innerHTML = filteredAutomations.map(automation => `
            <div class="automation-item bg-gray-800 rounded-lg p-6 border border-gray-700" data-automation-id="${automation.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="text-lg font-semibold">${automation.name}</h3>
                            <span class="status-badge status-${automation.status} text-xs font-medium px-2 py-1 rounded-full">
                                ${automation.status.toUpperCase()}
                            </span>
                        </div>
                        <p class="text-gray-400 text-sm mb-3">${automation.description}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${automation.status === 'running' ? `
                            <button class="automation-action p-2 text-gray-400 hover:text-yellow-400 transition-colors" 
                                    data-action="pause" title="Pause automation">
                                <i class="fas fa-pause"></i>
                            </button>
                        ` : automation.status === 'paused' ? `
                            <button class="automation-action p-2 text-gray-400 hover:text-green-400 transition-colors" 
                                    data-action="start" title="Start automation">
                                <i class="fas fa-play"></i>
                            </button>
                        ` : `
                            <button class="automation-action p-2 text-gray-400 hover:text-green-400 transition-colors" 
                                    data-action="start" title="Start automation">
                                <i class="fas fa-play"></i>
                            </button>
                        `}
                        <button class="automation-action p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                data-action="run" title="Run now">
                            <i class="fas fa-bolt"></i>
                        </button>
                        <button class="automation-action p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                data-action="edit" title="Edit automation">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="automation-action p-2 text-gray-400 hover:text-red-400 transition-colors" 
                                data-action="delete" title="Delete automation">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- Automation Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-400">${automation.executionCount}</div>
                        <div class="text-xs text-gray-400">Executions</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-400">${automation.successRate}%</div>
                        <div class="text-xs text-gray-400">Success Rate</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm font-medium text-gray-300">${automation.schedule}</div>
                        <div class="text-xs text-gray-400">Schedule</div>
                    </div>
                    <div class="text-center">
                        <div class="text-sm font-medium text-gray-300">
                            ${automation.nextRun === 'continuous' ? 'Continuous' : 
                              automation.nextRun ? this.formatRelativeTime(automation.nextRun) : 'Manual'}
                        </div>
                        <div class="text-xs text-gray-400">Next Run</div>
                    </div>
                </div>

                <!-- Last Run Info -->
                <div class="flex items-center justify-between text-sm text-gray-400">
                    <span>
                        Last run: ${automation.lastRun ? this.formatRelativeTime(automation.lastRun) : 'Never'}
                    </span>
                    <span>
                        Created: ${this.formatRelativeTime(automation.createdAt)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    saveActiveAutomations() {
        localStorage.setItem('activeAutomations', JSON.stringify(this.activeAutomations));
    }

    formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));

        if (diffTime < 0) {
            // Past time
            const absDiffDays = Math.abs(diffDays);
            const absDiffHours = Math.abs(diffHours);
            const absDiffMinutes = Math.abs(diffMinutes);

            if (absDiffDays > 0) {
                return `${absDiffDays} day${absDiffDays > 1 ? 's' : ''} ago`;
            } else if (absDiffHours > 0) {
                return `${absDiffHours} hour${absDiffHours > 1 ? 's' : ''} ago`;
            } else {
                return `${absDiffMinutes} minute${absDiffMinutes > 1 ? 's' : ''} ago`;
            }
        } else {
            // Future time
            if (diffDays > 0) {
                return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
            } else if (diffHours > 0) {
                return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
            } else {
                return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
            }
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }

    // Get automation statistics
    getAutomationStats() {
        return {
            totalAutomations: this.activeAutomations.length,
            runningAutomations: this.activeAutomations.filter(a => a.status === 'running').length,
            pausedAutomations: this.activeAutomations.filter(a => a.status === 'paused').length,
            totalExecutions: this.activeAutomations.reduce((sum, a) => sum + a.executionCount, 0),
            averageSuccessRate: this.activeAutomations.reduce((sum, a) => sum + a.successRate, 0) / this.activeAutomations.length || 0
        };
    }

    // Export automation configurations
    exportAutomations() {
        const dataStr = JSON.stringify(this.activeAutomations, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `automations-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Automations exported successfully!', 'success');
    }
}

// Initialize automation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.automationController = new AutomationController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomationController;
}