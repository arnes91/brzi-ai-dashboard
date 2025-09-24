import streamlit as st
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
from datetime import datetime
import numpy as np

# Page config
st.set_page_config(page_title="Ideas - BRZI AI Dashboard", page_icon="💡", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .idea-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .priority-high { border-left-color: #e74c3c; }
    .priority-medium { border-left-color: #f39c12; }
    .priority-low { border-left-color: #27ae60; }
    .stage-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: bold;
        margin-right: 0.5rem;
    }
    .stage-ideate { background: #fff3cd; color: #856404; }
    .stage-validate { background: #cce5ff; color: #004085; }
    .stage-prototype { background: #e2e3e5; color: #383d41; }
    .stage-ship { background: #d4edda; color: #155724; }
</style>
""", unsafe_allow_html=True)

# Base paths
DATA = Path(__file__).resolve().parents[1] / "data"
fp = DATA / "ideas.json"

st.title("💡 Ideas Management")
st.caption("Capture, prioritize, and track your creative ideas using Impact × Effort analysis")

# Load ideas
if fp.exists():
    ideas = json.load(open(fp, "r", encoding="utf-8"))
else:
    ideas = []

# Convert to DataFrame for analysis
df = pd.DataFrame(ideas) if ideas else pd.DataFrame(columns=['id', 'title', 'stage', 'tags', 'impact', 'effort', 'created_date'])

# Add calculated fields
if not df.empty:
    df['priority_score'] = df['impact'] * (11 - df['effort'])  # Higher impact, lower effort = higher score
    df['priority_level'] = pd.cut(df['priority_score'], bins=[0, 30, 60, 100], labels=['Low', 'Medium', 'High'])

# Sidebar filters
st.sidebar.header("🔍 Filters")
if not df.empty:
    stage_filter = st.sidebar.multiselect("Stage", df['stage'].unique(), default=df['stage'].unique())
    priority_filter = st.sidebar.multiselect("Priority", ['Low', 'Medium', 'High'], default=['Low', 'Medium', 'High'])
    
    # Apply filters
    filtered_df = df[
        (df['stage'].isin(stage_filter)) & 
        (df['priority_level'].isin(priority_filter))
    ]
else:
    filtered_df = df

# Main content
col1, col2 = st.columns([2, 1])

with col1:
    # Ideas overview
    if not filtered_df.empty:
        st.subheader("📊 Ideas Overview")
        
        # Metrics
        col_m1, col_m2, col_m3, col_m4 = st.columns(4)
        col_m1.metric("Total Ideas", len(filtered_df))
        col_m2.metric("High Priority", len(filtered_df[filtered_df['priority_level'] == 'High']))
        col_m3.metric("In Progress", len(filtered_df[filtered_df['stage'].isin(['validate', 'prototype'])]))
        col_m4.metric("Shipped", len(filtered_df[filtered_df['stage'] == 'ship']))
        
        # Impact vs Effort scatter plot
        fig_scatter = px.scatter(
            filtered_df, 
            x='effort', 
            y='impact',
            color='stage',
            size='priority_score',
            hover_data=['title'],
            title="Impact vs Effort Analysis",
            labels={'effort': 'Effort (1-10)', 'impact': 'Impact (1-10)'}
        )
        fig_scatter.add_shape(
            type="line", x0=5.5, y0=0, x1=5.5, y1=10,
            line=dict(color="gray", width=1, dash="dash")
        )
        fig_scatter.add_shape(
            type="line", x0=0, y0=5.5, x1=10, y1=5.5,
            line=dict(color="gray", width=1, dash="dash")
        )
        fig_scatter.update_layout(height=400)
        st.plotly_chart(fig_scatter, use_container_width=True)
        
        # Stage distribution
        stage_counts = filtered_df['stage'].value_counts()
        fig_pie = px.pie(
            values=stage_counts.values, 
            names=stage_counts.index,
            title="Ideas by Stage"
        )
        st.plotly_chart(fig_pie, use_container_width=True)
        
    else:
        st.info("No ideas found. Add your first idea using the form on the right!")

with col2:
    st.subheader("➕ Add New Idea")
    
    with st.form("add_idea", clear_on_submit=True):
        title = st.text_input("💡 Idea Title", placeholder="Enter your brilliant idea...")
        description = st.text_area("📝 Description", placeholder="Describe your idea in detail...")
        stage = st.selectbox("🚀 Stage", 
                           options=["ideate", "validate", "prototype", "ship"],
                           format_func=lambda x: {
                               "ideate": "💭 Ideate",
                               "validate": "🔍 Validate", 
                               "prototype": "🛠️ Prototype",
                               "ship": "🚢 Ship"
                           }[x])
        
        col_impact, col_effort = st.columns(2)
        with col_impact:
            impact = st.slider("📈 Impact", 1, 10, 5, help="How much value will this create?")
        with col_effort:
            effort = st.slider("⚡ Effort", 1, 10, 5, help="How much work is required?")
        
        tags = st.text_input("🏷️ Tags", placeholder="ai, productivity, automation", help="Comma-separated tags")
        
        submitted = st.form_submit_button("✨ Add Idea", use_container_width=True)
        
        if submitted and title:
            new_idea = {
                "id": f"IA-{len(ideas)+1:04d}",
                "title": title,
                "description": description,
                "stage": stage,
                "tags": [t.strip() for t in tags.split(",") if t.strip()],
                "impact": impact,
                "effort": effort,
                "created_date": datetime.now().isoformat()[:10],
                "priority_score": impact * (11 - effort)
            }
            ideas.append(new_idea)
            json.dump(ideas, open(fp, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
            st.success("🎉 Idea added successfully!")
            st.rerun()

# Ideas list
if not filtered_df.empty:
    st.divider()
    st.subheader("📋 Ideas List")
    
    # Sort by priority score
    sorted_df = filtered_df.sort_values('priority_score', ascending=False)
    
    for _, idea in sorted_df.iterrows():
        priority_class = f"priority-{idea['priority_level'].lower()}"
        stage_class = f"stage-{idea['stage']}"
        
        st.markdown(f"""
        <div class="idea-card {priority_class}">
            <h4>{idea['title']}</h4>
            <p><strong>Description:</strong> {idea.get('description', 'No description provided')}</p>
            <div>
                <span class="stage-badge {stage_class}">{idea['stage'].upper()}</span>
                <strong>Impact:</strong> {idea['impact']}/10 | 
                <strong>Effort:</strong> {idea['effort']}/10 | 
                <strong>Priority Score:</strong> {idea['priority_score']:.1f}
            </div>
            <p><strong>Tags:</strong> {', '.join(idea.get('tags', []))}</p>
            <small><strong>Created:</strong> {idea.get('created_date', 'Unknown')}</small>
        </div>
        """, unsafe_allow_html=True)

# Quick actions
st.divider()
col_a1, col_a2, col_a3 = st.columns(3)

with col_a1:
    if st.button("📊 Export Ideas", use_container_width=True):
        if not df.empty:
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"brzi_ideas_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )

with col_a2:
    if st.button("🔄 Refresh Data", use_container_width=True):
        st.rerun()

with col_a3:
    if st.button("🏠 Back to Dashboard", use_container_width=True):
        st.switch_page("app.py")
