# Cross‑Context Management

Maintaining a coherent context across multiple AI agents and platforms is essential for consistent decision‑making and collaboration. This document provides guidelines for sharing information, updating memory, and logging changes.

## Guidelines

1. **Centralize Context:** Use the `main_context/global_context.md` file as the single source of truth for the core mission, identity, principles, and key projects. Include this file at the start of any conversation or when onboarding a new agent.
2. **Use Prompt Packs:** When starting a new task, attach the relevant prompt pack from the `prompts/` directory along with the base context. This ensures the agent has all necessary instructions.
3. **Update Memory Carefully:** When an agent learns a new fact or completes a task that affects the shared knowledge, update the relevant document or memory entry. Ask for confirmation if the update could impact multiple agents.
4. **Log Changes:** Each agent should record significant actions, decisions, and updates in the `logs/` directory. Use the provided templates to ensure consistency.
5. **Avoid Overlap:** Keep memory items concise and timeless. Project‑specific details should live in the appropriate documents rather than in agent memories.
6. **Version Control:** Track changes to core documents by bumping version numbers and dates. Archive outdated versions or move them to the `logs/` directory.
7. **Respect Privacy:** Do not share sensitive information (e.g., personal data, financial details) across agents unless absolutely necessary and always comply with privacy guidelines.

## Logging Procedures

Use the `logs/` directory to maintain separate logs for each agent or platform, as well as a master log for cross‑agent actions. Include the following details in each log entry:

- **Date and Time:** Use a consistent timezone (Europe/Sarajevo).
- **Agent or Platform:** Identify the source (e.g., ChatGPT, Gemini, Copilot).
- **Action Taken:** Summarize the task performed or information updated.
- **Result or Outcome:** Describe the result or output of the action.
- **Next Steps:** Note any pending actions or follow‑up tasks.
- **References:** Link to related documents or prompt packs if relevant.

By following these guidelines, you can maintain a unified and up‑to‑date context across all agents, minimize confusion, and increase collaboration efficiency.
