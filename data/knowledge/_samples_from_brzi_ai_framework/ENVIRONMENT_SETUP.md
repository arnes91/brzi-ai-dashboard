# Environment Setup

This document describes the hardware, software, and AI tool configurations that make up the Brzi AI environment. Keeping this environment consistent ensures that all collaborators and AI agents can work efficiently and access the necessary resources.

## Hardware & Platforms

- **Windows Desktop PC:** Primary development and creative workstation. Runs Windows 10/11 with necessary software installed (VS Code, Git, web browsers, CapCut/Pippit, etc.).
- **Android Smartphone:** Secondary interface for mobile productivity and content capture. Uses Gemini (default assistant) and mobile apps for YouTube Studio, CapCut, social media, and other tools.
- **Virtual Desktop (Manus.ai):** Provides a fully configured cloud environment with pre‑installed tools, enabling remote work and heavy computational tasks.
- **Unified Audio Setup:** Studio‑grade microphones and speakers with synchronized audio routing for consistent quality across devices.

## Software & Tools

### Operating Systems & Editors

- **Windows + WSL (if needed)**
- **Android OS**
- **VS Code** with GitHub Copilot for coding tasks
- **CapCut / Pippit** for video editing (Android + desktop)
- **Google Chrome / Microsoft Edge** with Copilot integration
- **Cloud services:** Google Drive, Google Cloud (trial), Vercel

### AI Assistants & Platforms

- **Gemini (Google):** Mobile assistant integrated with phone to access device features and perform tasks with voice or text commands.
- **ChatGPT Plus (OpenAI) – GPT‑5 Pro:** Primary reasoning model with connectors (browser, code interpreter, etc.), custom GPTs, and agentic capabilities.
- **Claude (Anthropic):** Alternative reasoning model with multiple modalities and connectors.
- **Microsoft Copilot:** Available on Windows, MS Edge, and mobile for deep research, integrated actions, and generative tasks.
- **Perplexity Pro:** Desktop and mobile search and research assistant.
- **NotebookLM:** Google’s notebook environment for audio‑transcribed research and interactive analysis.

### Agentic Tools & Models

- **Producer/Suno (Music Agents):** AI music studio environment enabling full track generation, mixing, and export.
- **Rabbit‑OS Intern:** AI intern for performing research and project tasks.
- **Manus.ai:** Virtual desktop with integrated agentic tools and full browser.
- **GitHub Copilot:** Autocomplete and code generation assistant integrated with VS Code.
- **Vercel v0.dev:** Platform for building and deploying code through an AI assistant.
- **Firebase Studio & Google Cloud:** For prototypes, database, and hosting.
- **BabyAGI, AutoBrowser, etc. (Experimental):** Consider using new tools; integrate after testing.

## Configuration Guidelines

1. **Synchronization:** Maintain a unified sign‑in across devices for Google, Microsoft, OpenAI, and Anthropic accounts. Enable two‑factor authentication and keep credentials secure.
2. **Presets & Templates:** Use consistent presets (e.g., audio settings, document templates) across all devices. Store them in `templates/` and `docs/`.
3. **Backups & Drive Sync:** Synchronize project directories to Google Drive using labeled workspaces. Ensure important assets (video files, audio stems, project files) are backed up regularly.
4. **Updates:** Keep applications and operating systems up to date but avoid risky upgrades without testing (e.g., new OS versions). Document any major changes in `logs/`.
5. **Testing New Tools:** Use isolated environments (e.g., VMs or separate user accounts) to test new AI tools or agentic platforms before integrating them into your workflow.

## Maintenance

Review this document quarterly to ensure it reflects the current environment. Adjust details as new tools are integrated or old ones removed. Maintain a simple and modular configuration to prevent complexity from hindering productivity.
