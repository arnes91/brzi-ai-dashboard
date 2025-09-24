import streamlit as st
import yaml
import json
import pandas as pd
from pathlib import Path
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go

# Page config
st.set_page_config(page_title="AI Agents - BRZI AI Dashboard", page_icon="🤖", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .agent-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .blueprint-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
        border-left: 3px solid #28a745;
    }
    .status-active { border-left-color: #28a745; }
    .status-idle { border-left-color: #6c757d; }
    .status-error { border-left-color: #dc3545; }
    .agent-type-sequential { border-left-color: #007bff; }
    .agent-type-parallel { border-left-color: #17a2b8; }
    .agent-type-loop { border-left-color: #ffc107; }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# Base paths
BASE = Path(__file__).resolve().parents[1]
SCRIPTS = BASE / "scripts"
DATA = BASE / "data"

st.title("🤖 AI Agents & Orchestration")
st.caption("Manage AI agent blueprints, workflows, and automation patterns")

# Load agent configurations and blueprints
agents_config_path = DATA / "agents.json"
if agents_config_path.exists():
    with open(agents_config_path, 'r', encoding='utf-8') as f:
        agents_config = json.load(f)
else:
    agents_config = {
        "agents": [],
        "blueprints": [],
        "executions": []
    }

# Sidebar
st.sidebar.header("🔧 Agent Tools")

# Agent status overview
agents = agents_config.get("agents", [])
blueprints = agents_config.get("blueprints", [])
executions = agents_config.get("executions", [])

if agents:
    active_agents = len([a for a in agents if a.get('status') == 'active'])
    st.sidebar.metric("Active Agents", active_agents)
    st.sidebar.metric("Total Blueprints", len(blueprints))
    st.sidebar.metric("Executions Today", len([e for e in executions if e.get('date', '')[:10] == datetime.now().strftime('%Y-%m-%d')]))

st.sidebar.divider()

# Quick actions
if st.sidebar.button("➕ Create Agent", use_container_width=True):
    st.session_state.show_create_agent = True

if st.sidebar.button("📋 New Blueprint", use_container_width=True):
    st.session_state.show_create_blueprint = True

if st.sidebar.button("▶️ Execute Blueprint", use_container_width=True):
    st.session_state.show_execute = True

# Main content tabs
tab1, tab2, tab3, tab4 = st.tabs(["🤖 Agents", "📋 Blueprints", "📊 Execution Monitor", "⚙️ Configuration"])

with tab1:
    st.subheader("🤖 AI Agents Overview")
    
    if agents:
        # Agent metrics
        col1, col2, col3, col4 = st.columns(4)
        
        total_agents = len(agents)
        active_count = len([a for a in agents if a.get('status') == 'active'])
        idle_count = len([a for a in agents if a.get('status') == 'idle'])
        error_count = len([a for a in agents if a.get('status') == 'error'])
        
        col1.metric("Total Agents", total_agents)
        col2.metric("Active", active_count, f"{(active_count/total_agents*100):.0f}%" if total_agents > 0 else "0%")
        col3.metric("Idle", idle_count)
        col4.metric("Errors", error_count)
        
        # Agent status distribution
        status_data = {'Active': active_count, 'Idle': idle_count, 'Error': error_count}
        if sum(status_data.values()) > 0:
            fig_status = px.pie(
                values=list(status_data.values()),
                names=list(status_data.keys()),
                title="Agent Status Distribution",
                color_discrete_map={'Active': '#28a745', 'Idle': '#6c757d', 'Error': '#dc3545'}
            )
            st.plotly_chart(fig_status, use_container_width=True)
        
        # Agents list
        st.markdown("### 🤖 Active Agents")
        
        for agent in agents:
            agent_name = agent.get('name', 'Unnamed Agent')
            agent_type = agent.get('type', 'general')
            agent_status = agent.get('status', 'idle')
            agent_desc = agent.get('description', 'No description provided')
            
            status_class = f"status-{agent_status}"
            
            st.markdown(f"""
            <div class="agent-card {status_class}">
                <h4>🤖 {agent_name}</h4>
                <p><strong>Type:</strong> {agent_type} | <strong>Status:</strong> {agent_status.upper()}</p>
                <p><strong>Description:</strong> {agent_desc}</p>
                <p><strong>Last Active:</strong> {agent.get('last_active', 'Never')}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Agent controls
            col_ctrl1, col_ctrl2, col_ctrl3 = st.columns(3)
            
            with col_ctrl1:
                if st.button(f"▶️ Start", key=f"start_{agent_name}"):
                    agent['status'] = 'active'
                    agent['last_active'] = datetime.now().isoformat()
                    # Save changes
                    with open(agents_config_path, 'w', encoding='utf-8') as f:
                        json.dump(agents_config, f, indent=2, ensure_ascii=False)
                    st.success(f"Agent {agent_name} started!")
                    st.rerun()
            
            with col_ctrl2:
                if st.button(f"⏸️ Stop", key=f"stop_{agent_name}"):
                    agent['status'] = 'idle'
                    # Save changes
                    with open(agents_config_path, 'w', encoding='utf-8') as f:
                        json.dump(agents_config, f, indent=2, ensure_ascii=False)
                    st.success(f"Agent {agent_name} stopped!")
                    st.rerun()
            
            with col_ctrl3:
                if st.button(f"🗑️ Remove", key=f"remove_{agent_name}"):
                    agents_config['agents'].remove(agent)
                    # Save changes
                    with open(agents_config_path, 'w', encoding='utf-8') as f:
                        json.dump(agents_config, f, indent=2, ensure_ascii=False)
                    st.success(f"Agent {agent_name} removed!")
                    st.rerun()
    else:
        st.info("No agents configured. Create your first agent to get started!")

with tab2:
    st.subheader("📋 Agent Blueprints")
    
    # Blueprint types explanation
    st.markdown("""
    ### Blueprint Types
    
    **Sequential**: Execute tools one after another (Tool A → Tool B → Tool C)
    - Example: Fetch URL → Extract Text → Summarize Content
    
    **Parallel**: Execute multiple tools simultaneously (Tool A || Tool B || Tool C)  
    - Example: Fetch multiple APIs concurrently
    
    **Loop**: Repeat execution until condition is met
    - Example: Generate → Validate → Improve (repeat until quality threshold met)
    """)
    
    if blueprints:
        # Blueprint metrics
        sequential_count = len([b for b in blueprints if b.get('type') == 'sequential'])
        parallel_count = len([b for b in blueprints if b.get('type') == 'parallel'])
        loop_count = len([b for b in blueprints if b.get('type') == 'loop'])
        
        col_bp1, col_bp2, col_bp3, col_bp4 = st.columns(4)
        col_bp1.metric("Total Blueprints", len(blueprints))
        col_bp2.metric("Sequential", sequential_count)
        col_bp3.metric("Parallel", parallel_count)
        col_bp4.metric("Loop", loop_count)
        
        # Blueprint list
        st.markdown("### 📋 Available Blueprints")
        
        for blueprint in blueprints:
            bp_name = blueprint.get('name', 'Unnamed Blueprint')
            bp_type = blueprint.get('type', 'sequential')
            bp_desc = blueprint.get('description', 'No description provided')
            bp_steps = blueprint.get('steps', [])
            
            type_class = f"agent-type-{bp_type}"
            
            with st.expander(f"📋 {bp_name} ({bp_type.upper()})", expanded=False):
                st.markdown(f"""
                <div class="blueprint-card {type_class}">
                    <p><strong>Description:</strong> {bp_desc}</p>
                    <p><strong>Steps:</strong> {len(bp_steps)}</p>
                </div>
                """, unsafe_allow_html=True)
                
                # Show blueprint structure
                st.markdown("**Blueprint Structure:**")
                st.json(blueprint)
                
                # Blueprint controls
                col_bp_ctrl1, col_bp_ctrl2, col_bp_ctrl3 = st.columns(3)
                
                with col_bp_ctrl1:
                    if st.button(f"▶️ Execute", key=f"exec_{bp_name}"):
                        # Add to execution log
                        execution = {
                            "blueprint_name": bp_name,
                            "status": "running",
                            "started_at": datetime.now().isoformat(),
                            "steps_completed": 0,
                            "total_steps": len(bp_steps)
                        }
                        agents_config['executions'].append(execution)
                        
                        # Save changes
                        with open(agents_config_path, 'w', encoding='utf-8') as f:
                            json.dump(agents_config, f, indent=2, ensure_ascii=False)
                        
                        st.success(f"Blueprint {bp_name} execution started!")
                        st.rerun()
                
                with col_bp_ctrl2:
                    if st.button(f"✏️ Edit", key=f"edit_{bp_name}"):
                        st.session_state[f"edit_blueprint_{bp_name}"] = True
                
                with col_bp_ctrl3:
                    if st.button(f"🗑️ Delete", key=f"delete_{bp_name}"):
                        agents_config['blueprints'].remove(blueprint)
                        # Save changes
                        with open(agents_config_path, 'w', encoding='utf-8') as f:
                            json.dump(agents_config, f, indent=2, ensure_ascii=False)
                        st.success(f"Blueprint {bp_name} deleted!")
                        st.rerun()
    else:
        st.info("No blueprints available. Create your first blueprint!")
        
        # Example blueprints
        st.markdown("### 📚 Example Blueprints")
        
        examples = {
            "Sequential Web Scraper": {
                "type": "sequential",
                "description": "Fetch webpage, extract content, and summarize",
                "steps": [
                    {"tool": "fetch_url", "args": {"url": "https://example.com"}},
                    {"tool": "extract_text", "args": {"selector": "article"}},
                    {"tool": "summarize_text", "args": {"max_words": 120}}
                ]
            },
            "Parallel Data Fetcher": {
                "type": "parallel",
                "description": "Fetch data from multiple APIs simultaneously",
                "steps": [
                    {"tool": "fetch_api", "args": {"endpoint": "weather"}},
                    {"tool": "fetch_api", "args": {"endpoint": "news"}},
                    {"tool": "fetch_api", "args": {"endpoint": "stocks"}}
                ]
            },
            "Content Generation Loop": {
                "type": "loop",
                "description": "Generate and refine content until quality threshold met",
                "condition": {"quality_score": {"min": 0.8}},
                "max_iterations": 5,
                "steps": [
                    {"tool": "generate_content", "args": {"topic": "AI trends"}},
                    {"tool": "evaluate_quality", "args": {"criteria": ["clarity", "accuracy"]}},
                    {"tool": "improve_content", "args": {"feedback": "previous_evaluation"}}
                ]
            }
        }
        
        for name, example in examples.items():
            with st.expander(f"📋 {name}"):
                st.json(example)
                if st.button(f"📥 Import {name}", key=f"import_{name}"):
                    example['name'] = name
                    agents_config['blueprints'].append(example)
                    # Save changes
                    with open(agents_config_path, 'w', encoding='utf-8') as f:
                        json.dump(agents_config, f, indent=2, ensure_ascii=False)
                    st.success(f"Blueprint {name} imported!")
                    st.rerun()

with tab3:
    st.subheader("📊 Execution Monitor")
    
    if executions:
        # Execution metrics
        running_count = len([e for e in executions if e.get('status') == 'running'])
        completed_count = len([e for e in executions if e.get('status') == 'completed'])
        failed_count = len([e for e in executions if e.get('status') == 'failed'])
        
        col_ex1, col_ex2, col_ex3, col_ex4 = st.columns(4)
        col_ex1.metric("Total Executions", len(executions))
        col_ex2.metric("Running", running_count)
        col_ex3.metric("Completed", completed_count)
        col_ex4.metric("Failed", failed_count)
        
        # Execution timeline
        df_executions = pd.DataFrame(executions)
        if not df_executions.empty and 'started_at' in df_executions.columns:
            df_executions['started_at'] = pd.to_datetime(df_executions['started_at'])
            df_executions['date'] = df_executions['started_at'].dt.date
            
            daily_executions = df_executions.groupby('date').size().reset_index(name='count')
            
            fig_timeline = px.line(
                daily_executions,
                x='date',
                y='count',
                title="Daily Execution Count",
                markers=True
            )
            st.plotly_chart(fig_timeline, use_container_width=True)
        
        # Recent executions
        st.markdown("### 🕒 Recent Executions")
        
        recent_executions = sorted(executions, key=lambda x: x.get('started_at', ''), reverse=True)[:10]
        
        for execution in recent_executions:
            exec_name = execution.get('blueprint_name', 'Unknown')
            exec_status = execution.get('status', 'unknown')
            exec_started = execution.get('started_at', 'Unknown')
            exec_progress = execution.get('steps_completed', 0)
            exec_total = execution.get('total_steps', 1)
            
            progress_pct = (exec_progress / exec_total * 100) if exec_total > 0 else 0
            
            st.markdown(f"""
            **🔄 {exec_name}**  
            Status: {exec_status.upper()} | Started: {exec_started[:19]} | Progress: {exec_progress}/{exec_total} ({progress_pct:.0f}%)
            """)
            
            if exec_status == 'running':
                st.progress(progress_pct / 100)
    else:
        st.info("No executions recorded yet. Execute a blueprint to see monitoring data.")

with tab4:
    st.subheader("⚙️ Agent Configuration")
    
    # LLM Provider settings
    st.markdown("### 🔗 LLM Provider Configuration")
    
    providers = {
        "OpenAI": {"api_key": "OPENAI_API_KEY", "models": ["gpt-4", "gpt-3.5-turbo"]},
        "Anthropic": {"api_key": "ANTHROPIC_API_KEY", "models": ["claude-3-opus", "claude-3-sonnet"]},
        "Google": {"api_key": "GOOGLE_API_KEY", "models": ["gemini-pro", "gemini-pro-vision"]},
        "Local": {"api_key": "Not required", "models": ["llama2", "mistral"]}
    }
    
    selected_provider = st.selectbox("Primary LLM Provider", list(providers.keys()))
    
    if selected_provider != "Local":
        api_key = st.text_input(f"{selected_provider} API Key", type="password", 
                               help=f"Set {providers[selected_provider]['api_key']} environment variable")
    
    selected_model = st.selectbox("Model", providers[selected_provider]["models"])
    
    # Agent settings
    st.markdown("### 🤖 Agent Settings")
    
    col_set1, col_set2 = st.columns(2)
    
    with col_set1:
        max_concurrent = st.number_input("Max Concurrent Agents", min_value=1, max_value=10, value=3)
        execution_timeout = st.number_input("Execution Timeout (seconds)", min_value=30, max_value=3600, value=300)
    
    with col_set2:
        retry_attempts = st.number_input("Retry Attempts", min_value=0, max_value=5, value=2)
        log_level = st.selectbox("Log Level", ["DEBUG", "INFO", "WARNING", "ERROR"])
    
    if st.button("💾 Save Configuration", use_container_width=True):
        config = {
            "llm_provider": selected_provider,
            "model": selected_model,
            "max_concurrent": max_concurrent,
            "execution_timeout": execution_timeout,
            "retry_attempts": retry_attempts,
            "log_level": log_level,
            "updated_at": datetime.now().isoformat()
        }
        
        config_path = DATA / "agent_config.json"
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        st.success("Configuration saved successfully!")

# Create agent form
if st.session_state.get('show_create_agent', False):
    st.divider()
    st.subheader("➕ Create New Agent")
    
    with st.form("create_agent"):
        col_agent1, col_agent2 = st.columns(2)
        
        with col_agent1:
            agent_name = st.text_input("Agent Name", placeholder="My AI Agent")
            agent_type = st.selectbox("Agent Type", ["general", "web_scraper", "content_generator", "data_processor"])
        
        with col_agent2:
            agent_desc = st.text_area("Description", placeholder="Describe what this agent does...")
            agent_model = st.selectbox("LLM Model", ["gpt-4", "gpt-3.5-turbo", "claude-3-opus", "gemini-pro"])
        
        agent_capabilities = st.multiselect(
            "Capabilities",
            ["web_browsing", "file_processing", "api_calls", "image_generation", "code_execution"]
        )
        
        if st.form_submit_button("🚀 Create Agent", use_container_width=True):
            new_agent = {
                "name": agent_name,
                "type": agent_type,
                "description": agent_desc,
                "model": agent_model,
                "capabilities": agent_capabilities,
                "status": "idle",
                "created_at": datetime.now().isoformat(),
                "last_active": None
            }
            
            agents_config['agents'].append(new_agent)
            
            # Save changes
            with open(agents_config_path, 'w', encoding='utf-8') as f:
                json.dump(agents_config, f, indent=2, ensure_ascii=False)
            
            st.success("🎉 Agent created successfully!")
            st.session_state.show_create_agent = False
            st.rerun()
    
    if st.button("❌ Cancel"):
        st.session_state.show_create_agent = False
        st.rerun()

# Create blueprint form
if st.session_state.get('show_create_blueprint', False):
    st.divider()
    st.subheader("📋 Create New Blueprint")
    
    with st.form("create_blueprint"):
        col_bp1, col_bp2 = st.columns(2)
        
        with col_bp1:
            bp_name = st.text_input("Blueprint Name", placeholder="My Workflow")
            bp_type = st.selectbox("Blueprint Type", ["sequential", "parallel", "loop"])
        
        with col_bp2:
            bp_desc = st.text_area("Description", placeholder="Describe this workflow...")
        
        # Steps configuration
        st.markdown("### Steps Configuration")
        num_steps = st.number_input("Number of Steps", min_value=1, max_value=10, value=2)
        
        steps = []
        for i in range(num_steps):
            st.markdown(f"**Step {i+1}**")
            col_step1, col_step2 = st.columns(2)
            
            with col_step1:
                tool_name = st.text_input(f"Tool Name", key=f"tool_{i}", placeholder="fetch_url")
            
            with col_step2:
                tool_args = st.text_area(f"Arguments (JSON)", key=f"args_{i}", 
                                       placeholder='{"url": "https://example.com"}')
            
            if tool_name:
                try:
                    args = json.loads(tool_args) if tool_args else {}
                    steps.append({"tool": tool_name, "args": args})
                except json.JSONDecodeError:
                    st.error(f"Invalid JSON in step {i+1} arguments")
        
        if st.form_submit_button("📋 Create Blueprint", use_container_width=True):
            new_blueprint = {
                "name": bp_name,
                "type": bp_type,
                "description": bp_desc,
                "steps": steps,
                "created_at": datetime.now().isoformat()
            }
            
            agents_config['blueprints'].append(new_blueprint)
            
            # Save changes
            with open(agents_config_path, 'w', encoding='utf-8') as f:
                json.dump(agents_config, f, indent=2, ensure_ascii=False)
            
            st.success("🎉 Blueprint created successfully!")
            st.session_state.show_create_blueprint = False
            st.rerun()
    
    if st.button("❌ Cancel"):
        st.session_state.show_create_blueprint = False
        st.rerun()

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("⚙️ Automations", use_container_width=True):
        st.switch_page("pages/07_Automations.py")

with col_nav2:
    if st.button("📊 Analytics", use_container_width=True):
        st.switch_page("pages/08_Analytics.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
