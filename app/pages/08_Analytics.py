import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
import yaml
from pathlib import Path
from datetime import datetime, timedelta
import numpy as np

# Page config
st.set_page_config(page_title="Analytics - BRZI AI Dashboard", page_icon="📊", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        margin: 0.5rem 0;
    }
    .analytics-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .kpi-positive { color: #28a745; }
    .kpi-negative { color: #dc3545; }
    .kpi-neutral { color: #6c757d; }
</style>
""", unsafe_allow_html=True)

# Base paths
DATA = Path(__file__).resolve().parents[1] / "data"

st.title("📊 Analytics & Insights")
st.caption("Comprehensive analytics dashboard for tracking performance, productivity, and growth metrics")

# Load data
metrics_path = DATA / "metrics.csv"
ideas_path = DATA / "ideas.json"
projects_path = DATA / "projects.yaml"
automation_log_path = DATA / "automation_log.json"

# Load metrics data
if metrics_path.exists():
    df_metrics = pd.read_csv(metrics_path)
    df_metrics['date'] = pd.to_datetime(df_metrics['date'])
else:
    # Create sample data for demonstration
    dates = pd.date_range(start=datetime.now() - timedelta(days=30), end=datetime.now(), freq='D')
    sample_data = []
    
    for date in dates:
        # YouTube metrics
        sample_data.append({
            'date': date,
            'metric': 'yt_subs',
            'value': 1000 + np.random.randint(-50, 100),
            'category': 'social'
        })
        sample_data.append({
            'date': date,
            'metric': 'yt_views',
            'value': 50000 + np.random.randint(-5000, 10000),
            'category': 'social'
        })
        
        # Productivity metrics
        sample_data.append({
            'date': date,
            'metric': 'ideas_created',
            'value': np.random.poisson(2),
            'category': 'productivity'
        })
        sample_data.append({
            'date': date,
            'metric': 'tasks_completed',
            'value': np.random.poisson(5),
            'category': 'productivity'
        })
        
        # AI metrics
        sample_data.append({
            'date': date,
            'metric': 'kb_searches',
            'value': np.random.poisson(8),
            'category': 'ai'
        })
        sample_data.append({
            'date': date,
            'metric': 'prompts_used',
            'value': np.random.poisson(3),
            'category': 'ai'
        })
    
    df_metrics = pd.DataFrame(sample_data)

# Load additional data
ideas_data = []
if ideas_path.exists():
    with open(ideas_path, 'r', encoding='utf-8') as f:
        ideas_data = json.load(f)

projects_data = {"projects": []}
if projects_path.exists():
    with open(projects_path, 'r', encoding='utf-8') as f:
        projects_data = yaml.safe_load(f)

automation_data = {"executions": []}
if automation_log_path.exists():
    with open(automation_log_path, 'r', encoding='utf-8') as f:
        automation_data = json.load(f)

# Sidebar filters
st.sidebar.header("📊 Analytics Filters")

# Date range filter
date_range = st.sidebar.date_input(
    "Date Range",
    value=(datetime.now() - timedelta(days=30), datetime.now()),
    max_value=datetime.now()
)

if len(date_range) == 2:
    start_date, end_date = date_range
    df_filtered = df_metrics[
        (df_metrics['date'] >= pd.Timestamp(start_date)) & 
        (df_metrics['date'] <= pd.Timestamp(end_date))
    ]
else:
    df_filtered = df_metrics

# Metric category filter
categories = df_filtered['category'].unique() if 'category' in df_filtered.columns else []
selected_categories = st.sidebar.multiselect(
    "Metric Categories",
    categories,
    default=categories
)

if selected_categories:
    df_filtered = df_filtered[df_filtered['category'].isin(selected_categories)]

# Main content tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs(["📈 Overview", "🎯 Productivity", "🤖 AI Metrics", "📱 Social Media", "📊 Custom Analytics"])

with tab1:
    st.subheader("📈 Performance Overview")
    
    # Key Performance Indicators
    col_kpi1, col_kpi2, col_kpi3, col_kpi4 = st.columns(4)
    
    # Calculate KPIs
    total_ideas = len(ideas_data)
    active_projects = len([p for p in projects_data.get("projects", []) if p.get("status") == "active"])
    automation_runs = len(automation_data.get("executions", []))
    
    # Recent activity (last 7 days)
    recent_date = datetime.now() - timedelta(days=7)
    recent_metrics = df_filtered[df_filtered['date'] >= pd.Timestamp(recent_date)]
    
    with col_kpi1:
        st.markdown("""
        <div class="metric-card">
            <h3>💡 Total Ideas</h3>
            <h2>{}</h2>
            <p>Creative concepts</p>
        </div>
        """.format(total_ideas), unsafe_allow_html=True)
    
    with col_kpi2:
        st.markdown("""
        <div class="metric-card">
            <h3>🚀 Active Projects</h3>
            <h2>{}</h2>
            <p>In progress</p>
        </div>
        """.format(active_projects), unsafe_allow_html=True)
    
    with col_kpi3:
        recent_searches = recent_metrics[recent_metrics['metric'] == 'kb_searches']['value'].sum() if not recent_metrics.empty else 0
        st.markdown("""
        <div class="metric-card">
            <h3>🔍 KB Searches</h3>
            <h2>{}</h2>
            <p>Last 7 days</p>
        </div>
        """.format(int(recent_searches)), unsafe_allow_html=True)
    
    with col_kpi4:
        st.markdown("""
        <div class="metric-card">
            <h3>⚙️ Automations</h3>
            <h2>{}</h2>
            <p>Total runs</p>
        </div>
        """.format(automation_runs), unsafe_allow_html=True)
    
    # Trend analysis
    st.divider()
    st.markdown("### 📈 Trend Analysis")
    
    if not df_filtered.empty:
        # Multi-metric trend chart
        fig_trends = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Ideas Created', 'Tasks Completed', 'KB Searches', 'Prompts Used'),
            specs=[[{"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"secondary_y": False}]]
        )
        
        metrics_to_plot = ['ideas_created', 'tasks_completed', 'kb_searches', 'prompts_used']
        positions = [(1,1), (1,2), (2,1), (2,2)]
        
        for metric, (row, col) in zip(metrics_to_plot, positions):
            metric_data = df_filtered[df_filtered['metric'] == metric]
            if not metric_data.empty:
                fig_trends.add_trace(
                    go.Scatter(
                        x=metric_data['date'],
                        y=metric_data['value'],
                        mode='lines+markers',
                        name=metric.replace('_', ' ').title(),
                        line=dict(width=2)
                    ),
                    row=row, col=col
                )
        
        fig_trends.update_layout(
            height=600,
            title_text="Daily Activity Trends",
            showlegend=False
        )
        
        st.plotly_chart(fig_trends, use_container_width=True)
    
    # Performance summary
    st.divider()
    st.markdown("### 📊 Performance Summary")
    
    col_perf1, col_perf2 = st.columns(2)
    
    with col_perf1:
        # Weekly comparison
        if not df_filtered.empty:
            current_week = df_filtered[df_filtered['date'] >= pd.Timestamp(datetime.now() - timedelta(days=7))]
            previous_week = df_filtered[
                (df_filtered['date'] >= pd.Timestamp(datetime.now() - timedelta(days=14))) &
                (df_filtered['date'] < pd.Timestamp(datetime.now() - timedelta(days=7)))
            ]
            
            st.markdown("**📅 Weekly Comparison**")
            
            for metric in ['ideas_created', 'tasks_completed', 'kb_searches']:
                current_val = current_week[current_week['metric'] == metric]['value'].sum()
                previous_val = previous_week[previous_week['metric'] == metric]['value'].sum()
                
                if previous_val > 0:
                    change_pct = ((current_val - previous_val) / previous_val) * 100
                    change_class = "kpi-positive" if change_pct > 0 else "kpi-negative" if change_pct < 0 else "kpi-neutral"
                    change_icon = "📈" if change_pct > 0 else "📉" if change_pct < 0 else "➡️"
                else:
                    change_pct = 0
                    change_class = "kpi-neutral"
                    change_icon = "➡️"
                
                st.markdown(f"""
                **{metric.replace('_', ' ').title()}:** {int(current_val)} 
                <span class="{change_class}">{change_icon} {change_pct:+.1f}%</span>
                """, unsafe_allow_html=True)
    
    with col_perf2:
        # Top performing days
        if not df_filtered.empty:
            daily_totals = df_filtered.groupby('date')['value'].sum().sort_values(ascending=False)
            
            st.markdown("**🏆 Top Performing Days**")
            
            for i, (date, total) in enumerate(daily_totals.head(5).items()):
                rank_icon = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i]
                st.markdown(f"{rank_icon} {date.strftime('%Y-%m-%d')}: {int(total)} total activity")

with tab2:
    st.subheader("🎯 Productivity Analytics")
    
    # Productivity metrics
    productivity_metrics = df_filtered[df_filtered['category'] == 'productivity'] if 'category' in df_filtered.columns else pd.DataFrame()
    
    if not productivity_metrics.empty:
        # Ideas vs Tasks completion
        col_prod1, col_prod2 = st.columns(2)
        
        with col_prod1:
            ideas_data_chart = productivity_metrics[productivity_metrics['metric'] == 'ideas_created']
            if not ideas_data_chart.empty:
                fig_ideas = px.line(
                    ideas_data_chart,
                    x='date',
                    y='value',
                    title='💡 Ideas Created Over Time',
                    markers=True
                )
                fig_ideas.update_traces(line_color='#667eea')
                st.plotly_chart(fig_ideas, use_container_width=True)
        
        with col_prod2:
            tasks_data_chart = productivity_metrics[productivity_metrics['metric'] == 'tasks_completed']
            if not tasks_data_chart.empty:
                fig_tasks = px.line(
                    tasks_data_chart,
                    x='date',
                    y='value',
                    title='✅ Tasks Completed Over Time',
                    markers=True
                )
                fig_tasks.update_traces(line_color='#28a745')
                st.plotly_chart(fig_tasks, use_container_width=True)
        
        # Productivity heatmap
        st.markdown("### 📅 Productivity Heatmap")
        
        # Create heatmap data
        heatmap_data = productivity_metrics.pivot_table(
            index=productivity_metrics['date'].dt.day_name(),
            columns=productivity_metrics['date'].dt.hour,
            values='value',
            aggfunc='mean'
        )
        
        if not heatmap_data.empty:
            fig_heatmap = px.imshow(
                heatmap_data,
                title="Average Productivity by Day and Hour",
                labels=dict(x="Hour of Day", y="Day of Week", color="Activity Level"),
                color_continuous_scale="Blues"
            )
            st.plotly_chart(fig_heatmap, use_container_width=True)
    
    # Project status analysis
    if projects_data.get("projects"):
        st.divider()
        st.markdown("### 🚀 Project Status Analysis")
        
        projects = projects_data["projects"]
        status_counts = {}
        
        for project in projects:
            status = project.get("status", "unknown")
            status_counts[status] = status_counts.get(status, 0) + 1
        
        if status_counts:
            fig_projects = px.pie(
                values=list(status_counts.values()),
                names=list(status_counts.keys()),
                title="Project Status Distribution",
                color_discrete_map={
                    'active': '#007bff',
                    'completed': '#28a745',
                    'on_hold': '#ffc107',
                    'cancelled': '#dc3545'
                }
            )
            st.plotly_chart(fig_projects, use_container_width=True)

with tab3:
    st.subheader("🤖 AI & Automation Metrics")
    
    # AI usage metrics
    ai_metrics = df_filtered[df_filtered['category'] == 'ai'] if 'category' in df_filtered.columns else pd.DataFrame()
    
    if not ai_metrics.empty:
        col_ai1, col_ai2 = st.columns(2)
        
        with col_ai1:
            kb_searches = ai_metrics[ai_metrics['metric'] == 'kb_searches']
            if not kb_searches.empty:
                fig_kb = px.bar(
                    kb_searches,
                    x='date',
                    y='value',
                    title='🔍 Knowledge Base Searches',
                    color='value',
                    color_continuous_scale='Blues'
                )
                st.plotly_chart(fig_kb, use_container_width=True)
        
        with col_ai2:
            prompts_used = ai_metrics[ai_metrics['metric'] == 'prompts_used']
            if not prompts_used.empty:
                fig_prompts = px.bar(
                    prompts_used,
                    x='date',
                    y='value',
                    title='📝 Prompts Used',
                    color='value',
                    color_continuous_scale='Greens'
                )
                st.plotly_chart(fig_prompts, use_container_width=True)
    
    # Automation analytics
    if automation_data.get("executions"):
        st.divider()
        st.markdown("### ⚙️ Automation Performance")
        
        executions = automation_data["executions"]
        
        # Success rate analysis
        success_count = len([e for e in executions if e.get('status') == 'success'])
        total_count = len(executions)
        success_rate = (success_count / total_count * 100) if total_count > 0 else 0
        
        col_auto1, col_auto2, col_auto3 = st.columns(3)
        
        col_auto1.metric("Total Executions", total_count)
        col_auto2.metric("Success Rate", f"{success_rate:.1f}%")
        col_auto3.metric("Failed Executions", total_count - success_count)
        
        # Execution timeline
        if executions:
            df_executions = pd.DataFrame(executions)
            if 'timestamp' in df_executions.columns:
                df_executions['timestamp'] = pd.to_datetime(df_executions['timestamp'])
                df_executions['date'] = df_executions['timestamp'].dt.date
                
                daily_executions = df_executions.groupby('date').size().reset_index(name='count')
                
                fig_auto_timeline = px.line(
                    daily_executions,
                    x='date',
                    y='count',
                    title='Daily Automation Executions',
                    markers=True
                )
                st.plotly_chart(fig_auto_timeline, use_container_width=True)

with tab4:
    st.subheader("📱 Social Media Analytics")
    
    # Social media metrics
    social_metrics = df_filtered[df_filtered['category'] == 'social'] if 'category' in df_filtered.columns else pd.DataFrame()
    
    if not social_metrics.empty:
        # YouTube metrics
        col_yt1, col_yt2 = st.columns(2)
        
        with col_yt1:
            yt_subs = social_metrics[social_metrics['metric'] == 'yt_subs']
            if not yt_subs.empty:
                fig_subs = px.line(
                    yt_subs,
                    x='date',
                    y='value',
                    title='📺 YouTube Subscribers Growth',
                    markers=True
                )
                fig_subs.update_traces(line_color='#ff0000')
                st.plotly_chart(fig_subs, use_container_width=True)
        
        with col_yt2:
            yt_views = social_metrics[social_metrics['metric'] == 'yt_views']
            if not yt_views.empty:
                fig_views = px.line(
                    yt_views,
                    x='date',
                    y='value',
                    title='👀 YouTube Views',
                    markers=True
                )
                fig_views.update_traces(line_color='#ff6b6b')
                st.plotly_chart(fig_views, use_container_width=True)
        
        # Growth rate analysis
        st.divider()
        st.markdown("### 📈 Growth Rate Analysis")
        
        if not yt_subs.empty:
            # Calculate growth rate
            yt_subs_sorted = yt_subs.sort_values('date')
            if len(yt_subs_sorted) > 1:
                first_value = yt_subs_sorted.iloc[0]['value']
                last_value = yt_subs_sorted.iloc[-1]['value']
                days_diff = (yt_subs_sorted.iloc[-1]['date'] - yt_subs_sorted.iloc[0]['date']).days
                
                if days_diff > 0 and first_value > 0:
                    growth_rate = ((last_value - first_value) / first_value) * 100
                    daily_growth = growth_rate / days_diff
                    
                    col_growth1, col_growth2, col_growth3 = st.columns(3)
                    
                    col_growth1.metric("Total Growth", f"{growth_rate:+.1f}%")
                    col_growth2.metric("Daily Growth Rate", f"{daily_growth:+.3f}%")
                    col_growth3.metric("Net Subscribers", f"{int(last_value - first_value):+}")

with tab5:
    st.subheader("📊 Custom Analytics")
    
    # Custom metric builder
    st.markdown("### 🛠️ Custom Metric Builder")
    
    col_custom1, col_custom2 = st.columns(2)
    
    with col_custom1:
        available_metrics = df_filtered['metric'].unique() if not df_filtered.empty else []
        selected_metric = st.selectbox("Select Metric", available_metrics)
        
        chart_type = st.selectbox("Chart Type", ["Line", "Bar", "Area", "Scatter"])
        
        if st.button("Generate Custom Chart"):
            if selected_metric and not df_filtered.empty:
                metric_data = df_filtered[df_filtered['metric'] == selected_metric]
                
                if not metric_data.empty:
                    if chart_type == "Line":
                        fig_custom = px.line(metric_data, x='date', y='value', title=f'{selected_metric} - Line Chart')
                    elif chart_type == "Bar":
                        fig_custom = px.bar(metric_data, x='date', y='value', title=f'{selected_metric} - Bar Chart')
                    elif chart_type == "Area":
                        fig_custom = px.area(metric_data, x='date', y='value', title=f'{selected_metric} - Area Chart')
                    else:  # Scatter
                        fig_custom = px.scatter(metric_data, x='date', y='value', title=f'{selected_metric} - Scatter Plot')
                    
                    st.plotly_chart(fig_custom, use_container_width=True)
    
    with col_custom2:
        st.markdown("### 📈 Correlation Analysis")
        
        if len(available_metrics) >= 2:
            metric1 = st.selectbox("First Metric", available_metrics, key="corr1")
            metric2 = st.selectbox("Second Metric", available_metrics, key="corr2")
            
            if st.button("Calculate Correlation") and metric1 != metric2:
                data1 = df_filtered[df_filtered['metric'] == metric1][['date', 'value']].rename(columns={'value': metric1})
                data2 = df_filtered[df_filtered['metric'] == metric2][['date', 'value']].rename(columns={'value': metric2})
                
                merged_data = pd.merge(data1, data2, on='date', how='inner')
                
                if len(merged_data) > 1:
                    correlation = merged_data[metric1].corr(merged_data[metric2])
                    
                    st.metric("Correlation Coefficient", f"{correlation:.3f}")
                    
                    # Scatter plot for correlation
                    fig_corr = px.scatter(
                        merged_data,
                        x=metric1,
                        y=metric2,
                        title=f'Correlation: {metric1} vs {metric2}',
                        trendline="ols"
                    )
                    st.plotly_chart(fig_corr, use_container_width=True)
    
    # Export analytics
    st.divider()
    st.markdown("### 📤 Export Analytics")
    
    col_export1, col_export2 = st.columns(2)
    
    with col_export1:
        if st.button("📊 Export Current Data", use_container_width=True):
            if not df_filtered.empty:
                csv_data = df_filtered.to_csv(index=False)
                st.download_button(
                    label="📥 Download CSV",
                    data=csv_data,
                    file_name=f"brzi_analytics_{datetime.now().strftime('%Y%m%d')}.csv",
                    mime="text/csv"
                )
    
    with col_export2:
        if st.button("📋 Generate Report", use_container_width=True):
            # Generate summary report
            report = f"""
# BRZI AI Dashboard Analytics Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary Statistics
- Total Ideas: {len(ideas_data)}
- Active Projects: {len([p for p in projects_data.get("projects", []) if p.get("status") == "active"])}
- Automation Runs: {len(automation_data.get("executions", []))}
- Date Range: {start_date} to {end_date}

## Key Insights
- Most productive day: {df_filtered.groupby('date')['value'].sum().idxmax().strftime('%Y-%m-%d') if not df_filtered.empty else 'N/A'}
- Average daily activity: {df_filtered.groupby('date')['value'].sum().mean():.1f} if not df_filtered.empty else 0
- Top metric category: {df_filtered['category'].value_counts().index[0] if not df_filtered.empty and 'category' in df_filtered.columns else 'N/A'}

Generated by BRZI AI Dashboard Analytics Engine
            """
            
            st.download_button(
                label="📥 Download Report",
                data=report,
                file_name=f"brzi_analytics_report_{datetime.now().strftime('%Y%m%d')}.md",
                mime="text/markdown"
            )

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("⚙️ Settings", use_container_width=True):
        st.switch_page("pages/09_Settings.py")

with col_nav2:
    if st.button("🤖 AI Agents", use_container_width=True):
        st.switch_page("pages/06_Agents.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
