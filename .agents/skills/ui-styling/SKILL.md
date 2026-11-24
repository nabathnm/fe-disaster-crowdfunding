---
name: ui-styling
description: Create accessible, brand-specific user interfaces using shadcn/ui components (Radix UI + Tailwind CSS) under the Anti-Slop filter. Banish generic AI patterns, uniform pill buttons, and purple-blue gradients; enforce purposeful radius, WCAG AA contrast, responsive reflow, and full UI state handling.
argument-hint: "[component or layout]"
license: MIT
metadata:
  author: claudekit
  version: "1.1.0"
---

# UI Styling Skill (Anti-Slop Governed)

Comprehensive skill for creating accessible, authentic user interfaces combining shadcn/ui components and Tailwind CSS, strictly governed by the **Anti-Slop Filter** (`.agents/skills/antislop/SKILL.md`).

## Reference

- shadcn/ui: https://ui.shadcn.com/llms.txt
- Tailwind CSS: https://tailwindcss.com/docs
- Anti-Slop Core: `.agents/skills/antislop/SKILL.md`
- Anti-Slop UI Deep-Dive: `.agents/skills/antislop-ui/SKILL.md`
- Anti-Slop Human & Contrast: `.agents/skills/antislop-human/SKILL.md`

## When to Use This Skill

Use when:
- Building UI with React-based frameworks (Next.js, Vite, Remix, Astro)
- Implementing accessible components (dialogs, forms, tables, navigation)
- Styling with utility-first CSS approach (Tailwind CSS)
- Creating responsive, mobile-first layouts without horizontal clipping
- Implementing dark mode and theme customization with verified contrast
- Building design systems with consistent tokens derived from brand identity
- Prototyping complete UI flows (including empty, loading, and error states)

---

## Anti-Slop Craftsmanship Standard for UI (Mandatory)

Whenever generating or styling UI, all components MUST pass the 5 Craftsmanship Criteria and governing rules:

### 1. C-1: Intentionality & Palette Restraint (R-01, R-29)
- **FORBIDDEN**: The generic blue-purple gradient, neon accents, or radial glow orbs.
- Pull colors directly from `DESIGN.md` (e.g. Caring Green for PeduliChain). Restrain palette to 2-3 core colors + 1 deliberate accent.
- Gradients are permitted ONLY when they serve a clear visual hierarchy with the reason articulated.

### 2. C-2: Functional Completeness (R-26)
- Every button, tab, and link must work or be removed. No dead click handlers or buttons that do nothing.
- Modals must be closable via Escape and backdrop click.

### 3. C-3: Purposeful Shape & Elevation (R-10, R-11, R-12, R-13)
- **Radius (R-11)**: Establish purposeful radius tiers (`sm`: 4px, `md`: 8px, `lg`: 12px). Avoid uniform pill (`rounded-full`) everywhere.
- **Glassmorphism (R-10)**: Maximum 1-2 elements per view. Never stack backdrop-blur on navbar, cards, modals, and sidebar simultaneously.
- **Shadows (R-12)**: Ground plane stays flat. Use shadows solely as elevation markers when an element actually floats (dropdown, modal).
- **Glow (R-13)**: Maximum 1-2 elements as focus accents. No glowing card borders everywhere.

### 4. C-4: Resilience & States (R-03, R-27, R-34)
- **Mobile Reflow (R-03)**: Mobile is a designed layout, not a squeezed desktop. Minimum 44px tap targets; zero horizontal overflow.
- **Three UI States (R-27)**: Every data-driven component MUST implement:
  1. `Loading state`: Skeleton or spinner indicator.
  2. `Empty state`: Clear icon + actionable guidance when no data exists.
  3. `Error state`: Friendly message + retry action.
- **Theme Resilience (R-34)**: If dark mode is provided, verify that text and borders remain legible in both themes.

### 5. Accessibility (R-25, R-32)
- All text must meet WCAG AA (minimum 4.5:1 normal text, 3:1 large text / boundaries).
- Never remove focus rings without replacing them: `focus-visible:ring-2 focus-visible:ring-offset-2`.

---

## Core Stack

### Component Layer: shadcn/ui
- Accessible components built on Radix UI primitives.
- Code lives directly in your project (`src/components/ui/`).
- Full keyboard navigation and ARIA attributes out of the box.

### Styling Layer: Tailwind CSS
- Utility-first CSS processed at build-time.
- Mobile-first responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`).
- Design tokens defined in CSS variables (`hsl(var(--primary))`).

### Anti-Slop Filter Layer
- Holds every styling decision to the Purpose Test.
- Ensures the final product feels human-crafted, unique, and resilient.

---

## Quick Start (Clean Anti-Slop Component Example)

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeartHandshake, Loader2, AlertCircle } from "lucide-react"

interface CampaignCardProps {
  campaign: {
    id: string
    title: string
    description: string
    targetEth: string
    status: string
  } | null
  isLoading?: boolean
  error?: string | null
  onDonate?: () => void
}

export function CampaignStatusCard({ campaign, isLoading, error, onDonate }: CampaignCardProps) {
  // 1. Loading State (R-27)
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-emerald-100 p-8 text-center bg-white dark:bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mx-auto" />
        <p className="text-xs text-muted-foreground mt-2 font-medium">Memuat data bantuan bencana...</p>
      </Card>
    )
  }

  // 2. Error State (R-27)
  if (error) {
    return (
      <Card className="rounded-2xl border-rose-200 bg-rose-50/30 p-6 text-center">
        <AlertCircle className="h-6 w-6 text-rose-600 mx-auto mb-2" />
        <p className="text-xs font-semibold text-rose-900">{error}</p>
      </Card>
    )
  }

  // 3. Empty State (R-27)
  if (!campaign) {
    return (
      <Card className="rounded-2xl border-dashed border-emerald-200 p-8 text-center bg-emerald-50/20">
        <HeartHandshake className="h-8 w-8 text-emerald-600/50 mx-auto mb-2" />
        <p className="text-xs font-bold text-foreground">Belum Ada Program Bencana</p>
      </Card>
    )
  }

  // 4. Default State (Clean, restrained, high-contrast)
  return (
    <Card className="rounded-2xl border border-emerald-100 bg-white dark:bg-card shadow-sm hover:border-emerald-300 transition-colors">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className="text-[10px] font-bold border-emerald-200 text-emerald-800 bg-emerald-50">
            {campaign.status}
          </Badge>
          <span className="font-mono text-xs font-extrabold text-emerald-700">
            {campaign.targetEth} ETH
          </span>
        </div>
        <CardTitle className="text-base font-extrabold text-foreground mt-1 line-clamp-1">
          {campaign.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-2 space-y-4">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {campaign.description}
        </p>
        <Button
          onClick={onDonate}
          className="w-full text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <HeartHandshake className="h-3.5 w-3.5 mr-1" /> Berdonasi Sekarang
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

## Delivery Gate for UI Styling

Before delivering any UI component or view, answer these pre-flight checks:
1. **Purpose Test Passed?** Can you articulate why every gradient, shadow, and border exists?
2. **Accessible Contrast (4.5:1)?** Verified text contrast on all backgrounds.
3. **Resilient States Handled?** Loading, empty, and error states present.
4. **Mobile Reflow Verified?** No horizontal overflow, buttons meet 44px tap targets.
5. **No AI Tells?** Zero em dashes (`—`), no floating card glow spam, no uniform pill shape overdose.
