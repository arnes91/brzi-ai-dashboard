import streamlit as st
import yaml
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
from datetime import datetime, timedelta
import json

# Page config
st.set_page_config(page_title="Projects - BRZI AI Dashboard", page_icon="🚀", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .project-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .status-todo { border-left-color: #6c757d; }
    .status-doing { border-left-color: #007bff; }
    .status-done { border-left-color: #28a745; }
    .status-blocked { border-left-color: #dc3545; }
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        margin-right: 0.5rem;
    }
    .status-todo-badge { background: #6c757d; color: white; }
    .status-doing-badge { background: #007bff; color: white; }
    .status-done-badge { background: #28a745; color: white; }
    .status-blocked-badge { background: #dc3545; color: white; }
    .milestone-item {
        background: #f8f9fa;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border-radius: 5px;
        border-left: 3px solid #dee2e6;
    }
    .milestone-completed { border-left-color: #28a745; }
    .milestone-current { border-left-color: #007bff; }
    .milestone-upcoming { border-left-color: #ffc107; }
</style>
""", unsafe_allow_html=True)

# Base paths
DATA = Path(__file__).resolve().parents[1] / "data"
fp = DATA / "projects.yaml"

st.title("🚀 Projects Management")
st.caption("Track your projects, milestones, and tasks with comprehensive project management tools")

# Load projects
if fp.exists():
    db = yaml.safe_load(open(fp, "r", encoding="utf-8"))
else:
    db = {"projects": []}

projects = db.get("projects", [])

# Sidebar filters and actions
st.sidebar.header("🔍 Filters & Actions")

if projects:
    # Status filter
    all_statuses = list(set([p.get('status', 'todo') for p in projects]))
    status_filter = st.sidebar.multiselect("Status", all_statuses, default=all_statuses)
    
    # Project type filter (if available)
    all_types = list(set([p.get('type', 'general') for p in projects]))
    if len(all_types) > 1:
        type_filter = st.sidebar.multiselect("Type", all_types, default=all_types)
    else:
        type_filter = all_types

# Quick actions
st.sidebar.divider()
if st.sidebar.button("➕ Add New Project", use_container_width=True):
    st.session_state.show_add_form = True

if st.sidebar.button("📊 Export Projects", use_container_width=True):
    if projects:
        # Create export data
        export_data = []
        for p in projects:
            export_data.append({
                'key': p.get('key', ''),
                'name': p.get('name', ''),
                'status': p.get('status', ''),
                'type': p.get('type', ''),
                'goals': p.get('goals', ''),
                'milestones_count': len(p.get('milestones', [])),
                'tasks_count': len(p.get('tasks', []))
            })
        df_export = pd.DataFrame(export_data)
        csv = df_export.to_csv(index=False)
        st.sidebar.download_button(
            label="Download CSV",
            data=csv,
            file_name=f"brzi_projects_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )

# Main content
if projects:
    # Filter projects
    filtered_projects = [
        p for p in projects 
        if p.get('status', 'todo') in status_filter and p.get('type', 'general') in type_filter
    ]
    
    # Overview metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_projects = len(filtered_projects)
        st.metric("Total Projects", total_projects)
    
    with col2:
        active_projects = len([p for p in filtered_projects if p.get('status') == 'doing'])
        st.metric("Active Projects", active_projects)
    
    with col3:
        completed_projects = len([p for p in filtered_projects if p.get('status') == 'done'])
        completion_rate = (completed_projects / total_projects * 100) if total_projects > 0 else 0
        st.metric("Completed", completed_projects, f"{completion_rate:.1f}%")
    
    with col4:
        blocked_projects = len([p for p in filtered_projects if p.get('status') == 'blocked'])
        st.metric("Blocked", blocked_projects)
    
    # Charts
    col_chart1, col_chart2 = st.columns(2)
    
    with col_chart1:
        # Status distribution
        status_counts = {}
        for p in filtered_projects:
            status = p.get('status', 'todo')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        if status_counts:
            fig_pie = px.pie(
                values=list(status_counts.values()),
                names=list(status_counts.keys()),
                title="Projects by Status"
            )
            st.plotly_chart(fig_pie, use_container_width=True)
    
    with col_chart2:
        # Project timeline (if dates available)
        timeline_data = []
        for p in filtered_projects:
            milestones = p.get('milestones', [])
            for m in milestones:
                if 'due_date' in m:
                    timeline_data.append({
                        'project': p.get('name', 'Unnamed'),
                        'milestone': m.get('title', 'Unnamed Milestone'),
                        'due_date': m.get('due_date'),
                        'status': m.get('status', 'pending')
                    })
        
        if timeline_data:
            df_timeline = pd.DataFrame(timeline_data)
            df_timeline['due_date'] = pd.to_datetime(df_timeline['due_date'])
            fig_timeline = px.scatter(
                df_timeline,
                x='due_date',
                y='project',
                color='status',
                title="Project Timeline"
            )
            st.plotly_chart(fig_timeline, use_container_width=True)
        else:
            st.info("Add due dates to milestones to see project timeline")
    
    st.divider()
    
    # Projects list
    st.subheader("📋 Projects Overview")
    
    for project in filtered_projects:
        status = project.get('status', 'todo')
        project_class = f"status-{status}"
        status_badge_class = f"status-{status}-badge"
        
        with st.expander(f"🚀 {project.get('name', 'Unnamed Project')} [{project.get('key', 'N/A')}]", expanded=False):
            col_info, col_progress = st.columns([2, 1])
            
            with col_info:
                st.markdown(f"""
                <div class="project-card {project_class}">
                    <div>
                        <span class="status-badge {status_badge_class}">{status.upper()}</span>
                        <strong>Type:</strong> {project.get('type', 'General')}
                    </div>
                    <h4>Goals</h4>
                    <p>{project.get('goals', 'No goals specified')}</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col_progress:
                # Calculate progress
                milestones = project.get('milestones', [])
                tasks = project.get('tasks', [])
                
                if milestones:
                    completed_milestones = len([m for m in milestones if m.get('status') == 'completed'])
                    milestone_progress = (completed_milestones / len(milestones)) * 100
                    st.metric("Milestone Progress", f"{milestone_progress:.0f}%", f"{completed_milestones}/{len(milestones)}")
                
                if tasks:
                    completed_tasks = len([t for t in tasks if t.get('status') == 'done'])
                    task_progress = (completed_tasks / len(tasks)) * 100
                    st.metric("Task Progress", f"{task_progress:.0f}%", f"{completed_tasks}/{len(tasks)}")
            
            # Milestones
            if milestones:
                st.markdown("### 🎯 Milestones")
                for i, milestone in enumerate(milestones):
                    m_status = milestone.get('status', 'upcoming')
                    milestone_class = f"milestone-{m_status}" if m_status in ['completed', 'current', 'upcoming'] else "milestone-upcoming"
                    
                    st.markdown(f"""
                    <div class="milestone-item {milestone_class}">
                        <strong>{milestone.get('title', f'Milestone {i+1}')}</strong>
                        <br>
                        <small>Status: {m_status.title()} | Due: {milestone.get('due_date', 'Not set')}</small>
                        <br>
                        {milestone.get('description', 'No description')}
                    </div>
                    """, unsafe_allow_html=True)
            
            # Tasks
            if tasks:
                st.markdown("### ✅ Tasks")
                df_tasks = pd.DataFrame(tasks)
                if not df_tasks.empty:
                    # Add status styling
                    def style_status(val):
                        colors = {
                            'todo': 'background-color: #f8f9fa',
                            'doing': 'background-color: #cce5ff', 
                            'done': 'background-color: #d4edda',
                            'blocked': 'background-color: #f8d7da'
                        }
                        return colors.get(val, '')
                    
                    styled_df = df_tasks.style.applymap(style_status, subset=['status'] if 'status' in df_tasks.columns else [])
                    st.dataframe(styled_df, use_container_width=True)

else:
    st.info("No projects found. Add your first project to get started!")

# Add new project form
if st.session_state.get('show_add_form', False):
    st.divider()
    st.subheader("➕ Add New Project")
    
    with st.form("add_project", clear_on_submit=True):
        col_form1, col_form2 = st.columns(2)
        
        with col_form1:
            project_key = st.text_input("Project Key", placeholder="PROJ-001")
            project_name = st.text_input("Project Name", placeholder="My Awesome Project")
            project_type = st.selectbox("Type", ["general", "ai", "web", "mobile", "research", "business"])
            project_status = st.selectbox("Status", ["todo", "doing", "done", "blocked"])
        
        with col_form2:
            project_goals = st.text_area("Goals", placeholder="Describe the project goals and objectives...")
            project_description = st.text_area("Description", placeholder="Additional project details...")
        
        # Milestones
        st.markdown("### Milestones")
        milestone_count = st.number_input("Number of milestones", min_value=0, max_value=10, value=3)
        
        milestones = []
        for i in range(milestone_count):
            col_m1, col_m2, col_m3 = st.columns(3)
            with col_m1:
                m_title = st.text_input(f"Milestone {i+1} Title", key=f"m_title_{i}")
            with col_m2:
                m_due = st.date_input(f"Due Date", key=f"m_due_{i}")
            with col_m3:
                m_status = st.selectbox(f"Status", ["upcoming", "current", "completed"], key=f"m_status_{i}")
            
            if m_title:
                milestones.append({
                    "title": m_title,
                    "due_date": m_due.isoformat(),
                    "status": m_status,
                    "description": ""
                })
        
        submitted = st.form_submit_button("🚀 Create Project", use_container_width=True)
        
        if submitted and project_key and project_name:
            new_project = {
                "key": project_key,
                "name": project_name,
                "type": project_type,
                "status": project_status,
                "goals": project_goals,
                "description": project_description,
                "milestones": milestones,
                "tasks": [],
                "created_date": datetime.now().isoformat()[:10]
            }
            
            db["projects"].append(new_project)
            
            # Save to file
            with open(fp, "w", encoding="utf-8") as f:
                yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
            
            st.success("🎉 Project created successfully!")
            st.session_state.show_add_form = False
            st.rerun()
    
    if st.button("❌ Cancel"):
        st.session_state.show_add_form = False
        st.rerun()

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("💡 Ideas", use_container_width=True):
        st.switch_page("pages/02_Ideas.py")

with col_nav2:
    if st.button("📚 Knowledge Base", use_container_width=True):
        st.switch_page("pages/04_Knowledge_Base.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
