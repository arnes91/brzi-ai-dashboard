// BRZI AI Dashboard - Prompts Controller
// Handles AI prompt library, search, filtering, and management

class PromptsController {
    constructor() {
        this.prompts = [];
        this.categories = [
            { id: 'content', name: 'Content Creation', color: 'blue', count: 0 },
            { id: 'analysis', name: 'Analysis & Research', color: 'green', count: 0 },
            { id: 'coding', name: 'Coding & Development', color: 'purple', count: 0 },
            { id: 'marketing', name: 'Marketing & Sales', color: 'yellow', count: 0 },
            { id: 'business', name: 'Business Strategy', color: 'red', count: 0 },
            { id: 'creative', name: 'Creative & Design', color: 'pink', count: 0 }
        ];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.sortBy = 'updated';
        this.init();
    }

    init() {
        this.loadPrompts();
        this.setupEventListeners();
        this.renderCategories();
        this.renderPrompts();
    }

    setupEventListeners() {
        // Search functionality
        const promptSearch = document.getElementById('promptSearch');
        if (promptSearch) {
            promptSearch.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderPrompts();
            });
        }

        // Filter functionality
        const promptFilter = document.getElementById('promptFilter');
        if (promptFilter) {
            promptFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.renderPrompts();
            });
        }

        // Add prompt button
        const addPromptBtn = document.getElementById('addPromptBtn');
        if (addPromptBtn) {
            addPromptBtn.addEventListener('click', () => {
                this.showAddPromptModal();
            });
        }

        // Category filter clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('prompt-category-filter')) {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            }
        });

        // Prompt actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.prompt-action')) {
                const action = e.target.closest('.prompt-action').dataset.action;
                const promptId = e.target.closest('.prompt-card').dataset.promptId;
                this.handlePromptAction(action, promptId);
            }
        });
    }

    loadPrompts() {
        const storedPrompts = localStorage.getItem('aiPrompts');
        if (storedPrompts) {
            this.prompts = JSON.parse(storedPrompts);
        } else {
            // Initialize with sample prompts
            this.prompts = this.getSamplePrompts();
            this.savePrompts();
        }
        this.updateCategoryCounts();
    }

    getSamplePrompts() {
        return [
            {
                id: this.generateId(),
                title: 'Blog Post Content Generator',
                description: 'Generate comprehensive blog posts with SEO optimization and engaging content structure.',
                prompt: `You are an expert content writer and SEO specialist. Create a comprehensive blog post about [TOPIC] that includes:

1. **Compelling Headline**: Write 3 headline options that are SEO-friendly and click-worthy
2. **Introduction**: Hook the reader with a compelling opening that addresses their pain point
3. **Main Content**: Structure the content with:
   - Clear subheadings (H2, H3)
   - Actionable insights and tips
   - Real-world examples or case studies
   - Data and statistics where relevant
4. **SEO Elements**: 
   - Target keyword: [KEYWORD]
   - Meta description (150-160 characters)
   - 5-7 related keywords to include naturally
5. **Call-to-Action**: End with a clear, compelling CTA

**Writing Style**: [Professional/Conversational/Technical]
**Target Audience**: [AUDIENCE]
**Word Count**: [WORD_COUNT] words
**Tone**: [TONE]

Please ensure the content is original, valuable, and optimized for both readers and search engines.`,
                category: 'content',
                tags: ['Blog Writing', 'SEO', 'Content Marketing', 'Copywriting'],
                author: 'Content Team',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                usageCount: 45,
                rating: 4.8,
                isFavorite: true,
                variables: ['TOPIC', 'KEYWORD', 'AUDIENCE', 'WORD_COUNT', 'TONE']
            },
            {
                id: this.generateId(),
                title: 'Market Research Analyzer',
                description: 'Comprehensive market analysis with competitor insights and strategic recommendations.',
                prompt: `You are a senior market research analyst with expertise in [INDUSTRY]. Conduct a comprehensive market analysis for [PRODUCT/SERVICE] including:

## Market Overview
- Market size and growth trends
- Key market drivers and challenges
- Regulatory environment and impact
- Emerging opportunities and threats

## Competitive Analysis
- Top 5-7 competitors analysis
- Competitive positioning map
- Strengths and weaknesses comparison
- Pricing strategies and models
- Market share distribution

## Target Audience Analysis
- Primary and secondary customer segments
- Customer personas and demographics
- Pain points and needs analysis
- Buying behavior and decision factors
- Customer journey mapping

## Strategic Recommendations
- Market entry strategies
- Positioning recommendations
- Pricing strategy suggestions
- Marketing channel recommendations
- Risk mitigation strategies

## Data Sources and Methodology
- Research methodology used
- Data sources and reliability
- Limitations and assumptions
- Confidence levels and validation

Please provide actionable insights backed by data and industry expertise. Include relevant charts, graphs, or frameworks where applicable.

**Industry**: [INDUSTRY]
**Geographic Focus**: [REGION]
**Time Frame**: [TIMEFRAME]
**Budget Range**: [BUDGET]`,
                category: 'analysis',
                tags: ['Market Research', 'Competitive Analysis', 'Business Intelligence', 'Strategy'],
                author: 'Research Team',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                usageCount: 32,
                rating: 4.6,
                isFavorite: false,
                variables: ['INDUSTRY', 'PRODUCT/SERVICE', 'REGION', 'TIMEFRAME', 'BUDGET']
            },
            {
                id: this.generateId(),
                title: 'Code Review and Optimization',
                description: 'Comprehensive code review with performance optimization and best practices recommendations.',
                prompt: `You are a senior software engineer and code reviewer with expertise in [PROGRAMMING_LANGUAGE]. Please review the following code and provide:

## Code Analysis
\`\`\`[PROGRAMMING_LANGUAGE]
[CODE_TO_REVIEW]
\`\`\`

## Review Areas
1. **Code Quality**
   - Readability and maintainability
   - Naming conventions and structure
   - Code organization and modularity
   - Documentation and comments

2. **Performance Analysis**
   - Time and space complexity
   - Potential bottlenecks
   - Memory usage optimization
   - Algorithm efficiency

3. **Security Review**
   - Vulnerability assessment
   - Input validation and sanitization
   - Authentication and authorization
   - Data protection measures

4. **Best Practices**
   - Design patterns implementation
   - SOLID principles adherence
   - Error handling and logging
   - Testing considerations

## Recommendations
- **High Priority Issues**: Critical problems that need immediate attention
- **Medium Priority**: Improvements for better maintainability
- **Low Priority**: Nice-to-have optimizations
- **Refactored Code**: Provide improved version of problematic sections

## Additional Considerations
- Framework/library specific best practices
- Platform-specific optimizations
- Scalability considerations
- Future maintenance implications

Please provide specific examples and explanations for each recommendation.

**Programming Language**: [PROGRAMMING_LANGUAGE]
**Framework/Library**: [FRAMEWORK]
**Project Type**: [PROJECT_TYPE]
**Performance Requirements**: [PERFORMANCE_REQUIREMENTS]`,
                category: 'coding',
                tags: ['Code Review', 'Performance', 'Best Practices', 'Security'],
                author: 'Development Team',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                updatedAt: new Date(Date.now() - 259200000).toISOString(),
                usageCount: 28,
                rating: 4.9,
                isFavorite: true,
                variables: ['PROGRAMMING_LANGUAGE', 'CODE_TO_REVIEW', 'FRAMEWORK', 'PROJECT_TYPE', 'PERFORMANCE_REQUIREMENTS']
            },
            {
                id: this.generateId(),
                title: 'Sales Email Campaign Creator',
                description: 'Create personalized sales email sequences with high conversion potential.',
                prompt: `You are an expert sales copywriter specializing in email marketing. Create a comprehensive email campaign for [PRODUCT/SERVICE] targeting [TARGET_AUDIENCE].

## Campaign Structure
Create a 5-email sequence with the following:

### Email 1: Introduction & Problem Identification
- Subject line (3 options)
- Hook that resonates with target audience
- Identify specific pain points
- Soft introduction to solution
- Clear CTA for engagement

### Email 2: Solution Presentation
- Subject line building on previous email
- Detailed solution presentation
- Key benefits and features
- Social proof or testimonials
- CTA for demo/consultation

### Email 3: Objection Handling
- Address common objections
- Provide additional proof points
- Risk reversal or guarantee
- Urgency or scarcity element
- Strong CTA for action

### Email 4: Case Study/Success Story
- Detailed customer success story
- Specific results and metrics
- Relatable customer profile
- Clear connection to prospect's situation
- CTA for similar results

### Email 5: Final Offer/Last Chance
- Compelling final offer
- Limited-time bonus or discount
- Clear value proposition summary
- Strong urgency and scarcity
- Multiple CTA options

## Email Specifications
- **Tone**: [TONE]
- **Length**: 150-250 words per email
- **Personalization**: Include [PERSONALIZATION_FIELDS]
- **Industry**: [INDUSTRY]
- **Price Point**: [PRICE_RANGE]

## Additional Elements
- A/B test subject line variations
- Mobile-optimized formatting
- Compliance considerations
- Follow-up sequence for non-responders
- Tracking and analytics recommendations

**Product/Service**: [PRODUCT/SERVICE]
**Target Audience**: [TARGET_AUDIENCE]
**Unique Value Proposition**: [UVP]
**Main Competitor**: [COMPETITOR]
**Campaign Goal**: [GOAL]`,
                category: 'marketing',
                tags: ['Email Marketing', 'Sales Copy', 'Lead Nurturing', 'Conversion'],
                author: 'Marketing Team',
                createdAt: new Date(Date.now() - 345600000).toISOString(),
                updatedAt: new Date(Date.now() - 345600000).toISOString(),
                usageCount: 38,
                rating: 4.7,
                isFavorite: false,
                variables: ['PRODUCT/SERVICE', 'TARGET_AUDIENCE', 'TONE', 'PERSONALIZATION_FIELDS', 'INDUSTRY', 'PRICE_RANGE', 'UVP', 'COMPETITOR', 'GOAL']
            },
            {
                id: this.generateId(),
                title: 'Business Strategy Framework',
                description: 'Comprehensive business strategy development using proven frameworks and methodologies.',
                prompt: `You are a senior business strategy consultant with expertise in [INDUSTRY]. Develop a comprehensive business strategy for [COMPANY/PROJECT] using established frameworks.

## Strategic Analysis

### 1. Situation Analysis (SWOT)
**Strengths**
- Internal capabilities and advantages
- Unique resources and competencies
- Market position and brand strength

**Weaknesses**
- Internal limitations and gaps
- Resource constraints
- Competitive disadvantages

**Opportunities**
- Market trends and growth areas
- Technological advancements
- Regulatory changes and benefits

**Threats**
- Competitive pressures
- Market risks and challenges
- External factors and disruptions

### 2. Market Position Analysis
- Porter's Five Forces analysis
- Competitive landscape mapping
- Value chain analysis
- Customer segment analysis

### 3. Strategic Options Development
**Growth Strategies**
- Market penetration opportunities
- Market development possibilities
- Product development strategies
- Diversification options

**Competitive Strategies**
- Cost leadership approach
- Differentiation strategy
- Focus/niche strategy
- Blue ocean opportunities

### 4. Strategic Recommendations
**Primary Strategy**
- Chosen strategic direction
- Key success factors
- Resource requirements
- Timeline and milestones

**Implementation Plan**
- Phase 1: Foundation (0-6 months)
- Phase 2: Growth (6-18 months)
- Phase 3: Scale (18+ months)

**Risk Management**
- Key risks and mitigation strategies
- Contingency planning
- Success metrics and KPIs

### 5. Financial Projections
- Revenue projections (3-5 years)
- Investment requirements
- Break-even analysis
- ROI expectations

**Company/Project**: [COMPANY/PROJECT]
**Industry**: [INDUSTRY]
**Market Size**: [MARKET_SIZE]
**Current Position**: [CURRENT_POSITION]
**Strategic Objective**: [OBJECTIVE]
**Time Horizon**: [TIMEFRAME]
**Budget**: [BUDGET]`,
                category: 'business',
                tags: ['Strategy', 'Business Planning', 'SWOT Analysis', 'Competitive Strategy'],
                author: 'Strategy Team',
                createdAt: new Date(Date.now() - 432000000).toISOString(),
                updatedAt: new Date(Date.now() - 432000000).toISOString(),
                usageCount: 22,
                rating: 4.5,
                isFavorite: true,
                variables: ['INDUSTRY', 'COMPANY/PROJECT', 'MARKET_SIZE', 'CURRENT_POSITION', 'OBJECTIVE', 'TIMEFRAME', 'BUDGET']
            },
            {
                id: this.generateId(),
                title: 'Creative Campaign Concept Generator',
                description: 'Generate innovative creative concepts for marketing campaigns across multiple channels.',
                prompt: `You are a creative director with expertise in integrated marketing campaigns. Develop innovative creative concepts for [BRAND/PRODUCT] targeting [TARGET_AUDIENCE].

## Creative Brief Analysis
**Brand**: [BRAND/PRODUCT]
**Objective**: [CAMPAIGN_OBJECTIVE]
**Target Audience**: [TARGET_AUDIENCE]
**Key Message**: [KEY_MESSAGE]
**Budget**: [BUDGET_RANGE]
**Timeline**: [TIMELINE]
**Channels**: [CHANNELS]

## Creative Concept Development

### Concept 1: [CONCEPT_NAME_1]
**Big Idea**: Core creative concept and theme
**Visual Direction**: 
- Color palette and mood
- Typography and design style
- Photography/illustration approach
- Overall aesthetic and feel

**Messaging Strategy**:
- Primary headline/tagline
- Supporting messages
- Call-to-action variations
- Tone and voice guidelines

**Channel Adaptations**:
- Digital/Social media executions
- Traditional media applications
- Out-of-home possibilities
- Experiential/event integration

### Concept 2: [CONCEPT_NAME_2]
[Same structure as Concept 1]

### Concept 3: [CONCEPT_NAME_3]
[Same structure as Concept 1]

## Implementation Recommendations
**Recommended Concept**: [CHOSEN_CONCEPT]
**Rationale**: Why this concept best meets objectives

**Production Considerations**:
- Asset requirements and specifications
- Timeline and milestone planning
- Budget allocation by channel
- Resource and talent needs

**Measurement Strategy**:
- Key performance indicators
- Success metrics by channel
- Testing and optimization plan
- Reporting and analysis framework

## Creative Extensions
- Seasonal variations
- Product line extensions
- International adaptations
- Long-term campaign evolution

**Additional Requirements**:
- Brand guidelines compliance
- Legal and regulatory considerations
- Accessibility and inclusion factors
- Sustainability and social responsibility

Please provide detailed creative concepts that are innovative, on-brand, and strategically sound.`,
                category: 'creative',
                tags: ['Creative Strategy', 'Campaign Development', 'Brand Marketing', 'Advertising'],
                author: 'Creative Team',
                createdAt: new Date(Date.now() - 518400000).toISOString(),
                updatedAt: new Date(Date.now() - 518400000).toISOString(),
                usageCount: 19,
                rating: 4.4,
                isFavorite: false,
                variables: ['BRAND/PRODUCT', 'TARGET_AUDIENCE', 'CAMPAIGN_OBJECTIVE', 'KEY_MESSAGE', 'BUDGET_RANGE', 'TIMELINE', 'CHANNELS', 'CONCEPT_NAME_1', 'CONCEPT_NAME_2', 'CONCEPT_NAME_3', 'CHOSEN_CONCEPT']
            }
        ];
    }

    addPrompt(promptData) {
        const newPrompt = {
            id: this.generateId(),
            ...promptData,
            author: 'Current User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 0,
            rating: 0,
            isFavorite: false,
            variables: this.extractVariables(promptData.prompt)
        };

        this.prompts.unshift(newPrompt);
        this.savePrompts();
        this.updateCategoryCounts();
        this.renderCategories();
        this.renderPrompts();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'blue',
                icon: 'fas fa-code',
                title: 'New prompt added',
                description: `Added "${promptData.title}" to prompt library`,
                time: 'Just now'
            });
        }

        this.showNotification('Prompt added successfully!', 'success');
    }

    extractVariables(promptText) {
        const variableRegex = /\[([A-Z_]+(?:\/[A-Z_]+)*)\]/g;
        const variables = [];
        let match;
        
        while ((match = variableRegex.exec(promptText)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        
        return variables;
    }

    copyPrompt(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;

        // Copy to clipboard
        navigator.clipboard.writeText(prompt.prompt).then(() => {
            this.showNotification('Prompt copied to clipboard!', 'success');
            
            // Increment usage count
            prompt.usageCount += 1;
            prompt.updatedAt = new Date().toISOString();
            this.savePrompts();
            this.renderPrompts();
        }).catch(() => {
            this.showNotification('Failed to copy prompt', 'error');
        });
    }

    toggleFavorite(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (prompt) {
            prompt.isFavorite = !prompt.isFavorite;
            prompt.updatedAt = new Date().toISOString();
            this.savePrompts();
            this.renderPrompts();
            
            const action = prompt.isFavorite ? 'added to' : 'removed from';
            this.showNotification(`Prompt ${action} favorites`, 'success');
        }
    }

    editPrompt(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;

        // This would open an edit modal
        this.showNotification('Edit functionality would open here', 'info');
    }

    deletePrompt(promptId) {
        if (!confirm('Are you sure you want to delete this prompt?')) {
            return;
        }

        const promptIndex = this.prompts.findIndex(p => p.id === promptId);
        if (promptIndex > -1) {
            const deletedPrompt = this.prompts[promptIndex];
            this.prompts.splice(promptIndex, 1);
            this.savePrompts();
            this.updateCategoryCounts();
            this.renderCategories();
            this.renderPrompts();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'yellow',
                    icon: 'fas fa-trash',
                    title: 'Prompt deleted',
                    description: `Removed "${deletedPrompt.title}" from prompt library`,
                    time: 'Just now'
                });
            }

            this.showNotification('Prompt deleted successfully', 'success');
        }
    }

    ratePrompt(promptId, rating) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (prompt) {
            prompt.rating = rating;
            prompt.updatedAt = new Date().toISOString();
            this.savePrompts();
            this.renderPrompts();
            this.showNotification('Rating saved!', 'success');
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        const filterSelect = document.getElementById('promptFilter');
        if (filterSelect) {
            filterSelect.value = category;
        }
        this.renderPrompts();
    }

    renderCategories() {
        const categoriesContainer = document.getElementById('promptCategories');
        if (!categoriesContainer) return;

        const allCount = this.prompts.length;
        
        categoriesContainer.innerHTML = `
            <div class="prompt-category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentCategory === 'all' ? 'bg-blue-600' : 'bg-gray-700'}" 
                 data-category="all">
                <span class="text-sm">All Prompts</span>
                <span class="text-xs bg-gray-600 px-2 py-1 rounded-full">${allCount}</span>
            </div>
            <div class="prompt-category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentCategory === 'favorites' ? 'bg-blue-600' : 'bg-gray-700'}" 
                 data-category="favorites">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-heart text-red-400"></i>
                    <span class="text-sm">Favorites</span>
                </div>
                <span class="text-xs bg-gray-600 px-2 py-1 rounded-full">${this.prompts.filter(p => p.isFavorite).length}</span>
            </div>
            ${this.categories.map(category => `
                <div class="prompt-category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentCategory === category.id ? 'bg-blue-600' : 'bg-gray-700'}" 
                     data-category="${category.id}">
                    <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full bg-${category.color}-500"></div>
                        <span class="text-sm">${category.name}</span>
                    </div>
                    <span class="text-xs bg-gray-600 px-2 py-1 rounded-full">${category.count}</span>
                </div>
            `).join('')}
        `;
    }

    renderPrompts() {
        const promptsList = document.getElementById('promptsList');
        if (!promptsList) return;

        let filteredPrompts = this.prompts;

        // Apply category filter
        if (this.currentCategory === 'favorites') {
            filteredPrompts = filteredPrompts.filter(prompt => prompt.isFavorite);
        } else if (this.currentCategory !== 'all') {
            filteredPrompts = filteredPrompts.filter(prompt => prompt.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchTerm) {
            filteredPrompts = filteredPrompts.filter(prompt => 
                prompt.title.toLowerCase().includes(this.searchTerm) ||
                prompt.description.toLowerCase().includes(this.searchTerm) ||
                prompt.prompt.toLowerCase().includes(this.searchTerm) ||
                prompt.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        }

        // Sort prompts
        filteredPrompts.sort((a, b) => {
            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'usage':
                    return b.usageCount - a.usageCount;
                case 'rating':
                    return b.rating - a.rating;
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'updated':
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });

        if (filteredPrompts.length === 0) {
            promptsList.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-code text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No prompts found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        promptsList.innerHTML = filteredPrompts.map(prompt => `
            <div class="prompt-card" data-prompt-id="${prompt.id}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <h3 class="text-xl font-semibold">${prompt.title}</h3>
                            ${prompt.isFavorite ? '<i class="fas fa-heart text-red-400"></i>' : ''}
                        </div>
                        <p class="text-gray-400 text-sm mb-3">${prompt.description}</p>
                    </div>
                    <button class="copy-btn prompt-action" data-action="copy" title="Copy prompt">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>

                <!-- Prompt Preview -->
                <div class="bg-gray-900 rounded-lg p-4 mb-4 relative">
                    <div class="text-sm text-gray-300 line-clamp-4 font-mono">
                        ${this.truncatePrompt(prompt.prompt, 200)}
                    </div>
                    ${prompt.prompt.length > 200 ? `
                        <button class="text-blue-400 text-sm mt-2 hover:text-blue-300" onclick="promptsController.showFullPrompt('${prompt.id}')">
                            Show full prompt
                        </button>
                    ` : ''}
                </div>

                <!-- Variables -->
                ${prompt.variables.length > 0 ? `
                    <div class="mb-4">
                        <div class="text-sm font-medium mb-2">Variables:</div>
                        <div class="flex flex-wrap gap-2">
                            ${prompt.variables.map(variable => `
                                <span class="text-xs bg-blue-600 px-2 py-1 rounded-full text-white">[${variable}]</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Metadata -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <span class="category-tag bg-${this.getCategoryColor(prompt.category)}-500">
                            ${this.getCategoryName(prompt.category)}
                        </span>
                        <span class="text-sm text-gray-400">
                            <i class="fas fa-user mr-1"></i>${prompt.author}
                        </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-400">
                        <span><i class="fas fa-chart-bar mr-1"></i>${prompt.usageCount} uses</span>
                        ${prompt.rating > 0 ? `<span><i class="fas fa-star mr-1 text-yellow-400"></i>${prompt.rating.toFixed(1)}</span>` : ''}
                        <span>${this.formatRelativeDate(prompt.updatedAt)}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        ${prompt.tags.map(tag => `
                            <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">${tag}</span>
                        `).join('')}
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="prompt-action p-2 text-gray-400 hover:text-red-400 transition-colors" 
                                data-action="favorite" title="${prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                            <i class="fas fa-heart ${prompt.isFavorite ? 'text-red-400' : ''}"></i>
                        </button>
                        <button class="prompt-action p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                data-action="edit" title="Edit prompt">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="prompt-action p-2 text-gray-400 hover:text-red-400 transition-colors" 
                                data-action="delete" title="Delete prompt">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showFullPrompt(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);
        if (!prompt) return;

        // Create and show full prompt modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold">${prompt.title}</h2>
                        <div class="flex items-center space-x-2">
                            <button onclick="navigator.clipboard.writeText(\`${prompt.prompt.replace(/`/g, '\\`')}\`).then(() => promptsController.showNotification('Copied!', 'success'))" 
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                <i class="fas fa-copy mr-2"></i>Copy Prompt
                            </button>
                            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <p class="text-gray-400 mt-2">${prompt.description}</p>
                </div>
                <div class="p-6">
                    <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
                        ${prompt.prompt}
                    </div>
                    ${prompt.variables.length > 0 ? `
                        <div class="mt-4">
                            <h3 class="font-semibold mb-2">Variables to replace:</h3>
                            <div class="grid grid-cols-2 gap-2">
                                ${prompt.variables.map(variable => `
                                    <div class="text-sm">
                                        <span class="bg-blue-600 px-2 py-1 rounded text-white">[${variable}]</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    handlePromptAction(action, promptId) {
        switch (action) {
            case 'copy':
                this.copyPrompt(promptId);
                break;
            case 'favorite':
                this.toggleFavorite(promptId);
                break;
            case 'edit':
                this.editPrompt(promptId);
                break;
            case 'delete':
                this.deletePrompt(promptId);
                break;
        }
    }

    truncatePrompt(prompt, maxLength) {
        return prompt.length > maxLength 
            ? prompt.substring(0, maxLength) + '...'
            : prompt;
    }

    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.prompts.filter(prompt => prompt.category === category.id).length;
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

    showAddPromptModal() {
        // This would show a modal for adding new prompts
        this.showNotification('Add prompt functionality would open here', 'info');
    }

    savePrompts() {
        localStorage.setItem('aiPrompts', JSON.stringify(this.prompts));
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
            return date.toLocaleDateString();
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

    // Export prompts
    exportPrompts() {
        const dataStr = JSON.stringify(this.prompts, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Prompts exported successfully!', 'success');
    }

    // Get prompt statistics
    getPromptStats() {
        return {
            totalPrompts: this.prompts.length,
            favoritePrompts: this.prompts.filter(p => p.isFavorite).length,
            totalUsage: this.prompts.reduce((sum, prompt) => sum + prompt.usageCount, 0),
            averageRating: this.prompts.reduce((sum, prompt) => sum + prompt.rating, 0) / this.prompts.length,
            categoryCounts: this.categories.map(cat => ({
                name: cat.name,
                count: cat.count
            }))
        };
    }
}

// Initialize prompts controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.promptsController = new PromptsController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptsController;
}