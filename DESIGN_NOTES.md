
# Design Notes & Rationale

- **Multi-agent orchestration** (Sequential / Parallel / Loop blueprints) maps to patterns like ReAct and ADK's agent classes. See the guide's *Agent orchestration* and ReAct loop diagrams (pages 14–17).  
- **Runtime choices**: local Streamlit MVP now; can graduate to Cloud Run or Vertex AI Agent Engine when needed (pages 16–18).  
- **Interoperability**: plan stubs for MCP + A2A so your agents can consume or expose tools and talk to other agents (see MCP overview and A2A protocol pages ~34–41).  
- **Grounding**: FAISS + sentence-transformers for local RAG; later upgrade to Vertex AI Search / RAG Engine or GraphRAG when moving to cloud (pages 17–23).  

Security & AgentOps: add CI/CD and evaluation harness when you promote this to production (Section 3, pages 49–58).

