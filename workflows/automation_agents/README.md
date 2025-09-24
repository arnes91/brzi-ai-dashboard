# Automation & Agents Workflow

## Purpose

Identify recurring tasks and design automations using agentic tools such as Zapier, Make, or native integrations. The aim is to reduce manual work, minimize errors, and free up time for creative tasks.

## Steps

1. **Task Inventory:** List all recurring tasks across projects (e.g., uploading content, data entry, file backups, analytics reporting). Note the frequency and effort required for each.
2. **Trigger & Action Mapping:** For each task, define the trigger (event that starts the workflow) and the desired action(s). Example: “New YouTube video uploaded” → “Post to social media”.
3. **Select Automation Tool:** Choose the appropriate platform (Zapier, Make, native integration) based on cost, ease of use, and capabilities. Prefer free options when available.
4. **Design Flows:** Draft a flowchart or list of steps for each automation. Include filters, conditions, and any branching logic.
5. **Safety Rails:** Specify rate limits, retries, and error handling. Ensure privacy is maintained (no sensitive data leakage).
6. **Pilot Automation:** Implement one pilot automation with test data. Monitor performance and fix any issues.
7. **Documentation:** Document the setup in detail—screenshots, settings, and triggers—in the `templates/automation_mapping_template.md`.
8. **Test & Refine:** Run the automation with real data. Gather feedback and iterate on the flow and triggers.
9. **Roll Out:** Deploy the automation for regular use if the pilot succeeds. Schedule periodic reviews to ensure it continues working as intended.
10. **Maintain Log:** Record automation activities in `logs/` including any errors, updates, and resulting time savings.

## Deliverables

- **Task Inventory & Trigger‑Action Map**
- **Automation Flowcharts or Schematics**
- **Pilot Automation with Test Data**
- **Documentation & Safety Measures**
- **Deployment Plan**

Use `/prompts/automation_agents.md` to initiate this workflow with an AI agent.
