# MetaMask Screen Templates Library

A comprehensive library of pre-built screen compositions for rapid prototyping. Each template represents a common MetaMask mobile screen pattern.

## Quick Start

1. Open the Canvas at `/canvas`
2. Click "Templates" button in the toolbar
3. Select a template to load
4. Customize props and add/remove components

---

## Template Categories

### 🏠 Core Screens

#### Wallet Home
**ID:** `wallet-home`  
**Use for:** Main entry point, portfolio overview

| Component | Purpose |
|-----------|---------|
| HubHeader | Total balance with primary actions |
| SectionHeader | "Tokens" label with "See all" |
| TokenCell (×3) | Individual token balances |
| FooterNav | Bottom navigation |

```
┌─────────────────────────┐
│     $12,450.00          │
│   Total Balance         │
│  [Add funds]  [Buy]     │
├─────────────────────────┤
│ Tokens          See all │
├─────────────────────────┤
│ ETH    2.45   $4,890.00 │
│ USDC   5,000  $5,000.00 │
│ MATIC  1,250  $1,125.00 │
├─────────────────────────┤
│  🏠   🔍   (+)  🕐   ⚙️  │
└─────────────────────────┘
```

---

#### Token Detail
**ID:** `token-detail`  
**Use for:** Single asset view, token-specific actions

| Component | Purpose |
|-----------|---------|
| PageHeader | Back navigation + token name |
| HubHeader | Token balance + Send/Receive |
| SectionHeader | "Activity" label |
| TransactionCell (×3) | Token transaction history |

---

### 💸 Send Flow

#### Send - Amount Entry
**ID:** `send-amount`  
**Use for:** Step 1 of send flow

| Component | Purpose |
|-----------|---------|
| PageHeader | "Send" with back/cancel |
| AmountInput | Token amount with USD conversion |
| Button | "Next" to proceed |

---

#### Send - Recipient
**ID:** `send-recipient`  
**Use for:** Step 2 of send flow

| Component | Purpose |
|-----------|---------|
| PageHeader | "Send to" with back |
| Input | Address/ENS entry |
| SectionHeader | "Recent" label |
| ListItem (×2) | Recent recipients |

---

#### Send - Confirm
**ID:** `send-confirm`  
**Use for:** Final review before sending

| Component | Purpose |
|-----------|---------|
| PageHeader | "Confirm Send" |
| ConfirmationSheet | Transaction details |
| GasFeeSelector | Gas fee options |
| Button | "Confirm & Send" |

---

### 📥 Receive

#### Receive Address
**ID:** `receive`  
**Use for:** Display address/QR for receiving

| Component | Purpose |
|-----------|---------|
| PageHeader | "Receive" with back |
| QRCode | Scannable wallet address |
| AddressDisplay | Copy-able address |
| Button | Share address option |

---

### 🔄 Swap

#### Swap Interface
**ID:** `swap`  
**Use for:** Token swap flow

| Component | Purpose |
|-----------|---------|
| PageHeader | "Swap" with back |
| AmountInput (from) | Token to swap from |
| AmountInput (to) | Token to receive |
| SwapPreview | Rate and fee info |
| Button | "Review Swap" |

---

### ⚙️ Settings

#### Main Settings
**ID:** `settings`  
**Use for:** App configuration hub

| Component | Purpose |
|-----------|---------|
| PageHeader | "Settings" |
| SectionHeader | Category groupings |
| ListItem (×7) | Setting rows |

---

#### Security Settings
**ID:** `security-settings`  
**Use for:** Security-specific options

| Component | Purpose |
|-----------|---------|
| PageHeader | "Security" with back |
| Banner | Security recommendation |
| ListItem (×5) | Security options |
| SectionHeader | Privacy section |
| ListItem (×2) | Privacy options |

---

### 📊 Activity

#### Transaction History
**ID:** `activity`  
**Use for:** Full transaction history

| Component | Purpose |
|-----------|---------|
| PageHeader | "Activity" |
| Tabs | Filter: All/Sent/Received/Swaps |
| SectionHeader | Date groupings |
| TransactionCell (×4) | Transaction rows |
| FooterNav | Bottom navigation |

---

### 🌐 Network

#### Network Selection
**ID:** `network-select`  
**Use for:** Switching networks

| Component | Purpose |
|-----------|---------|
| PageHeader | "Select Network" |
| SearchBar | Search networks |
| SectionHeader | "Popular" / "Test Networks" |
| ListItem (×5) | Network options |

---

### 🔗 dApp Connection

#### Connect Request
**ID:** `dapp-connect`  
**Use for:** New dApp connection approval

| Component | Purpose |
|-----------|---------|
| PageHeader | "Connect" |
| WalletConnectSession | dApp info |
| SectionHeader | "Permissions Requested" |
| ListItem (×2) | Permission items |
| Button (×2) | Connect / Reject |

---

#### Connected dApps
**ID:** `connected-dapps`  
**Use for:** Managing existing connections

| Component | Purpose |
|-----------|---------|
| PageHeader | "Connected Sites" |
| WalletConnectSession (×3) | Connected dApps |
| EmptyState | Management hint |

---

### 🖼️ NFTs

#### NFT Gallery
**ID:** `nft-gallery`  
**Use for:** NFT collection display

| Component | Purpose |
|-----------|---------|
| PageHeader | "NFTs" |
| Tabs | Collected/Created/Hidden |
| NFTCard (×2) | NFT items |
| FooterNav | Bottom navigation |

---

### ✨ States

#### Empty State
**ID:** `empty`  
**Use for:** No content scenarios

| Component | Purpose |
|-----------|---------|
| PageHeader | Context title |
| EmptyState | Illustration + CTA |
| FooterNav | Bottom navigation |

---

#### Success State
**ID:** `success`  
**Use for:** Transaction success

| Component | Purpose |
|-----------|---------|
| PageHeader | "Success" + Done |
| StatusIndicator | Confirmed badge |
| TransactionCell | Transaction summary |
| Button (×2) | View on Explorer / Done |

---

#### Error State
**ID:** `error`  
**Use for:** Transaction failure

| Component | Purpose |
|-----------|---------|
| PageHeader | "Failed" |
| StatusIndicator | Failed badge |
| Banner | Error explanation |
| Button (×2) | Try Again / Cancel |

---

#### Pending State
**ID:** `pending`  
**Use for:** Transaction in progress

| Component | Purpose |
|-----------|---------|
| PageHeader | "Pending" |
| StatusIndicator | Pending with pulse |
| TransactionCell | Transaction being processed |
| ProgressBar | Visual progress |
| Button (×2) | Speed Up / Cancel |

---

### 🚀 Onboarding

#### Welcome Screen
**ID:** `onboarding-welcome`  
**Use for:** First-time user entry

| Component | Purpose |
|-----------|---------|
| EmptyState | Welcome message |
| Button | Create New Wallet |
| Button | Import Existing Wallet |

---

#### Security Setup
**ID:** `onboarding-secure`  
**Use for:** Backup prompt step

| Component | Purpose |
|-----------|---------|
| PageHeader | "Secure Your Wallet" |
| Stepper | Progress indicator |
| Banner | Why backup matters |
| Button (×2) | Start Backup / Remind Later |

---

### 🔔 Notifications

#### Notification Center
**ID:** `notifications`  
**Use for:** In-app notification list

| Component | Purpose |
|-----------|---------|
| PageHeader | "Notifications" + Mark all read |
| SectionHeader | "New" / "Earlier" |
| NotificationCell (×4) | Individual notifications |

---

### 🌍 Browser

#### In-App Browser
**ID:** `browser`  
**Use for:** dApp browser context

| Component | Purpose |
|-----------|---------|
| PageHeader | dApp name |
| ChainBadge | Current network |
| Banner | Connection status |
| FooterNav | Bottom navigation |

---

## Customization Tips

### Adding Components
1. Drag from the component palette on the left
2. Drop onto the canvas
3. Edit props in the right panel

### Removing Components
- Drag component off the device frame
- Or select and press Delete/Backspace

### Reordering
- Drag components up/down within the canvas
- Footer should always be last for proper layout

### Saving Custom Templates
1. Build your screen composition
2. Click Save icon
3. Give it a name
4. Access later via "Load" button

---

## Best Practices

1. **Start with a template** - Faster than building from scratch
2. **Use PageHeader for navigation** - Consistent back/close behavior
3. **Include FooterNav on main screens** - Users expect bottom nav
4. **Test with different data** - Try long names, large numbers
5. **Consider empty states** - What if there's no data?

---

## Template Request

Need a template that doesn't exist? 

1. Describe the screen flow
2. List the components you think it needs
3. Provide context on when it's used
4. Submit to the design system team

