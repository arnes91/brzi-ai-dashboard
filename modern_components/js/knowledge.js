// BRZI AI Dashboard - Knowledge Base Controller
// Handles knowledge repository, search, and categorization

class KnowledgeController {
    constructor() {
        this.articles = [];
        this.categories = [
            { id: 'ai-ml', name: 'AI & Machine Learning', color: 'blue', count: 0 },
            { id: 'automation', name: 'Automation', color: 'purple', count: 0 },
            { id: 'development', name: 'Development', color: 'green', count: 0 },
            { id: 'marketing', name: 'Marketing', color: 'yellow', count: 0 },
            { id: 'productivity', name: 'Productivity', color: 'red', count: 0 },
            { id: 'research', name: 'Research', color: 'indigo', count: 0 }
        ];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.sortBy = 'updated';
        this.init();
    }

    init() {
        this.loadArticles();
        this.setupEventListeners();
        this.renderCategories();
        this.renderArticles();
    }

    setupEventListeners() {
        // Search functionality
        const knowledgeSearch = document.getElementById('knowledgeSearch');
        if (knowledgeSearch) {
            knowledgeSearch.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderArticles();
            });
        }

        // Add article button
        const addKnowledgeBtn = document.getElementById('addKnowledgeBtn');
        if (addKnowledgeBtn) {
            addKnowledgeBtn.addEventListener('click', () => {
                this.showAddArticleModal();
            });
        }

        // Category filter clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('knowledge-category-filter')) {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            }
        });

        // Article actions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.article-action')) {
                const action = e.target.closest('.article-action').dataset.action;
                const articleId = e.target.closest('.knowledge-card').dataset.articleId;
                this.handleArticleAction(action, articleId);
            }
        });
    }

    loadArticles() {
        const storedArticles = localStorage.getItem('knowledgeArticles');
        if (storedArticles) {
            this.articles = JSON.parse(storedArticles);
        } else {
            // Initialize with sample articles
            this.articles = this.getSampleArticles();
            this.saveArticles();
        }
        this.updateCategoryCounts();
    }

    getSampleArticles() {
        return [
            {
                id: this.generateId(),
                title: 'Advanced AI Prompt Engineering Techniques',
                content: `# Advanced AI Prompt Engineering Techniques

## Introduction
Prompt engineering is the art and science of crafting effective instructions for AI models to generate desired outputs. This comprehensive guide covers advanced techniques for maximizing AI performance.

## Key Principles

### 1. Clarity and Specificity
- Use clear, unambiguous language
- Provide specific context and requirements
- Define the desired output format

### 2. Context Setting
- Establish the AI's role and expertise level
- Provide relevant background information
- Set appropriate tone and style guidelines

### 3. Iterative Refinement
- Start with basic prompts and refine based on results
- Test variations to find optimal phrasing
- Document successful patterns for reuse

## Advanced Techniques

### Chain-of-Thought Prompting
Encourage step-by-step reasoning by asking the AI to "think through" problems:
\`\`\`
"Let's work through this step by step:
1. First, identify the key components
2. Then, analyze their relationships
3. Finally, synthesize the solution"
\`\`\`

### Few-Shot Learning
Provide examples of desired input-output pairs:
\`\`\`
Example 1: Input -> Output
Example 2: Input -> Output
Now apply this pattern to: [Your Input]
\`\`\`

### Role-Based Prompting
Assign specific expertise roles to the AI:
\`\`\`
"As a senior data scientist with 10 years of experience in machine learning..."
\`\`\`

## Best Practices
- Keep prompts concise but comprehensive
- Use consistent formatting and structure
- Test prompts across different scenarios
- Maintain a prompt library for reuse
- Regular review and optimization

## Conclusion
Mastering prompt engineering requires practice and experimentation. These techniques provide a foundation for creating more effective AI interactions.`,
                category: 'ai-ml',
                tags: ['AI', 'Prompt Engineering', 'Machine Learning', 'Best Practices'],
                author: 'AI Research Team',
                createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                views: 245,
                likes: 18,
                status: 'published'
            },
            {
                id: this.generateId(),
                title: 'Workflow Automation Best Practices',
                content: `# Workflow Automation Best Practices

## Overview
Effective workflow automation can dramatically improve productivity and reduce errors. This guide outlines proven strategies for successful automation implementation.

## Planning Phase

### 1. Process Analysis
- Map current workflows in detail
- Identify bottlenecks and pain points
- Measure baseline performance metrics
- Document decision points and exceptions

### 2. Automation Opportunities
- Look for repetitive, rule-based tasks
- Identify high-volume processes
- Focus on error-prone manual steps
- Consider integration possibilities

## Implementation Strategies

### Start Small
- Begin with simple, low-risk processes
- Prove value before scaling up
- Learn from initial implementations
- Build team confidence and expertise

### Design for Flexibility
- Create modular, reusable components
- Plan for process changes and updates
- Include error handling and recovery
- Design clear monitoring and alerts

### User-Centric Approach
- Involve end users in design process
- Provide comprehensive training
- Create clear documentation
- Establish feedback mechanisms

## Common Pitfalls to Avoid
- Over-automating complex processes
- Ignoring exception handling
- Insufficient testing and validation
- Poor change management
- Lack of monitoring and maintenance

## Measuring Success
- Track time savings and efficiency gains
- Monitor error rates and quality improvements
- Measure user satisfaction and adoption
- Calculate ROI and business impact

## Tools and Technologies
- Workflow management platforms
- API integration tools
- Robotic Process Automation (RPA)
- Business Process Management (BPM)
- Custom scripting and development

## Conclusion
Successful workflow automation requires careful planning, gradual implementation, and continuous optimization. Focus on user needs and business value to achieve lasting success.`,
                category: 'automation',
                tags: ['Automation', 'Workflow', 'Process Improvement', 'Best Practices'],
                author: 'Operations Team',
                createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                views: 189,
                likes: 12,
                status: 'published'
            },
            {
                id: this.generateId(),
                title: 'Modern Web Development Stack Guide',
                content: `# Modern Web Development Stack Guide

## Introduction
The web development landscape evolves rapidly. This guide covers current best practices and recommended technologies for building modern web applications.

## Frontend Technologies

### React Ecosystem
- **React 18+**: Latest features including concurrent rendering
- **Next.js**: Full-stack React framework with SSR/SSG
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **Context API**: Built-in React state sharing

## Backend Technologies

### Node.js Stack
- **Express.js**: Minimal web framework
- **Fastify**: High-performance alternative
- **Prisma**: Modern database toolkit
- **GraphQL**: Flexible API query language

### Database Options
- **PostgreSQL**: Robust relational database
- **MongoDB**: Document-based NoSQL
- **Redis**: In-memory caching
- **Supabase**: Firebase alternative

## Development Tools

### Build Tools
- **Vite**: Fast build tool and dev server
- **Webpack**: Mature bundling solution
- **ESBuild**: Extremely fast bundler

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **Jest**: Testing framework

## Deployment and DevOps

### Hosting Platforms
- **Vercel**: Optimized for frontend frameworks
- **Netlify**: JAMstack deployment platform
- **Railway**: Full-stack application hosting
- **AWS/GCP/Azure**: Cloud infrastructure

### CI/CD
- **GitHub Actions**: Integrated CI/CD
- **GitLab CI**: Comprehensive DevOps platform
- **CircleCI**: Flexible automation

## Best Practices

### Performance
- Code splitting and lazy loading
- Image optimization and CDN usage
- Caching strategies
- Bundle size monitoring

### Security
- Input validation and sanitization
- Authentication and authorization
- HTTPS everywhere
- Regular dependency updates

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## Conclusion
Choose technologies based on project requirements, team expertise, and long-term maintainability. Stay updated with the rapidly evolving ecosystem while focusing on fundamentals.`,
                category: 'development',
                tags: ['Web Development', 'React', 'Node.js', 'Full Stack'],
                author: 'Development Team',
                createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                updatedAt: new Date(Date.now() - 259200000).toISOString(),
                views: 312,
                likes: 25,
                status: 'published'
            },
            {
                id: this.generateId(),
                title: 'Content Marketing Strategy Framework',
                content: `# Content Marketing Strategy Framework

## Strategic Foundation

### Define Your Purpose
- Establish clear business objectives
- Identify target audience personas
- Define unique value proposition
- Set measurable goals and KPIs

### Content Pillars
Create 3-5 core themes that align with:
- Business expertise and authority
- Audience interests and pain points
- Industry trends and opportunities
- Brand values and messaging

## Content Planning

### Editorial Calendar
- Plan content themes by quarter/month
- Balance evergreen and timely content
- Coordinate with business events and launches
- Include content promotion schedules

### Content Types and Formats
- **Educational**: How-to guides, tutorials, explainers
- **Inspirational**: Success stories, case studies, insights
- **Entertaining**: Behind-the-scenes, industry humor, trends
- **Promotional**: Product features, announcements, offers

## Content Creation Process

### Research and Ideation
- Monitor industry conversations and trends
- Analyze competitor content strategies
- Survey audience for content preferences
- Use keyword research for SEO optimization

### Production Workflow
1. Content brief and outline creation
2. Writing/creation and internal review
3. Editing and fact-checking
4. Design and multimedia integration
5. SEO optimization and metadata
6. Final approval and scheduling

## Distribution Strategy

### Owned Channels
- Company blog and website
- Email newsletters
- Podcasts and video series
- Resource libraries and downloads

### Social Media
- Platform-specific content adaptation
- Community engagement and interaction
- Influencer and partnership collaborations
- User-generated content campaigns

### Paid Promotion
- Social media advertising
- Content syndication platforms
- Search engine marketing
- Native advertising placements

## Performance Measurement

### Key Metrics
- **Awareness**: Reach, impressions, brand mentions
- **Engagement**: Likes, shares, comments, time on page
- **Lead Generation**: Downloads, subscriptions, inquiries
- **Conversion**: Sales attribution, customer acquisition

### Analytics Tools
- Google Analytics for website performance
- Social media platform analytics
- Email marketing metrics
- CRM integration for lead tracking

## Optimization and Iteration

### Regular Review Process
- Monthly performance analysis
- Quarterly strategy assessment
- Annual comprehensive review
- Continuous A/B testing

### Content Repurposing
- Transform long-form content into multiple formats
- Update and refresh evergreen content
- Create content series from popular topics
- Develop templates for consistent quality

## Conclusion
Successful content marketing requires strategic planning, consistent execution, and continuous optimization. Focus on providing genuine value to your audience while supporting business objectives.`,
                category: 'marketing',
                tags: ['Content Marketing', 'Strategy', 'Digital Marketing', 'Brand Building'],
                author: 'Marketing Team',
                createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                updatedAt: new Date(Date.now() - 345600000).toISOString(),
                views: 156,
                likes: 9,
                status: 'published'
            },
            {
                id: this.generateId(),
                title: 'Productivity Systems and Time Management',
                content: `# Productivity Systems and Time Management

## Foundational Principles

### Time Awareness
- Track how you currently spend time
- Identify peak energy and focus periods
- Recognize time wasters and distractions
- Understand your natural rhythms

### Priority Management
- Distinguish between urgent and important
- Use the Eisenhower Matrix for decision-making
- Apply the 80/20 rule (Pareto Principle)
- Regular priority review and adjustment

## Popular Productivity Systems

### Getting Things Done (GTD)
**Core Components:**
- Capture everything in trusted systems
- Clarify what items mean and require
- Organize by context and priority
- Reflect through regular reviews
- Engage with confidence in choices

**Implementation:**
- Inbox for all inputs
- Project and action lists
- Context-based organization
- Weekly and daily reviews

### Time Blocking
- Schedule specific time slots for different activities
- Include buffer time for unexpected tasks
- Batch similar activities together
- Protect deep work periods

### Pomodoro Technique
- Work in focused 25-minute intervals
- Take 5-minute breaks between sessions
- Longer break after 4 pomodoros
- Track completed sessions

## Digital Tools and Systems

### Task Management
- **Todoist**: Natural language processing
- **Notion**: All-in-one workspace
- **Asana**: Team collaboration features
- **Things 3**: Elegant design and usability

### Time Tracking
- **RescueTime**: Automatic time tracking
- **Toggl**: Manual time logging
- **Clockify**: Team time tracking
- **Forest**: Focus and distraction blocking

### Note-Taking
- **Obsidian**: Linked knowledge management
- **Roam Research**: Bi-directional linking
- **Logseq**: Local-first knowledge base
- **Notion**: Database-driven notes

## Habit Formation

### Building Productive Habits
- Start small and be consistent
- Stack new habits onto existing ones
- Create environmental cues
- Track progress visually

### Breaking Bad Habits
- Identify triggers and patterns
- Replace with positive alternatives
- Modify environment to reduce temptation
- Use accountability systems

## Energy Management

### Physical Energy
- Maintain regular sleep schedule
- Exercise for mental clarity
- Eat for sustained energy
- Take regular breaks

### Mental Energy
- Minimize decision fatigue
- Batch similar cognitive tasks
- Practice mindfulness and meditation
- Limit multitasking

## Advanced Techniques

### Deep Work Practices
- Eliminate distractions completely
- Set clear objectives for sessions
- Use ritual to enter deep work mode
- Measure and improve focus duration

### Automation and Delegation
- Automate repetitive tasks
- Delegate when possible
- Create templates and checklists
- Use technology to reduce manual work

## Common Pitfalls

### Over-Optimization
- Spending more time on systems than work
- Constantly switching between methods
- Perfectionism in organization
- Analysis paralysis

### Unrealistic Expectations
- Overestimating available time
- Underestimating task complexity
- Ignoring energy fluctuations
- Neglecting rest and recovery

## Conclusion
Effective productivity systems are personal and evolve over time. Experiment with different approaches, measure results, and adapt based on what works for your specific situation and goals.`,
                category: 'productivity',
                tags: ['Productivity', 'Time Management', 'GTD', 'Habits'],
                author: 'Productivity Team',
                createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
                updatedAt: new Date(Date.now() - 432000000).toISOString(),
                views: 203,
                likes: 15,
                status: 'published'
            }
        ];
    }

    addArticle(articleData) {
        const newArticle = {
            id: this.generateId(),
            ...articleData,
            author: 'Current User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            likes: 0,
            status: 'published'
        };

        this.articles.unshift(newArticle);
        this.saveArticles();
        this.updateCategoryCounts();
        this.renderCategories();
        this.renderArticles();

        // Add activity
        if (window.dashboardController) {
            window.dashboardController.addActivity({
                type: 'green',
                icon: 'fas fa-book',
                title: 'New article added',
                description: `Added "${articleData.title}" to knowledge base`,
                time: 'Just now'
            });
        }

        this.showNotification('Article added successfully!', 'success');
    }

    editArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        // This would open an edit modal or navigate to edit page
        // For now, we'll show a notification
        this.showNotification('Edit functionality would open here', 'info');
    }

    deleteArticle(articleId) {
        if (!confirm('Are you sure you want to delete this article?')) {
            return;
        }

        const articleIndex = this.articles.findIndex(a => a.id === articleId);
        if (articleIndex > -1) {
            const deletedArticle = this.articles[articleIndex];
            this.articles.splice(articleIndex, 1);
            this.saveArticles();
            this.updateCategoryCounts();
            this.renderCategories();
            this.renderArticles();

            // Add activity
            if (window.dashboardController) {
                window.dashboardController.addActivity({
                    type: 'yellow',
                    icon: 'fas fa-trash',
                    title: 'Article deleted',
                    description: `Removed "${deletedArticle.title}" from knowledge base`,
                    time: 'Just now'
                });
            }

            this.showNotification('Article deleted successfully', 'success');
        }
    }

    likeArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            article.likes += 1;
            article.updatedAt = new Date().toISOString();
            this.saveArticles();
            this.renderArticles();
        }
    }

    viewArticle(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (article) {
            article.views += 1;
            this.saveArticles();
            
            // Show article in modal or navigate to full view
            this.showArticleModal(article);
        }
    }

    showArticleModal(article) {
        // Create and show article modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-gray-800 rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold">${article.title}</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-white">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                        <span>By ${article.author}</span>
                        <span>${this.formatDate(article.createdAt)}</span>
                        <span><i class="fas fa-eye mr-1"></i>${article.views} views</span>
                        <span><i class="fas fa-heart mr-1"></i>${article.likes} likes</span>
                    </div>
                </div>
                <div class="p-6">
                    <div class="prose prose-invert max-w-none">
                        ${this.renderMarkdown(article.content)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    renderMarkdown(content) {
        // Simple markdown rendering (in a real app, you'd use a proper markdown parser)
        return content
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code class="bg-gray-700 px-2 py-1 rounded">$1</code>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br>');
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.renderArticles();
        
        // Update category filter UI
        document.querySelectorAll('.knowledge-category-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600');
            btn.classList.add('bg-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-blue-600');
            activeBtn.classList.remove('bg-gray-700');
        }
    }

    renderCategories() {
        const categoriesContainer = document.getElementById('knowledgeCategories');
        if (!categoriesContainer) return;

        const allCount = this.articles.filter(a => a.status === 'published').length;
        
        categoriesContainer.innerHTML = `
            <div class="knowledge-category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentCategory === 'all' ? 'bg-blue-600' : 'bg-gray-700'}" 
                 data-category="all">
                <span class="text-sm">All Articles</span>
                <span class="text-xs bg-gray-600 px-2 py-1 rounded-full">${allCount}</span>
            </div>
            ${this.categories.map(category => `
                <div class="knowledge-category-filter flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${this.currentCategory === category.id ? 'bg-blue-600' : 'bg-gray-700'}" 
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

    renderArticles() {
        const articlesContainer = document.getElementById('knowledgeArticlesList');
        if (!articlesContainer) return;

        let filteredArticles = this.articles.filter(article => article.status === 'published');

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filteredArticles = filteredArticles.filter(article => article.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchTerm) {
            filteredArticles = filteredArticles.filter(article => 
                article.title.toLowerCase().includes(this.searchTerm) ||
                article.content.toLowerCase().includes(this.searchTerm) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        }

        // Sort articles
        filteredArticles.sort((a, b) => {
            switch (this.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'views':
                    return b.views - a.views;
                case 'likes':
                    return b.likes - a.likes;
                case 'created':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'updated':
                default:
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
        });

        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-book text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-400 mb-2">No articles found</h3>
                    <p class="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        articlesContainer.innerHTML = filteredArticles.map(article => `
            <div class="knowledge-card" data-article-id="${article.id}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-400 transition-colors" 
                            onclick="knowledgeController.viewArticle('${article.id}')">${article.title}</h3>
                        <p class="text-gray-400 text-sm mb-3 line-clamp-3">${this.getArticleExcerpt(article.content)}</p>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <button class="article-action p-2 text-gray-400 hover:text-blue-400 transition-colors" 
                                data-action="view" title="View article">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="article-action p-2 text-gray-400 hover:text-green-400 transition-colors" 
                                data-action="like" title="Like article">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="article-action p-2 text-gray-400 hover:text-yellow-400 transition-colors" 
                                data-action="edit" title="Edit article">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="article-action p-2 text-gray-400 hover:text-red-400 transition-colors" 
                                data-action="delete" title="Delete article">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="category-tag bg-${this.getCategoryColor(article.category)}-500">
                            ${this.getCategoryName(article.category)}
                        </span>
                        <span class="text-sm text-gray-400">
                            <i class="fas fa-user mr-1"></i>${article.author}
                        </span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-400">
                        <span><i class="fas fa-eye mr-1"></i>${article.views}</span>
                        <span><i class="fas fa-heart mr-1"></i>${article.likes}</span>
                        <span>${this.formatRelativeDate(article.updatedAt)}</span>
                    </div>
                </div>
                
                ${article.tags.length > 0 ? `
                    <div class="mt-3 flex flex-wrap gap-2">
                        ${article.tags.map(tag => `
                            <span class="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">${tag}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    handleArticleAction(action, articleId) {
        switch (action) {
            case 'view':
                this.viewArticle(articleId);
                break;
            case 'like':
                this.likeArticle(articleId);
                break;
            case 'edit':
                this.editArticle(articleId);
                break;
            case 'delete':
                this.deleteArticle(articleId);
                break;
        }
    }

    getArticleExcerpt(content, maxLength = 200) {
        // Remove markdown formatting and get plain text excerpt
        const plainText = content
            .replace(/#{1,6}\s+/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]*)`/g, '$1')
            .replace(/\n/g, ' ')
            .trim();
        
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    }

    updateCategoryCounts() {
        this.categories.forEach(category => {
            category.count = this.articles.filter(article => 
                article.category === category.id && article.status === 'published'
            ).length;
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

    showAddArticleModal() {
        // This would show a modal for adding new articles
        // For now, we'll show a notification
        this.showNotification('Add article functionality would open here', 'info');
    }

    saveArticles() {
        localStorage.setItem('knowledgeArticles', JSON.stringify(this.articles));
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

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    showNotification(message, type = 'info') {
        if (window.dashboardController) {
            window.dashboardController.showNotification(message, type);
        }
    }

    // Export knowledge base
    exportKnowledge() {
        const dataStr = JSON.stringify(this.articles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `knowledge-base-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('Knowledge base exported successfully!', 'success');
    }

    // Get knowledge base statistics
    getKnowledgeStats() {
        return {
            totalArticles: this.articles.length,
            publishedArticles: this.articles.filter(a => a.status === 'published').length,
            totalViews: this.articles.reduce((sum, article) => sum + article.views, 0),
            totalLikes: this.articles.reduce((sum, article) => sum + article.likes, 0),
            categoryCounts: this.categories.map(cat => ({
                name: cat.name,
                count: cat.count
            }))
        };
    }
}

// Initialize knowledge controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.knowledgeController = new KnowledgeController();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeController;
}