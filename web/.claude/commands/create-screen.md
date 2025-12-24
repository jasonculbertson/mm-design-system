# Create Screen Command

Create a new screen using MetaMask Design System components.

## Usage

```
/create-screen ScreenName
```

## Steps

1. **Plan the layout** - identify which components are needed
2. **Import components** from `@/lib/components`
3. **Import tokens** from `@/lib/tokens`
4. **Use useColors()** for theme-aware colors
5. **Compose the screen** using design system components

## Screen Template

```tsx
"use client";

import {
  PageHeader,
  TokenCell,
  SectionHeader,
  FooterNav,
  useColors,
} from "@/lib/components";
import { spacing } from "@/lib/tokens";

export default function MyScreen() {
  const c = useColors();

  return (
    <div style={{
      backgroundColor: c.background.default,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Content */}
      <div style={{ flex: 1, padding: spacing[4] }}>
        <PageHeader title="Screen Title" showBack />
        
        <div style={{ marginTop: spacing[6] }}>
          <SectionHeader title="Section" action="See all" />
          {/* Content here */}
        </div>
      </div>

      {/* Footer */}
      <FooterNav activeTab="wallet" />
    </div>
  );
}
```

## Common Screen Patterns

### Wallet Home
- HubHeader (balance)
- SectionHeader + TokenCell list
- FooterNav

### Token Detail
- PageHeader (with back)
- HubHeader (token balance)
- TransactionCell list

### Settings
- PageHeader
- SectionHeader + ListItem list

### Activity
- PageHeader
- Tabs
- TransactionCell list

## Rules

1. Always use design tokens for spacing
2. Always use useColors() for colors
3. Always include FooterNav for main screens
4. Always include PageHeader for detail screens

