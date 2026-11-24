---
name: design-system
description: Token architecture, component specifications, and slide generation with Anti-Slop enforcement. Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, component specs, WCAG AA contrast verification, and brand-compliant presentations.
argument-hint: "[component or token]"
license: MIT
metadata:
  author: claudekit
  version: "1.1.0"
---

# Design System

Token architecture, component specifications, systematic design, and presentation generation — strictly filtered by **Anti-Slop** rules.

## When to Use

- Design token creation and maintenance
- Component state definitions and specifications
- CSS variable systems and design systems
- Spacing, typography, and elevation scales
- Design-to-code handoff
- Tailwind theme configuration
- **Slide and presentation generation**

---

## Anti-Slop & Craftsmanship Standards for Tokens

All tokens and component specifications MUST comply with the **Anti-Slop Craftsmanship Standards** (`.agents/skills/antislop/SKILL.md`):

### 1. Palette Restraint & No AI Defaults (R-01, R-29)
- **FORBIDDEN**: Using the generic AI-slop blue palette (`#2563EB`, `#3B82F6`) or purple-blue gradients as an unthinking default.
- **REQUIRED**: Primitives must derive from the product's actual brand identity (see `DESIGN.md`, e.g. caring emerald/green for PeduliChain).
- Restrain the active palette: 2-3 core colors (neutral base + brand primary) + 1 deliberate accent.

### 2. Mandatory Contrast Verification (R-25)
- All foreground and background token pairings MUST meet WCAG AA contrast standards:
  - Normal text: minimum **4.5:1** contrast ratio.
  - Large text (18px+) & component boundaries: minimum **3:1** contrast ratio.
- Never eyeball or hallucinate grey contrast. Verify using `python .agents/skills/antislop-human/contrast-check.py "<bg>" "<fg>"`.

### 3. Purposeful Border Radius (R-11)
- **FORBIDDEN**: Uniform pill-shaped radius (`rounded-full` / `9999px`) on every card, input, button, and badge.
- Establish a deliberate 3-tier radius scale:
  - `sm` (0.25rem - 4px): inputs, tags, badges, small buttons.
  - `md` (0.5rem - 8px): cards, dropdowns, primary buttons.
  - `lg` (0.75rem - 12px) to `xl` (1rem - 16px): modals, sheets, dialog containers.

### 4. Elevation Over Floating Shadows (R-12)
- Most surfaces sit flat on the ground plane (`--shadow-none` or subtle `--shadow-sm`).
- Reserve elevated shadows (`--shadow-md`, `--shadow-lg`) strictly for surfaces that physically lift above the page (drawers, dialogs, active dropdowns).

### 5. Intentional Focus & States (R-26, R-27, R-32)
- Provide dedicated tokens for:
  - `--ring` / `--focus-visible`: High-visibility focus indicators (minimum 3:1 against background).
  - Component states: `default`, `hover`, `active`, `focus`, `disabled`.
  - Content states: `empty`, `loading`, `error`.

---

## Token Architecture

Load: `references/token-architecture.md`

### Three-Layer Structure

```
Primitive (raw values: brand hues, neutral scales, dimensions)
       ↓
Semantic (purpose aliases: background, foreground, primary, border)
       ↓
Component (component-specific: button-bg, card-radius, input-ring)
```

**Example (PeduliChain Caring Green Brand):**
```css
/* Layer 1: Primitive */
--color-emerald-600: #059669;
--color-emerald-700: #047857;
--color-slate-900: #0f172a;

/* Layer 2: Semantic (Purpose-Driven) */
--color-primary: var(--color-emerald-600);
--color-primary-hover: var(--color-emerald-700);
--color-foreground: var(--color-slate-900);

/* Layer 3: Component (Specific) */
--button-primary-bg: var(--color-primary);
--button-primary-hover: var(--color-primary-hover);
```

## Quick Start

**Generate tokens:**
```bash
node scripts/generate-tokens.cjs --config tokens.json -o tokens.css
```

**Validate token usage (checks for hardcoded values and contrast):**
```bash
node scripts/validate-tokens.cjs --dir src/
```

## References

| Topic | File | Antislop Rule |
|-------|------|---------------|
| Token Architecture | `references/token-architecture.md` | C-1 (Intentionality) |
| Primitive Tokens | `references/primitive-tokens.md` | R-29 (Restrained Palette) |
| Semantic Tokens | `references/semantic-tokens.md` | R-25 (WCAG AA Contrast) |
| Component Tokens | `references/component-tokens.md` | R-11 (Radius), R-12 (Shadow) |
| Component Specs | `references/component-specs.md` | R-26, R-27 (UI States) |
| States & Variants | `references/states-and-variants.md` | R-32 (Keyboard & Focus) |
| Tailwind Integration | `references/tailwind-integration.md` | C-4 (Resilience) |

## Component Spec Pattern

| Property | Default | Hover | Active | Focus (Visible) | Disabled |
|----------|---------|-------|--------|-----------------|----------|
| Background | primary | primary-hover | primary-active | primary | muted |
| Text | primary-fg (4.5:1+) | primary-fg | primary-fg | primary-fg | muted-fg |
| Border | border | border | border | ring (3:1+) | muted-border |
| Shadow | sm | md | sm | none | none |

## Templates

| Template | Purpose |
|----------|---------|
| `design-tokens-starter.json` | Anti-slop starter JSON with 3 layers, emerald brand palette, WCAG AA contrast, and purposeful scales |

## Integration

- **With antislop (`.agents/skills/antislop`):** Mandatory filter for all token decisions, component specs, and color choices.
- **With brand / DESIGN.md:** Primitives extracted directly from the product's identity, never from AI defaults.
- **With ui-styling (`.agents/skills/ui-styling`):** Semantic tokens feed directly into Tailwind theme variables and shadcn/ui.

**Skill Dependencies:** antislop, antislop-ui, antislop-human, ui-styling  
**Primary Agents:** ui-ux-designer, frontend-developer

---

## Slide System

Brand-compliant presentations using design tokens + Chart.js + contextual decision system.

### Source of Truth

| File | Purpose |
|------|---------|
| `DESIGN.md` / `brand-guidelines.md` | Brand identity, voice, colors |
| `assets/design-tokens.json` | Token definitions (primitive→semantic→component) |
| `assets/design-tokens.css` | CSS variables (import in slides) |
| `assets/css/slide-animations.css` | CSS animation library |

### Slide Requirements (Anti-Slop Compliant)

**ALL slides MUST:**
1. Import `assets/design-tokens.css` as single source of truth.
2. Use CSS variables: `var(--color-primary)`, `var(--slide-bg)`, etc.
3. Use Chart.js with high-contrast data series (WCAG AA).
4. Include keyboard navigation (`ArrowRight`, `ArrowLeft`, `Escape`).
5. Adhere to **Evidence Over Claims (C-5)**: Real data only, no fabricated statistics (R-17).
6. No empty AI buzzwords or em dashes (R-02, R-16).
