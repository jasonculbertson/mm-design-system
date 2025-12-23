# Cursor Workflow Guide

## Before Building

1. **Check component-registry.json** for available components
2. **Review AI_GUIDELINES.md** for rules
3. **Look at docs/patterns/** for screen examples
4. **Always use tokens** from /lib/tokens.ts

## Building a Screen

Ask Cursor:
```
"Build a [ScreenName] screen using the MetaMask Design System.
Follow these patterns:
1. Import from @/lib/components
2. Use tokens from @/lib/tokens
3. Use the useColors() hook for theme-aware colors
4. Reference docs/patterns/WalletHomeScreen.tsx as example
5. Include FooterNav with activeTab prop"
```

## Adding a Component

Ask Cursor:
```
"Create a new [ComponentName] component that:
1. Uses design tokens for all styling
2. Exports TypeScript interfaces
3. Follows the structure in lib/components.tsx
4. Includes JSDoc comments"
```

## Common Commands

**Build wallet screen:**
```
cursor: create wallet home screen
```

**Add transaction list:**
```
cursor: add transaction history using TransactionCell
```

**Create settings screen:**
```
cursor: build settings screen with ListItem components
```

## Verification

After generation, verify:
- ✅ All colors use tokens or useColors()
- ✅ All spacing uses spacing tokens
- ✅ Components imported from @/lib/components
- ✅ Props match component-registry.json
- ✅ Types are defined
- ✅ Inline styles use design tokens

## Canvas Builder

Use `/canvas` to:
- Drag & drop components visually
- Preview in device frames (iPhone 15 Pro, SE, Pixel 8)
- Export React code
- Save/load compositions
- Test different themes

## File Structure

```
web/
├── lib/
│   ├── tokens.ts        # Design tokens
│   └── components.tsx   # All components
├── app/
│   ├── canvas/          # Canvas builder
│   └── components/      # Component docs
├── component-registry.json  # AI reference
├── AI_GUIDELINES.md     # AI instructions
└── docs/
    ├── INDEX.md         # Quick reference
    └── patterns/        # Example screens
```

