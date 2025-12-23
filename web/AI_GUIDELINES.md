# AI Guidelines for MetaMask Design System

This document helps AI tools (like Cursor, GitHub Copilot) understand and correctly use this design system.

## Quick Start

```tsx
// Import components
import { Button, TokenCell, HubHeader } from "@/lib/components";

// Import tokens
import { colors, spacing, borderRadius, typography } from "@/lib/tokens";
```

## Core Principles

1. **Always use design tokens** - Never use raw hex colors or pixel values
2. **Use semantic colors** - `colors.text.default` not `colors.grey[100]`
3. **Follow spacing scale** - `spacing[4]` (16px) not `16`
4. **Mobile-first** - Components are designed for 375px width

## Component Categories

### Primitives (33 components)
Low-level UI building blocks: Button, Input, Card, Badge, Avatar, Switch, Banner, etc.

### Wallet Components (22 components)
MetaMask-specific: HubHeader, TokenCell, FooterNav, TransactionCell, etc.

## Common Patterns

### Building a Screen

```tsx
import { PageHeader, TokenCell, FooterNav } from "@/lib/components";
import { colors, spacing } from "@/lib/tokens";

export function TokenListScreen() {
  return (
    <div style={{ 
      backgroundColor: colors.background.default,
      minHeight: "100vh",
      padding: spacing[4]
    }}>
      <PageHeader title="Tokens" showBack />
      <TokenCell symbol="ETH" name="Ethereum" balance="1.5" value="$3,000" />
      <TokenCell symbol="USDC" name="USD Coin" balance="500" value="$500" />
      <FooterNav activeTab="wallet" />
    </div>
  );
}
```

### Using Colors

```tsx
// ✅ Correct
backgroundColor: colors.background.section
color: colors.text.default
borderColor: colors.border.muted

// ❌ Incorrect
backgroundColor: "#31333A"
color: "white"
```

### Using Spacing

```tsx
// ✅ Correct
padding: spacing[4]        // 16px
gap: spacing[2]            // 8px
marginBottom: spacing[6]   // 24px

// ❌ Incorrect
padding: 16
gap: "8px"
```

### Using Border Radius

```tsx
// ✅ Correct
borderRadius: borderRadius.lg   // 16px
borderRadius: borderRadius.pill // 9999px (circles)

// ❌ Incorrect
borderRadius: 16
borderRadius: "50%"
```

## Component Props Quick Reference

### Most Used Components

| Component | Required Props | Common Props |
|-----------|---------------|--------------|
| Button | label | variant, size, disabled |
| TokenCell | symbol, name, balance | value, change, changePositive |
| HubHeader | balance | label, primaryAction, secondaryAction |
| PageHeader | title | showBack, action |
| FooterNav | activeTab | - |
| TransactionCell | type, status, amount | address, timestamp |

### Variants

| Component | Variants |
|-----------|----------|
| Button | primary, secondary, tertiary, danger |
| Badge | default, primary, success, warning, error |
| Card | default, elevated, outlined |
| Toast | default, success, error |
| Banner | info, success, warning, error |

## File Structure

```
web/
├── lib/
│   ├── tokens.ts        # Design tokens (colors, spacing, etc.)
│   └── components.tsx   # All components + registry
├── app/
│   ├── components/      # Component documentation pages
│   └── canvas/          # Interactive canvas builder
└── component-registry.json  # AI-readable component list
```

## Do's and Don'ts

### ✅ Do

- Import from `@/lib/components` and `@/lib/tokens`
- Use the `useColors()` hook for theme-aware colors
- Check `component-registry.json` for available props
- Follow existing component patterns
- Use semantic color tokens

### ❌ Don't

- Use raw color values like `#FFFFFF`
- Use arbitrary spacing like `padding: 17px`
- Create new components when existing ones work
- Mix Tailwind with design tokens
- Hardcode dark theme colors

## Theme Support

The design system supports dark and light themes via the `useColors()` hook:

```tsx
import { useColors } from "@/lib/components";

function MyComponent() {
  const c = useColors();
  
  return (
    <div style={{ 
      backgroundColor: c.background.section,
      color: c.text.default 
    }}>
      Content
    </div>
  );
}
```

## Canvas Builder

Use the canvas at `/canvas` to:
- Drag & drop components
- Preview in device frames (iPhone 15 Pro, SE, Pixel 8)
- Export code
- Save/load compositions

## Questions?

- Check `component-registry.json` for all props
- Look at existing component pages in `/app/components/`
- Reference `lib/tokens.ts` for all design tokens

