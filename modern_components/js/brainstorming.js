// BRZI AI Dashboard - Brainstorming Controller
// Handles idea capture, organization, and brainstorming tools

class BrainstormingController {
    constructor() {
        this.ideas = [];
        this.categories = [
            { id: 'product', name: 'Product Development', color: 'blue', count: 0 },
            { id: 'marketing', name: 'Marketing', color: 'green', count: 0 },
            { id: 'automation', name: 'Automation', color: 'purple', count: 0 },
            { id: 'research', name: 'Research', color: 'yellow', count: 0 },
            { id: 'content', name: 'Content Creation', color: 'red', count: 0 }
        ];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadIdeas();
        this.setupEventListeners();
        this.renderCategories();
        this.renderIdeas();
    }

    setupEventListeners() {
        // Idea form submission
        const ideaForm = document.getElementById('ideaForm');
        if (ideaForm) {
            ideaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addIdea();
            });
        }

        // Search functionality
        const ideaSearch = document.getElementById('ideaSearch');
        if (ideaSearch) {
            ideaSearch.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderIdeas();
            });
        }

        // Filter functionality
        const ideaFilter = document.getElementById('ideaFilter');
        if (ideaFilter) {
            ideaFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.renderIdeas();
            });
        }

        // Category filter clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-filter')) {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            }
        });
    }

    loadIdeas() {
        const storedIdeas = localStorage.getItem('ideas');
        if (storedIdeas) {
            this.ideas = JSON.parse(storedIdeas);
        } else {
            // Initialize with sample ideas
            this.ideas = this.getSampleIdeas();
            this.saveIdeas();
        }
        this.updateCategoryCounts();
    }

    getSampleIdeas() {
        return [
            {
                id: this.generateId(),
                title: 'AI-Powered Content Optimization',
                description: 'Develop an AI system that automatically optimizes content for different platforms and audiences, analyzing engagement patterns and suggesting improvements.',
                category: 'product',
                priority: 'high',
                tags: ['AI', 'content', 'optimization', 'automation'],
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                status: 'active'
            },
            {
                id: this.generateId(),
                title: 'Automated Social Media Campaign Generator',
                description: 'Create a system that generates complete social media campaigns based on product descriptions, target audience, and marketing goals.',
                category: 'marketing',
                priority: 'medium',
                tags: ['social media', 'automation', 'campaigns', 'AI'],
                createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                status: 'active'
            },
            {
                id: this.generateId(),
                title: 'Smart Task Prioritization Algorithm',
                description: 'Implement an intelligent system that automatically prioritizes tasks based on deadlines, importance, dependencies, and user behavior patterns.',
                category: 'automation',
                priority: 'high',
                tags: ['task management', 'AI', 'prioritization', 'productivity'],
                createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                updatedAt: new Date(Date.now() - 259200000).toISOString(),
                status: 'active'
            },
            {
                id: this.generateId(),
                title: 'Market Trend Analysis Dashboard',
                description: 'Build a comprehensive dashboard that analyzes market trends, competitor activities, and consumer sentiment to inform strategic decisions.',
                category: 'research',
                priority: 'medium',
                tags: ['market analysis', 'dashboard', 'trends', 'research'],
                createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                updatedAt: new Date(Date.now() - 345600000).toISOString(),
                status: 'active'
            },
            {
                id: this.generateId(),
                title: 'Interactive Video Content Creator',
                description: 'Develop a tool that creates interactive video content with branching narratives, quizzes, and personalized experiences.',
                category: 'content',
                priority: 'low',
                tags: ['video', 'interactive', 'content creation', 'engagement'],
                createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
                updatedAt: new Date(Date.now() - 432000000).toISOString(),
                status: 'active'
            }
        ];
    }

    addIdea() {
        const title = document.getElementById('ideaTitle').value.trim();
        const description = document.getElementById('ideaDescription').value.trim();
        const category = document.getElementById('ideaCategory').value;
        const priority = document.getElementById('ideaPriority').value;

        if (!title || !description) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const newIdea = {
            id: this.generateId(),
            title,
            description,
            category,
            priority,
            tags: this.extractTags(description),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
        };

        this.ideas.unshift(newIdea);
        this.saveIdeas();
        this.updateCategoryCounts();
        this.renderCategories();
        this.renderIdeas();

        // Clear form
        document.getElementById('ideaForm').reset();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'green',
                icon: 'fas fa-lightbulb',
                title: 'New idea created',
                description: `Added "${title}" to ${this.getCategoryName(category)}`,
                time: 'Just now'
            });
        }

        this.showNotification('Idea added successfully!', 'success');
    }

    extractTags(text) {
        // Simple tag extraction based on common keywords
        const keywords = ['AI', 'automation', 'dashboard', 'content', 'marketing', 'research', 'optimization', 'analysis'];
        const tags = [];
        const lowerText = text.toLowerCase();
        
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword.toLowerCase())) {
                tags.push(keyword);
            }
        });
        
        return tags;
    }

    editIdea(ideaId) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (!idea) return;

        // Populate form with existing data
        document.getElementById('ideaTitle').value = idea.title;
        document.getElementById('ideaDescription').value = idea.description;
        document.getElementById('ideaCategory').value = idea.category;
        document.getElementById('ideaPriority').value = idea.priority;

        // Remove the idea temporarily (will be re-added when form is submitted)
        this.deleteIdea(ideaId, false);
    }

    deleteIdea(ideaId, showConfirmation = true) {
        if (showConfirmation && !confirm('Are you sure you want to delete this idea?')) {
            return;
        }

        const ideaIndex = this.ideas.findIndex(i => i.id === ideaId);
        if (ideaIndex > -1) {
            const deletedIdea = this.ideas[ideaIndex];
            this.ideas.splice(ideaIndex, 1);
            this.saveIdeas();
            this.updateCategoryCounts();
            this.renderCategories();
            this.renderIdeas();

            if (showConfirmation) {
                this.showNotification('Idea deleted successfully', 'success');
                
                // Add activity
                if (window.dashboardController) {
                    window.dashboardController.addActivity({
                        type: 'yellow',
                        icon: 'fas fa-trash',
                        title: 'Idea deleted',
                        description: `Removed "${deletedIdea.title}"`,
                        time: 'Just now'
                    });
                }
            }
        }
    }

    toggleIdeaStatus(ideaId) {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (idea) {
            idea.status = idea.status === 'active' ? 'archived' : 'active';
            idea.updatedAt = new Date().toISOString();
            this.saveIdeas();
            this.renderIdeas();
            
            this.showNotification(`Idea ${idea.status === 'active' ? 'activated' : 'archived'}`, 'success');
        }
    }

    filterByCategory(category) {
        this.currentFilter = category;
        const filterSelect = document.getElementById('ideaFilter');
        if (filterSelect) {
            filterSelect.value = category;
        }
        this.renderIdeas();
    }

    renderCategories() {
        const categoryList = document.getElementById('categoryList');
        if (!categoryList) return;

        categoryList.innerHTML = this.categories.map(category => `
            <div class="category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentFilter === category.id ? 'bg-blue-600' : ''}" 
                 data-category="${category.id}">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-${category.color}-500"></div>
                    <span class="text-sm">${category.name}</span>
                </div>
                <span class="text-xs bg-gray-600 px-2 py-1 rounded-full">${category.count}</span>
            </div>
        `).join('');
    }

    renderIdeas() {
        const ideasList = document.getElementById('ideasList');
        if (!ideasList) return;

        let filteredIdeas = this.ideas;

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredIdeas = filteredIdeas.filter(idea => idea.category === this.currentFilter);
        }

        // Apply search filter
        if (this.searchTerm) {
            filteredIdeas = filteredIdeas.filter(idea => 
                idea.title.toLowerCase().includes(this.searchTerm) ||
                idea.description.toLowerCase().includes(this.searchTerm) ||
                idea.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        }

        if (filteredIdeas.length === 0) {
            ideasList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-lightbulb text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No ideas found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        ideasList.innerHTML = filteredIdeas.map(idea => `
            <div class="idea-card" data-idea-id="${idea.id}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h4 class="font-semibold text-lg mb-2">${idea.title}</h4>
                        <p class="text-gray-400 text-sm mb-3">${idea.description}</p>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="brainstormingController.editIdea('${idea.id}')" 
                                class="p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                title="Edit idea">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="brainstormingController.toggleIdeaStatus('${idea.id}')" 
                                class="p-2 text-gray-400 hover:text-yellow-400 transition-colors" 
                                title="${idea.status === 'active' ? 'Archive' : 'Activate'} idea">
                            <i class="fas fa-${idea.status === 'active' ? 'archive' : 'undo'}"></i>
                        </button>
                        <button onclick="brainstormingController.deleteIdea('${idea.id}')" 
                                class="p-2 text-gray-400 hover:text-red-400 transition-colors" 
                                title="Delete idea">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="category-tag bg-${this.getCategoryColor(idea.category)}-500">
                            ${this.getCategoryName(idea.category)}
                        </span>
                        <span class="priority-${idea.priority} text-sm font-medium">
                            <i class="fas fa-flag mr-1"></i>${idea.priority.toUpperCase()}
                        </span>
                        ${idea.status === 'archived' ? '<span class="text-xs bg-gray-600 px-2 py-1 rounded-full">Archived</span>' : ''}
                    </div>
                    <div class="text-xs text-gray-500">
                        ${this.formatDate(idea.createdAt)}
                    </div>
                </div>
                
                ${idea.tags.length > 0 ? `
                    <div class="mt-3 flex flex-wrap gap-2">
                        ${idea.tags.map(tag => `
                            <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">${tag}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.ideas.filter(idea => idea.category === category.id && idea.status === 'active').length;
        });
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    }

    getCategoryColor(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.color : 'gray';
    }

    saveIdeas() {
        localStorage.setItem('ideas', JSON.stringify(this.ideas));
    }

    exportIdeas() {
        const dataStr = JSON.stringify(this.ideas, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ideas-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Ideas exported successfully!', 'success');
    }

    importIdeas(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedIdeas = JSON.parse(e.target.result);
                if (Array.isArray(importedIdeas)) {
                    // Merge with existing ideas, avoiding duplicates
                    const existingTitles = this.ideas.map(idea => idea.title.toLowerCase());
                    const newIdeas = importedIdeas.filter(idea => 
                        !existingTitles.includes(idea.title.toLowerCase())
                    );
                    
                    this.ideas = [...newIdeas, ...this.ideas];
                    this.saveIdeas();
                    this.updateCategoryCounts();
                    this.renderCategories();
                    this.renderIdeas();
                    
                    this.showNotification(`Imported ${newIdeas.length} new ideas!`, 'success');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showNotification(`Error importing ideas: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Brainstorming session methods
    startBrainstormingSession(topic) {
        // Create a focused brainstorming session
        const session = {
            id: this.generateId(),
            topic: topic,
            startTime: new Date().toISOString(),
            ideas: [],
            duration: 0
        };
        
        // Store session
        localStorage.setItem('currentBrainstormingSession', JSON.stringify(session));
        
        // Show session interface
        this.showBrainstormingSession(session);
    }

    showBrainstormingSession(session) {
        // This would show a focused brainstorming interface
        // For now, we'll just show a notification
        this.showNotification(`Brainstorming session started for: ${session.topic}`, 'info');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }
}

// Initialize brainstorming controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brainstormingController = new BrainstormingController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrainstormingController;
}