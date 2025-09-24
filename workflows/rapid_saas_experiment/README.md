# Rapid SaaS/Tool Experiment Workflow

## Purpose

Test and validate a simple SaaS concept within one to three days using free tiers and minimal code. The goal is to build a prototype, gather feedback, and decide whether to continue or pivot.

## Steps

1. **Problem Definition:** Identify the pain point or job‑to‑be‑done (JTBD) for your target audience. Write it down clearly.
2. **Value Proposition:** Formulate a one‑sentence promise of how your solution addresses the problem. Sketch pricing options if relevant.
3. **UI Scaffold:** Use Vercel v0.dev or another AI code generator to create a basic UI and landing page. Keep design simple and mobile‑friendly.
4. **Database Setup:** Configure Firebase (or alternative) with authentication, a minimal schema, and security rules. Document key fields.
5. **Prototype Features:** Implement only the core features needed to demonstrate the value proposition. Avoid building complex infrastructure.
6. **Feedback Capture:** Add a simple form or survey to collect user feedback. Connect it to an analytics tool or spreadsheet.
7. **Analytics:** Integrate a lightweight analytics service (e.g., Google Analytics) to monitor usage metrics.
8. **Pilot Launch:** Deploy the prototype to a free hosting environment. Share it with a small group of potential users or post it on social channels.
9. **Criteria for Success:** Define go/no‑go metrics (e.g., sign‑ups, user retention, feedback quality). Decide whether to iterate, expand, or shut down.
10. **Documentation & Cleanup:** Record lessons learned, issues encountered, and user feedback in the `logs/` directory. Archive the prototype and remove unused services if you decide not to pursue the idea.

## Deliverables

- **One‑Pager:** Problem statement, JTBD, user promise, and pricing sketch.
- **UI Code Scaffold**
- **Database Schema & Setup Notes**
- **Feedback Mechanism**
- **Analytics Integration**
- **Launch Checklist & Decision Criteria**

Use `/prompts/rapid_saas_experiment.md` to initiate this workflow with an AI agent.
