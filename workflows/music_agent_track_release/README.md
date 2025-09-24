# Music Agent – Track to Release Workflow

## Purpose

Create, select, and release an AI‑generated music track with minimal manual effort. This workflow covers prompt preparation, track generation, selection, release packaging, and promotional activities.

## Steps

1. **Define Style Prompt:** Determine the style combination (e.g., glitch techno, cyberpunk rap, Balkan fusion) and languages (English, Bosnian, Japanese). Use `/prompts/music_agent_track_release.md` to guide prompt creation.
2. **Generate Variants:** Use Producer/Suno to generate multiple 30‑second and 60‑second hooks. Save each variation and note the parameters used.
3. **Select the Best Variant:** Listen to all generated hooks. Evaluate them based on catchiness, production quality, and alignment with brand identity. Use a simple retention heuristic if available (which parts are memorable).
4. **Expand to Full Track:** Using the chosen hook, instruct the music agent to generate a full track. Adjust instrumentation or tempo if necessary.
5. **Create Release Pack:** Write the track title, produce cover art (with AI art if desired), and prepare metadata (genre, language, mood, etc.). Use `/templates/music_release_template.md` for guidance.
6. **Distribution:** Upload the track to DistroKid or another distribution platform. Fill out release details, schedule the release date, and verify links once live.
7. **Promo Kit:** Develop promotional materials, including three short scripts for social media, five relevant hashtags, and a 7‑day posting cadence.
8. **Cross‑Channel Coordination:** Promote the release on YouTube (e.g., lyric video), Brzi Ai channel (e.g., AI music tutorial), and Brzi Balkan channel (e.g., gaming montage featuring the track).
9. **Track Performance:** Monitor streams and engagement across platforms. Record key metrics in the `logs/` directory and update strategies for future releases.
10. **Archive Assets:** Save project files, stems, prompts, and metadata in a dedicated folder for reuse and reference.

## Deliverables

- **Style Prompt Pack**
- **Selection Analysis** (notes on why the chosen variant won)
- **Release Pack** (title, cover, metadata, distribution checklist)
- **Promo Kit** (scripts, hashtags, posting schedule)
- **Performance Summary** (optional, after release)

Use the `/prompts/music_agent_track_release.md` prompt to initiate this workflow with an AI agent.
