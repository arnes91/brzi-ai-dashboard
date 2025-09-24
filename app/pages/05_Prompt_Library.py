import streamlit as st
import yaml
import json
import pandas as pd
from pathlib import Path
from datetime import datetime
import plotly.express as px

# Page config
st.set_page_config(page_title="Prompt Library - BRZI AI Dashboard", page_icon="📝", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .prompt-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .category-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }
    .prompt-meta {
        background: #f8f9fa;
        padding: 0.5rem;
        border-radius: 5px;
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }
    .copy-button {
        background: #28a745;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
    }
    .tag {
        background: #e9ecef;
        padding: 0.25rem 0.5rem;
        border-radius: 15px;
        font-size: 0.8rem;
        margin: 0.25rem;
        display: inline-block;
    }
</style>
""", unsafe_allow_html=True)

# Base paths
DATA = Path(__file__).resolve().parents[1] / "data"
fp = DATA / "prompts.yaml"

st.title("📝 Prompt Library")
st.caption("Organize and manage your AI prompts with categories, tags, and usage tracking")

# Load prompts
if fp.exists():
    db = yaml.safe_load(open(fp, "r", encoding="utf-8"))
else:
    db = {"categories": {}}

categories = db.get("categories", {})

# Sidebar
st.sidebar.header("🔧 Prompt Tools")

# Category filter
all_categories = list(categories.keys())
if all_categories:
    selected_categories = st.sidebar.multiselect(
        "Filter Categories", 
        all_categories, 
        default=all_categories
    )
else:
    selected_categories = []

# Search
search_term = st.sidebar.text_input("🔍 Search Prompts", placeholder="Search by name or content...")

# Quick actions
st.sidebar.divider()
if st.sidebar.button("➕ Add New Prompt", use_container_width=True):
    st.session_state.show_add_form = True

if st.sidebar.button("📊 Export Library", use_container_width=True):
    if categories:
        # Create export data
        export_data = []
        for cat_name, prompts in categories.items():
            for prompt in prompts:
                export_data.append({
                    'category': cat_name,
                    'name': prompt.get('name', ''),
                    'prompt': prompt.get('prompt', ''),
                    'description': prompt.get('description', ''),
                    'tags': ', '.join(prompt.get('tags', [])),
                    'usage_count': prompt.get('usage_count', 0)
                })
        
        df_export = pd.DataFrame(export_data)
        csv = df_export.to_csv(index=False)
        st.sidebar.download_button(
            label="Download CSV",
            data=csv,
            file_name=f"brzi_prompts_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )

# Main content
if categories:
    # Overview metrics
    total_prompts = sum(len(prompts) for prompts in categories.values())
    total_categories = len(categories)
    
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total Prompts", total_prompts)
    col2.metric("Categories", total_categories)
    
    # Calculate most used category
    category_sizes = {cat: len(prompts) for cat, prompts in categories.items()}
    largest_category = max(category_sizes, key=category_sizes.get) if category_sizes else "None"
    col3.metric("Largest Category", largest_category)
    
    # Calculate average usage
    all_usage = []
    for prompts in categories.values():
        for prompt in prompts:
            all_usage.append(prompt.get('usage_count', 0))
    avg_usage = sum(all_usage) / len(all_usage) if all_usage else 0
    col4.metric("Avg Usage", f"{avg_usage:.1f}")
    
    # Category distribution chart
    if category_sizes:
        fig_cat = px.pie(
            values=list(category_sizes.values()),
            names=list(category_sizes.keys()),
            title="Prompts by Category"
        )
        st.plotly_chart(fig_cat, use_container_width=True)
    
    st.divider()
    
    # Filter and display prompts
    filtered_categories = {k: v for k, v in categories.items() if k in selected_categories}
    
    for cat_name, prompts in filtered_categories.items():
        # Filter prompts by search term
        if search_term:
            filtered_prompts = [
                p for p in prompts 
                if search_term.lower() in p.get('name', '').lower() or 
                   search_term.lower() in p.get('prompt', '').lower() or
                   search_term.lower() in p.get('description', '').lower()
            ]
        else:
            filtered_prompts = prompts
        
        if not filtered_prompts:
            continue
            
        st.markdown(f"""
        <div class="category-header">
            <h3>📁 {cat_name} ({len(filtered_prompts)} prompts)</h3>
        </div>
        """, unsafe_allow_html=True)
        
        for i, prompt in enumerate(filtered_prompts):
            prompt_name = prompt.get('name', f'Prompt {i+1}')
            prompt_text = prompt.get('prompt', '')
            prompt_desc = prompt.get('description', 'No description provided')
            prompt_tags = prompt.get('tags', [])
            usage_count = prompt.get('usage_count', 0)
            
            with st.expander(f"📝 {prompt_name}", expanded=False):
                col_content, col_actions = st.columns([3, 1])
                
                with col_content:
                    st.markdown(f"**Description:** {prompt_desc}")
                    
                    if prompt_tags:
                        tags_html = ''.join([f'<span class="tag">{tag}</span>' for tag in prompt_tags])
                        st.markdown(f"**Tags:** {tags_html}", unsafe_allow_html=True)
                    
                    st.markdown("**Prompt:**")
                    st.code(prompt_text, language="text")
                    
                    st.markdown(f"""
                    <div class="prompt-meta">
                        <strong>Usage Count:</strong> {usage_count} | 
                        <strong>Length:</strong> {len(prompt_text)} chars | 
                        <strong>Words:</strong> {len(prompt_text.split())}
                    </div>
                    """, unsafe_allow_html=True)
                
                with col_actions:
                    if st.button(f"📋 Copy", key=f"copy_{cat_name}_{i}", use_container_width=True):
                        st.session_state[f"copied_{cat_name}_{i}"] = True
                        # Update usage count
                        prompt['usage_count'] = usage_count + 1
                        with open(fp, "w", encoding="utf-8") as f:
                            yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
                        st.success("Copied to clipboard!")
                    
                    if st.session_state.get(f"copied_{cat_name}_{i}", False):
                        st.text_area("Copied Text", prompt_text, height=100, disabled=True, key=f"textarea_{cat_name}_{i}")
                    
                    if st.button(f"✏️ Edit", key=f"edit_{cat_name}_{i}", use_container_width=True):
                        st.session_state[f"edit_prompt_{cat_name}_{i}"] = True
                    
                    if st.button(f"🗑️ Delete", key=f"delete_{cat_name}_{i}", use_container_width=True):
                        # Remove prompt
                        categories[cat_name].remove(prompt)
                        with open(fp, "w", encoding="utf-8") as f:
                            yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
                        st.success("Prompt deleted!")
                        st.rerun()
                
                # Edit form
                if st.session_state.get(f"edit_prompt_{cat_name}_{i}", False):
                    st.divider()
                    st.markdown("### ✏️ Edit Prompt")
                    
                    with st.form(f"edit_form_{cat_name}_{i}"):
                        new_name = st.text_input("Name", value=prompt_name)
                        new_desc = st.text_area("Description", value=prompt_desc)
                        new_prompt = st.text_area("Prompt", value=prompt_text, height=150)
                        new_tags = st.text_input("Tags (comma-separated)", value=", ".join(prompt_tags))
                        
                        col_save, col_cancel = st.columns(2)
                        
                        with col_save:
                            if st.form_submit_button("💾 Save Changes", use_container_width=True):
                                # Update prompt
                                prompt['name'] = new_name
                                prompt['description'] = new_desc
                                prompt['prompt'] = new_prompt
                                prompt['tags'] = [tag.strip() for tag in new_tags.split(',') if tag.strip()]
                                
                                with open(fp, "w", encoding="utf-8") as f:
                                    yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
                                
                                st.session_state[f"edit_prompt_{cat_name}_{i}"] = False
                                st.success("Prompt updated!")
                                st.rerun()
                        
                        with col_cancel:
                            if st.form_submit_button("❌ Cancel", use_container_width=True):
                                st.session_state[f"edit_prompt_{cat_name}_{i}"] = False
                                st.rerun()

else:
    st.info("No prompts found. Add your first prompt to get started!")

# Add new prompt form
if st.session_state.get('show_add_form', False):
    st.divider()
    st.subheader("➕ Add New Prompt")
    
    with st.form("add_prompt", clear_on_submit=True):
        col_form1, col_form2 = st.columns(2)
        
        with col_form1:
            prompt_name = st.text_input("Prompt Name", placeholder="Enter a descriptive name...")
            prompt_category = st.selectbox(
                "Category", 
                options=list(categories.keys()) + ["+ Create New Category"],
                index=0 if categories else 0
            )
            
            if prompt_category == "+ Create New Category":
                new_category = st.text_input("New Category Name", placeholder="Enter category name...")
                prompt_category = new_category
        
        with col_form2:
            prompt_desc = st.text_area("Description", placeholder="Describe what this prompt does...")
            prompt_tags = st.text_input("Tags", placeholder="ai, productivity, automation")
        
        prompt_text = st.text_area("Prompt Content", placeholder="Enter your prompt here...", height=200)
        
        submitted = st.form_submit_button("✨ Add Prompt", use_container_width=True)
        
        if submitted and prompt_name and prompt_text and prompt_category:
            # Create new prompt
            new_prompt = {
                "name": prompt_name,
                "description": prompt_desc,
                "prompt": prompt_text,
                "tags": [tag.strip() for tag in prompt_tags.split(',') if tag.strip()],
                "usage_count": 0,
                "created_date": datetime.now().isoformat()[:10]
            }
            
            # Add to category
            if prompt_category not in categories:
                categories[prompt_category] = []
            
            categories[prompt_category].append(new_prompt)
            
            # Save to file
            with open(fp, "w", encoding="utf-8") as f:
                yaml.dump(db, f, default_flow_style=False, allow_unicode=True)
            
            st.success("🎉 Prompt added successfully!")
            st.session_state.show_add_form = False
            st.rerun()
    
    if st.button("❌ Cancel"):
        st.session_state.show_add_form = False
        st.rerun()

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("🤖 AI Agents", use_container_width=True):
        st.switch_page("pages/06_Agents.py")

with col_nav2:
    if st.button("⚙️ Automations", use_container_width=True):
        st.switch_page("pages/07_Automations.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
