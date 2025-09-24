import streamlit as st
import yaml
import json
import pandas as pd
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go

# Page config
st.set_page_config(page_title="Automations - BRZI AI Dashboard", page_icon="⚙️", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .automation-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .workflow-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
        border-left: 3px solid #28a745;
    }
    .status-running { border-left-color: #007bff; }
    .status-completed { border-left-color: #28a745; }
    .status-failed { border-left-color: #dc3545; }
    .status-scheduled { border-left-color: #ffc107; }
    .script-output {
        background: #2d3748;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }
</style>
""", unsafe_allow_html=True)

# Base paths
BASE = Path(__file__).resolve().parents[1]
SCRIPTS = BASE / "scripts"
DATA = BASE / "data"
WORKFLOWS = BASE / "workflows"

st.title("⚙️ Automations & Workflows")
st.caption("Manage automated tasks, workflows, and system maintenance operations")

# Load automation data
automation_log_path = DATA / "automation_log.json"
if automation_log_path.exists():
    with open(automation_log_path, 'r', encoding='utf-8') as f:
        automation_log = json.load(f)
else:
    automation_log = {"executions": [], "scheduled_tasks": []}

# Sidebar
st.sidebar.header("🔧 Automation Tools")

# Quick stats
executions = automation_log.get("executions", [])
scheduled_tasks = automation_log.get("scheduled_tasks", [])

if executions:
    recent_executions = [e for e in executions if e.get('date', '')[:10] == datetime.now().strftime('%Y-%m-%d')]
    st.sidebar.metric("Executions Today", len(recent_executions))
    
    successful = len([e for e in executions if e.get('status') == 'success'])
    success_rate = (successful / len(executions) * 100) if executions else 0
    st.sidebar.metric("Success Rate", f"{success_rate:.1f}%")

st.sidebar.metric("Scheduled Tasks", len(scheduled_tasks))

st.sidebar.divider()

# Quick actions
if st.sidebar.button("🔄 Run All Maintenance", use_container_width=True):
    st.session_state.run_maintenance = True

if st.sidebar.button("📊 Generate Reports", use_container_width=True):
    st.session_state.generate_reports = True

if st.sidebar.button("🧹 Cleanup System", use_container_width=True):
    st.session_state.cleanup_system = True

# Main content tabs
tab1, tab2, tab3, tab4 = st.tabs(["🚀 Quick Actions", "📋 Workflows", "📊 Execution Log", "⏰ Scheduler"])

with tab1:
    st.subheader("🚀 Quick Automation Actions")
    
    # System maintenance section
    st.markdown("### 🔧 System Maintenance")
    
    col_maint1, col_maint2, col_maint3 = st.columns(3)
    
    with col_maint1:
        st.markdown("""
        **📚 Knowledge Base**
        - Rebuild search index
        - Scan for conflicts
        - Update metadata
        """)
        
        if st.button("🔄 Rebuild KB Index", use_container_width=True):
            with st.spinner("Rebuilding knowledge base index..."):
                try:
                    result = subprocess.run(
                        [sys.executable, str(SCRIPTS / "build_vector_index.py")],
                        capture_output=True,
                        text=True,
                        cwd=str(BASE)
                    )
                    
                    # Log execution
                    execution = {
                        "task": "rebuild_kb_index",
                        "status": "success" if result.returncode == 0 else "failed",
                        "timestamp": datetime.now().isoformat(),
                        "output": result.stdout,
                        "error": result.stderr
                    }
                    automation_log["executions"].append(execution)
                    
                    # Save log
                    with open(automation_log_path, 'w', encoding='utf-8') as f:
                        json.dump(automation_log, f, indent=2, ensure_ascii=False)
                    
                    if result.returncode == 0:
                        st.success("✅ Knowledge base index rebuilt successfully!")
                    else:
                        st.error(f"❌ Index rebuild failed: {result.stderr}")
                        
                except Exception as e:
                    st.error(f"❌ Error running index rebuild: {e}")
        
        if st.button("🔍 Scan Conflicts", use_container_width=True):
            with st.spinner("Scanning for conflicts..."):
                try:
                    result = subprocess.run(
                        [sys.executable, str(SCRIPTS / "conflict_scanner.py")],
                        capture_output=True,
                        text=True,
                        cwd=str(BASE)
                    )
                    
                    # Log execution
                    execution = {
                        "task": "scan_conflicts",
                        "status": "success" if result.returncode == 0 else "failed",
                        "timestamp": datetime.now().isoformat(),
                        "output": result.stdout,
                        "error": result.stderr
                    }
                    automation_log["executions"].append(execution)
                    
                    # Save log
                    with open(automation_log_path, 'w', encoding='utf-8') as f:
                        json.dump(automation_log, f, indent=2, ensure_ascii=False)
                    
                    if result.returncode == 0:
                        st.success("✅ Conflict scan completed!")
                        if result.stdout:
                            st.text_area("Scan Results", result.stdout, height=150)
                    else:
                        st.error(f"❌ Conflict scan failed: {result.stderr}")
                        
                except Exception as e:
                    st.error(f"❌ Error running conflict scan: {e}")
    
    with col_maint2:
        st.markdown("""
        **💾 Data Management**
        - Backup all data
        - Export configurations
        - Archive old logs
        """)
        
        if st.button("💾 Backup Data", use_container_width=True):
            with st.spinner("Creating backup..."):
                try:
                    result = subprocess.run(
                        [sys.executable, str(SCRIPTS / "backup.py")],
                        capture_output=True,
                        text=True,
                        cwd=str(BASE)
                    )
                    
                    # Log execution
                    execution = {
                        "task": "backup_data",
                        "status": "success" if result.returncode == 0 else "failed",
                        "timestamp": datetime.now().isoformat(),
                        "output": result.stdout,
                        "error": result.stderr
                    }
                    automation_log["executions"].append(execution)
                    
                    # Save log
                    with open(automation_log_path, 'w', encoding='utf-8') as f:
                        json.dump(automation_log, f, indent=2, ensure_ascii=False)
                    
                    if result.returncode == 0:
                        st.success("✅ Data backup completed!")
                        if result.stdout:
                            st.text_area("Backup Results", result.stdout, height=100)
                    else:
                        st.error(f"❌ Backup failed: {result.stderr}")
                        
                except Exception as e:
                    st.error(f"❌ Error creating backup: {e}")
        
        if st.button("📤 Export All", use_container_width=True):
            # Create comprehensive export
            export_data = {
                "ideas": [],
                "projects": [],
                "prompts": [],
                "agents": [],
                "export_date": datetime.now().isoformat()
            }
            
            # Load and include all data
            try:
                # Ideas
                ideas_path = DATA / "ideas.json"
                if ideas_path.exists():
                    with open(ideas_path, 'r', encoding='utf-8') as f:
                        export_data["ideas"] = json.load(f)
                
                # Projects
                projects_path = DATA / "projects.yaml"
                if projects_path.exists():
                    with open(projects_path, 'r', encoding='utf-8') as f:
                        export_data["projects"] = yaml.safe_load(f)
                
                # Prompts
                prompts_path = DATA / "prompts.yaml"
                if prompts_path.exists():
                    with open(prompts_path, 'r', encoding='utf-8') as f:
                        export_data["prompts"] = yaml.safe_load(f)
                
                # Agents
                agents_path = DATA / "agents.json"
                if agents_path.exists():
                    with open(agents_path, 'r', encoding='utf-8') as f:
                        export_data["agents"] = json.load(f)
                
                # Create download
                export_json = json.dumps(export_data, indent=2, ensure_ascii=False)
                st.download_button(
                    label="📥 Download Complete Export",
                    data=export_json,
                    file_name=f"brzi_dashboard_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json"
                )
                
                st.success("✅ Export prepared successfully!")
                
            except Exception as e:
                st.error(f"❌ Export failed: {e}")
    
    with col_maint3:
        st.markdown("""
        **🧹 System Cleanup**
        - Clear temporary files
        - Optimize database
        - Update dependencies
        """)
        
        if st.button("🧹 Clean Temp Files", use_container_width=True):
            try:
                # Clean temporary files
                temp_dirs = [BASE / "temp", BASE / ".cache", DATA / "temp"]
                cleaned_files = 0
                
                for temp_dir in temp_dirs:
                    if temp_dir.exists():
                        for file in temp_dir.glob("*"):
                            if file.is_file():
                                file.unlink()
                                cleaned_files += 1
                
                # Log execution
                execution = {
                    "task": "clean_temp_files",
                    "status": "success",
                    "timestamp": datetime.now().isoformat(),
                    "output": f"Cleaned {cleaned_files} temporary files",
                    "error": None
                }
                automation_log["executions"].append(execution)
                
                # Save log
                with open(automation_log_path, 'w', encoding='utf-8') as f:
                    json.dump(automation_log, f, indent=2, ensure_ascii=False)
                
                st.success(f"✅ Cleaned {cleaned_files} temporary files!")
                
            except Exception as e:
                st.error(f"❌ Cleanup failed: {e}")
        
        if st.button("📊 System Stats", use_container_width=True):
            try:
                # Gather system statistics
                stats = {
                    "knowledge_base_files": len(list((DATA / "knowledge").glob("**/*"))),
                    "total_ideas": len(json.load(open(DATA / "ideas.json", 'r')) if (DATA / "ideas.json").exists() else []),
                    "total_projects": len(yaml.safe_load(open(DATA / "projects.yaml", 'r')).get("projects", []) if (DATA / "projects.yaml").exists() else []),
                    "automation_executions": len(automation_log.get("executions", [])),
                    "disk_usage_mb": sum(f.stat().st_size for f in BASE.rglob('*') if f.is_file()) / (1024 * 1024)
                }
                
                st.json(stats)
                
            except Exception as e:
                st.error(f"❌ Failed to gather stats: {e}")

with tab2:
    st.subheader("📋 Available Workflows")
    
    # List available workflows
    workflow_dirs = [d for d in WORKFLOWS.iterdir() if d.is_dir()] if WORKFLOWS.exists() else []
    
    if workflow_dirs:
        for workflow_dir in workflow_dirs:
            workflow_name = workflow_dir.name.replace('_', ' ').title()
            readme_path = workflow_dir / "README.md"
            
            with st.expander(f"📋 {workflow_name}", expanded=False):
                if readme_path.exists():
                    workflow_content = readme_path.read_text(encoding='utf-8')
                    st.markdown(workflow_content)
                else:
                    st.info("No documentation available for this workflow.")
                
                # List workflow files
                workflow_files = list(workflow_dir.glob("*"))
                if workflow_files:
                    st.markdown("**Files:**")
                    for file in workflow_files:
                        st.markdown(f"- 📄 {file.name}")
                
                # Execution button
                if st.button(f"▶️ Execute {workflow_name}", key=f"exec_wf_{workflow_dir.name}"):
                    st.info(f"Executing {workflow_name}... (This would trigger the workflow execution)")
                    
                    # Log the execution attempt
                    execution = {
                        "task": f"workflow_{workflow_dir.name}",
                        "status": "initiated",
                        "timestamp": datetime.now().isoformat(),
                        "output": f"Workflow {workflow_name} execution initiated",
                        "error": None
                    }
                    automation_log["executions"].append(execution)
                    
                    # Save log
                    with open(automation_log_path, 'w', encoding='utf-8') as f:
                        json.dump(automation_log, f, indent=2, ensure_ascii=False)
    else:
        st.info("No workflows available. Workflows should be placed in the workflows/ directory.")

with tab3:
    st.subheader("📊 Execution Log & Analytics")
    
    if executions:
        # Execution metrics
        col_log1, col_log2, col_log3, col_log4 = st.columns(4)
        
        total_executions = len(executions)
        successful_executions = len([e for e in executions if e.get('status') == 'success'])
        failed_executions = len([e for e in executions if e.get('status') == 'failed'])
        success_rate = (successful_executions / total_executions * 100) if total_executions > 0 else 0
        
        col_log1.metric("Total Executions", total_executions)
        col_log2.metric("Successful", successful_executions)
        col_log3.metric("Failed", failed_executions)
        col_log4.metric("Success Rate", f"{success_rate:.1f}%")
        
        # Recent executions table
        st.markdown("### 🕒 Recent Executions")
        
        recent_executions = sorted(executions, key=lambda x: x.get('timestamp', ''), reverse=True)[:20]
        
        for execution in recent_executions:
            task_name = execution.get('task', 'Unknown')
            status = execution.get('status', 'unknown')
            timestamp = execution.get('timestamp', 'Unknown')
            output = execution.get('output', '')
            error = execution.get('error', '')
            
            status_class = f"status-{status}"
            
            st.markdown(f"""
            <div class="automation-card {status_class}">
                <h4>⚙️ {task_name.replace('_', ' ').title()}</h4>
                <p><strong>Status:</strong> {status.upper()} | <strong>Time:</strong> {timestamp[:19]}</p>
                <p><strong>Output:</strong> {output[:200]}{'...' if len(output) > 200 else ''}</p>
                {f'<p><strong>Error:</strong> {error}</p>' if error else ''}
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No execution history available. Run some automations to see logs here.")

with tab4:
    st.subheader("⏰ Task Scheduler")
    st.info("Task scheduling functionality will be implemented in future versions.")

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("📊 Analytics", use_container_width=True):
        st.switch_page("pages/08_Analytics.py")

with col_nav2:
    if st.button("⚙️ Settings", use_container_width=True):
        st.switch_page("pages/09_Settings.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
