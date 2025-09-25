import streamlit as st
import os
import json
import yaml
import pandas as pd
import plotly.express as px
from pathlib import Path
import subprocess
import sys
from datetime import datetime
import time

# Page config
st.set_page_config(page_title="Knowledge Base - BRZI AI Dashboard", page_icon="📚", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .search-result {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .file-item {
        background: #f8f9fa;
        padding: 0.75rem;
        margin: 0.5rem 0;
        border-radius: 5px;
        border-left: 3px solid #dee2e6;
    }
    .file-type-md { border-left-color: #007bff; }
    .file-type-pdf { border-left-color: #dc3545; }
    .file-type-txt { border-left-color: #28a745; }
    .file-type-yaml { border-left-color: #ffc107; }
    .file-type-json { border-left-color: #17a2b8; }
    .score-high { background: #d4edda; }
    .score-medium { background: #fff3cd; }
    .score-low { background: #f8d7da; }
</style>
""", unsafe_allow_html=True)

# Base paths
# Determine the root of the repository dynamically
ROOT = Path(__file__).resolve().parents[2] # Assuming app/pages/04_Knowledge_Base.py is 2 levels deep from root

# Define key directories relative to ROOT
SCRIPTS_DIR = ROOT / "scripts"
KB_DIR = ROOT / "data" / "knowledge"
INDEX_DIR = ROOT / "data" / "indexes"
REPORTS_DIR = ROOT / "data" / "reports"

# Ensure index and knowledge base directories exist
KB_DIR.mkdir(parents=True, exist_ok=True)
INDEX_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# For backward compatibility with existing code that might use these names
BASE = Path(__file__).resolve().parent # This page's directory
DATA = ROOT / "data"
KB = KB_DIR
INDEXES = INDEX_DIR
REPORTS = REPORTS_DIR

st.title("📚 Knowledge Base")
st.caption("AI-powered semantic search with local FAISS indexing for your documents and knowledge")

# Sidebar
st.sidebar.header("🔧 Knowledge Base Tools")

# Index status
index_exists = (INDEXES / "faiss.index").exists()
meta_exists = (INDEXES / "meta.pkl").exists()

if index_exists and meta_exists:
    st.sidebar.success("✅ Search Index Ready")
    # Get index stats
    try:
        import pickle
        meta = pickle.load(open(INDEXES / "meta.pkl", "rb"))
        st.sidebar.metric("Indexed Documents", len(meta))
    except:
        st.sidebar.warning("Index metadata corrupted")
else:
    st.sidebar.warning("⚠️ Search Index Not Built")

# Quick actions
st.sidebar.divider()
if st.sidebar.button("🔄 Rebuild Index", use_container_width=True):
    st.session_state.rebuild_index = True

if st.sidebar.button("📊 View Reports", use_container_width=True):
    st.session_state.show_reports = True

if st.sidebar.button("📁 Browse Files", use_container_width=True):
    st.session_state.show_files = True

# Main content
tab1, tab2, tab3, tab4 = st.tabs(["🔍 Search", "📁 Files", "🔧 Index Management", "📊 Reports"])

with tab1:
    st.subheader("🔍 Semantic Search")
    
    if index_exists and meta_exists:
        # Search interface
        col_search, col_filters = st.columns([3, 1])
        
        with col_search:
            query = st.text_input(
                "Search your knowledge base", 
                placeholder="Enter your search query...",
                help="Use natural language to search through your documents"
            )
            
        with col_filters:
            num_results = st.selectbox("Results", [5, 10, 15, 20], index=0)
            min_score = st.slider("Min Relevance", 0.0, 1.0, 0.3, 0.1)
        
        if query:
            with st.spinner("Searching..."):
                try:
                    # Perform search
                    import numpy as np
                    import faiss
                    import pickle
                    from sentence_transformers import SentenceTransformer
                    
                    # Load index and metadata
                    index = faiss.read_index(str(INDEXES / "faiss.index"))
                    meta = pickle.load(open(INDEXES / "meta.pkl", "rb"))
                    
                    # Load model and encode query
                    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
                    qv = model.encode([query])
                    
                    # Search
                    D, I = index.search(qv, num_results)
                    
                    st.markdown(f"### 📋 Search Results for: *{query}*")
                    
                    results_found = False
                    for i, (score, idx) in enumerate(zip(D[0], I[0])):
                        if idx == -1:
                            continue
                            
                        # Convert distance to similarity score (lower distance = higher similarity)
                        similarity = 1 / (1 + score)
                        
                        if similarity < min_score:
                            continue
                            
                        results_found = True
                        rec = meta[idx]
                        
                        # Determine score class
                        if similarity > 0.7:
                            score_class = "score-high"
                        elif similarity > 0.5:
                            score_class = "score-medium"
                        else:
                            score_class = "score-low"
                        
                        # Display result
                        st.markdown(f"""
                        <div class="search-result {score_class}">
                            <h4>📄 {rec['relpath']}</h4>
                            <p><strong>Relevance Score:</strong> {similarity:.3f}</p>
                            <p><strong>Content Preview:</strong> {rec.get('content', 'No preview available')[:200]}...</p>
                            <small><strong>File Type:</strong> {Path(rec['relpath']).suffix}</small>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        # Show file content if available
                        file_path = KB / rec['relpath']
                        if file_path.exists() and file_path.suffix in ['.md', '.txt']:
                            with st.expander(f"View content: {rec['relpath']}"):
                                try:
                                    content = file_path.read_text(encoding='utf-8')
                                    st.text_area("Content", content, height=200, disabled=True)
                                except Exception as e:
                                    st.error(f"Error reading file: {e}")
                    
                    if not results_found:
                        st.info("No results found matching your criteria. Try adjusting the relevance threshold or using different keywords.")
                        
                except Exception as e:
                    st.error(f"Search error: {e}")
                    st.info("Try rebuilding the index if the error persists.")
    else:
        st.warning("🔧 Search index not available. Please build the index first.")
        if st.button("🚀 Build Index Now", use_container_width=True):
            st.session_state.rebuild_index = True
            st.rerun()

with tab2:
    st.subheader("📁 File Browser")
    
    # Get all files
    files = list(KB.glob("**/*"))
    files = [f for f in files if f.is_file()]
    
    if files:
        # File statistics
        col_stat1, col_stat2, col_stat3, col_stat4 = st.columns(4)
        
        file_types = {}
        total_size = 0
        for f in files:
            ext = f.suffix.lower()
            file_types[ext] = file_types.get(ext, 0) + 1
            try:
                total_size += f.stat().st_size
            except:
                pass
        
        col_stat1.metric("Total Files", len(files))
        col_stat2.metric("File Types", len(file_types))
        col_stat3.metric("Total Size", f"{total_size / (1024*1024):.1f} MB")
        col_stat4.metric("Indexed", "Yes" if index_exists else "No")
        
        # File type distribution
        if file_types:
            fig_types = px.pie(
                values=list(file_types.values()),
                names=list(file_types.keys()),
                title="File Types Distribution"
            )
            st.plotly_chart(fig_types, use_container_width=True)
        
        # File list with search
        search_files = st.text_input("🔍 Filter files", placeholder="Search by filename...")
        
        filtered_files = files
        if search_files:
            filtered_files = [f for f in files if search_files.lower() in f.name.lower()]
        
        st.markdown(f"### 📋 Files ({len(filtered_files)} of {len(files)})")
        
        for file_path in sorted(filtered_files)[:100]:  # Limit to first 100
            rel_path = file_path.relative_to(KB)
            file_ext = file_path.suffix.lower()
            file_class = f"file-type-{file_ext[1:]}" if file_ext else "file-type-unknown"
            
            try:
                file_size = file_path.stat().st_size
                file_size_str = f"{file_size / 1024:.1f} KB" if file_size < 1024*1024 else f"{file_size / (1024*1024):.1f} MB"
                mod_time = datetime.fromtimestamp(file_path.stat().st_mtime).strftime("%Y-%m-%d %H:%M")
            except:
                file_size_str = "Unknown"
                mod_time = "Unknown"
            
            st.markdown(f"""
            <div class="file-item {file_class}">
                <strong>📄 {rel_path}</strong><br>
                <small>Size: {file_size_str} | Modified: {mod_time} | Type: {file_ext or 'No extension'}</small>
            </div>
            """, unsafe_allow_html=True)
            
        if len(filtered_files) > 100:
            st.info(f"Showing first 100 files. {len(filtered_files) - 100} more files available.")
    else:
        st.info("No files found in the knowledge base. Add documents to the data/knowledge/ directory.")

with tab3:
    st.subheader("🔧 Index Management")
    
    # Index information
    if index_exists:
        st.success("✅ FAISS index exists")
        try:
            index_path = INDEXES / "faiss.index"
            index_size = index_path.stat().st_size
            index_modified = datetime.fromtimestamp(index_path.stat().st_mtime)
            
            col_idx1, col_idx2 = st.columns(2)
            col_idx1.metric("Index Size", f"{index_size / 1024:.1f} KB")
            col_idx2.metric("Last Updated", index_modified.strftime("%Y-%m-%d %H:%M"))
        except Exception as e:
            st.warning(f"Could not read index info: {e}")
    else:
        st.warning("⚠️ No FAISS index found")
    
    st.markdown("### Build/Rebuild Index")
    st.info("This process will scan all documents in the knowledge base and create a searchable vector index using sentence-transformers.")
    
    # Handle index rebuild
    if st.session_state.get('rebuild_index', False):
        st.session_state.rebuild_index = False
        
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        status_text.text("Starting index build...")
        progress_bar.progress(10)
        
        try:
            # Run the index building script
            result = subprocess.run(
                [sys.executable, str(SCRIPTS_DIR / "build_vector_index.py")],
                capture_output=True,
                text=True,
                cwd=str(ROOT) # Set CWD to the repository root
            )

            
            progress_bar.progress(90)
            status_text.text("Finalizing...")
            
            if result.returncode == 0:
                progress_bar.progress(100)
                status_text.text("Index built successfully!")
                st.success("🎉 Index built successfully!")
                if result.stdout:
                    st.text_area("Build Output", result.stdout, height=150)
                time.sleep(2)
                st.rerun()
            else:
                st.error(f"Index build failed with exit code {result.returncode}")
                if result.stderr:
                    st.text_area("Error Output", result.stderr, height=150)
                if result.stdout:
                    st.text_area("Standard Output", result.stdout, height=150)
        except Exception as e:
            st.error(f"Failed to run index build script: {e}")
        
        progress_bar.empty()
        status_text.empty()
    
    if st.button("🚀 Build/Rebuild Index", use_container_width=True):
        st.session_state.rebuild_index = True
        st.rerun()
    
    st.markdown("### Advanced Options")
    
    col_adv1, col_adv2 = st.columns(2)
    
    with col_adv1:
        if st.button("🗑️ Clear Index", use_container_width=True):
            try:
                if (INDEXES / "faiss.index").exists():
                    (INDEXES / "faiss.index").unlink()
                if (INDEXES / "meta.pkl").exists():
                    (INDEXES / "meta.pkl").unlink()
                st.success("Index cleared successfully!")
                st.rerun()
            except Exception as e:
                st.error(f"Failed to clear index: {e}")
    
    with col_adv2:
        if st.button("📊 Index Statistics", use_container_width=True):
            if index_exists and meta_exists:
                try:
                    import pickle
                    import faiss
                    
                    meta = pickle.load(open(INDEXES / "meta.pkl", "rb"))
                    index = faiss.read_index(str(INDEXES / "faiss.index"))
                    
                    st.json({
                        "total_documents": len(meta),
                        "index_dimension": index.d,
                        "index_type": str(type(index)),
                        "sample_documents": [m['relpath'] for m in meta[:5]]
                    })
                except Exception as e:
                    st.error(f"Failed to load index stats: {e}")
            else:
                st.warning("Index not available")

with tab4:
    st.subheader("📊 Reports & Analytics")
    
    # Source catalog
    catalog_path = REPORTS / "source_catalog.csv"
    if catalog_path.exists():
        st.markdown("### 📋 Source Catalog")
        try:
            catalog_df = pd.read_csv(catalog_path)
            st.dataframe(catalog_df, use_container_width=True)
            
            # Download button
            csv_data = catalog_df.to_csv(index=False)
            st.download_button(
                "📥 Download Source Catalog",
                data=csv_data,
                file_name="source_catalog.csv",
                mime="text/csv"
            )
        except Exception as e:
            st.error(f"Failed to load source catalog: {e}")
    
    # Conflicts report
    conflicts_path = REPORTS / "conflicts_report.md"
    if conflicts_path.exists():
        st.markdown("### ⚠️ Conflicts Report")
        try:
            conflicts_content = conflicts_path.read_text(encoding='utf-8')
            st.markdown(conflicts_content)
            
            # Download button
            st.download_button(
                "📥 Download Conflicts Report",
                data=conflicts_content,
                file_name="conflicts_report.md",
                mime="text/markdown"
            )
        except Exception as e:
            st.error(f"Failed to load conflicts report: {e}")
    
    if not catalog_path.exists() and not conflicts_path.exists():
        st.info("No reports available. Reports are generated during the initial setup and index building process.")

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("📝 Prompt Library", use_container_width=True):
        st.switch_page("pages/05_Prompt_Library.py")

with col_nav2:
    if st.button("🤖 AI Agents", use_container_width=True):
        st.switch_page("pages/06_Agents.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
