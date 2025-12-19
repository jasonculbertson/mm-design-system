"use client";

import { useState, useMemo } from "react";
import { Check, Search } from "lucide-react";

// ============================================================================
// UI ICONS - MetaMask Icon Library
// ============================================================================
const uiIcons = [
  "home", "home-filled", "explore", "explore-filled", "global-search", "global",
  "more-horizontal", "more-vertical", "menu", "apps", "widgets", "add", "minus",
  "minus-bold", "plus-and-minus", "add-circle", "remove-minus", "add-square",
  "minus-square", "plant", "stake", "sparkle", "ai", "arrow-up", "arrow-down",
  "arrow-right", "arrow-left", "arrow-2-up-right", "arrow-double-right",
  "arrow-double-left", "arrow-2-right", "arrow-2-left", "arrow-2-up", "arrow-2-down",
  "arrow-circle-down", "arrow-circle-up", "swap-horizontal", "swap-vertical",
  "refresh", "undo", "start", "first-page", "last-page", "unfold",
  "arrow-drop-down-circle", "check", "check-bold", "confirmation", "verified",
  "verified-filled", "close", "circle-x", "warning", "error", "info", "danger",
  "report", "priority-high", "message-question", "question", "feedback", "ban",
  "slash", "category", "setting", "setting-filled", "filter", "sort",
  "sort-by-alpha", "customize", "graph", "trend-up", "trend-down", "diagram",
  "chart", "flask", "plug", "ethereum", "bold", "square", "file", "folder",
  "description", "image", "page-info", "wifi", "wifi-off", "eye", "eye-slash",
  "security", "security-tick", "security-cross", "security-alert", "security-slash",
  "security-key", "shield-lock", "encrypted-add", "privacy-tip", "security-search",
  "policy-alert", "security-user", "security-time", "password-check", "key",
  "lock", "lock-slash", "scan", "qr-code", "receive", "connect", "flag", "flash",
  "flash-slash", "clock", "clock-filled", "activity", "money", "wallet",
  "wallet-filled", "money-bag", "saving", "coin", "cash", "currency-yuan",
  "currency-lira", "currency-franc", "currency-pound", "exchange", "card",
  "add-card", "credit-check", "bank", "bank-assured", "tag", "received",
  "programming-arrows", "bridge", "search", "expand", "expand-vertical",
  "collapse", "link", "login", "logout", "export", "share", "publish",
  "download", "upload", "upload-file", "cloud-upload", "cloud-download", "cloud",
  "user", "user-circle-add", "user-circle-remove", "user-circle", "people",
  "user-check", "person-cancel", "eraser", "copy", "copy-success", "edit",
  "trash", "monitor", "mobile", "tablet", "star-filled", "code", "document-code",
  "star", "heart", "heart-filled", "sms", "messages", "book", "student",
  "calculator", "save", "save-filled", "bookmark", "gas", "speedometer", "data",
  "hierarchy", "notification", "snaps", "snaps-plus", "dark", "dark-filled",
  "light", "light-filled", "tint", "hardware", "usb", "pending", "loading",
  "full-circle", "details", "unpin", "pin", "keep", "keep-filled", "thumb-down",
  "thumb-down-filled", "thumb-up", "thumb-up-filled", "attachment", "calendar",
  "joystick", "eco-leaf", "forest", "flower", "fire", "rocket", "cake", "gift",
  "call", "mic", "view-in-ar", "camera", "videocam", "music-note", "volume-off",
  "volume-up", "table-row", "view-column", "sentiment-dissatisfied",
  "sentiment-neutral", "sentiment-satisfied", "sentiment-very-satisfied", "speed",
  "storefront", "shopping-cart", "shopping-bag", "location", "mountain-flag",
  "map", "bulb", "translate", "print", "palette", "mail", "draft",
  "signal-cellular", "extension", "briefcase", "accessibility", "campaign",
  "web-traffic", "face-id", "alternate-email", "fingerprint", "tab-close",
  "inventory", "x", "send", "hash-tag", "buy-sell", "candlestick", "clear",
  "apple-logo", "backspace", "metamask-fox-outline", "dollar", "after-hours",
  "remote-mode", "side-panel", "pop-up", "candlestick-filled",
];

// ============================================================================
// TOKEN ICONS - Cryptocurrency tokens
// Using local SVG files from public/tokens/
// ============================================================================
const tokenIcons = [
  { symbol: "ETH", name: "Ethereum", color: "#627EEA", iconFile: "eth" },
  { symbol: "USDC", name: "USD Coin", color: "#2775CA", iconFile: "usdc" },
  { symbol: "DAI", name: "Dai", color: "#F5AC37", iconFile: "dai" },
  { symbol: "BNB", name: "BNB", color: "#F3BA2F", iconFile: "bnb" },
  { symbol: "ENS", name: "Ethereum Name Service", color: "#5298FF", iconFile: "ens" },
  { symbol: "UNI", name: "Uniswap", color: "#FF007A", iconFile: "uni" },
  { symbol: "LINK", name: "Chainlink", color: "#2A5ADA", iconFile: "link" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", color: "#F09242", iconFile: "wbtc" },
  { symbol: "MKR", name: "Maker", color: "#1AAB9B", iconFile: "mkr" },
  { symbol: "MATIC", name: "Polygon", color: "#8247E5", iconFile: "matic" },
  { symbol: "AVAX", name: "Avalanche", color: "#E84142", iconFile: "avax" },
  { symbol: "SOL", name: "Solana", color: "#9945FF", iconFile: "sol" },
  { symbol: "FTM", name: "Fantom", color: "#1969FF", iconFile: "ftm" },
  { symbol: "USDT", name: "Tether", color: "#50AF95", iconFile: "usdt" },
  { symbol: "AAVE", name: "Aave", color: "#B6509E", iconFile: "aave" },
  { symbol: "SHIB", name: "Shiba Inu", color: "#FFA409", iconFile: "shib" },
  { symbol: "ATOM", name: "Cosmos", color: "#2E3148", iconFile: "atom" },
  { symbol: "GRT", name: "The Graph", color: "#6747ED", iconFile: "grt" },
  { symbol: "PEPE", name: "Pepe", color: "#3D9C3E", iconFile: "pepe" },
  { symbol: "1INCH", name: "1inch", color: "#94A6C3", iconFile: "1inch" },
  { symbol: "MANA", name: "Decentraland", color: "#FF2D55", iconFile: "mana" },
  { symbol: "OP", name: "Optimism", color: "#FF0420", iconFile: "op" },
  { symbol: "BTC", name: "Bitcoin", color: "#F7931A", iconFile: "btc" },
];

// ============================================================================
// NETWORK ICONS - Blockchain networks
// Using local SVG files from public/networks/
// ============================================================================
const networkIcons = [
  { name: "Ethereum", color: "#627EEA", symbol: "ETH", iconFile: "ethereum" },
  { name: "Base", color: "#0052FF", symbol: "BASE", iconFile: "base" },
  { name: "Unichain", color: "#FF007A", symbol: "UNI", iconFile: "unichain" },
  { name: "Arbitrum", color: "#28A0F0", symbol: "ARB", iconFile: "arbitrum" },
  { name: "BNB Smart Chain", color: "#F3BA2F", symbol: "BNB", iconFile: "bnb" },
  { name: "Blast", color: "#FCFC03", symbol: "BLAST", iconFile: "blast" },
  { name: "Celo", color: "#35D07F", symbol: "CELO", iconFile: "celo" },
  { name: "Zora", color: "#000000", symbol: "ZORA", iconFile: "zora" },
  { name: "zkSync", color: "#8C8DFC", symbol: "ZK", iconFile: "zksync" },
  { name: "World Chain", color: "#000000", symbol: "WLD", iconFile: "worldchain" },
  { name: "Gnosis", color: "#04795B", symbol: "GNO", iconFile: "gnosis" },
  { name: "Linea", color: "#121212", symbol: "LINEA", iconFile: "linea" },
  { name: "Polygon", color: "#8247E5", symbol: "MATIC", iconFile: "polygon" },
  { name: "Fantom", color: "#1969FF", symbol: "FTM", iconFile: "fantom" },
  { name: "Avalanche", color: "#E84142", symbol: "AVAX", iconFile: "avalanche" },
  { name: "OP Mainnet", color: "#FF0420", symbol: "OP", iconFile: "optimism" },
  { name: "Solana", color: "#9945FF", symbol: "SOL", iconFile: "solana" },
  { name: "Hyperliquid", color: "#7FFFD4", symbol: "HL", iconFile: "hyperliquid" },
  { name: "Sepolia (Testnet)", color: "#CFB5F0", symbol: "SEP", iconFile: "sepolia" },
  { name: "Linea Sepolia", color: "#CFB5F0", symbol: "L-SEP", iconFile: "sepolia" },
  { name: "Localhost", color: "#808080", symbol: "LOCAL", iconFile: "localhost" },
];

// ============================================================================
// IDENTICONS - Blockies color combinations
// ============================================================================
const blockiesVariants = [
  { colors: ["#2E7D32", "#FF8A65", "#8D6E63", "#A1887F"] },
  { colors: ["#1565C0", "#9C27B0", "#E91E63", "#3F51B5"] },
  { colors: ["#00897B", "#26A69A", "#80CBC4", "#004D40"] },
  { colors: ["#00838F", "#0097A7", "#00ACC1", "#006064"] },
  { colors: ["#F4511E", "#FFAB91", "#D84315", "#BF360C"] },
  { colors: ["#AD1457", "#F06292", "#880E4F", "#C2185B"] },
  { colors: ["#00695C", "#26A69A", "#004D40", "#00897B"] },
  { colors: ["#6A1B9A", "#AB47BC", "#4A148C", "#8E24AA"] },
];

// Simple hash function
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Maskicon component - using downloaded Figma images
function Maskicon({ variant, size = 48 }: { variant: number; size?: number }) {
  const variantNum = (variant % 24) + 1;
  const paddedNum = variantNum.toString().padStart(2, '0');
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={`/identicons/maskicons/maskicon-${paddedNum}.png`}
      alt={`Maskicon variant ${variantNum}`}
      width={size}
      height={size}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: size * 0.25,
        objectFit: 'cover'
      }}
    />
  );
}

// Jazzicon component - using downloaded Figma images
function Jazzicon({ variant, size = 40 }: { variant: number; size?: number }) {
  const variantNum = (variant % 5) + 1;
  const paddedNum = variantNum.toString().padStart(2, '0');
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={`/identicons/jazzicons/jazzicon-${paddedNum}.png`}
      alt={`Jazzicon variant ${variantNum}`}
      width={size}
      height={size}
      style={{ 
        width: size, 
        height: size, 
        borderRadius: size * 0.25,
        objectFit: 'cover'
      }}
    />
  );
}

// Blockie component - pixelated pattern
function Blockie({ variant, size = 48 }: { variant: number; size?: number }) {
  const v = blockiesVariants[variant % blockiesVariants.length];
  const hash = hashCode(`blockie-${variant}`);
  const gridSize = 8;
  const cellSize = size / gridSize;
  
  const cells = useMemo(() => {
    const result = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const colorIndex = ((hash >> (y * gridSize + x)) + x + y) % v.colors.length;
        result.push(
          <rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill={v.colors[colorIndex]}
          />
        );
      }
    }
    return result;
  }, [hash, v.colors, cellSize]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
    </svg>
  );
}

// Fallback avatar
function FallbackAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={size/2} fill="#9E9E9E" />
      <circle cx={size/2} cy={size*0.38} r={size*0.18} fill="#BDBDBD" />
      <ellipse cx={size/2} cy={size*0.85} rx={size*0.3} ry={size*0.22} fill="#BDBDBD" />
    </svg>
  );
}

type Tab = "ui" | "tokens" | "networks" | "identicons";

export default function IconsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ui");
  const [search, setSearch] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const filteredUIIcons = uiIcons.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTokens = tokenIcons.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredNetworks = networkIcons.filter(n =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "ui" as Tab, label: "UI Icons", count: filteredUIIcons.length },
    { id: "tokens" as Tab, label: "Tokens", count: filteredTokens.length },
    { id: "networks" as Tab, label: "Networks", count: filteredNetworks.length },
    { id: "identicons" as Tab, label: "Identicons", count: 38 },
  ];

  return (
    <div className="animate-in fade-in space-y-8 pb-24 duration-500">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
          Icons
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          MetaMask icon library including UI icons, token icons, network icons, and identicons.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--chrome-bg-subtle)] rounded-[var(--radius-lg)] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-body-sm rounded-[var(--radius-md)] transition-all ${
              activeTab === tab.id
                ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-body-xs opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search - only for non-identicons */}
      {activeTab !== "identicons" && (
        <div className="relative max-w-sm">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--chrome-text-muted)]" 
          />
          <input
            type="text"
            placeholder={`Search ${activeTab === "ui" ? "icons" : activeTab === "tokens" ? "tokens" : "networks"}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-body-sm rounded-[var(--radius-md)] border border-[var(--chrome-border)] bg-[var(--chrome-bg)] text-[var(--chrome-text)] focus:outline-none focus:border-[var(--chrome-accent)]"
          />
        </div>
      )}

      {/* UI Icons Tab */}
      {activeTab === "ui" && (
        <div className="space-y-6">
          <div className="text-body-sm text-[var(--chrome-text-muted)]">
            {filteredUIIcons.length} icons from MetaMask design system
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredUIIcons.map((name) => (
              <button
                key={name}
                onClick={() => copyToClipboard(name, name)}
                className="group relative flex flex-col items-center justify-center gap-2 p-3 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] transition-colors aspect-square"
                title={name}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/icons/${name}.svg`} 
                    alt={name}
                    width={20}
                    height={20}
                    className="dark:invert opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback to placeholder if icon not found
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-[9px] text-[var(--chrome-text-muted)] truncate w-full text-center">
                  {name.split("-")[0]}
                </span>
                
                {copiedItem === name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredUIIcons.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body-md text-[var(--chrome-text-muted)]">
                No icons found matching &quot;{search}&quot;
              </p>
            </div>
          )}

          <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
            <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
            <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
              <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`// Import from assets/icons folder
import WalletIcon from "@/assets/icons/wallet.svg";

// Or use the BaseIcon component
import { BaseIcon } from "@/lib/components";

<BaseIcon name="Wallet" size="md" color="default" />`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Token Icons Tab */}
      {activeTab === "tokens" && (
        <div className="space-y-6">
          <div className="text-body-sm text-[var(--chrome-text-muted)]">
            {filteredTokens.length} token icons • Local SVG files
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => copyToClipboard(token.symbol, token.symbol)}
                className="group relative flex flex-col items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] transition-colors"
                title={`${token.name} (${token.symbol})`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/tokens/${token.iconFile}.svg`}
                    alt={token.symbol}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="text-body-xs weight-medium text-[var(--chrome-text)]">
                    {token.symbol}
                  </div>
                  <div className="text-[10px] text-[var(--chrome-text-muted)] truncate max-w-[80px]">
                    {token.name}
                  </div>
                </div>
                
                {copiedItem === token.symbol && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredTokens.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body-md text-[var(--chrome-text-muted)]">
                No tokens found matching &quot;{search}&quot;
              </p>
            </div>
          )}

          <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
            <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
            <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
              <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`import { AvatarToken } from "@/lib/components";

<AvatarToken name="ETH" size="md" />
<AvatarToken name="ETH" size="md" network="Ethereum" />`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Network Icons Tab */}
      {activeTab === "networks" && (
        <div className="space-y-6">
          <div className="text-body-sm text-[var(--chrome-text-muted)]">
            {filteredNetworks.length} network icons • Blockchain networks supported by MetaMask
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredNetworks.map((network) => (
              <button
                key={network.name}
                onClick={() => copyToClipboard(network.name, network.name)}
                className="group relative flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] transition-colors"
                title={network.name}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`/networks/${network.iconFile}.svg`}
                    alt={network.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-body-sm weight-medium text-[var(--chrome-text)] truncate">
                    {network.name}
                  </div>
                  <div className="text-body-xs text-[var(--chrome-text-muted)]">
                    {network.symbol}
                  </div>
                </div>
                
                {copiedItem === network.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredNetworks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body-md text-[var(--chrome-text-muted)]">
                No networks found matching &quot;{search}&quot;
              </p>
            </div>
          )}

          <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
            <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
            <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
              <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`import { AvatarNetwork, ChainBadge } from "@/lib/components";

<AvatarNetwork name="Ethereum" size="md" />
<ChainBadge chain="Ethereum" showName={true} />`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Identicons Tab */}
      {activeTab === "identicons" && (
        <div className="space-y-10">
          {/* Maskicons Section */}
          <div className="space-y-4">
            <h2 className="text-body-lg weight-medium text-[var(--chrome-text)]">Maskicons</h2>
            <p className="text-body-sm text-[var(--chrome-text-muted)]">
              24 geometric patterns with shapes on colored backgrounds. Used for account avatars.
            </p>
            <div className="p-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--chrome-border)] inline-block">
              <div className="grid grid-cols-12 gap-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <button
                    key={`maskicon-${i}`}
                    onClick={() => copyToClipboard(`variant=${i + 1}`, `maskicon-${i}`)}
                    className="relative hover:scale-110 transition-transform"
                    title={`Maskicon variant ${i + 1}`}
                  >
                    <Maskicon variant={i} size={48} />
                    {copiedItem === `maskicon-${i}` && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-lg">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Jazzicons Section */}
          <div className="space-y-4">
            <h2 className="text-body-lg weight-medium text-[var(--chrome-text)]">Jazzicons</h2>
            <p className="text-body-sm text-[var(--chrome-text-muted)]">
              5 organic colorful patterns. Circular shapes with overlapping colors.
            </p>
            <div className="p-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--chrome-border)] inline-block">
              <div className="flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={`jazzicon-${i}`}
                    onClick={() => copyToClipboard(`variant=${i + 1}`, `jazzicon-${i}`)}
                    className="relative hover:scale-110 transition-transform"
                    title={`Jazzicon variant ${i + 1}`}
                  >
                    <Jazzicon variant={i} size={40} />
                    {copiedItem === `jazzicon-${i}` && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-full">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blockies Section */}
          <div className="space-y-4">
            <h2 className="text-body-lg weight-medium text-[var(--chrome-text)]">Blockies</h2>
            <p className="text-body-sm text-[var(--chrome-text-muted)]">
              8 pixelated patterns. Grid-based colorful blocks inspired by Ethereum blockies.
            </p>
            <div className="p-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--chrome-border)] inline-block">
              <div className="flex gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={`blockie-${i}`}
                    onClick={() => copyToClipboard(`variant=${i + 1}`, `blockie-${i}`)}
                    className="relative hover:scale-110 transition-transform"
                    title={`Blockie variant ${i + 1}`}
                  >
                    <Blockie variant={i} size={48} />
                    {copiedItem === `blockie-${i}` && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)]">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fallback Section */}
          <div className="space-y-4">
            <h2 className="text-body-lg weight-medium text-[var(--chrome-text)]">Fallback</h2>
            <p className="text-body-sm text-[var(--chrome-text-muted)]">
              Default placeholder avatar when no identicon is available.
            </p>
            <div className="p-6 rounded-[var(--radius-xl)] border border-dashed border-[var(--chrome-border)] inline-block">
              <button
                onClick={() => copyToClipboard("fallback", "fallback")}
                className="relative hover:scale-110 transition-transform"
                title="Fallback avatar"
              >
                <FallbackAvatar size={40} />
                {copiedItem === "fallback" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-full">
                    <Check size={16} className="text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Usage */}
          <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
            <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
            <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
              <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`import { AvatarAccount } from "@/lib/components";

// Account avatar with generated identicon
<AvatarAccount address="0x1234...5678" size="md" />

// Specify identicon type
<AvatarAccount 
  address="0x1234...5678" 
  size="lg"
  type="maskicon"  // "maskicon" | "jazzicon" | "blockie"
/>`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
