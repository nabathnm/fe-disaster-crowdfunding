---
name: design
description: "Comprehensive design skill under the Anti-Slop filter: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (22 styles, social/ads/web/print), icon design (15 styles, SVG, Gemini 3.1 Pro), social photos. Enforces purposeful craft, WCAG AA contrast, and anti-AI slop consistency."
argument-hint: "[design-type] [context]"
license: MIT
metadata:
  author: claudekit
  version: "2.2.0"
---

# Design Skill (Anti-Slop Governed)

Unified design system for branding, tokens, UI, logos, CIP, presentations, banners, social graphics, and icons — filtered through **Anti-Slop** (`.agents/skills/antislop/SKILL.md`).

## Core Principle: Anti-Slop Filter

All design outputs produced with this skill MUST satisfy the **Craftsmanship Standard** (`.agents/skills/antislop/SKILL.md`):
1. **Purpose Test (C-1)**: Every style, color, font, and shape choice must have an articulated reason rooted in the product's identity (see `DESIGN.md`), not a generic AI template.
2. **Accessible Contrast (R-25)**: All text on graphics, presentations, and UI must meet WCAG AA (minimum 4.5:1 text, 3:1 non-text).
3. **No Fabricated Evidence (C-5, R-17, R-18, R-36)**: No fake stats, no fictional client logos, and no made-up trust badges.
4. **Honest Copy (R-02, R-16)**: Zero em dashes (`—`) in agent text, and no empty AI buzzwords ("seamless, revolutionary, elevate").

## When to Use

- Brand identity, voice, and design assets
- Design system tokens and specs (`design-system` skill)
- UI styling with shadcn/ui + Tailwind (`ui-styling` skill)
- Logo design and AI generation
- Corporate identity program (CIP) deliverables
- Presentations and pitch decks (`slides` skill)
- Banner design for social media, ads, web, print (`banner-design` skill)
- Social photos for Instagram, Facebook, LinkedIn, Twitter, Pinterest, TikTok
- Custom SVG icons and icon sets

## Sub-skill Routing

| Task | Sub-skill | Details |
|------|-----------|---------|
| Brand identity, voice, assets | `DESIGN.md` | Single source of truth |
| Tokens, specs, CSS vars | `design-system` | `.agents/skills/design-system` |
| shadcn/ui, Tailwind, code | `ui-styling` | `.agents/skills/ui-styling` |
| UI/UX Intelligence | `ui-ux-pro-max` | `.agents/skills/ui-ux-pro-max` |
| Logo creation, AI generation | Logo (built-in) | `references/logo-design.md` |
| CIP mockups, deliverables | CIP (built-in) | `references/cip-design.md` |
| Presentations, pitch decks | Slides (built-in) | `references/slides-create.md` |
| Banners, covers, headers | Banner (built-in) | `references/banner-sizes-and-styles.md` |
| Social media images/photos | Social Photos (built-in) | `references/social-photos-design.md` |
| SVG icons, icon sets | Icon (built-in) | `references/icon-design.md` |

---

## Logo Design (Built-in)

55+ styles, 30 color palettes, 25 industry guides. Gemini Nano Banana models.

### Logo: Generate Design Brief
```bash
python .agents/skills/design/scripts/logo/search.py "tech startup modern" --design-brief -p "BrandName"
```

### Logo: Search Styles/Colors/Industries
```bash
python .agents/skills/design/scripts/logo/search.py "minimalist clean" --domain style
python .agents/skills/design/scripts/logo/search.py "tech professional" --domain color
python .agents/skills/design/scripts/logo/search.py "healthcare medical" --domain industry
```

### Logo: Generate with AI
**ALWAYS** generate output logo images with a clean background.
```bash
python .agents/skills/design/scripts/logo/generate.py --brand "PeduliChain" --style minimalist --industry humanitarian
python .agents/skills/design/scripts/logo/generate.py --prompt "disaster relief blockchain caring hands" --style geometric
```

---

## CIP Design (Built-in)

50+ deliverables, 20 styles, 20 industries. Gemini Nano Banana (Flash/Pro).

### CIP: Generate Brief
```bash
python .agents/skills/design/scripts/cip/search.py "disaster crowdfunding" --cip-brief -b "PeduliChain"
```

### CIP: Search Domains
```bash
python .agents/skills/design/scripts/cip/search.py "business card letterhead" --domain deliverable
python .agents/skills/design/scripts/cip/search.py "clean humanitarian trustworthy" --domain style
```

### CIP: Generate Mockups
```bash
# With logo
python .agents/skills/design/scripts/cip/generate.py --brand "PeduliChain" --logo assets/logo.png --deliverable "business card" --industry "humanitarian"
```

---

## Slides (Built-in)

Strategic HTML presentations with Chart.js, design tokens, and copywriting formulas.
Load `references/slides-create.md` for the creation workflow.

### Slides: Requirements (Anti-Slop Enforced)
- Import `assets/design-tokens.css` as single source of truth.
- High contrast Chart.js visualizations (WCAG AA).
- Verified facts only: no fabricated numbers or synthetic metrics (R-17, C-5).
- Keyboard accessible navigation (`ArrowRight`, `ArrowLeft`, `Escape`).

---

## Banner Design (Built-in)

22 art direction styles across social, ads, web, print.
Load `references/banner-sizes-and-styles.md` for complete sizes and styles reference.

### Banner: Anti-Slop Rules
- Critical content positioned within the central safe zone (70-80%).
- Max 2 typefaces, single clear CTA, minimum 4.5:1 text contrast ratio against background.
- If using photos or gradients behind text, apply a dark scrim or solid backing so contrast holds across the entire area (R-25).
- No generic AI slogans: craft concise, specific value propositions (R-16).

---

## Icon Design (Built-in)

15 styles, 12 categories. Gemini 3.1 Pro Preview generates SVG text output directly.

### Icon: Generate
```bash
python .agents/skills/design/scripts/icon/generate.py --prompt "heart donation hand" --style outlined
python .agents/skills/design/scripts/icon/generate.py --name "dashboard" --category navigation --style duotone
```

---

## Workflows

### Complete Brand Package
1. **Brand Definition** (`DESIGN.md`) → Establish identity, caring green palette, and voice.
2. **Design Tokens** (`design-system` skill) → Generate three-layer tokens with verified contrast.
3. **UI Implementation** (`ui-styling` skill) → Build accessible components with Tailwind and shadcn/ui.
4. **Visual Assets** → Generate logos, banners, and presentation slides adhering to anti-slop rules.

## References

| Topic | File | Anti-Slop Focus |
|-------|------|-----------------|
| Design Routing | `references/design-routing.md` | Skill workflow |
| Logo Design Guide | `references/logo-design.md` | Purposeful geometry |
| Slides Create | `references/slides-create.md` | Evidence over claims (C-5) |
| Banner Sizes & Styles | `references/banner-sizes-and-styles.md` | WCAG AA contrast (R-25) |
| Icon Design Guide | `references/icon-design.md` | Restrained iconography (R-19) |

## Prerequisites & Setup

On Windows, use `python` to execute scripts:
```bash
python --version
```
Required dependencies for image generation:
```bash
python -m pip install google-genai pillow
```
Ensure `GEMINI_API_KEY` is set in your environment if executing Gemini AI generation scripts.
