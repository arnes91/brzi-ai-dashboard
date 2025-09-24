# BRZI AI Dashboard - Complete Project Management Platform

A comprehensive, interactive AI-powered dashboard platform for managing projects, ideas, knowledge base, prompts, agents, automations, and analytics. Built with Streamlit and designed for maximum productivity and ease of use.

## 🚀 Features

### Core Modules

- **🏠 Dashboard Home** - Central hub with overview metrics and quick actions
- **💡 Ideas Management** - Brainstorm, organize, and track creative concepts
- **🚀 Project Tracking** - Comprehensive project management with status tracking
- **📚 Knowledge Base** - Semantic search and document management system (FAISS + sentence-transformers)
- **📝 Prompt Library** - Organize and manage AI prompts with categories and tags
- **🤖 AI Agents** - Agent orchestration and automation blueprints
- **⚙️ Automations** - Workflow automation and system maintenance
- **📊 Analytics** - Comprehensive metrics and performance tracking
- **⚙️ Settings** - Configuration management and system preferences

### Advanced Features

- **Semantic Search** - AI-powered knowledge base search using sentence transformers (all-MiniLM-L6-v2)
- **Agent Blueprints** - Sequential, parallel, and loop-based automation patterns
- **Real-time Analytics** - Interactive charts and performance metrics with Plotly
- **Multi-language Support** - English, Bosnian, German localization
- **Export/Import** - Comprehensive data management and backup systems
- **API Integration** - Support for OpenAI, Anthropic, Google, ElevenLabs APIs
- **Responsive Design** - Modern UI with custom CSS and interactive components
- **Local-First** - Privacy-friendly, no cloud dependencies required

## 📋 Quick Start

### Prerequisites

- Python 3.10+ (3.11 recommended)
- pip package manager
- 4GB+ RAM recommended
- 2GB+ free disk space

### Installation & Setup

```bash
# 1) Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2) Install dependencies
pip install -r requirements.txt

# 3) Run the dashboard
cd app
python -m streamlit run app.py --server.port 8501 --server.address 0.0.0.0

# 4) Build semantic search index (optional but recommended)
# In the app: Knowledge Base → 'Build / refresh index'
```

The dashboard will be available at `http://localhost:8501`

### First-Time Setup

1. **Configure Profile** - Go to Settings → Profile to set your name and preferences
2. **Add API Keys** - Navigate to Settings → API Keys to configure AI service integrations
3. **Import Knowledge** - Place documents in `data/knowledge/` and build the search index
4. **Explore Features** - Visit each module to familiarize yourself with the interface

## 📁 Project Structure

```
brzi-ai-dashboard-final/
├── app/                    # Streamlit frontend (multi-page)
│   ├── app.py             # Main dashboard home
│   └── pages/             # Individual module pages
│       ├── 02_Ideas.py
│       ├── 03_Projects.py
│       ├── 04_Knowledge_Base.py
│       ├── 05_Prompt_Library.py
│       ├── 06_Agents.py
│       ├── 07_Automations.py
│       ├── 08_Analytics.py
│       └── 09_Settings.py
├── data/                   # Data storage
│   ├── ideas.json         # Ideas and brainstorming data
│   ├── projects.yaml      # Project management data
│   ├── prompts.yaml       # Prompt library
│   ├── agents.json        # AI agent configurations
│   ├── metrics.csv        # Analytics and metrics
│   ├── automation_log.json # Automation execution logs
│   └── knowledge/         # Knowledge base documents
├── scripts/               # Utility scripts
│   ├── build_vector_index.py
│   ├── backup.py
│   ├── conflict_scanner.py
│   └── blueprints.py
├── configs/               # Configuration files
│   └── starter_config.yaml
├── i18n/                  # Internationalization (EN/BS/DE)
├── workflows/             # Automation workflows
├── templates/             # Document templates
├── reports/               # Auto-generated reports
└── requirements.txt       # Python dependencies
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# AI Service API Keys
OPENAI_API_KEY=your-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
GOOGLE_API_KEY=your-google-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here

# Dashboard Configuration
DASHBOARD_DEBUG=false
DASHBOARD_THEME=light
DASHBOARD_LANGUAGE=EN
```

### Configuration Files

- `configs/starter_config.yaml` - Main configuration file
- `data/prompts.yaml` - Prompt library data
- `data/projects.yaml` - Project management data
- `data/ideas.json` - Ideas and brainstorming data

## 📚 Module Overview

### 🏠 Dashboard Home (`app.py`)

Central hub providing:
- Overview metrics and KPIs
- Quick action buttons for common tasks
- Recent activity feed
- System status indicators
- Navigation to all modules

### 💡 Ideas Management (`pages/02_Ideas.py`)

Enhanced features:
- Idea creation with rich metadata (categories, tags, priority)
- Advanced search and filtering capabilities
- Idea evaluation and scoring system
- Export to projects functionality
- Collaboration and sharing tools
- Visual idea mapping and connections

### 🚀 Project Tracking (`pages/03_Projects.py`)

Comprehensive capabilities:
- Full project lifecycle management
- Task and milestone tracking with dependencies
- Progress visualization with Gantt charts
- Resource allocation and team management
- Timeline and deadline management
- Integration with ideas and knowledge base

### 📚 Knowledge Base (`pages/04_Knowledge_Base.py`)

Advanced functionality:
- Document upload and automatic indexing
- Semantic search with AI embeddings (FAISS + sentence-transformers)
- Category and tag organization
- Version control and document history
- Integration with other modules
- Conflict detection and resolution

### 📝 Prompt Library (`pages/05_Prompt_Library.py`)

Professional tools:
- Prompt organization by categories and tags
- Usage tracking and analytics
- Template management and versioning
- Copy and share functionality
- Integration with AI agents
- Performance metrics and optimization

### 🤖 AI Agents (`pages/06_Agents.py`)

Sophisticated features:
- Agent creation and configuration
- Blueprint design (sequential, parallel, loop patterns)
- Real-time execution monitoring
- Performance analytics and optimization
- Integration with external APIs
- Agent collaboration and orchestration

### ⚙️ Automations (`pages/07_Automations.py`)

Powerful capabilities:
- Workflow automation with visual designer
- Scheduled task management
- System maintenance tools
- Backup and cleanup operations
- Execution logging and monitoring
- Error handling and recovery

### 📊 Analytics (`pages/08_Analytics.py`)

Comprehensive insights:
- Performance metrics and KPIs
- Interactive charts and visualizations (Plotly)
- Trend analysis and forecasting
- Custom metric creation
- Export and reporting tools
- Real-time dashboard updates

### ⚙️ Settings (`pages/09_Settings.py`)

Complete configuration:
- Profile and preferences management
- API key management with security
- Theme and appearance customization
- Language and localization settings
- Security and privacy controls
- System information and diagnostics

## 🔌 API Integration

### Supported Services

- **OpenAI** - GPT models for text generation and analysis
- **Anthropic** - Claude models for advanced reasoning
- **Google** - Gemini models and Google services
- **ElevenLabs** - Text-to-speech and voice synthesis

### Configuration Steps

1. Obtain API keys from respective providers
2. Add keys to Settings → API Keys or environment variables
3. Test connections using built-in validation tools
4. Configure usage limits and preferences

## 🔄 Automation & Workflows

### Blueprint Types

1. **Sequential** - Execute tasks one after another in order
2. **Parallel** - Run multiple tasks simultaneously for efficiency
3. **Loop** - Repeat tasks until specific conditions are met

### Creating Custom Workflows

1. Navigate to AI Agents → Blueprints
2. Choose appropriate blueprint type
3. Define steps and parameters
4. Test and validate execution
5. Schedule or trigger manually

## 💾 Data Management

### Import Your Archives

The dashboard has already processed your uploaded archives and extracted samples for immediate testing. To add more documents:

1. Place documents (PDF/MD/TXT/CSV/JSON/YAML) into `data/knowledge/`
2. Go to Knowledge Base → Build/refresh index
3. Documents will be automatically indexed for semantic search

### Backup and Export

- **Manual Backup** - Automations → Quick Actions → Backup Data
- **Scheduled Backup** - Configure in Automations → Scheduler
- **Export Options** - JSON, CSV, YAML formats available
- **Import Tools** - Restore from backup files

### Security Features

- Local data storage (no cloud dependencies required)
- Encrypted API key storage
- Access control and permissions
- Audit logging and monitoring
- Privacy-friendly design

## 🎨 Customization

### Themes and Appearance

1. Go to Settings → Appearance
2. Choose from available themes (light/dark/auto)
3. Customize colors and layout preferences
4. Save and apply changes

### Adding Custom Modules

1. Create new Python file in `pages/` directory
2. Follow existing module structure and patterns
3. Add navigation links in main app
4. Update configuration files as needed

## 🔧 Troubleshooting

### Common Issues

**Dashboard won't start:**
- Check Python version (3.10+ required, 3.11 recommended)
- Verify all dependencies: `pip install -r requirements.txt`
- Check port availability (default: 8501)

**API Integration errors:**
- Verify API keys are correctly configured
- Check internet connection for external services
- Validate API key permissions and quotas

**Performance issues:**
- Increase cache size in Settings → Features
- Reduce concurrent operations limit
- Clear temporary files via Automations

**Search not working:**
- Build the semantic index: Knowledge Base → Build/refresh index
- Check document formats are supported
- Verify FAISS installation

### Debug Mode

Enable debug mode in Settings → Features → Debug Mode for detailed logging and diagnostics.

## 📊 Pre-loaded Data

This dashboard comes with processed data from your uploaded archives:

- **Source Catalog** - See `reports/source_catalog.csv` for document inventory
- **Conflict Report** - Check `reports/conflicts_report.md` for potential issues
- **Sample Data** - Ideas, projects, and prompts ready for testing
- **Knowledge Base** - Extracted documents ready for indexing

## 🚀 Advanced Features

### Semantic Search Engine

- Powered by `sentence-transformers` (all-MiniLM-L6-v2 model)
- FAISS vector database for fast similarity search
- Automatic document chunking and embedding
- Context-aware search results

### Agent Orchestration

- Blueprint-based automation patterns
- Support for complex workflows
- Integration with external APIs
- Performance monitoring and optimization

### Analytics Engine

- Real-time metrics collection
- Interactive visualizations with Plotly
- Custom KPI tracking
- Trend analysis and forecasting

## 🤝 Contributing

### Development Guidelines

- Follow PEP 8 Python style guidelines
- Add comprehensive docstrings
- Include type hints where appropriate
- Write unit tests for new features
- Update documentation for changes

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Streamlit](https://streamlit.io/) for the web interface
- AI integrations powered by OpenAI, Anthropic, Google APIs
- Semantic search using [sentence-transformers](https://www.sbert.net/) and [FAISS](https://faiss.ai/)
- Visualizations created with [Plotly](https://plotly.com/)
- Icons and UI components from various open-source projects

---

**BRZI AI Dashboard** - Your complete AI-powered productivity and project management solution.

*Empowering creativity, productivity, and intelligent automation.*

**Last updated:** September 2025
