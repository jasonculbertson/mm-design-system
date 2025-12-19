# MetaMask Design System Components

Quick reference for all available components.

## Primitives

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `Button` | Actions | `label`, `variant`, `size`, `disabled` |
| `Input` | Text entry | `placeholder`, `label`, `error`, `disabled` |
| `Card` | Content container | `title`, `description`, `variant`, `hasAction` |
| `Badge` | Status labels | `label`, `variant`, `size` |
| `Avatar` | User identity | `name`, `size`, `showBadge` |
| `Switch` | Toggle settings | `value`, `label`, `disabled` |
| `Banner` | Notifications | `title`, `description`, `variant`, `dismissible` |
| `Skeleton` | Loading states | `variant`, `width`, `height` |
| `Dialog` | Modal dialogs | `title`, `description`, `primaryAction`, `variant` |
| `Select` | Dropdown selector | `label`, `value`, `placeholder`, `disabled` |
| `Chip` | Filter/tag chips | `label`, `selected`, `disabled` |
| `Toast` | Brief notifications | `message`, `variant`, `action` |
| `ProgressBar` | Progress indicator | `progress`, `variant`, `showLabel` |
| `Divider` | Visual separator | `variant` |
| `AvatarNetwork` | Network logo avatar | `name`, `size` |
| `AvatarToken` | Token icon avatar | `symbol`, `name`, `size` |
| `ButtonIcon` | Icon-only button | `icon`, `size`, `variant` |
| `Checkbox` | Form checkbox | `checked`, `label`, `disabled` |
| `Tabs` | Tab navigation | `tabs`, `activeIndex`, `variant` |
| `TextArea` | Multi-line input | `placeholder`, `label`, `rows` |
| `BadgeCount` | Numeric badge | `count`, `max`, `variant` |
| `NetworkBadge` | Network indicator | `network`, `size` |
| `Radio` | Single radio button | `selected`, `label`, `disabled` |
| `RadioGroup` | Radio button group | `options`, `selected`, `disabled` |
| `Spinner` | Loading spinner | `size`, `variant` |
| `Tooltip` | Info tooltip | `text`, `position` |
| `Link` | Text link | `text`, `variant`, `disabled` |
| `Slider` | Range input | `value`, `min`, `max`, `showValue` |
| `Accordion` | Collapsible content | `title`, `content`, `expanded` |
| `BottomSheet` | Slide-up modal | `title`, `visible`, `hasHandle` |
| `Popover` | Floating content | `trigger`, `content`, `visible` |
| `SegmentedControl` | Segmented buttons | `segments`, `selected`, `disabled` |
| `PasswordInput` | Password field | `placeholder`, `value`, `showPassword`, `error` |
| `SearchBar` | Search input | `placeholder`, `value`, `showClear` |

## Components

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `HubHeader` | Wallet balance display | `balance`, `label`, `primaryAction`, `secondaryAction` |
| `AccountPicker` | Account selector | `name`, `connected`, `loading` |
| `TokenCell` | Asset row | `symbol`, `name`, `balance`, `value`, `change` |
| `FooterNav` | Bottom navigation | `activeTab` |
| `EmptyState` | Empty content | `title`, `description`, `actionLabel` |
| `PageHeader` | Page navigation | `title`, `showBack`, `action` |
| `SectionHeader` | Section title | `title`, `action` |
| `ListItem` | Menu/settings row | `title`, `subtitle`, `leftIcon`, `showChevron` |
| `TransactionCell` | Transaction history | `type`, `status`, `amount`, `address`, `timestamp` |
| `AddressDisplay` | Crypto address display | `address`, `truncate`, `showCopy`, `variant` |
| `GasFeeSelector` | Gas fee selection | `selected`, `lowFee`, `mediumFee`, `highFee` |
| `NFTCard` | NFT display card | `name`, `collection`, `price`, `showPrice` |
| `NetworkSelector` | Network selection list | `selected`, `networks` |
| `QRCode` | QR code display | `value`, `size`, `showValue` |
| `StatusIndicator` | Transaction status | `status`, `label`, `showPulse` |
| `WalletConnectSession` | Connected dApp | `dappName`, `dappUrl`, `connected`, `network` |
| `AmountInput` | Crypto amount input | `value`, `token`, `fiatValue`, `balance`, `showMax` |
| `SwapPreview` | Token swap preview | `fromToken`, `fromAmount`, `toToken`, `toAmount`, `rate`, `fee` |
| `ConfirmationSheet` | Transaction confirmation | `title`, `amount`, `recipient`, `fee`, `total` |
| `Identicon` | Address identicon | `address`, `size` |
| `ChainBadge` | Current chain indicator | `chain`, `showName` |
| `Stepper` | Multi-step progress | `steps`, `current`, `variant` |
| `NotificationCell` | In-app notification | `title`, `message`, `timestamp`, `type`, `unread` |
| `CollectibleGrid` | NFT grid layout | `count`, `columns` |

## Usage Examples

### Wallet Home Screen
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <AccountPicker name="Main Wallet" />
  <HubHeader balance="$10,000" primaryAction="Send" secondaryAction="Receive" />
  <TokenCell symbol="ETH" name="Ethereum" balance="5.0" value="$10,000" change="+5%" changePositive />
  <FooterNav activeTab="wallet" />
</View>
```

### Transaction History Screen
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Activity" showBack />
  <SectionHeader title="Recent" />
  <TransactionCell type="send" status="confirmed" amount="-0.5 ETH" address="0x1234...5678" />
  <TransactionCell type="receive" status="confirmed" amount="+1.0 ETH" address="0xabcd...ef12" />
  <TransactionCell type="swap" status="pending" amount="ETH → USDC" timestamp="Just now" />
</View>
```

### Send Flow
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Send ETH" showBack />
  <Stepper steps="Amount,Recipient,Confirm" current={0} />
  <AmountInput token="ETH" balance="2.5" fiatValue="$5,000" showMax />
  <GasFeeSelector selected="medium" />
  <Button label="Continue" variant="primary" />
</View>
```

### Settings Screen
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Settings" showBack />
  
  <SectionHeader title="Security" />
  <ListItem title="Lock Settings" leftIcon="🔒" showChevron />
  <ListItem title="Reveal Seed Phrase" leftIcon="📝" showChevron />
  <Divider variant="inset" />
  
  <SectionHeader title="Preferences" />
  <ListItem title="Currency" subtitle="USD" showChevron />
  <ListItem title="Language" subtitle="English" showChevron />
  <Divider variant="inset" />
  
  <SectionHeader title="Account" />
  <ListItem title="Delete Wallet" leftIcon="🗑️" variant="destructive" />
</View>
```

### Token Swap
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Swap" showBack />
  <SwapPreview 
    fromToken="ETH" 
    fromAmount="1.0" 
    toToken="USDC" 
    toAmount="2,000" 
    rate="1 ETH = 2,000 USDC"
    fee="$2.50"
  />
  <GasFeeSelector selected="medium" />
  <Button label="Swap" variant="primary" />
</View>
```

### Receive Address Screen
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default, alignItems: "center" }}>
  <PageHeader title="Receive" showBack />
  <QRCode value="0x1234567890abcdef..." size="lg" />
  <AddressDisplay address="0x1234567890abcdef..." showCopy />
  <ChainBadge chain="Ethereum" />
</View>
```

### Connected dApps
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Connected Sites" showBack />
  <WalletConnectSession dappName="Uniswap" dappUrl="app.uniswap.org" connected network="Ethereum" />
  <WalletConnectSession dappName="OpenSea" dappUrl="opensea.io" connected network="Ethereum" />
</View>
```

### Notifications
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="Notifications" showBack />
  <NotificationCell 
    title="Transaction Complete" 
    message="Your ETH transfer was successful" 
    type="success" 
    timestamp="2 min ago" 
    unread 
  />
  <NotificationCell 
    title="Low Balance" 
    message="Your ETH balance is running low" 
    type="warning" 
    timestamp="1 hour ago" 
  />
</View>
```

### NFT Collection
```tsx
<View style={{ flex: 1, backgroundColor: colors.background.default }}>
  <PageHeader title="My NFTs" showBack />
  <Tabs tabs={["Collected", "Created", "Favorited"]} activeIndex={0} />
  <CollectibleGrid count={6} columns={2} />
</View>
```

## Color Quick Reference

| Use Case | Token |
|----------|-------|
| Page background | `colors.background.default` |
| Cards/sections | `colors.background.section` |
| Primary text | `colors.text.default` |
| Secondary text | `colors.text.alternative` |
| Interactive | `colors.primary.default` |
| Errors | `colors.error.default` |
| Success | `colors.success.default` |
| Borders | `colors.border.muted` |

## Spacing Scale

| Token | Value | Use For |
|-------|-------|---------|
| `spacing[1]` | 4px | Tight gaps |
| `spacing[2]` | 8px | Small gaps |
| `spacing[3]` | 12px | Medium gaps |
| `spacing[4]` | 16px | Standard padding |
| `spacing[6]` | 24px | Section spacing |
| `spacing[8]` | 32px | Large sections |

## Component Count Summary

- **Primitives**: 33 components
- **Wallet Components**: 22 components
- **Total**: 55 components
