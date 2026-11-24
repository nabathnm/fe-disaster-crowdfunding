---
name: banner-design
description: "Design banners for social media, ads, website heroes, creative assets, and print under the Anti-Slop filter. Multiple art direction options with AI-generated visuals. Actions: design, create, generate banner. Enforces WCAG AA text contrast, honest copywriting without buzzwords, and purposeful visual hierarchy."
argument-hint: "[platform] [style] [dimensions]"
license: MIT
metadata:
  author: claudekit
  version: "1.1.0"
---

# Banner Design (Anti-Slop Governed)

Multi-format creative banner system for social, ads, web, and print — strictly filtered through the **Anti-Slop Standard** (`.agents/skills/antislop/SKILL.md`).

## Anti-Slop Banner Rules (Mandatory)

1. **Text Contrast (R-25, WCAG AA)**:
   - All headline and body text must have at least **4.5:1** contrast ratio against the background.
   - When text sits over photography or complex gradients, ALWAYS apply a dark scrim, subtle backdrop pill, or solid block behind the text. Verify across the full text area, not just one point.
2. **Copywriting Hygiene (R-02, R-16, C-5)**:
   - **FORBIDDEN**: em dashes (`—`) in headline, body, or CTA text. Use commas, colons, or clean phrasing instead.
   - **FORBIDDEN**: AI buzzwords ("unlock, elevate, revolutionize, seamless, next-level"). Use clear, human value propositions.
   - **FORBIDDEN**: Fabricated statistics ("10,000+ happy users") or fake trust logos (R-17, R-18).
3. **Restrained Visual Effects (R-01, R-10, R-13)**:
   - Do NOT stack glassmorphism, neon, radial orbs, and glow simultaneously.
   - If using glassmorphism or glow, apply it to a maximum of 1 focal element (e.g., the primary CTA or key stat badge).
4. **Purpose-Driven Layout (C-1, R-03)**:
   - Respect platform safe zones (keep critical text/logo in central 70-80%).
   - One primary CTA with minimum 44px height for touch/click ergonomics.

---

## When to Activate

- User requests banner, cover, or header design
- Social media cover/header creation (X, Facebook, LinkedIn, YouTube)
- Ad banner or display ad design
- Website hero section visual design
- Event/print banner design
- Creative asset generation for campaigns

## Workflow

### Step 1: Gather Requirements
Collect essential requirements:
1. **Purpose** — social cover, ad banner, website hero, or print.
2. **Platform & Dimensions** — see Quick Reference table below.
3. **Content** — headline, subtext, single CTA, logo.
4. **Brand Context** — read `DESIGN.md` for identity, colors, and typography.
5. **Quantity** — number of options to generate (default: 3).

### Step 2: Research & Art Direction
Select 2-3 distinct, purposeful art direction styles:
- **Minimalist**: High white space, 2-3 core brand colors, crisp typography.
- **Photo-Based**: Full-bleed real documentation photo + dark scrim + high-contrast text.
- **Bold Typography**: Oversized headline as the primary visual element.
- **Geometric / Restrained Gradient**: Subtle brand gradient serving visual hierarchy.

### Step 3: Design & Generate Options
For each option:
1. **HTML/CSS Banner Structure**:
   - Exact platform pixel dimensions.
   - Scrim overlay (`bg-gradient-to-t from-black/80 via-black/40 to-transparent`) behind text if using background imagery.
   - Max 2 typefaces, single CTA button (minimum 44px height).
2. **Image Elements**:
   - High-resolution photography or generated visuals with clean backgrounds.
   - No text embedded inside the raw image; all copy rendered via HTML for pixel-perfect typography and accessibility.

### Step 4: Export to PNG
Export HTML banners to PNG at exact pixel dimensions using standard headless screenshot tools or DevTools.

---

## Banner Size Quick Reference

| Platform | Type | Size (px) | Aspect Ratio | Safe Zone |
|----------|------|-----------|--------------|-----------|
| Facebook | Cover | 820 × 312 | ~2.6:1 | Center 75% |
| Twitter/X | Header | 1500 × 500 | 3:1 | Avoid bottom-left avatar |
| LinkedIn | Banner | 1584 × 396 | 4:1 | Avoid bottom-left profile |
| YouTube | Channel Art | 2560 × 1440 | 16:9 | Safe text area: 1546 × 423 |
| Instagram | Post (Square) | 1080 × 1080 | 1:1 | Full canvas |
| Instagram | Story | 1080 × 1920 | 9:16 | Central 80% (avoid top/bottom bars) |
| Website | Hero Banner | 1920 × 600-800 | ~3:1 | Central 70% |

---

## Delivery Gate for Banners

Before presenting any banner options to the user:
- [ ] Text contrast verified at $\ge 4.5:1$ across the entire text area.
- [ ] Zero em dashes (`—`) and zero generic AI buzzwords in copy.
- [ ] Brand colors match `DESIGN.md` (e.g. Caring Green `#059669` for PeduliChain).
- [ ] Single clear CTA with minimum 44px height.
- [ ] File sizes optimized and safe zones respected.
