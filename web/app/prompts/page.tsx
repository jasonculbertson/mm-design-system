"use client";

import { useState } from "react";
import { 
  Copy, Check, Sparkles, Wallet, ArrowLeftRight, Settings, 
  User, Shield, Layout, Bell, Image, Search, Zap
} from "lucide-react";
import { useColors } from "@/lib/components";
import { colors, spacing, radius, typography } from "@/lib/tokens";

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  prompt: string;
  tags: string[];
}

const prompts: Prompt[] = [
  {
    id: "wallet-home",
    title: "Wallet Home Screen",
    description: "Create the main wallet dashboard with balance and tokens",
    category: "Screens",
    icon: <Wallet size={20} />,
    prompt: `Create a wallet home screen for MetaMask using the design system components.

Requirements:
- Use HubHeader for balance display with "Add funds" and "Buy" actions
- Add a SectionHeader titled "Tokens"
- Show 3-5 TokenCell components with different tokens (ETH, USDC, MATIC, etc.)
- Include FooterNav at the bottom with "wallet" as active tab
- Use colors.background.default for the main background
- Add proper spacing using the spacing tokens

Reference the design system components from @/lib/components:
- HubHeader
- SectionHeader
- TokenCell
- FooterNav

Use design tokens from @/lib/tokens:
- colors.background.default
- spacing[4], spacing[6]`,
    tags: ["home", "balance", "tokens", "dashboard"],
  },
  {
    id: "send-flow",
    title: "Send Token Flow",
    description: "Build a complete send flow with amount, recipient, and confirmation",
    category: "Flows",
    icon: <ArrowLeftRight size={20} />,
    prompt: `Create a send token flow with three screens:

1. Amount Screen:
- PageHeader with title "Send" and back button
- AmountInput component for entering the amount
- Show token balance and fiat conversion
- "Next" button at the bottom

2. Recipient Screen:
- PageHeader with title "Send to"
- Input for address/ENS
- Recent recipients section with ListItem components

3. Confirmation Screen:
- PageHeader with title "Confirm Send"
- ConfirmationSheet showing transaction details
- GasFeeSelector for gas options
- "Confirm & Send" button

Use components:
- PageHeader, AmountInput, Button, Input
- ListItem, SectionHeader
- ConfirmationSheet, GasFeeSelector

Use design tokens for spacing and colors.`,
    tags: ["send", "transfer", "transaction", "flow"],
  },
  {
    id: "settings-screen",
    title: "Settings Screen",
    description: "Design a settings page with grouped options",
    category: "Screens",
    icon: <Settings size={20} />,
    prompt: `Create a settings screen with organized sections.

Requirements:
- PageHeader with title "Settings" and back button
- Multiple sections using SectionHeader:
  - "Account" section: Profile, Security, Backup
  - "Preferences" section: Notifications, Currency, Language
  - "Networks" section: Manage Networks, Add Network
  - "About" section: Help, Privacy Policy, Version
- Use ListItem components with:
  - title and subtitle
  - showChevron for navigation items
  - leftIcon for visual indicators
- Proper spacing between sections

Components to use:
- PageHeader, SectionHeader, ListItem

Style using design tokens for consistent theming.`,
    tags: ["settings", "preferences", "menu", "options"],
  },
  {
    id: "swap-interface",
    title: "Token Swap Interface",
    description: "Build a swap screen with token selection and preview",
    category: "Screens",
    icon: <ArrowLeftRight size={20} />,
    prompt: `Create a token swap interface.

Requirements:
- PageHeader with title "Swap"
- Two AmountInput components:
  - "From" token with balance and max button
  - "To" token showing converted amount
- Swap button between inputs (rotatable icon)
- SwapPreview showing:
  - Exchange rate
  - Price impact
  - Network fee
- "Review Swap" button

Components:
- PageHeader, AmountInput, SwapPreview, Button

Add visual feedback for:
- Loading states while fetching rates
- Error states for insufficient balance
- Success preview before confirmation`,
    tags: ["swap", "exchange", "dex", "trade"],
  },
  {
    id: "nft-gallery",
    title: "NFT Gallery View",
    description: "Display NFT collection in a responsive grid",
    category: "Screens",
    icon: <Image size={20} />,
    prompt: `Create an NFT gallery screen.

Requirements:
- PageHeader with title "NFTs"
- Tabs component with: "Collected", "Created", "Hidden"
- Grid layout for NFT cards (2 columns)
- NFTCard component showing:
  - NFT image placeholder
  - Collection name
  - NFT name/ID
  - Optional price in ETH
- Empty state when no NFTs

Components:
- PageHeader, Tabs, NFTCard, EmptyState

Grid styling:
- Use CSS Grid with gap: spacing[3]
- 2 columns on mobile
- Responsive for larger screens`,
    tags: ["nft", "collectibles", "gallery", "collection"],
  },
  {
    id: "onboarding-flow",
    title: "Onboarding Welcome",
    description: "Design the first screen users see when opening the app",
    category: "Flows",
    icon: <User size={20} />,
    prompt: `Create an onboarding welcome screen.

Requirements:
- Centered content layout
- MetaMask logo or fox icon at top
- EmptyState component with:
  - title: "Welcome to MetaMask"
  - description: "The crypto wallet trusted by millions"
- Two primary actions:
  - "Create New Wallet" (primary button)
  - "Import Existing Wallet" (secondary button)
- Legal text at bottom (Terms, Privacy links)

Components:
- EmptyState, Button

Styling:
- Full height centered layout
- Generous vertical spacing
- Primary button should be prominent`,
    tags: ["onboarding", "welcome", "setup", "first-run"],
  },
  {
    id: "transaction-detail",
    title: "Transaction Detail",
    description: "Show detailed view of a single transaction",
    category: "Screens",
    icon: <Zap size={20} />,
    prompt: `Create a transaction detail screen.

Requirements:
- PageHeader with title "Transaction" and back button
- StatusIndicator showing transaction status
- Transaction summary card with:
  - Type (Send, Receive, Swap)
  - Amount in crypto and fiat
  - Timestamp
  - Status badge
- Details section:
  - From/To addresses (AddressDisplay)
  - Network (ChainBadge)
  - Gas used
  - Transaction hash
- Action buttons:
  - "View on Explorer"
  - "Share"

Components:
- PageHeader, StatusIndicator, AddressDisplay
- ChainBadge, Button, SectionHeader

Show different states: pending, confirmed, failed`,
    tags: ["transaction", "detail", "history", "activity"],
  },
  {
    id: "dapp-connection",
    title: "dApp Connection Request",
    description: "Approval screen for connecting to a dApp",
    category: "Flows",
    icon: <Layout size={20} />,
    prompt: `Create a dApp connection approval screen.

Requirements:
- PageHeader with title "Connect"
- WalletConnectSession showing:
  - dApp name and URL
  - dApp logo placeholder
  - Connection status
- Permissions section:
  - List of requested permissions
  - Each with icon and description
- Warning banner if suspicious
- Action buttons:
  - "Connect" (primary)
  - "Reject" (secondary)

Components:
- PageHeader, WalletConnectSession
- ListItem, Banner, Button

Security considerations:
- Highlight what the dApp can access
- Show network being connected to`,
    tags: ["dapp", "connect", "walletconnect", "approval"],
  },
  {
    id: "notification-center",
    title: "Notification Center",
    description: "Display in-app notifications grouped by time",
    category: "Screens",
    icon: <Bell size={20} />,
    prompt: `Create a notification center screen.

Requirements:
- PageHeader with title "Notifications"
- Optional "Mark all read" action
- Grouped by time:
  - "New" section for unread
  - "Earlier" section for read
  - "This Week" for older
- NotificationCell for each item:
  - Icon based on type (success, warning, info)
  - Title and message
  - Timestamp
  - Unread indicator
- Empty state when no notifications

Components:
- PageHeader, SectionHeader
- NotificationCell, EmptyState

Interaction:
- Tap to mark as read
- Swipe to dismiss (optional)`,
    tags: ["notifications", "alerts", "messages", "inbox"],
  },
  {
    id: "security-settings",
    title: "Security Settings",
    description: "Manage security and privacy options",
    category: "Screens",
    icon: <Shield size={20} />,
    prompt: `Create a security settings screen.

Requirements:
- PageHeader with title "Security" and back button
- Security score/status banner (optional)
- Settings sections:
  - "Authentication": Biometrics, Auto-lock, Password
  - "Privacy": Analytics, Clear data
  - "Backup": Recovery phrase, Backup status
  - "Advanced": Network requests, Permissions
- ListItem with toggles for on/off settings
- Warning banner for unbackup wallet

Components:
- PageHeader, SectionHeader, ListItem
- Switch, Banner, Button

Visual indicators:
- Green checkmark for enabled features
- Warning icon for security risks`,
    tags: ["security", "privacy", "protection", "settings"],
  },
  {
    id: "search-tokens",
    title: "Token Search",
    description: "Search and filter tokens",
    category: "Screens",
    icon: <Search size={20} />,
    prompt: `Create a token search screen.

Requirements:
- SearchBar at top with:
  - Placeholder "Search tokens"
  - Clear button when text entered
- Filter chips: "All", "ERC-20", "NFTs"
- Search results as TokenCell list
- Recent searches section when empty
- "No results" empty state

Components:
- SearchBar, Chip, TokenCell
- SectionHeader, EmptyState

Behavior:
- Debounced search as user types
- Highlight matching text
- Show token icon and network`,
    tags: ["search", "tokens", "filter", "find"],
  },
  {
    id: "custom-component",
    title: "Custom Component",
    description: "Create a new reusable component following the design system",
    category: "Development",
    icon: <Sparkles size={20} />,
    prompt: `Create a new reusable component for the MetaMask design system.

Follow these patterns:

1. File location: web/lib/components.tsx

2. Import design tokens:
\`\`\`tsx
import { colors, spacing, radius, typography } from "@/lib/tokens";
\`\`\`

3. Use the useColors() hook:
\`\`\`tsx
const c = useColors();
\`\`\`

4. Component structure:
\`\`\`tsx
export function MyComponent({
  title = "Default",
  variant = "default",
  onClick,
}: {
  title?: string;
  variant?: "default" | "primary";
  onClick?: () => void;
}) {
  const c = useColors();
  
  return (
    <div style={{
      padding: spacing[4],
      borderRadius: radius.lg,
      backgroundColor: c.background.section,
    }}>
      {title}
    </div>
  );
}
\`\`\`

5. Add to componentRegistry for Canvas access

6. Always use design tokens, never raw values`,
    tags: ["component", "development", "custom", "new"],
  },
];

const categories = Array.from(new Set(prompts.map(p => p.category)));

export default function PromptsPage() {
  const c = useColors();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: c.background.default, fontFamily: typography.fontFamily.sans }}>
      {/* Header */}
      <div style={{ 
        padding: `${spacing[6]}px ${spacing[8]}px`, 
        borderBottom: `1px solid ${c.border.muted}`,
        background: c.background.section,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: spacing[3] }}>
            <Sparkles size={28} style={{ color: c.primary.default }} />
            <div>
              <h1 style={{ 
                fontSize: typography.fontSize["2xl"], 
                fontWeight: typography.fontWeight.bold, 
                color: c.text.default,
                margin: 0,
              }}>
                AI Prompt Templates
              </h1>
              <p style={{ 
                fontSize: typography.fontSize.sm, 
                color: c.text.alternative, 
                marginTop: spacing[1],
                margin: `${spacing[1]}px 0 0 0`,
              }}>
                Copy these prompts into Cursor to build screens and components faster
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ 
        padding: `${spacing[4]}px ${spacing[8]}px`, 
        borderBottom: `1px solid ${c.border.muted}`,
        background: c.background.default,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: spacing[4], flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ 
            flex: 1, 
            minWidth: 250,
            position: "relative",
          }}>
            <Search 
              size={16} 
              style={{ 
                position: "absolute", 
                left: spacing[3], 
                top: "50%", 
                transform: "translateY(-50%)",
                color: c.text.muted,
              }} 
            />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: `${spacing[2]}px ${spacing[3]}px`,
                paddingLeft: spacing[8],
                background: c.background.section,
                border: `1px solid ${c.border.muted}`,
                borderRadius: radius.lg,
                color: c.text.default,
                fontSize: typography.fontSize.sm,
                outline: "none",
              }}
            />
          </div>

          {/* Category Filters */}
          <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap" }}>
            <button
              onClick={() => setFilterCategory(null)}
              style={{
                background: filterCategory === null ? c.primary.muted : c.background.section,
                color: filterCategory === null ? c.primary.default : c.text.alternative,
                border: "none",
                borderRadius: radius.full,
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: "pointer",
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  background: filterCategory === cat ? c.primary.muted : c.background.section,
                  color: filterCategory === cat ? c.primary.default : c.text.alternative,
                  border: "none",
                  borderRadius: radius.full,
                  padding: `${spacing[1.5]}px ${spacing[3]}px`,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div style={{ padding: `${spacing[6]}px ${spacing[8]}px`, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", 
          gap: spacing[4],
        }}>
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              style={{
                background: c.background.section,
                borderRadius: radius.xl,
                overflow: "hidden",
                border: `1px solid ${c.border.muted}`,
              }}
            >
              {/* Card Header */}
              <div style={{ 
                padding: spacing[4], 
                borderBottom: `1px solid ${c.border.muted}`,
                display: "flex",
                alignItems: "flex-start",
                gap: spacing[3],
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.lg,
                  background: c.primary.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.primary.default,
                  flexShrink: 0,
                }}>
                  {prompt.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: typography.fontSize.base, 
                    fontWeight: typography.fontWeight.semibold, 
                    color: c.text.default,
                    margin: 0,
                  }}>
                    {prompt.title}
                  </h3>
                  <p style={{ 
                    fontSize: typography.fontSize.sm, 
                    color: c.text.alternative, 
                    margin: `${spacing[1]}px 0 0 0`,
                  }}>
                    {prompt.description}
                  </p>
                </div>
              </div>

              {/* Prompt Content */}
              <div style={{ 
                padding: spacing[4], 
                background: c.background.default,
                maxHeight: 200,
                overflow: "auto",
              }}>
                <pre style={{
                  fontSize: typography.fontSize.xs,
                  color: c.text.alternative,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: 0,
                  fontFamily: "ui-monospace, monospace",
                  lineHeight: 1.5,
                }}>
                  {prompt.prompt}
                </pre>
              </div>

              {/* Card Footer */}
              <div style={{ 
                padding: spacing[3], 
                borderTop: `1px solid ${c.border.muted}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", gap: spacing[1], flexWrap: "wrap" }}>
                  {prompt.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: c.background.muted,
                        color: c.text.muted,
                        padding: `${spacing[0.5]}px ${spacing[2]}px`,
                        borderRadius: radius.sm,
                        fontSize: typography.fontSize.xs,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleCopy(prompt)}
                  style={{
                    background: copiedId === prompt.id ? c.success.default : c.primary.default,
                    color: copiedId === prompt.id ? c.success.inverse : c.primary.inverse,
                    border: "none",
                    borderRadius: radius.lg,
                    padding: `${spacing[2]}px ${spacing[3]}px`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: spacing[1],
                    transition: "background 150ms ease",
                  }}
                >
                  {copiedId === prompt.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === prompt.id ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: `${spacing[12]}px ${spacing[4]}px`,
          }}>
            <Search size={48} style={{ color: c.text.muted, marginBottom: spacing[4] }} />
            <h3 style={{ 
              fontSize: typography.fontSize.lg, 
              color: c.text.default,
              margin: 0,
            }}>
              No prompts found
            </h3>
            <p style={{ 
              fontSize: typography.fontSize.sm, 
              color: c.text.alternative,
              marginTop: spacing[2],
            }}>
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div style={{ 
        padding: `${spacing[6]}px ${spacing[8]}px`, 
        background: c.background.section,
        borderTop: `1px solid ${c.border.muted}`,
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h2 style={{ 
            fontSize: typography.fontSize.lg, 
            fontWeight: typography.fontWeight.semibold, 
            color: c.text.default,
            margin: `0 0 ${spacing[4]}px 0`,
          }}>
            💡 Tips for Using with Cursor
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: spacing[4],
          }}>
            {[
              { title: "Be Specific", description: "Include exact component names and design token references in your prompts" },
              { title: "Reference Examples", description: "Point Cursor to /screens or /components for visual context" },
              { title: "Iterate Quickly", description: "Start with a template prompt, then refine with follow-up requests" },
              { title: "Use the Canvas", description: "Preview your compositions in the Canvas before exporting code" },
            ].map((tip, i) => (
              <div key={i} style={{
                background: c.background.default,
                padding: spacing[4],
                borderRadius: radius.lg,
              }}>
                <h4 style={{ 
                  fontSize: typography.fontSize.sm, 
                  fontWeight: typography.fontWeight.semibold, 
                  color: c.text.default,
                  margin: `0 0 ${spacing[1]}px 0`,
                }}>
                  {tip.title}
                </h4>
                <p style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: c.text.alternative,
                  margin: 0,
                  lineHeight: `${typography.lineHeight.sm}px`,
                }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

