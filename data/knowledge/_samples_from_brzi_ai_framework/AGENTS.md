# Agents Overview

This document profiles the key AI agents and platforms used in the Brzi ecosystem. Each agent has different strengths, modalities, and integrations. Use these profiles to choose the right agent for a given task and to understand how to interact with them effectively.

## ChatGPT (OpenAI)

- **Model:** GPT‑5 Pro (with connectors and code interpreter)
- **Strengths:** Reasoning, deep research, code generation, summarization, modular prompt support, customizable personas. Access to web search, file management, calendar, email, and other connectors.
- **Typical Tasks:** Research synthesis, content drafting, code assistance, spreadsheet analysis, documentation generation, strategic planning.
- **Limitations:** Occasional hallucination; may need explicit clarification for ambiguous instructions; knowledge cut‑off date is June 2024 (use search for newer data).
- **Integration Notes:** Use connectors (browser, Python, Google Drive, Gmail, etc.) for external tasks. Always verify critical facts using `web` search when recency matters.

## Claude (Anthropic)

- **Model:** Claude 3.x with MCP connectors
- **Strengths:** Summarization of long documents, conversational nuance, reasoning; able to analyze and generate structured data.
- **Typical Tasks:** Summarizing transcripts, drafting communications, brainstorming, writing code.
- **Limitations:** Less tool integration than ChatGPT; may need context re‑upload for large documents.
- **Integration Notes:** Use the “Artifacts” feature for running code interactively. Combine with NotebookLM for advanced research.

## Gemini (Google)

- **Model:** Gemini 2.5 Pro/Flash on mobile and NotebookLM
- **Strengths:** Deep research via Google search, generating images/videos, and interacting with device features through voice commands. Integrated into mobile for voice commands and device control.
- **Typical Tasks:** Quick look‑ups, mobile actions, generative image/video, interactive research notebooks, audio transcription.
- **Limitations:** Tool access may be limited outside the Google ecosystem; quality of generative media can vary.
- **Integration Notes:** Leverage NotebookLM and Canvas for interactive work. Use Gemini’s API for programmatic tasks when available.

## Microsoft Copilot

- **Model:** Based on GPT with Microsoft Graph integration
- **Strengths:** Integration with Windows, Office apps, and Edge; deep research mode; ability to perform certain autonomous actions in Microsoft products.
- **Typical Tasks:** Document editing (Word, Excel, PowerPoint), summarizing emails, generating code samples in development environments, searching the web.
- **Limitations:** Strongest within Microsoft’s ecosystem; still needs manual confirmation for actions; quality varies depending on context.
- **Integration Notes:** Use when working inside Windows or Edge. Combine with GitHub Copilot for development.

## Perplexity Pro

- **Strengths:** Rapid search and summary of web content; citations included.
- **Typical Tasks:** Getting quick answers to specific questions, exploring news or niche topics, comparing sources.
- **Limitations:** Limited action integration; best used for research rather than execution.
- **Integration Notes:** Use as a supplement to ChatGPT or Gemini when additional perspectives are needed.

## Manus.ai (Virtual Desktop)

- **Strengths:** Full cloud desktop environment with integrated AI agents. Provides a persistent workspace accessible through a browser and is useful for tasks requiring heavy computation or multi‑step interactions.
- **Typical Tasks:** Running long research sessions, managing multiple tabs and tools, performing heavy computations.
- **Limitations:** May require a subscription; performance dependent on network.
- **Integration Notes:** Use for complex workflows requiring many steps or when local resources are constrained.

## Producer & Suno (Music Agents)

- **Strengths:** Generate original music based on prompts; ability to produce stems, hooks, and multi‑instrument arrangements. Suitable for glitch techno, cyberpunk rap, and other genres.
- **Typical Tasks:** Composing tracks, creating variations, exporting audio files, and preparing promo snippets.
- **Limitations:** Creative outputs may need human selection and fine‑tuning; quality depends on prompt specificity.
- **Integration Notes:** Use a clear style prompt and review multiple variants. Align outputs with existing catalogue (Brzi Arzi).

## Rabbit‑OS Intern / Other Agents

- **Strengths:** Research, summarization, and simple task execution by a virtual assistant. Can handle some real‑world tasks (booking, ordering) where supported.
- **Typical Tasks:** Summarizing articles, drafting communications, making simple purchases, scheduling.
- **Limitations:** Evolving capabilities; confirm actions before proceeding.
- **Integration Notes:** Use after verifying that the agent has the required access and does not conflict with privacy or security policies.

---

**Agent Management Guidelines**

1. **Choose the Right Tool:** Select agents based on strengths and the nature of the task (research vs. creative vs. execution).
2. **Provide Context:** Supply the relevant prompt pack or Base Context to ensure agents understand the mission and constraints.
3. **Verify Outputs:** Always review outputs from any agent before acting on them, especially when decisions involve money, data privacy, or reputation.
4. **Log Actions:** Record important actions or changes in the `logs/` directory to maintain traceability and facilitate cross‑agent collaboration.
5. **Stay Updated:** Agent capabilities evolve; revisit this document periodically to incorporate new agents or retired services.
