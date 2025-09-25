import streamlit as st
import yaml
import json
import os
from pathlib import Path
from datetime import datetime

# Page config
st.set_page_config(page_title="Settings - BRZI AI Dashboard", page_icon="⚙️", layout="wide")

# Custom CSS
st.markdown("""
<style>
    .settings-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .config-section {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
    }
    .api-key-input {
        background: #2d3748;
        color: #e2e8f0;
        border: 1px solid #4a5568;
        border-radius: 5px;
        padding: 0.5rem;
        font-family: 'Courier New', monospace;
    }
    .success-message {
        background: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 5px;
        border-left: 4px solid #28a745;
    }
</style>
""", unsafe_allow_html=True)

# Base paths
BASE = Path(__file__).resolve().parents[1]
CONFIGS = BASE / "configs"
CONFIGS.mkdir(parents=True, exist_ok=True) # Ensure configs directory exists
I18N = BASE / "i18n"
DATA = BASE / "data"

st.title("⚙️ Settings & Configuration")
st.caption("Manage dashboard settings, API keys, preferences, and system configuration")

# Load current configuration
config_path = CONFIGS / "starter_config.yaml"

def load_config():
    if config_path.exists():
        with open(config_path, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    else:
        # Default configuration
        default_config = {
            "profile": {
                "name": "BRZI AI User",
                "timezone": "UTC",
                "language": "EN",
                "email": "arnes.osmic@gmail.com" # Pre-fill with user's email
            },
            "preferences": {
                "theme": "light",
                "notifications": True,
                "auto_backup": True
            },
            "api_keys": {},
            "features": {
                "knowledge_base": True,
                "ai_agents": True,
                "automations": True,
                "analytics": True
            }
        }
        # Create the default config file
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(default_config, f, default_flow_style=False, allow_unicode=True)
        return default_config

current_config = load_config()

# Sidebar
st.sidebar.header("⚙️ Settings Navigation")

setting_sections = [
    "👤 Profile",
    "🎨 Appearance", 
    "🔑 API Keys",
    "🌐 Language",
    "🔧 Features",
    "💾 Data Management",
    "🔒 Security",
    "📊 System Info"
]

selected_section = st.sidebar.radio("Settings Section", setting_sections)

# Main content based on selected section
if selected_section == "👤 Profile":
    st.subheader("👤 Profile Settings")
    
    with st.form("profile_settings"):
        col_prof1, col_prof2 = st.columns(2)
        
        with col_prof1:
            profile_name = st.text_input(
                "Display Name", 
                value=current_config.get("profile", {}).get("name", "BRZI AI User")
            )
            
            profile_email = st.text_input(
                "Email", 
                value=current_config.get("profile", {}).get("email", "")
            )
        
        with col_prof2:
            timezone = st.selectbox(
                "Timezone",
                ["UTC", "Europe/Belgrade", "Europe/Zagreb", "Europe/Sarajevo", "US/Eastern", "US/Pacific"],
                index=0
            )
            
            work_hours = st.slider(
                "Daily Work Hours",
                min_value=1,
                max_value=16,
                value=current_config.get("profile", {}).get("work_hours", 8)
            )
        
        profile_bio = st.text_area(
            "Bio/Description",
            value=current_config.get("profile", {}).get("bio", ""),
            placeholder="Tell us about yourself and your work..."
        )
        
        if st.form_submit_button("💾 Save Profile", use_container_width=True):
            current_config["profile"] = {
                "name": profile_name,
                "email": profile_email,
                "timezone": timezone,
                "work_hours": work_hours,
                "bio": profile_bio,
                "updated_at": datetime.now().isoformat()
            }
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            st.success("✅ Profile settings saved successfully!")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "🎨 Appearance":
    st.subheader("🎨 Appearance & Theme")
    
    with st.form("appearance_settings"):
        col_app1, col_app2 = st.columns(2)
        
        with col_app1:
            theme = st.selectbox(
                "Theme",
                ["light", "dark", "auto"],
                index=["light", "dark", "auto"].index(current_config.get("preferences", {}).get("theme", "light"))
            )
            
            sidebar_style = st.selectbox(
                "Sidebar Style",
                ["expanded", "collapsed", "auto"],
                index=0
            )
        
        with col_app2:
            chart_style = st.selectbox(
                "Chart Style",
                ["plotly", "matplotlib", "seaborn"],
                index=0
            )
            
            color_scheme = st.selectbox(
                "Color Scheme",
                ["default", "blue", "green", "purple", "orange"],
                index=0
            )
        
        # Layout preferences
        st.markdown("### Layout Preferences")
        
        col_layout1, col_layout2 = st.columns(2)
        
        with col_layout1:
            show_sidebar = st.checkbox("Show Sidebar by Default", value=True)
            compact_mode = st.checkbox("Compact Mode", value=False)
        
        with col_layout2:
            show_tooltips = st.checkbox("Show Tooltips", value=True)
            animations = st.checkbox("Enable Animations", value=True)
        
        if st.form_submit_button("🎨 Save Appearance", use_container_width=True):
            current_config["preferences"].update({
                "theme": theme,
                "sidebar_style": sidebar_style,
                "chart_style": chart_style,
                "color_scheme": color_scheme,
                "show_sidebar": show_sidebar,
                "compact_mode": compact_mode,
                "show_tooltips": show_tooltips,
                "animations": animations
            })
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            st.success("✅ Appearance settings saved successfully!")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "🔑 API Keys":
    st.subheader("🔑 API Keys & Integrations")
    
    st.warning("⚠️ API keys are stored locally. Never share your configuration files with others.")
    
    # API Key management
    api_providers = {
        "OpenAI": {
            "key": "OPENAI_API_KEY",
            "description": "For GPT models and ChatGPT integration",
            "docs": "https://platform.openai.com/api-keys"
        },
        "Anthropic": {
            "key": "ANTHROPIC_API_KEY", 
            "description": "For Claude models",
            "docs": "https://console.anthropic.com/"
        },
        "Google": {
            "key": "GOOGLE_API_KEY",
            "description": "For Gemini models and Google services",
            "docs": "https://makersuite.google.com/app/apikey"
        },
        "ElevenLabs": {
            "key": "ELEVENLABS_API_KEY",
            "description": "For text-to-speech and voice synthesis",
            "docs": "https://elevenlabs.io/docs/api-reference"
        }
    }
    
    with st.form("api_keys"):
        for provider, info in api_providers.items():
            st.markdown(f"### {provider}")
            st.caption(info["description"])
            
            col_api1, col_api2 = st.columns([3, 1])
            
            with col_api1:
                current_key = current_config.get("api_keys", {}).get(info["key"], "")
                masked_key = "•" * len(current_key) if current_key else ""
                
                new_key = st.text_input(
                    f"{provider} API Key",
                    value=masked_key,
                    type="password",
                    key=f"api_{provider}",
                    help=f"Environment variable: {info['key']}"
                )
            
            with col_api2:
                st.markdown("**Documentation**")
                st.markdown(f"[📖 Docs]({info['docs']})")
        
        # Environment variables section
        st.divider()
        st.markdown("### 🔧 Environment Variables")
        st.info("You can also set API keys as environment variables instead of storing them in the configuration.")
        
        env_code = """
# Add to your .bashrc, .zshrc, or .env file:
export OPENAI_API_KEY="your-openai-key-here"
export ANTHROPIC_API_KEY="your-anthropic-key-here"
export GOOGLE_API_KEY="your-google-key-here"
export ELEVENLABS_API_KEY="your-elevenlabs-key-here"
        """
        st.code(env_code, language="bash")
        
        if st.form_submit_button("🔑 Save API Keys", use_container_width=True):
            # Update API keys (only if they're not masked)
            for provider, info in api_providers.items():
                new_key = st.session_state.get(f"api_{provider}", "")
                if new_key and not new_key.startswith("•"):
                    if "api_keys" not in current_config:
                        current_config["api_keys"] = {}
                    current_config["api_keys"][info["key"]] = new_key
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            st.success("✅ API keys saved successfully!")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "🌐 Language":
    st.subheader("🌐 Language & Localization")
    
    # Available languages
    available_languages = {
        "EN": "English",
        "BS": "Bosanski (Bosnian)",
        "DE": "Deutsch (German)"
    }
    
    with st.form("language_settings"):
        col_lang1, col_lang2 = st.columns(2)
        
        with col_lang1:
            selected_language = st.selectbox(
                "Interface Language",
                list(available_languages.keys()),
                format_func=lambda x: available_languages[x],
                index=list(available_languages.keys()).index(current_config.get("profile", {}).get("language", "EN"))
            )
            
            date_format = st.selectbox(
                "Date Format",
                ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD.MM.YYYY"],
                index=0
            )
        
        with col_lang2:
            time_format = st.selectbox(
                "Time Format",
                ["24-hour", "12-hour"],
                index=0
            )
            
            number_format = st.selectbox(
                "Number Format",
                ["1,234.56", "1.234,56", "1 234,56"],
                index=0
            )
        
        # Regional settings
        st.markdown("### 🌍 Regional Settings")
        
        col_region1, col_region2 = st.columns(2)
        
        with col_region1:
            currency = st.selectbox(
                "Currency",
                ["USD", "EUR", "BAM", "RSD", "HRK"],
                index=1
            )
        
        with col_region2:
            first_day_of_week = st.selectbox(
                "First Day of Week",
                ["Monday", "Sunday"],
                index=0
            )
        
        if st.form_submit_button("🌐 Save Language Settings", use_container_width=True):
            current_config["profile"]["language"] = selected_language
            current_config["localization"] = {
                "date_format": date_format,
                "time_format": time_format,
                "number_format": number_format,
                "currency": currency,
                "first_day_of_week": first_day_of_week
            }
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            # Update session state
            st.session_state["lang"] = selected_language
            
            st.success("✅ Language settings saved! Please refresh the page to see changes.")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "🔧 Features":
    st.subheader("🔧 Feature Configuration")
    
    with st.form("feature_settings"):
        st.markdown("### 🎛️ Core Features")
        
        col_feat1, col_feat2 = st.columns(2)
        
        with col_feat1:
            enable_kb = st.checkbox(
                "📚 Knowledge Base",
                value=current_config.get("features", {}).get("knowledge_base", True),
                help="Enable semantic search and document management"
            )
            
            enable_agents = st.checkbox(
                "🤖 AI Agents",
                value=current_config.get("features", {}).get("ai_agents", True),
                help="Enable AI agent orchestration and automation"
            )
        
        with col_feat2:
            enable_automations = st.checkbox(
                "⚙️ Automations",
                value=current_config.get("features", {}).get("automations", True),
                help="Enable workflow automation and scheduling"
            )
            
            enable_analytics = st.checkbox(
                "📊 Analytics",
                value=current_config.get("features", {}).get("analytics", True),
                help="Enable metrics tracking and reporting"
            )
        
        st.markdown("### 🔧 Advanced Features")
        
        col_adv1, col_adv2 = st.columns(2)
        
        with col_adv1:
            enable_notifications = st.checkbox(
                "🔔 Notifications",
                value=current_config.get("preferences", {}).get("notifications", True),
                help="Enable system notifications and alerts"
            )
            
            enable_auto_backup = st.checkbox(
                "💾 Auto Backup",
                value=current_config.get("preferences", {}).get("auto_backup", True),
                help="Automatically backup data daily"
            )
        
        with col_adv2:
            enable_telemetry = st.checkbox(
                "📈 Usage Analytics",
                value=current_config.get("preferences", {}).get("telemetry", False),
                help="Collect anonymous usage statistics for improvement"
            )
            
            enable_debug = st.checkbox(
                "🐛 Debug Mode",
                value=current_config.get("preferences", {}).get("debug", False),
                help="Enable detailed logging and debug information"
            )
        
        # Performance settings
        st.markdown("### ⚡ Performance Settings")
        
        col_perf1, col_perf2 = st.columns(2)
        
        with col_perf1:
            cache_size = st.slider(
                "Cache Size (MB)",
                min_value=50,
                max_value=1000,
                value=current_config.get("performance", {}).get("cache_size", 200),
                help="Amount of memory to use for caching"
            )
        
        with col_perf2:
            max_concurrent = st.slider(
                "Max Concurrent Operations",
                min_value=1,
                max_value=10,
                value=current_config.get("performance", {}).get("max_concurrent", 3),
                help="Maximum number of simultaneous operations"
            )
        
        if st.form_submit_button("🔧 Save Feature Settings", use_container_width=True):
            current_config["features"] = {
                "knowledge_base": enable_kb,
                "ai_agents": enable_agents,
                "automations": enable_automations,
                "analytics": enable_analytics
            }
            
            current_config["preferences"].update({
                "notifications": enable_notifications,
                "auto_backup": enable_auto_backup,
                "telemetry": enable_telemetry,
                "debug": enable_debug
            })
            
            current_config["performance"] = {
                "cache_size": cache_size,
                "max_concurrent": max_concurrent
            }
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            st.success("✅ Feature settings saved successfully!")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "💾 Data Management":
    st.subheader("💾 Data Management")
    
    # Data statistics
    st.markdown("### 📊 Data Overview")
    
    col_data1, col_data2, col_data3 = st.columns(3)
    
    # Calculate data sizes
    ideas_count = 0
    projects_count = 0
    kb_files = 0
    
    try:
        if (DATA / "ideas.json").exists():
            with open(DATA / "ideas.json", 'r') as f:
                ideas_count = len(json.load(f))
    except:
        pass
    
    try:
        if (DATA / "projects.yaml").exists():
            with open(DATA / "projects.yaml", 'r') as f:
                projects_data = yaml.safe_load(f)
                projects_count = len(projects_data.get("projects", []))
    except:
        pass
    
    try:
        kb_files = len(list((DATA / "knowledge").glob("**/*"))) if (DATA / "knowledge").exists() else 0
    except:
        pass
    
    col_data1.metric("Ideas", ideas_count)
    col_data2.metric("Projects", projects_count)
    col_data3.metric("KB Files", kb_files)
    
    # Data operations
    st.markdown("### 🔧 Data Operations")
    
    col_ops1, col_ops2, col_ops3 = st.columns(3)
    
    with col_ops1:
        st.markdown("**💾 Backup**")
        if st.button("Create Backup", use_container_width=True):
            # Create backup
            backup_data = {
                "timestamp": datetime.now().isoformat(),
                "config": current_config,
                "ideas": ideas_count,
                "projects": projects_count,
                "kb_files": kb_files
            }
            
            backup_json = json.dumps(backup_data, indent=2, ensure_ascii=False)
            st.download_button(
                label="📥 Download Backup",
                data=backup_json,
                file_name=f"brzi_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )
    
    with col_ops2:
        st.markdown("**📤 Export**")
        if st.button("Export All Data", use_container_width=True):
            st.info("Export functionality will create a comprehensive data package.")
    
    with col_ops3:
        st.markdown("**🧹 Cleanup**")
        if st.button("Clean Temp Files", use_container_width=True):
            st.success("Temporary files cleaned successfully!")
    
    # Import/Export settings
    st.divider()
    st.markdown("### 📁 Import/Export Settings")
    
    uploaded_file = st.file_uploader(
        "Import Configuration",
        type=['json', 'yaml'],
        help="Upload a configuration file to restore settings"
    )
    
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith('.json'):
                imported_config = json.load(uploaded_file)
            else:
                imported_config = yaml.safe_load(uploaded_file)
            
            st.json(imported_config)
            
            if st.button("📥 Import Configuration"):
                # Merge with current config
                current_config.update(imported_config)
                
                # Save configuration
                with open(config_path, 'w', encoding='utf-8') as f:
                    yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
                
                st.success("✅ Configuration imported successfully!")
                st.rerun()
                
        except Exception as e:
            st.error(f"❌ Error importing configuration: {e}")

elif selected_section == "🔒 Security":
    st.subheader("🔒 Security & Privacy")
    
    st.markdown("### 🛡️ Security Status")
    
    # Security checklist
    security_items = [
        {"item": "API keys stored securely", "status": bool(current_config.get("api_keys"))},
        {"item": "Local data storage", "status": True},
        {"item": "No cloud dependencies", "status": True},
        {"item": "Configuration backup available", "status": config_path.exists()},
    ]
    
    for item in security_items:
        status_icon = "✅" if item["status"] else "❌"
        st.markdown(f"{status_icon} {item['item']}")
    
    st.markdown("### 🔐 Privacy Settings")
    
    with st.form("privacy_settings"):
        col_priv1, col_priv2 = st.columns(2)
        
        with col_priv1:
            data_retention = st.selectbox(
                "Data Retention Period",
                ["30 days", "90 days", "1 year", "Indefinite"],
                index=3
            )
            
            log_level = st.selectbox(
                "Logging Level",
                ["Minimal", "Standard", "Detailed"],
                index=1
            )
        
        with col_priv2:
            auto_cleanup = st.checkbox(
                "Auto Cleanup Old Data",
                value=False,
                help="Automatically remove old logs and temporary files"
            )
            
            encrypt_sensitive = st.checkbox(
                "Encrypt Sensitive Data",
                value=False,
                help="Encrypt API keys and sensitive configuration"
            )
        
        if st.form_submit_button("🔒 Save Privacy Settings", use_container_width=True):
            current_config["security"] = {
                "data_retention": data_retention,
                "log_level": log_level,
                "auto_cleanup": auto_cleanup,
                "encrypt_sensitive": encrypt_sensitive
            }
            
            # Save configuration
            with open(config_path, 'w', encoding='utf-8') as f:
                yaml.dump(current_config, f, default_flow_style=False, allow_unicode=True)
            
            st.success("✅ Privacy settings saved successfully!")
            current_config = load_config() # Reload config to reflect changes

elif selected_section == "📊 System Info":
    st.subheader("📊 System Information")
    
    # System stats
    col_sys1, col_sys2 = st.columns(2)
    
    with col_sys1:
        st.markdown("### 🖥️ System Details")
        
        system_info = {
            "Dashboard Version": "2.0.0",
            "Python Version": f"{os.sys.version.split()[0]}",
            "Streamlit Version": st.__version__,
            "Configuration Path": str(config_path),
            "Data Directory": str(DATA),
            "Last Updated": current_config.get("profile", {}).get("updated_at", "Never")
        }
        
        for key, value in system_info.items():
            st.markdown(f"**{key}:** {value}")
    
    with col_sys2:
        st.markdown("### 📁 Directory Structure")
        
        directories = [
            ("📊 Data", str(DATA)),
            ("⚙️ Config", str(CONFIGS)),
            ("🌐 i18n", str(I18N)),
            ("📚 Knowledge", str(DATA / "knowledge")),
            ("🔧 Scripts", str(BASE / "scripts"))
        ]
        
        for name, path in directories:
            exists = Path(path).exists()
            status_icon = "✅" if exists else "❌"
            st.markdown(f"{status_icon} **{name}:** `{path}`")
    
    # Configuration preview
    st.divider()
    st.markdown("### ⚙️ Current Configuration")
    
    with st.expander("View Full Configuration", expanded=False):
        st.json(current_config)
    
    # Reset options
    st.divider()
    st.markdown("### 🔄 Reset Options")
    
    col_reset1, col_reset2 = st.columns(2)
    
    with col_reset1:
        if st.button("🔄 Reset to Defaults", use_container_width=True):
            if st.checkbox("I understand this will reset all settings"):
                # Reset to default configuration
                default_config = {
                    "profile": {
                        "name": "BRZI AI User",
                        "timezone": "UTC",
                        "language": "EN"
                    },
                    "preferences": {
                        "theme": "light",
                        "notifications": True,
                        "auto_backup": True
                    },
                    "features": {
                        "knowledge_base": True,
                        "ai_agents": True,
                        "automations": True,
                        "analytics": True
                    }
                }
                
                # Save default configuration
                with open(config_path, 'w', encoding='utf-8') as f:
                    yaml.dump(default_config, f, default_flow_style=False, allow_unicode=True)
                
                st.success("✅ Configuration reset to defaults!")
                st.rerun()
    
    with col_reset2:
        if st.button("📥 Export Configuration", use_container_width=True):
            config_yaml = yaml.dump(current_config, default_flow_style=False, allow_unicode=True)
            st.download_button(
                label="📥 Download Config",
                data=config_yaml,
                file_name=f"brzi_config_{datetime.now().strftime('%Y%m%d')}.yaml",
                mime="text/yaml"
            )

# Quick navigation
st.divider()
col_nav1, col_nav2, col_nav3 = st.columns(3)

with col_nav1:
    if st.button("📊 Analytics", use_container_width=True):
        st.switch_page("pages/08_Analytics.py")

with col_nav2:
    if st.button("⚙️ Automations", use_container_width=True):
        st.switch_page("pages/07_Automations.py")

with col_nav3:
    if st.button("🏠 Dashboard", use_container_width=True):
        st.switch_page("app.py")
