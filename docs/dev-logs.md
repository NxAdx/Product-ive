# Product+ive — Development Logs

> Records development decisions and reasoning.

---

## 2026-04-01 — Project Structure Decision

**Decision:** Adopt the same project governance structure used in Saral Lekhan Plus and Vinyas projects.

**Reasoning:**
- Consistency across all production projects
- Proven documentation-first workflow
- AI agent context system ensures no knowledge loss between sessions
- Skills folder provides reusable expertise

**Structure adopted:**
- `.agents/` — AI agent config + skills (10 skill packs)
- `.agent/skills/` — Skill references
- `docs/` — Central brain of the project
- `docs/inspiration/` — Design reference images
- `docs/RELEASES/` — Version release notes
- `ss/` — App screenshots
- `skills-lock.json` — Skill version pinning

**Reference projects:**
- Saral Lekhan Plus: `.agents/`, `.agent/`, `docs/`, `research_inspiration/`, `ss/`
- Vinyas: `Docs/`, `Docs/inspiration/`, `Sample/`
