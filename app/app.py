import streamlit as st
from pathlib import Path
import yaml, json, pandas as pd
import os
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import numpy as np

# Configure page
st.set_page_config(
    page_title="BRZI AI Dashboard", 
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for enhanced styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        margin-bottom: 2rem;
        color: white;
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #667eea;
    }
    .feature-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border: 1px solid #e9ecef;
    }
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .status-active { background: #d4edda; color: #155724; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-completed { background: #cce5ff; color: #004085; }
</style>
""", unsafe_allow_html=True)

# Base paths
BASE = Path(__file__).resolve().parent.parent
DATA = BASE / "data"
DATA.mkdir(parents=True, exist_ok=True) # Ensure data directory exists
CONFIGS = BASE / "configs"
REPORTS = BASE / "reports"
I18N = BASE / "i18n"
INDEXES = DATA / "indexes"
KB = DATA / "knowledge"
WORKFLOWS = BASE / "workflows"
TEMPLATES = BASE / "templates"
ASSETS = BASE / "assets"

# Load i18n
def load_lang(code):
    p = I18N / f"{code}.yml"
    if p.exists():
        return yaml.safe_load(open(p, "r", encoding="utf-8"))
    return {}

if "lang" not in st.session_state:
    st.session_state["lang"] = "EN"

t = load_lang(st.session_state["lang"])

def T(key, fallback):
    parts = key.split(".")
    cur = t
    for p in parts:
        if isinstance(cur, dict) and p in cur: 
            cur = cur[p]
        else: 
            return fallback
    return cur

# Header
st.markdown("""
<div class="main-header">
    <h1>🧭 BRZI AI — Universal Dashboard</h1>
    <p>Comprehensive AI Project & Tools Management Platform</p>
    <p><em>Modular • Multilingual • Balkan‑localized • Privacy‑first</em></p>
</div>
""", unsafe_allow_html=True)

# Load data files
ideas_fp = DATA / "ideas.json"
projects_fp = DATA / "projects.yaml"
prompts_fp = DATA / "prompts.yaml"
metrics_fp = DATA / "metrics.csv"

ideas = json.load(open(ideas_fp, "r", encoding="utf-8")) if ideas_fp.exists() else []
projects = yaml.safe_load(open(projects_fp, "r", encoding="utf-8")) if projects_fp.exists() else {"projects":[]}
prompts = yaml.safe_load(open(prompts_fp, "r", encoding="utf-8")) if prompts_fp.exists() else {"categories":{}}
metrics_df = pd.DataFrame()
if metrics_fp.exists():
    try:
        metrics_df = pd.read_csv(metrics_fp)
    except pd.errors.EmptyDataError:
        st.warning("Metrics CSV is empty. Initializing with empty data.")
    except Exception as e:
        st.error(f"Error loading metrics CSV: {e}. Initializing with empty data.")


# Dashboard metrics
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    st.metric(
        label="💡 Ideas", 
        value=len(ideas),
        delta=f"+{len([i for i in ideas if i.get('created_date', '') > (datetime.now() - timedelta(days=7)).isoformat()[:10]])} this week"
    )

with col2:
    active_projects = len([p for p in projects.get("projects", []) if p.get("status") == "active"])
    st.metric(
        label="🚀 Active Projects", 
        value=active_projects,
        delta=f"{len(projects.get('projects', []))} total"
    )

with col3:
    prompt_count = sum(len(v) for v in prompts.get("categories", {}).values())
    st.metric(
        label="📝 Prompt Packs", 
        value=prompt_count,
        delta=f"{len(prompts.get('categories', {}))} categories"
    )

with col4:
    kb_docs = sum(1 for _ in KB.glob("**/*") if _.is_file())
    st.metric(
        label="📚 Knowledge Base", 
        value=kb_docs,
        delta="docs indexed"
    )

with col5:
    workflow_count = sum(1 for _ in WORKFLOWS.glob("**/*") if _.is_file() and _.suffix == '.md')
    st.metric(
        label="⚙️ Workflows", 
        value=workflow_count,
        delta="automation ready"
    )

st.divider()

# Quick insights section
col_left, col_right = st.columns([2, 1])

with col_left:
    st.subheader("📊 Quick Insights")
    
    # Create sample activity data if metrics don't exist
    if metrics_df.empty:
        dates = pd.date_range(start=datetime.now() - timedelta(days=30), end=datetime.now(), freq='D')
        activity_data = pd.DataFrame({
            'date': dates,
            'ideas_created': np.random.poisson(2, len(dates)),
            'tasks_completed': np.random.poisson(3, len(dates)),
            'kb_searches': np.random.poisson(5, len(dates))
        })
    else:
        activity_data = metrics_df
    
    # Activity chart
    if not activity_data.empty and len(activity_data) > 0: # Ensure data is not empty before plotting
        fig = px.line(
            activity_data, 
            x='date', 
            y=['ideas_created', 'tasks_completed', 'kb_searches'],
            title="Daily Activity Overview",
            labels={'value': 'Count', 'date': 'Date'}
        )
        fig.update_layout(height=300)
        st.plotly_chart(fig, use_container_width=True)

with col_right:
    st.subheader("🎯 Quick Actions")
    
    if st.button("💡 Add New Idea", use_container_width=True):
        st.switch_page("pages/02_Ideas.py")
    
    if st.button("🚀 Create Project", use_container_width=True):
        st.switch_page("pages/03_Projects.py")
    
    if st.button("🔍 Search Knowledge", use_container_width=True):
        st.switch_page("pages/04_Knowledge_Base.py")
    
    if st.button("🤖 Run Automation", use_container_width=True):
        st.switch_page("pages/07_Automations.py")

st.divider()

# Feature overview
st.subheader("🎛️ Platform Features")

features = [
    {
        "icon": "💡",
        "title": "Ideas Management",
        "description": "Capture, rank, and prioritize ideas using Impact × Effort matrix",
        "status": "active"
    },
    {
        "icon": "🚀", 
        "title": "Project Tracking",
        "description": "Manage projects, milestones, tasks, and team collaboration",
        "status": "active"
    },
    {
        "icon": "📚",
        "title": "Knowledge Base",
        "description": "AI-powered semantic search with FAISS vector indexing",
        "status": "active"
    },
    {
        "icon": "📝",
        "title": "Prompt Library",
        "description": "Organized collection of reusable AI prompts and templates",
        "status": "active"
    },
    {
        "icon": "🤖",
        "title": "AI Agents",
        "description": "Orchestration blueprints for sequential, parallel, and loop workflows",
        "status": "active"
    },
    {
        "icon": "⚙️",
        "title": "Automations",
        "description": "One-click scripts for data ingestion, backups, and exports",
        "status": "active"
    },
    {
        "icon": "📊",
        "title": "Analytics",
        "description": "Comprehensive metrics, charts, and performance insights",
        "status": "active"
    },
    {
        "icon": "🌐",
        "title": "Multi-language",
        "description": "Full internationalization support (EN/BS/DE)",
        "status": "active"
    }
]

cols = st.columns(4)
for i, feature in enumerate(features):
    with cols[i % 4]:
        status_class = f"status-{feature['status']}"
        st.markdown(f"""
        <div class="feature-card">
            <h4>{feature['icon']} {feature['title']}</h4>
            <p>{feature['description']}</p>
            <span class="status-badge {status_class}">{feature['status'].upper()}</span>
        </div>
        """, unsafe_allow_html=True)

st.divider()

# Getting started section
st.subheader("🚀 Getting Started")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    ### First Steps
    1. **Build Knowledge Index** - Go to Knowledge Base and click "Build/refresh index"
    2. **Add Your Projects** - Import or create your current projects
    3. **Configure Settings** - Set up your preferences and API keys
    4. **Explore Workflows** - Check out the automation templates
    """)

with col2:
    st.markdown("""
    ### Key Benefits
    - **Privacy-First**: All data stored locally, no cloud dependencies
    - **Modular Design**: Use only the features you need
    - **AI-Powered**: Semantic search and intelligent automation
    - **Multilingual**: Native support for Balkan languages
    """)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 1rem;">
    <p>BRZI AI Dashboard v2.0 | Built with ❤️ for productivity and creativity</p>
    <p>Use the sidebar navigation to explore all features</p>
</div>
""", unsafe_allow_html=True)
