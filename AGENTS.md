<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Anti-Slop Design & UI Rules (Mandatory)

For ANY UI, frontend, design tokens, or visual styling work in this repository:
1. **Direction**: Always read `DESIGN.md` in the project root for the brand identity, caring green color palette, typography, and mood.
2. **Filter**: Always load and enforce `.agents/skills/antislop/SKILL.md` (and its satellite skills: `antislop-ui`, `antislop-human`, `antislop-layoutmobile`, `antislop-copywriting`, `antislop-code`).
3. **Core Standards**:
   - **No AI Default Slop**: Never use generic blue-purple gradients, floating glow overload, or uniform pill (`rounded-full`) borders everywhere.
   - **Accessible Contrast**: All text must meet WCAG AA (minimum 4.5:1 normal text, 3:1 components). Verify using `.agents/skills/antislop-human/contrast-check.py`.
   - **Resilience**: Every data-driven UI MUST include loading, empty, and error states (R-27).
   - **Mobile Reflow**: Minimum 44px tap targets, zero horizontal overflow (R-03).
   - **Honest Copy**: Never use em dashes (`—`) in agent-written copy (R-02); no empty AI buzzwords (R-16); real data only (R-17, C-5).
   - **Delivery Gate**: Perform pre-flight verification before completing any UI or styling task.
