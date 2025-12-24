"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, Wallet, CreditCard, ArrowLeftRight, Settings, Clock, 
  Layout, Sparkles, Star, Bell, ChevronRight, Copy, Check,
  Smartphone, Monitor
} from "lucide-react";
import { 
  componentRegistry, 
  getComponentBySlug,
  HubHeader,
  PageHeader,
  SectionHeader,
  TokenCell,
  FooterNav,
  ListItem,
  TransactionCell,
  EmptyState,
  Banner,
  AmountInput,
  ConfirmationSheet,
  GasFeeSelector,
  QRCodeDisplay,
  AddressDisplay,
  SwapPreview,
  WalletConnectSession,
  NFTCard,
  StatusIndicator,
  Stepper,
  NotificationCell,
  ChainBadge,
  Button,
  Input,
  Tabs,
  SearchBar,
  useColors,
} from "@/lib/components";
import { colors, spacing, radius, typography } from "@/lib/tokens";

// Screen definitions with their component compositions
const screenDefinitions = [
  {
    id: "wallet-home",
    name: "Wallet Home",
    description: "Main wallet screen with balance and tokens",
    category: "Core",
    icon: <Wallet size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <HubHeader balance="$12,450.00" label="Total Balance" primaryAction="Add funds" secondaryAction="Buy" />
          <div style={{ marginTop: spacing[6] }}>
            <SectionHeader title="Tokens" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <TokenCell symbol="ETH" name="Ethereum" balance="2.45" value="$4,890.00" change="+5.2%" changePositive />
              <TokenCell symbol="USDC" name="USD Coin" balance="5,000" value="$5,000.00" change="+0.01%" changePositive />
              <TokenCell symbol="MATIC" name="Polygon" balance="1,250" value="$1,125.00" change="-2.3%" changePositive={false} />
            </div>
          </div>
        </div>
        <FooterNav activeTab="wallet" />
      </div>
    ),
  },
  {
    id: "token-detail",
    name: "Token Detail",
    description: "Single token view with activity",
    category: "Core",
    icon: <CreditCard size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="Ethereum" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <HubHeader balance="$4,890.00" label="2.45 ETH" primaryAction="Send" secondaryAction="Receive" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <SectionHeader title="Activity" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <TransactionCell type="receive" status="confirmed" amount="+0.5 ETH" value="$1,000.00" timestamp="2 hours ago" />
              <TransactionCell type="send" status="confirmed" amount="-0.25 ETH" value="$500.00" timestamp="Yesterday" />
              <TransactionCell type="swap" status="confirmed" amount="ETH → USDC" value="$200.00" timestamp="3 days ago" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "send-amount",
    name: "Send - Amount",
    description: "Enter amount to send",
    category: "Send Flow",
    icon: <ArrowLeftRight size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Send" showBack />
          <div style={{ marginTop: spacing[6] }}>
            <AmountInput value="0.5" token="ETH" fiatValue="$1,000.00" balance="2.45" showMax />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <Button label="Next" variant="primary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "send-recipient",
    name: "Send - Recipient",
    description: "Enter recipient address",
    category: "Send Flow",
    icon: <ArrowLeftRight size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Send to" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <Input placeholder="Enter address or ENS name" label="Recipient" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <SectionHeader title="Recent" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <ListItem title="vitalik.eth" subtitle="0x1234...5678" />
              <ListItem title="0xabcd...ef01" subtitle="Last sent 3 days ago" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "send-confirm",
    name: "Send - Confirm",
    description: "Review and confirm transaction",
    category: "Send Flow",
    icon: <ArrowLeftRight size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Confirm Send" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <ConfirmationSheet title="Send ETH" amount="0.5 ETH" recipient="vitalik.eth" fee="$2.50" total="$1,002.50" />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <GasFeeSelector selected="medium" lowFee="$1.20" mediumFee="$2.50" highFee="$5.00" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <Button label="Confirm & Send" variant="primary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "receive",
    name: "Receive",
    description: "QR code to receive tokens",
    category: "Core",
    icon: <Wallet size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Receive" showBack />
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", alignItems: "center" }}>
            <QRCodeDisplay value="0x1234567890abcdef1234567890abcdef12345678" size="lg" showValue />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <AddressDisplay address="0x1234567890abcdef1234567890abcdef12345678" truncate showCopy />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <Button label="Share Address" variant="secondary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "swap",
    name: "Swap",
    description: "Token swap interface",
    category: "Core",
    icon: <ArrowLeftRight size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Swap" showBack />
          <div style={{ marginTop: spacing[4], display: "flex", flexDirection: "column", gap: spacing[3] }}>
            <AmountInput value="1.0" token="ETH" fiatValue="$2,000.00" balance="2.45" showMax />
            <AmountInput value="2,000" token="USDC" fiatValue="$2,000.00" balance="5,000" showMax={false} />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SwapPreview fromToken="ETH" fromAmount="1.0" toToken="USDC" toAmount="2,000" rate="1 ETH = 2,000 USDC" fee="$5.00" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <Button label="Review Swap" variant="primary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "settings",
    name: "Settings",
    description: "App settings screen",
    category: "Settings",
    icon: <Settings size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="Settings" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Account" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <ListItem title="Profile" subtitle="Manage your account" showChevron />
              <ListItem title="Security" subtitle="Password, 2FA, recovery" showChevron />
            </div>
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Preferences" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <ListItem title="Notifications" subtitle="Push, email alerts" showChevron />
              <ListItem title="Currency" subtitle="USD" showChevron />
              <ListItem title="Networks" subtitle="Manage networks" showChevron />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "activity",
    name: "Activity",
    description: "Transaction history",
    category: "Core",
    icon: <Clock size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="Activity" />
          <div style={{ marginTop: spacing[4] }}>
            <Tabs tabs={["All", "Sent", "Received", "Swaps"]} activeIndex={0} />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Today" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <TransactionCell type="swap" status="confirmed" amount="0.5 ETH → 1000 USDC" timestamp="2 hours ago" />
              <TransactionCell type="receive" status="confirmed" amount="+1.2 ETH" value="$2,400.00" timestamp="5 hours ago" />
            </div>
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Yesterday" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <TransactionCell type="send" status="confirmed" amount="-500 USDC" value="$500.00" timestamp="Yesterday" />
            </div>
          </div>
        </div>
        <FooterNav activeTab="wallet" />
      </div>
    ),
  },
  {
    id: "network-select",
    name: "Network Selection",
    description: "Choose a network",
    category: "Core",
    icon: <Layout size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="Select Network" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <SearchBar placeholder="Search networks" />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Popular" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <ListItem title="Ethereum Mainnet" subtitle="Chain ID: 1" leftIcon="🔷" />
              <ListItem title="Polygon" subtitle="Chain ID: 137" leftIcon="🟣" />
              <ListItem title="Arbitrum One" subtitle="Chain ID: 42161" leftIcon="🔵" />
              <ListItem title="Optimism" subtitle="Chain ID: 10" leftIcon="🔴" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "dapp-connect",
    name: "Connect dApp",
    description: "Approve dApp connection",
    category: "dApp",
    icon: <Layout size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Connect" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <WalletConnectSession dappName="Uniswap" dappUrl="app.uniswap.org" connected={false} network="Ethereum" />
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Permissions Requested" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
              <ListItem title="View your wallet address" leftIcon="👁️" showChevron={false} />
              <ListItem title="Request transaction approval" leftIcon="✍️" showChevron={false} />
            </div>
          </div>
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="Connect" variant="primary" fullWidth />
            <Button label="Reject" variant="secondary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "nft-gallery",
    name: "NFT Gallery",
    description: "NFT collection view",
    category: "NFTs",
    icon: <Star size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="NFTs" />
          <div style={{ marginTop: spacing[4] }}>
            <Tabs tabs={["Collected", "Created", "Hidden"]} activeIndex={0} />
          </div>
          <div style={{ marginTop: spacing[4], display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing[3] }}>
            <NFTCard name="Bored Ape #1234" collection="BAYC" price="50 ETH" />
            <NFTCard name="Azuki #5678" collection="Azuki" price="15 ETH" />
          </div>
        </div>
        <FooterNav activeTab="wallet" />
      </div>
    ),
  },
  {
    id: "success",
    name: "Success State",
    description: "Transaction success screen",
    category: "States",
    icon: <Sparkles size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Success" />
          <div style={{ marginTop: spacing[8] }}>
            <StatusIndicator status="confirmed" label="Transaction Confirmed" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <TransactionCell type="send" status="confirmed" amount="-0.5 ETH" value="$1,000.00" />
          </div>
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="View on Explorer" variant="secondary" fullWidth />
            <Button label="Done" variant="primary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "error",
    name: "Error State",
    description: "Transaction failed screen",
    category: "States",
    icon: <Sparkles size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Failed" showBack />
          <div style={{ marginTop: spacing[8] }}>
            <StatusIndicator status="failed" label="Transaction Failed" />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <Banner title="Insufficient funds" description="You don't have enough ETH to cover gas fees" variant="error" />
          </div>
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="Try Again" variant="primary" fullWidth />
            <Button label="Cancel" variant="secondary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "pending",
    name: "Pending State",
    description: "Transaction pending screen",
    category: "States",
    icon: <Clock size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Pending" />
          <div style={{ marginTop: spacing[8] }}>
            <StatusIndicator status="pending" label="Transaction Pending" showPulse />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <TransactionCell type="send" status="pending" amount="-0.5 ETH" value="$1,000.00" />
          </div>
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="Speed Up" variant="secondary" fullWidth />
            <Button label="Cancel Transaction" variant="danger" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "onboarding-welcome",
    name: "Onboarding - Welcome",
    description: "First screen of onboarding",
    category: "Onboarding",
    icon: <Sparkles size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <EmptyState title="Welcome to MetaMask" description="The crypto wallet trusted by millions" />
          <div style={{ marginTop: spacing[8], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="Create New Wallet" variant="primary" fullWidth />
            <Button label="Import Existing Wallet" variant="secondary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "onboarding-secure",
    name: "Onboarding - Secure",
    description: "Security setup step",
    category: "Onboarding",
    icon: <Sparkles size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4] }}>
          <PageHeader title="Secure Your Wallet" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <Stepper steps="Create,Secure,Confirm" current={1} />
          </div>
          <div style={{ marginTop: spacing[6] }}>
            <Banner title="Why backup?" description="Your Secret Recovery Phrase is the ONLY way to recover your wallet if you lose access" variant="warning" />
          </div>
          <div style={{ marginTop: spacing[6], display: "flex", flexDirection: "column", gap: spacing[2] }}>
            <Button label="Start Backup" variant="primary" fullWidth />
            <Button label="Remind Me Later" variant="secondary" fullWidth />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Notification center",
    category: "Core",
    icon: <Bell size={20} />,
    render: (c: any) => (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: c.background.default }}>
        <div style={{ flex: 1, padding: spacing[4], overflow: "auto" }}>
          <PageHeader title="Notifications" showBack />
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="New" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[2] }}>
              <NotificationCell title="Transaction Complete" message="Your swap of 1 ETH for 2000 USDC is complete" timestamp="2m ago" type="success" unread />
              <NotificationCell title="Price Alert" message="ETH is up 5% in the last hour" timestamp="1h ago" type="info" unread />
            </div>
          </div>
          <div style={{ marginTop: spacing[4] }}>
            <SectionHeader title="Earlier" />
            <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[2] }}>
              <NotificationCell title="Security Reminder" message="Backup your Secret Recovery Phrase" timestamp="1d ago" type="warning" unread={false} />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

// Group screens by category
const categories = Array.from(new Set(screenDefinitions.map(s => s.category)));

export default function ScreensGalleryPage() {
  const router = useRouter();
  const c = useColors();
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredScreens = filterCategory 
    ? screenDefinitions.filter(s => s.category === filterCategory)
    : screenDefinitions;

  const handleCopyCode = (screen: typeof screenDefinitions[0]) => {
    const code = `// ${screen.name} Screen
// ${screen.description}

import {
  HubHeader,
  PageHeader,
  SectionHeader,
  TokenCell,
  FooterNav,
  Button,
  // ... other components
} from "@/lib/components";
import { spacing } from "@/lib/tokens";

export function ${screen.name.replace(/[^a-zA-Z]/g, "")}Screen() {
  return (
    // Use the Canvas to compose this screen
    // or load the "${screen.name}" template
  );
}`;
    navigator.clipboard.writeText(code);
    setCopiedId(screen.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedScreenData = selectedScreen 
    ? screenDefinitions.find(s => s.id === selectedScreen) 
    : null;

  return (
    <div style={{ minHeight: "100vh", background: c.background.default, fontFamily: typography.fontFamily.sans }}>
      {/* Header */}
      <div style={{ 
        padding: `${spacing[6]}px ${spacing[8]}px`, 
        borderBottom: `1px solid ${c.border.muted}`,
        background: c.background.section,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1400, margin: "0 auto" }}>
          <div>
            <h1 style={{ 
              fontSize: typography.fontSize["2xl"], 
              fontWeight: typography.fontWeight.bold, 
              color: c.text.default,
              margin: 0,
            }}>
              Example Screens
            </h1>
            <p style={{ 
              fontSize: typography.fontSize.sm, 
              color: c.text.alternative, 
              marginTop: spacing[1],
              margin: `${spacing[1]}px 0 0 0`,
            }}>
              {screenDefinitions.length} pre-built screens ready to use • Click to preview
            </p>
          </div>
          <div style={{ display: "flex", gap: spacing[3] }}>
            <button
              onClick={() => router.push("/canvas")}
              style={{
                background: c.primary.default,
                color: c.primary.inverse,
                border: "none",
                borderRadius: radius.lg,
                padding: `${spacing[2]}px ${spacing[4]}px`,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: "pointer",
              }}
            >
              Open Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ 
        padding: `${spacing[4]}px ${spacing[8]}px`, 
        borderBottom: `1px solid ${c.border.muted}`,
        background: c.background.default,
      }}>
        <div style={{ display: "flex", gap: spacing[2], maxWidth: 1400, margin: "0 auto", flexWrap: "wrap" }}>
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
            All ({screenDefinitions.length})
          </button>
          {categories.map(cat => {
            const count = screenDefinitions.filter(s => s.category === cat).length;
            return (
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
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Grid */}
      <div style={{ padding: `${spacing[6]}px ${spacing[8]}px`, maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: spacing[6],
        }}>
          {filteredScreens.map(screen => (
            <div
              key={screen.id}
              onClick={() => setSelectedScreen(screen.id)}
              style={{
                background: c.background.section,
                borderRadius: radius.xl,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 150ms ease, box-shadow 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 32px ${c.overlay.default}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Screen Preview */}
              <div style={{ 
                height: 320, 
                background: c.background.default,
                overflow: "hidden",
                position: "relative",
              }}>
                <div style={{ 
                  transform: "scale(0.55)", 
                  transformOrigin: "top left",
                  width: 393,
                  height: 852,
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  marginLeft: -108,
                }}>
                  {screen.render(c)}
                </div>
              </div>

              {/* Screen Info */}
              <div style={{ padding: spacing[4] }}>
                <div style={{ display: "flex", alignItems: "center", gap: spacing[2], marginBottom: spacing[1] }}>
                  <span style={{ color: c.text.alternative }}>{screen.icon}</span>
                  <span style={{ 
                    fontSize: typography.fontSize.base, 
                    fontWeight: typography.fontWeight.semibold, 
                    color: c.text.default,
                  }}>
                    {screen.name}
                  </span>
                </div>
                <p style={{ 
                  fontSize: typography.fontSize.sm, 
                  color: c.text.alternative, 
                  margin: 0,
                }}>
                  {screen.description}
                </p>
                <div style={{ display: "flex", gap: spacing[2], marginTop: spacing[3] }}>
                  <span style={{
                    background: c.background.muted,
                    color: c.text.alternative,
                    padding: `${spacing[0.5]}px ${spacing[2]}px`,
                    borderRadius: radius.sm,
                    fontSize: typography.fontSize.xs,
                  }}>
                    {screen.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen Detail Modal */}
      {selectedScreenData && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: c.overlay.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: spacing[4],
          }}
          onClick={() => setSelectedScreen(null)}
        >
          <div 
            style={{
              background: c.background.section,
              borderRadius: radius["2xl"],
              maxWidth: 900,
              width: "100%",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Preview */}
            <div style={{ 
              flex: 1, 
              background: c.background.default, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              padding: spacing[6],
              borderRight: `1px solid ${c.border.muted}`,
            }}>
              <div style={{
                width: 393,
                height: 700,
                background: c.background.default,
                borderRadius: radius["2xl"],
                overflow: "hidden",
                boxShadow: `0 0 0 12px ${c.background.section}, 0 0 0 13px ${c.border.muted}`,
              }}>
                {selectedScreenData.render(c)}
              </div>
            </div>

            {/* Info Panel */}
            <div style={{ width: 320, padding: spacing[6], display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: spacing[4] }}>
                <h2 style={{ 
                  fontSize: typography.fontSize.xl, 
                  fontWeight: typography.fontWeight.bold, 
                  color: c.text.default,
                  margin: 0,
                }}>
                  {selectedScreenData.name}
                </h2>
                <button
                  onClick={() => setSelectedScreen(null)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: c.text.alternative,
                    cursor: "pointer",
                    padding: spacing[1],
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ 
                fontSize: typography.fontSize.sm, 
                color: c.text.alternative, 
                margin: `0 0 ${spacing[4]}px 0`,
                lineHeight: `${typography.lineHeight.sm}px`,
              }}>
                {selectedScreenData.description}
              </p>

              <div style={{
                background: c.background.muted,
                color: c.text.alternative,
                padding: `${spacing[1]}px ${spacing[2]}px`,
                borderRadius: radius.sm,
                fontSize: typography.fontSize.xs,
                width: "fit-content",
                marginBottom: spacing[6],
              }}>
                {selectedScreenData.category}
              </div>

              <div style={{ flex: 1 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: spacing[2] }}>
                <button
                  onClick={() => {
                    router.push(`/canvas?template=${selectedScreenData.id}`);
                  }}
                  style={{
                    background: c.primary.default,
                    color: c.primary.inverse,
                    border: "none",
                    borderRadius: radius.lg,
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing[2],
                  }}
                >
                  <Smartphone size={16} />
                  Open in Canvas
                </button>
                <button
                  onClick={() => handleCopyCode(selectedScreenData)}
                  style={{
                    background: c.background.subsection,
                    color: c.text.default,
                    border: "none",
                    borderRadius: radius.lg,
                    padding: `${spacing[3]}px ${spacing[4]}px`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: spacing[2],
                  }}
                >
                  {copiedId === selectedScreenData.id ? <Check size={16} /> : <Copy size={16} />}
                  {copiedId === selectedScreenData.id ? "Copied!" : "Copy Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

