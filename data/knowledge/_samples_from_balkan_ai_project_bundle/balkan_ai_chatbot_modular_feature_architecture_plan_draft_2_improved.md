# Balkan AI Chatbot

## Modular Feature & Architecture Plan

---

### 1️⃣ Project Philosophy: Modularity & Independence

Every feature is designed as a fully independent, plug-and-play module. This guarantees maximum flexibility, rapid iteration, and ensures that if one module fails, the rest of the app remains fully functional.

---

### 2️⃣ Immediate MVP Features (Phase 1: Launch)

| Feature                                    | Description / Intent                                                                                 | Module? | Notes                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------ |
| **1. DBZ Power Scanner (Hume AI)**         | User uploads selfie and receives a real-time “Power Level” via emotion analysis (DBZ-style, fun UI/meters).    | YES     | Animated, gamified output                  |
| **2. Hot-or-Not (Emotion→Attractiveness)** | Same selfie pipeline, but outputs a “hotness” score (0–100) and witty feedback (option for “scientific” or “for fun”). | YES     | Reuses emotion scan backend; custom UI     |
| **3. Selfie Health Scan**                  | Analyzes patterns/emotions for a playful “health” verdict and tips (e.g. “You look tired. Hydrate!”).           | YES     | Reuses emotion analysis engine             |
| **4. Balkan Chatbot (Custom Persona)**     | Balkan-tuned ChatGPT/Claude/Gemini. Pre-set personas (funny, regional slang, memes, advice, etc.).    | YES     | Each persona is a swappable sub-module     |
| **5. Model Selector**                      | Users pick: free/fast (Gemini), paid/premium (GPT-4o/Claude), or open-source fallback.                        | YES     | Tiered access, fallback auto-selection     |
| **6. Modular Monetization**                | Soft paywall for advanced features (extra scans, personas, voice, etc.), “cheapest in Balkans” pricing.        | YES     | Stripe/PayPal/local integrations           |
| **7. Core Admin & Analytics**              | Usage logs, error tracking, basic dashboard.                                                         | YES     | Essential, even for v1                     |

---

### 3️⃣ Modular Architecture Principles

- **Every feature is an independent module/component.**
- **All APIs (models, Hume, voice, payment) are wrapped via adapters/services, never hardcoded directly.** *(e.g., `useHumeService`, `usePaymentAdapter`)*
- **No feature coupling:** If Hot-or-Not breaks, Power Scanner & Chatbot continue to work perfectly.
- **Route-based code-splitting:** Each feature is behind its own URL/route and folder.
- **Scalable DB schema:** Normalized tables, clear foreign keys for user data, per-feature usage, and settings.
- **Feature flags:** Enable/disable modules live for testing or risk-mitigation.
- **Automated smoke tests:** Each module has a sanity check (CI/CD step) so new deployments can’t break others.

---

### 4️⃣ Advanced & Future Feature Ideas (Phase 2+)

| Feature                                    | Description                                                                    | Module? | Priority |
| ------------------------------------------ | ------------------------------------------------------------------------------ | ------- | -------- |
| **1. ElevenLabs Voice Agent Corner**       | Upload a voice sample, real-time voice call/chat, TTS/STT                      | YES     | HIGH     |
| **2. Brzi Arzi/Neural Nexus Portfolio**    | Separate tab for personal promo, demos, affiliate hooks                        | YES     | HIGH     |
| **3. Mini App Launcher (Web Experiments)** | Embed/launch 1-file React/HTML demos (sandbox)                                 | YES     | MID      |
| **4. AI Guide & Tutorials**                | AI/Arzi-powered guides for using AI, with personalized LoRA/image/video models  | YES     | MID      |
| **5. User Custom Personas**                | Users can create, save, and share their own chat personas                      | YES     | HIGH     |
| **6. Real-Time Video/Voice Scanning**      | Live camera analysis (emotion, sentiment, “party meter”, etc.)                 | YES     | LOW      |
| **7. Social/Sharing Hooks**                | Share results to TikTok, Instagram, WhatsApp, etc.                             | YES     | HIGH     |
| **8. Affiliate/Referral Programs**         | Viral invites, rewards, influencer tie-ins                                     | YES     | MID      |

---

### 5️⃣ Immediate Next Actions

**Confirm, tweak, or expand this feature/module list. Once confirmed, the following steps will be executed:**

- Draft a modular folder structure (Next.js + Supabase, as per project standards).
- Suggest how to safely scaffold the code (MVP template, module-by-module).
- Propose an initial DB schema for all MVP modules.

---

*Polished and ready for execution. Ready for your review!*

