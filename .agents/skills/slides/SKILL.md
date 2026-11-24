---
name: slides
description: Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies under the Anti-Slop filter. Enforces verifiable evidence, high-contrast data visualization, and authentic narrative structure.
argument-hint: "[topic] [slide-count]"
metadata:
  author: claudekit
  version: "1.1.0"
---

# Slides (Anti-Slop Governed)

Strategic HTML presentation design with Chart.js data visualization — strictly filtered through the **Anti-Slop Craftsmanship Standard** (`.agents/skills/antislop/SKILL.md`).

## Anti-Slop Slide Principles (Mandatory)

1. **Evidence Over Claims (C-5, R-17)**:
   - Present only verifiable data and real metrics. Never generate fictional statistics ("99.9% customer satisfaction", "500M+ transactions") without actual source data.
2. **Copywriting Hygiene (R-02, R-16)**:
   - **FORBIDDEN**: em dashes (`—`) in slide headlines or bullet points.
   - **FORBIDDEN**: hollow buzzwords ("unlock, elevate, next-generation, seamless"). State actual product value plainly.
3. **High-Contrast Data Visualization (R-25)**:
   - Every Chart.js line, bar, and label must maintain at least **3:1** contrast against slide backgrounds.
   - Labels and axis text must meet **4.5:1** contrast ratio.
4. **Token Consistency**:
   - Slides MUST use CSS variables from `assets/design-tokens.css` or values from `DESIGN.md`.
5. **Keyboard Operability (R-32)**:
   - Every slide deck must support keyboard navigation (`ArrowRight` for next slide, `ArrowLeft` for previous slide).

## When to Use

- Pitch decks and investor presentations
- Data-driven slides with interactive Chart.js visualizations
- Strategic project overviews and transparency reports
- Content-driven slide design using PAS/AIDA copywriting frameworks

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `create` | Create strategic presentation slides | `references/create.md` |

## References (Knowledge Base)

| Topic | File | Anti-Slop Guardrail |
|-------|------|---------------------|
| Layout Patterns | `references/layout-patterns.md` | Varied section rhythms (R-14) |
| HTML Template | `references/html-template.md` | WCAG AA contrast & token vars |
| Copywriting Formulas | `references/copywriting-formulas.md` | No empty AI buzzwords (R-16) |
| Slide Strategies | `references/slide-strategies.md` | Evidence-based narratives (C-5) |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word).
2. Load corresponding `references/{subcommand}.md`.
3. Verify output against the Anti-Slop Delivery Gate before completion.
