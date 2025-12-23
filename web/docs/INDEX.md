# Documentation Index

## Quick References
- [Design Tokens](/lib/tokens.ts) - Colors, spacing, typography
- [Component Registry](/component-registry.json) - All components with props
- [AI Guidelines](/AI_GUIDELINES.md) - Building with this system

## Common Tasks
- Building a wallet screen - See WalletHomeScreen pattern
- Creating a new component - Follow patterns in lib/components.tsx
- Choosing colors/spacing - See lib/tokens.ts

## All Components (55 total)
- **33 Primitives**: Button, Input, Card, Badge, Avatar, Switch, Banner, Skeleton, Dialog, Select, Chip, Toast, ProgressBar, Divider, AvatarNetwork, AvatarToken, ButtonIcon, Checkbox, Tabs, TextArea, BadgeCount, NetworkBadge, Radio, RadioGroup, Spinner, Tooltip, Link, Slider, Accordion, BottomSheet, Popover, SegmentedControl, PasswordInput, SearchBar

- **22 Wallet Components**: HubHeader, AccountPicker, TokenCell, FooterNav, EmptyState, PageHeader, SectionHeader, ListItem, TransactionCell, AddressDisplay, GasFeeSelector, NFTCard, NetworkSelector, QRCode, StatusIndicator, WalletConnectSession, AmountInput, SwapPreview, ConfirmationSheet, Identicon, ChainBadge, Stepper, NotificationCell, CollectibleGrid

## Design Tokens

### Colors
```ts
colors.background.default   // #222325 - Main background
colors.background.section   // #31333A - Cards, sections
colors.text.default         // #FFFFFF - Primary text
colors.text.alternative     // #858B9A - Secondary text
colors.primary.default      // #8b99ff - Interactive elements
colors.error.default        // #FF7584 - Error states
colors.success.default      // #4AE39E - Success states
```

### Spacing (4px base)
```ts
spacing[1]  // 4px
spacing[2]  // 8px
spacing[3]  // 12px
spacing[4]  // 16px
spacing[6]  // 24px
spacing[8]  // 32px
```

### Border Radius
```ts
borderRadius.xs    // 4px
borderRadius.sm    // 8px
borderRadius.md    // 12px
borderRadius.lg    // 16px
borderRadius.pill  // 9999px
```

## Screen Patterns

### Wallet Home
- HubHeader (balance display)
- SectionHeader ("Tokens")
- TokenCell (repeated)
- FooterNav (bottom navigation)

### Token Detail
- PageHeader (with back button)
- HubHeader (token balance)
- SectionHeader ("Activity")
- TransactionCell (repeated)

### Settings
- PageHeader (title)
- SectionHeader (category)
- ListItem (repeated, with chevrons)

## Canvas Builder

Interactive tool at `/canvas`:
- Drag components from palette
- Preview in device frames
- Export React code
- Save/load compositions

