"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  X, Undo2, Redo2, Copy, Save, FolderOpen, Trash2, 
  ChevronDown, ChevronRight, Search, Layers, Download,
  ZoomIn, ZoomOut, Sun, Moon, Grid3X3, Eye, EyeOff,
  Smartphone, RotateCcw, Share2, Image, Code2, Sparkles,
  Layout, CreditCard, ShoppingCart, User, Settings, Bell,
  Home, Wallet, ArrowLeftRight, Clock, Star
} from "lucide-react";
import { componentRegistry, type ComponentEntry } from "@/lib/components";

// Types
interface CanvasItem {
  id: string;
  component: ComponentEntry;
  props: Record<string, any>;
}

interface HistoryState {
  items: CanvasItem[];
  selectedId: string | null;
}

interface SavedComposition {
  id: string;
  name: string;
  items: CanvasItem[];
  deviceFrame: DeviceFrame;
  theme: "dark" | "light";
  createdAt: number;
}

interface ScreenTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  items: { slug: string; props?: Record<string, any> }[];
}

type DeviceFrame = "iphone-15-pro" | "iphone-14" | "iphone-se" | "pixel-8" | "none";

// Device configurations
const deviceFrames: Record<DeviceFrame, { name: string; width: number; height: number; radius: number; frameRadius: number; hasIsland: boolean }> = {
  "iphone-15-pro": { name: "iPhone 15 Pro", width: 393, height: 852, radius: 47, frameRadius: 55, hasIsland: true },
  "iphone-14": { name: "iPhone 14", width: 390, height: 844, radius: 47, frameRadius: 55, hasIsland: true },
  "iphone-se": { name: "iPhone SE", width: 375, height: 667, radius: 0, frameRadius: 44, hasIsland: false },
  "pixel-8": { name: "Pixel 8", width: 412, height: 915, radius: 32, frameRadius: 40, hasIsland: false },
  "none": { name: "No Frame", width: 375, height: 812, radius: 0, frameRadius: 0, hasIsland: false },
};

// Component categories
const componentCategories: { name: string; slugs: string[] }[] = [
  { name: "Navigation", slugs: ["page-header", "footer-nav", "tabs"] },
  { name: "Headers", slugs: ["hub-header", "section-header", "tab-header"] },
  { name: "Content", slugs: ["token-cell", "token-list", "transaction-cell", "list-item", "nft-card"] },
  { name: "Actions", slugs: ["button", "chip", "segmented-control"] },
  { name: "Feedback", slugs: ["banner", "toast", "empty-state", "skeleton"] },
  { name: "Inputs", slugs: ["input", "search", "text-area", "checkbox", "switch", "slider"] },
  { name: "Data Display", slugs: ["badge", "avatar", "progress-bar", "status-indicator"] },
  { name: "Overlays", slugs: ["dialog", "bottom-sheet", "tooltip"] },
];

// Screen templates - Comprehensive library for designers
const screenTemplates: ScreenTemplate[] = [
  // === CORE SCREENS ===
  {
    id: "wallet-home",
    name: "Wallet Home",
    description: "Main wallet screen with balance and tokens",
    icon: <Wallet size={20} />,
    items: [
      { slug: "hub-header", props: { balance: "$12,450.00", label: "Total Balance", primaryAction: "Add funds", secondaryAction: "Buy" } },
      { slug: "section-header", props: { title: "Tokens", action: "See all" } },
      { slug: "token-cell", props: { symbol: "ETH", name: "Ethereum", balance: "2.45", value: "$4,890.00", change: "+5.2%", changePositive: true } },
      { slug: "token-cell", props: { symbol: "USDC", name: "USD Coin", balance: "5,000", value: "$5,000.00", change: "+0.01%", changePositive: true } },
      { slug: "token-cell", props: { symbol: "MATIC", name: "Polygon", balance: "1,250", value: "$1,125.00", change: "-2.3%", changePositive: false } },
      { slug: "footer-nav", props: { activeTab: "wallet" } },
    ],
  },
  {
    id: "token-detail",
    name: "Token Detail",
    description: "Single token view with actions",
    icon: <CreditCard size={20} />,
    items: [
      { slug: "page-header", props: { title: "Ethereum", showBack: true } },
      { slug: "hub-header", props: { balance: "$4,890.00", label: "2.45 ETH", primaryAction: "Send", secondaryAction: "Receive" } },
      { slug: "section-header", props: { title: "Activity" } },
      { slug: "transaction-cell", props: { type: "receive", status: "confirmed", amount: "+0.5 ETH", value: "$1,000.00", timestamp: "2 hours ago" } },
      { slug: "transaction-cell", props: { type: "send", status: "confirmed", amount: "-0.25 ETH", value: "$500.00", timestamp: "Yesterday" } },
      { slug: "transaction-cell", props: { type: "swap", status: "confirmed", amount: "ETH → USDC", value: "$200.00", timestamp: "3 days ago" } },
    ],
  },
  
  // === SEND FLOW ===
  {
    id: "send-amount",
    name: "Send - Amount",
    description: "Enter amount to send",
    icon: <ArrowLeftRight size={20} />,
    items: [
      { slug: "page-header", props: { title: "Send", showBack: true, action: "Cancel" } },
      { slug: "amount-input", props: { value: "0.5", token: "ETH", fiatValue: "$1,000.00", balance: "2.45", showMax: true } },
      { slug: "button", props: { label: "Next", variant: "primary", fullWidth: true } },
    ],
  },
  {
    id: "send-recipient",
    name: "Send - Recipient",
    description: "Enter recipient address",
    icon: <ArrowLeftRight size={20} />,
    items: [
      { slug: "page-header", props: { title: "Send to", showBack: true } },
      { slug: "input", props: { placeholder: "Enter address or ENS name", label: "Recipient" } },
      { slug: "section-header", props: { title: "Recent" } },
      { slug: "list-item", props: { title: "vitalik.eth", subtitle: "0x1234...5678", showChevron: false } },
      { slug: "list-item", props: { title: "0xabcd...ef01", subtitle: "Last sent 3 days ago", showChevron: false } },
    ],
  },
  {
    id: "send-confirm",
    name: "Send - Confirm",
    description: "Review and confirm transaction",
    icon: <ArrowLeftRight size={20} />,
    items: [
      { slug: "page-header", props: { title: "Confirm Send", showBack: true } },
      { slug: "confirmation-sheet", props: { title: "Send ETH", amount: "0.5 ETH", recipient: "vitalik.eth", fee: "$2.50", total: "$1,002.50" } },
      { slug: "gas-fee-selector", props: { selected: "medium", lowFee: "$1.20", mediumFee: "$2.50", highFee: "$5.00" } },
      { slug: "button", props: { label: "Confirm & Send", variant: "primary", fullWidth: true } },
    ],
  },
  
  // === RECEIVE ===
  {
    id: "receive",
    name: "Receive",
    description: "QR code to receive tokens",
    icon: <Wallet size={20} />,
    items: [
      { slug: "page-header", props: { title: "Receive", showBack: true } },
      { slug: "qr-code", props: { value: "0x1234567890abcdef1234567890abcdef12345678", size: "lg", showValue: true } },
      { slug: "address-display", props: { address: "0x1234567890abcdef1234567890abcdef12345678", truncate: true, showCopy: true } },
      { slug: "button", props: { label: "Share Address", variant: "secondary", fullWidth: true } },
    ],
  },
  
  // === SWAP ===
  {
    id: "swap",
    name: "Swap",
    description: "Token swap interface",
    icon: <ArrowLeftRight size={20} />,
    items: [
      { slug: "page-header", props: { title: "Swap", showBack: true } },
      { slug: "amount-input", props: { value: "1.0", token: "ETH", fiatValue: "$2,000.00", balance: "2.45", showMax: true } },
      { slug: "amount-input", props: { value: "2,000", token: "USDC", fiatValue: "$2,000.00", balance: "5,000" } },
      { slug: "swap-preview", props: { fromToken: "ETH", fromAmount: "1.0", toToken: "USDC", toAmount: "2,000", rate: "1 ETH = 2,000 USDC", fee: "$5.00" } },
      { slug: "button", props: { label: "Review Swap", variant: "primary", fullWidth: true } },
    ],
  },
  
  // === SETTINGS ===
  {
    id: "settings",
    name: "Settings",
    description: "App settings screen",
    icon: <Settings size={20} />,
    items: [
      { slug: "page-header", props: { title: "Settings", showBack: true } },
      { slug: "section-header", props: { title: "Account" } },
      { slug: "list-item", props: { title: "Profile", subtitle: "Manage your account", showChevron: true } },
      { slug: "list-item", props: { title: "Security", subtitle: "Password, 2FA, recovery", showChevron: true } },
      { slug: "section-header", props: { title: "Preferences" } },
      { slug: "list-item", props: { title: "Notifications", subtitle: "Push, email alerts", showChevron: true } },
      { slug: "list-item", props: { title: "Currency", subtitle: "USD", showChevron: true } },
      { slug: "list-item", props: { title: "Networks", subtitle: "Manage networks", showChevron: true } },
      { slug: "section-header", props: { title: "Support" } },
      { slug: "list-item", props: { title: "Help Center", showChevron: true } },
      { slug: "list-item", props: { title: "About MetaMask", showChevron: true } },
    ],
  },
  {
    id: "security-settings",
    name: "Security Settings",
    description: "Security and privacy options",
    icon: <Settings size={20} />,
    items: [
      { slug: "page-header", props: { title: "Security", showBack: true } },
      { slug: "banner", props: { title: "Secure your wallet", description: "Enable biometrics for faster, safer access", variant: "info" } },
      { slug: "list-item", props: { title: "Face ID", subtitle: "Use Face ID to unlock", showChevron: false } },
      { slug: "list-item", props: { title: "Change Password", showChevron: true } },
      { slug: "list-item", props: { title: "Show Secret Recovery Phrase", showChevron: true } },
      { slug: "list-item", props: { title: "Auto-lock Timer", subtitle: "5 minutes", showChevron: true } },
      { slug: "section-header", props: { title: "Privacy" } },
      { slug: "list-item", props: { title: "Clear Browser History", showChevron: true } },
      { slug: "list-item", props: { title: "MetaMetrics", subtitle: "Help improve MetaMask", showChevron: false } },
    ],
  },
  
  // === ACTIVITY ===
  {
    id: "activity",
    name: "Activity",
    description: "Transaction history",
    icon: <Clock size={20} />,
    items: [
      { slug: "page-header", props: { title: "Activity" } },
      { slug: "tabs", props: { tabs: "All,Sent,Received,Swaps", activeIndex: 0 } },
      { slug: "section-header", props: { title: "Today" } },
      { slug: "transaction-cell", props: { type: "swap", status: "confirmed", amount: "0.5 ETH → 1000 USDC", timestamp: "2 hours ago" } },
      { slug: "transaction-cell", props: { type: "receive", status: "confirmed", amount: "+1.2 ETH", value: "$2,400.00", timestamp: "5 hours ago" } },
      { slug: "section-header", props: { title: "Yesterday" } },
      { slug: "transaction-cell", props: { type: "send", status: "confirmed", amount: "-500 USDC", value: "$500.00", timestamp: "Yesterday" } },
      { slug: "transaction-cell", props: { type: "approve", status: "confirmed", amount: "Approve USDC", timestamp: "Yesterday" } },
      { slug: "footer-nav", props: { activeTab: "activity" } },
    ],
  },
  
  // === NETWORK ===
  {
    id: "network-select",
    name: "Network Selection",
    description: "Choose a network",
    icon: <Layout size={20} />,
    items: [
      { slug: "page-header", props: { title: "Select Network", showBack: true } },
      { slug: "search-bar", props: { placeholder: "Search networks", value: "" } },
      { slug: "section-header", props: { title: "Popular" } },
      { slug: "list-item", props: { title: "Ethereum Mainnet", subtitle: "Chain ID: 1", leftIcon: "🔷" } },
      { slug: "list-item", props: { title: "Polygon", subtitle: "Chain ID: 137", leftIcon: "🟣" } },
      { slug: "list-item", props: { title: "Arbitrum One", subtitle: "Chain ID: 42161", leftIcon: "🔵" } },
      { slug: "list-item", props: { title: "Optimism", subtitle: "Chain ID: 10", leftIcon: "🔴" } },
      { slug: "section-header", props: { title: "Test Networks" } },
      { slug: "list-item", props: { title: "Sepolia", subtitle: "Chain ID: 11155111", leftIcon: "🟡" } },
    ],
  },
  
  // === DAPP CONNECTION ===
  {
    id: "dapp-connect",
    name: "Connect dApp",
    description: "Approve dApp connection",
    icon: <Layout size={20} />,
    items: [
      { slug: "page-header", props: { title: "Connect", showBack: true } },
      { slug: "wallet-connect-session", props: { dappName: "Uniswap", dappUrl: "app.uniswap.org", connected: false, network: "Ethereum" } },
      { slug: "section-header", props: { title: "Permissions Requested" } },
      { slug: "list-item", props: { title: "View your wallet address", leftIcon: "👁️", showChevron: false } },
      { slug: "list-item", props: { title: "Request transaction approval", leftIcon: "✍️", showChevron: false } },
      { slug: "button", props: { label: "Connect", variant: "primary", fullWidth: true } },
      { slug: "button", props: { label: "Reject", variant: "secondary", fullWidth: true } },
    ],
  },
  {
    id: "connected-dapps",
    name: "Connected dApps",
    description: "Manage dApp connections",
    icon: <Layout size={20} />,
    items: [
      { slug: "page-header", props: { title: "Connected Sites", showBack: true } },
      { slug: "wallet-connect-session", props: { dappName: "Uniswap", dappUrl: "app.uniswap.org", connected: true, network: "Ethereum" } },
      { slug: "wallet-connect-session", props: { dappName: "OpenSea", dappUrl: "opensea.io", connected: true, network: "Ethereum" } },
      { slug: "wallet-connect-session", props: { dappName: "Aave", dappUrl: "app.aave.com", connected: true, network: "Polygon" } },
      { slug: "empty-state", props: { title: "Manage connections", description: "Tap a site to disconnect or view details" } },
    ],
  },
  
  // === NFTs ===
  {
    id: "nft-gallery",
    name: "NFT Gallery",
    description: "NFT collection view",
    icon: <Star size={20} />,
    items: [
      { slug: "page-header", props: { title: "NFTs" } },
      { slug: "tabs", props: { tabs: "Collected,Created,Hidden", activeIndex: 0 } },
      { slug: "nft-card", props: { name: "Bored Ape #1234", collection: "BAYC", price: "50 ETH" } },
      { slug: "nft-card", props: { name: "Azuki #5678", collection: "Azuki", price: "15 ETH" } },
      { slug: "footer-nav", props: { activeTab: "wallet" } },
    ],
  },
  
  // === STATES ===
  {
    id: "empty",
    name: "Empty State",
    description: "No content placeholder",
    icon: <Sparkles size={20} />,
    items: [
      { slug: "page-header", props: { title: "NFTs" } },
      { slug: "empty-state", props: { title: "No NFTs yet", description: "Your NFT collection will appear here", actionLabel: "Browse OpenSea" } },
      { slug: "footer-nav", props: { activeTab: "wallet" } },
    ],
  },
  {
    id: "success",
    name: "Success State",
    description: "Transaction success screen",
    icon: <Sparkles size={20} />,
    items: [
      { slug: "page-header", props: { title: "Success", action: "Done" } },
      { slug: "status-indicator", props: { status: "confirmed", label: "Transaction Confirmed", showPulse: false } },
      { slug: "transaction-cell", props: { type: "send", status: "confirmed", amount: "-0.5 ETH", value: "$1,000.00" } },
      { slug: "button", props: { label: "View on Explorer", variant: "secondary", fullWidth: true } },
      { slug: "button", props: { label: "Done", variant: "primary", fullWidth: true } },
    ],
  },
  {
    id: "error",
    name: "Error State",
    description: "Transaction failed screen",
    icon: <Sparkles size={20} />,
    items: [
      { slug: "page-header", props: { title: "Failed", showBack: true } },
      { slug: "status-indicator", props: { status: "failed", label: "Transaction Failed" } },
      { slug: "banner", props: { title: "Insufficient funds", description: "You don't have enough ETH to cover gas fees", variant: "error" } },
      { slug: "button", props: { label: "Try Again", variant: "primary", fullWidth: true } },
      { slug: "button", props: { label: "Cancel", variant: "secondary", fullWidth: true } },
    ],
  },
  {
    id: "pending",
    name: "Pending State",
    description: "Transaction pending screen",
    icon: <Clock size={20} />,
    items: [
      { slug: "page-header", props: { title: "Pending" } },
      { slug: "status-indicator", props: { status: "pending", label: "Transaction Pending", showPulse: true } },
      { slug: "transaction-cell", props: { type: "send", status: "pending", amount: "-0.5 ETH", value: "$1,000.00" } },
      { slug: "progress-bar", props: { progress: 60, variant: "primary" } },
      { slug: "button", props: { label: "Speed Up", variant: "secondary", fullWidth: true } },
      { slug: "button", props: { label: "Cancel Transaction", variant: "danger", fullWidth: true } },
    ],
  },
  
  // === ONBOARDING ===
  {
    id: "onboarding-welcome",
    name: "Onboarding - Welcome",
    description: "First screen of onboarding",
    icon: <Sparkles size={20} />,
    items: [
      { slug: "empty-state", props: { title: "Welcome to MetaMask", description: "The crypto wallet trusted by millions", actionLabel: "Get Started" } },
      { slug: "button", props: { label: "Create New Wallet", variant: "primary", fullWidth: true } },
      { slug: "button", props: { label: "Import Existing Wallet", variant: "secondary", fullWidth: true } },
    ],
  },
  {
    id: "onboarding-secure",
    name: "Onboarding - Secure",
    description: "Security setup step",
    icon: <Sparkles size={20} />,
    items: [
      { slug: "page-header", props: { title: "Secure Your Wallet", showBack: true } },
      { slug: "stepper", props: { steps: "Create,Secure,Confirm", current: 1 } },
      { slug: "banner", props: { title: "Why backup?", description: "Your Secret Recovery Phrase is the ONLY way to recover your wallet if you lose access", variant: "warning" } },
      { slug: "button", props: { label: "Start Backup", variant: "primary", fullWidth: true } },
      { slug: "button", props: { label: "Remind Me Later", variant: "secondary", fullWidth: true } },
    ],
  },
  
  // === NOTIFICATIONS ===
  {
    id: "notifications",
    name: "Notifications",
    description: "Notification center",
    icon: <Bell size={20} />,
    items: [
      { slug: "page-header", props: { title: "Notifications", showBack: true, action: "Mark all read" } },
      { slug: "section-header", props: { title: "New" } },
      { slug: "notification-cell", props: { title: "Transaction Complete", message: "Your swap of 1 ETH for 2000 USDC is complete", timestamp: "2m ago", type: "success", unread: true } },
      { slug: "notification-cell", props: { title: "Price Alert", message: "ETH is up 5% in the last hour", timestamp: "1h ago", type: "info", unread: true } },
      { slug: "section-header", props: { title: "Earlier" } },
      { slug: "notification-cell", props: { title: "Security Reminder", message: "Backup your Secret Recovery Phrase", timestamp: "1d ago", type: "warning", unread: false } },
      { slug: "notification-cell", props: { title: "New Feature", message: "Swaps now available on Polygon", timestamp: "3d ago", type: "info", unread: false } },
    ],
  },
  
  // === BROWSER ===
  {
    id: "browser",
    name: "Browser",
    description: "In-app browser with dApp",
    icon: <Layout size={20} />,
    items: [
      { slug: "page-header", props: { title: "Uniswap", showBack: true, action: "..." } },
      { slug: "chain-badge", props: { chain: "Ethereum", showName: true } },
      { slug: "banner", props: { title: "Connected", description: "This site can see your address and request transactions", variant: "info" } },
      { slug: "footer-nav", props: { activeTab: "browser" } },
    ],
  },
];

export default function CanvasPage() {
  const router = useRouter();
  
  // Core state
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>("iphone-15-pro");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  
  // UI state
  const [showCode, setShowCode] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Navigation", "Headers", "Content"]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [savedCompositions, setSavedCompositions] = useState<SavedComposition[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  
  // Drag state
  const [draggedComponent, setDraggedComponent] = useState<ComponentEntry | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ items: [], selectedId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Refs
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load saved compositions
  useEffect(() => {
    const saved = localStorage.getItem("canvas-compositions-v2");
    if (saved) {
      try {
        setSavedCompositions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved compositions");
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          handleSave();
        } else if (e.key === "c" && selectedItemId) {
          e.preventDefault();
          copyComponentCode();
        } else if (e.key === "d" && selectedItemId) {
          e.preventDefault();
          duplicateComponent(selectedItemId);
        } else if (e.key === "=") {
          e.preventDefault();
          setZoom(z => Math.min(z + 0.1, 1.5));
        } else if (e.key === "-") {
          e.preventDefault();
          setZoom(z => Math.max(z - 0.1, 0.5));
        } else if (e.key === "0") {
          e.preventDefault();
          setZoom(1);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedItemId && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          removeComponent(selectedItemId);
        }
      } else if (e.key === "Escape") {
        setSelectedItemId(null);
      } else if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        if (document.activeElement?.tagName !== "INPUT") {
          setShowGrid(g => !g);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, historyIndex, history]);

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId);

  // History management - store as serializable data, restore component refs from registry
  const serializeItems = (items: CanvasItem[]) => {
    return items.map(item => ({
      id: item.id,
      slug: item.component.slug,
      props: item.props,
    }));
  };

  const deserializeItems = (serializedItems: { id: string; slug: string; props: Record<string, any> }[]): CanvasItem[] => {
    return serializedItems.map(item => {
      const component = componentRegistry.find(c => c.slug === item.slug);
      if (!component) {
        console.warn(`Component not found for slug: ${item.slug}`);
        return null;
      }
      return {
        id: item.id,
        component,
        props: item.props,
      };
    }).filter((item): item is CanvasItem => item !== null);
  };

  const pushHistory = useCallback((items: CanvasItem[], selectedId: string | null) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      // Store serialized items (slugs instead of component refs)
      newHistory.push({ items: deserializeItems(serializeItems(items)), selectedId });
      return newHistory.slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      // Re-deserialize to ensure fresh component refs
      const restoredItems = state.items.map(item => {
        const component = componentRegistry.find(c => c.slug === item.component.slug);
        return component ? { ...item, component } : item;
      });
      setCanvasItems(restoredItems);
      setSelectedItemId(state.selectedId);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      // Re-deserialize to ensure fresh component refs
      const restoredItems = state.items.map(item => {
        const component = componentRegistry.find(c => c.slug === item.component.slug);
        return component ? { ...item, component } : item;
      });
      setCanvasItems(restoredItems);
      setSelectedItemId(state.selectedId);
    }
  }, [historyIndex, history]);

  // Component management
  const addComponent = useCallback((component: ComponentEntry, index?: number, customProps?: Record<string, any>) => {
    const newItem: CanvasItem = {
      id: `${component.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      component,
      props: { ...component.defaultProps, ...customProps },
    };
    
    setCanvasItems(prev => {
      const newItems = [...prev];
      if (index !== undefined) {
        newItems.splice(index, 0, newItem);
      } else {
        newItems.push(newItem);
      }
      pushHistory(newItems, newItem.id);
      return newItems;
    });
    setSelectedItemId(newItem.id);
    setShowTemplates(false);
  }, [pushHistory]);

  const removeComponent = useCallback((id: string) => {
    setCanvasItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      pushHistory(newItems, null);
      if (newItems.length === 0) setShowTemplates(true);
      return newItems;
    });
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  }, [selectedItemId, pushHistory]);

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    setCanvasItems(prev => {
      const newItems = [...prev];
      const [moved] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, moved);
      pushHistory(newItems, moved.id);
      return newItems;
    });
  }, [pushHistory]);

  const updateProp = useCallback((id: string, key: string, value: any) => {
    setCanvasItems(prev => prev.map(item =>
      item.id === id ? { ...item, props: { ...item.props, [key]: value } } : item
    ));
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    const item = canvasItems.find(i => i.id === id);
    if (item) {
      const index = canvasItems.findIndex(i => i.id === id);
      addComponent(item.component, index + 1, item.props);
    }
  }, [canvasItems, addComponent]);

  const clearCanvas = useCallback(() => {
    setCanvasItems([]);
    setSelectedItemId(null);
    pushHistory([], null);
    setShowTemplates(true);
  }, [pushHistory]);

  // Load template
  const loadTemplate = useCallback((template: ScreenTemplate) => {
    const items: CanvasItem[] = [];
    template.items.forEach(item => {
      const component = componentRegistry.find(c => c.slug === item.slug);
      if (component) {
        items.push({
          id: `${item.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          component,
          props: { ...component.defaultProps, ...item.props },
        });
      }
    });
    setCanvasItems(items);
    pushHistory(items, null);
    setShowTemplates(false);
  }, [pushHistory]);

  // Drag handlers
  const handlePaletteDragStart = (e: React.DragEvent, component: ComponentEntry) => {
    setDraggedComponent(component);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "new", slug: component.slug }));
  };

  const handlePaletteDragEnd = () => {
    setDraggedComponent(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  const handleItemDragStart = (e: React.DragEvent, id: string, index: number) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "reorder", id, index }));
  };

  const handleItemDragEnd = (e: React.DragEvent) => {
    if (draggedItemId && phoneFrameRef.current) {
      const rect = phoneFrameRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      const isOutside = clientX < rect.left - 50 || clientX > rect.right + 50 || clientY < rect.top - 50 || clientY > rect.bottom + 50;
      if (isOutside) removeComponent(draggedItemId);
    }
    setDraggedItemId(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedComponent ? "copy" : "move";
    setIsDraggingOver(true);
    
    if (contentRef.current) {
      const children = Array.from(contentRef.current.children);
      const mouseY = e.clientY;
      let newDropIndex = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (mouseY < rect.top + rect.height / 2) {
          newDropIndex = i;
          break;
        }
      }
      setDropIndex(newDropIndex);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
      setDropIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === "new" && draggedComponent) {
        addComponent(draggedComponent, dropIndex ?? undefined);
      } else if (data.type === "reorder" && draggedItemId) {
        const fromIndex = canvasItems.findIndex(item => item.id === draggedItemId);
        const toIndex = dropIndex ?? canvasItems.length;
        if (fromIndex !== -1 && fromIndex !== toIndex) {
          moveComponent(fromIndex, toIndex > fromIndex ? toIndex - 1 : toIndex);
        }
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
    setDraggedComponent(null);
    setDraggedItemId(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  // Save/Load
  const handleSave = () => {
    const name = prompt("Enter composition name:", `Screen ${savedCompositions.length + 1}`);
    if (name) {
      const composition: SavedComposition = {
        id: Date.now().toString(),
        name,
        items: JSON.parse(JSON.stringify(canvasItems)),
        deviceFrame,
        theme: previewTheme,
        createdAt: Date.now(),
      };
      const newSaved = [...savedCompositions, composition];
      setSavedCompositions(newSaved);
      localStorage.setItem("canvas-compositions-v2", JSON.stringify(newSaved));
    }
  };

  const handleLoad = (composition: SavedComposition) => {
    const items = composition.items.map(item => ({
      ...item,
      component: componentRegistry.find(c => c.slug === item.component.slug) || item.component,
    }));
    setCanvasItems(items);
    setDeviceFrame(composition.deviceFrame);
    setPreviewTheme(composition.theme || "dark");
    pushHistory(items, null);
    setShowSavedPanel(false);
    setShowTemplates(false);
  };

  const handleDeleteSaved = (id: string) => {
    const newSaved = savedCompositions.filter(c => c.id !== id);
    setSavedCompositions(newSaved);
    localStorage.setItem("canvas-compositions-v2", JSON.stringify(newSaved));
  };

  // Export
  const exportAsImage = async () => {
    if (!canvasRef.current) return;
    
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const link = document.createElement("a");
      link.download = `screen-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Make sure html2canvas is available.");
    }
  };

  // Code generation
  const generateCode = (format: "jsx" | "rn" = "jsx") => {
    const imports = [...new Set(canvasItems.map(item => item.component.name))];
    const importLine = `import { ${imports.join(", ")} } from "@/components";`;
    
    const components = canvasItems
      .map((item) => {
        const props = Object.entries(item.props)
          .filter(([, value]) => value !== undefined && value !== "")
          .map(([key, value]) => {
            if (typeof value === "string") return `${key}="${value}"`;
            if (typeof value === "boolean") return value ? key : `${key}={false}`;
            return `${key}={${JSON.stringify(value)}}`;
          })
          .join(" ");
        return `      <${item.component.name}${props ? " " + props : ""} />`;
      })
      .join("\n");
    
    return `${importLine}

export function Screen() {
  return (
    <div className="flex flex-col">
${components}
    </div>
  );
}`;
  };

  const copyComponentCode = () => {
    if (selectedItem) {
      const props = Object.entries(selectedItem.props)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => {
          if (typeof value === "string") return `${key}="${value}"`;
          if (typeof value === "boolean") return value ? key : `${key}={false}`;
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(" ");
      navigator.clipboard.writeText(`<${selectedItem.component.name}${props ? " " + props : ""} />`);
    }
  };

  // Filter components
  const filteredComponents = componentRegistry.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const device = deviceFrames[deviceFrame];

  // Theme-aware colors for preview
  const themeColors = previewTheme === "dark" ? {
    bg: "#131416",
    bgSection: "#1c1d1f",
    text: "#ffffff",
    textMuted: "#9b9b9b",
    border: "rgba(255,255,255,0.1)",
  } : {
    bg: "#ffffff",
    bgSection: "#f5f6f8",
    text: "#121314",
    textMuted: "#686e7d",
    border: "rgba(0,0,0,0.1)",
  };

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden bg-[#0a0a0b]">
      {/* Component Palette */}
      <div className="w-72 border-r border-[var(--chrome-border)] bg-[var(--chrome-bg)] flex flex-col">
        <div className="p-3 border-b border-[var(--chrome-border)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--chrome-text-muted)]" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] placeholder:text-[var(--chrome-text-muted)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {search ? (
            <div className="space-y-1">
              {filteredComponents.map((component) => (
                <div
                  key={component.slug}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, component)}
                  onDragEnd={handlePaletteDragEnd}
                  onClick={() => addComponent(component)}
                  className="px-3 py-2.5 rounded-lg text-body-sm text-[var(--chrome-text)] bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-[var(--color-primary-default)]/30"
                >
                  {component.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {componentCategories.map((category) => {
                const categoryComponents = componentRegistry.filter(c => category.slugs.includes(c.slug));
                if (categoryComponents.length === 0) return null;
                const isExpanded = expandedCategories.includes(category.name);
                
                return (
                  <div key={category.name}>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-body-sm text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="weight-medium">{category.name}</span>
                      <span className="ml-auto text-body-xs opacity-50">{categoryComponents.length}</span>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-2 space-y-1 mt-1">
                        {categoryComponents.map((component) => (
                          <div
                            key={component.slug}
                            draggable
                            onDragStart={(e) => handlePaletteDragStart(e, component)}
                            onDragEnd={handlePaletteDragEnd}
                            onClick={() => addComponent(component)}
                            className="px-3 py-2 rounded-lg text-body-sm text-[var(--chrome-text)] hover:bg-[var(--chrome-bg-subtle)] cursor-grab active:cursor-grabbing transition-colors"
                          >
                            {component.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-[var(--chrome-border)]">
          <div className="text-body-xs text-[var(--chrome-text-muted)] space-y-0.5">
            <div className="flex justify-between"><span>Undo / Redo</span><span className="opacity-60">⌘Z / ⌘⇧Z</span></div>
            <div className="flex justify-between"><span>Duplicate</span><span className="opacity-60">⌘D</span></div>
            <div className="flex justify-between"><span>Zoom</span><span className="opacity-60">⌘+ / ⌘-</span></div>
            <div className="flex justify-between"><span>Grid</span><span className="opacity-60">G</span></div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)]">
          <div className="flex items-center gap-3">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] disabled:opacity-30 text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors" title="Undo">
                <Undo2 size={18} />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] disabled:opacity-30 text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors" title="Redo">
                <Redo2 size={18} />
              </button>
            </div>

            <div className="w-px h-5 bg-[var(--chrome-border)]" />

            {/* Device selector */}
            <select
              value={deviceFrame}
              onChange={(e) => setDeviceFrame(e.target.value as DeviceFrame)}
              className="px-2 py-1 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
            >
              {Object.entries(deviceFrames).map(([key, frame]) => (
                <option key={key} value={key}>{frame.name}</option>
              ))}
            </select>

            {/* Theme toggle */}
            <button
              onClick={() => setPreviewTheme(t => t === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
              title={`Switch to ${previewTheme === "dark" ? "light" : "dark"} mode`}
            >
              {previewTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Grid toggle */}
            <button
              onClick={() => setShowGrid(g => !g)}
              className={`p-1.5 rounded-md transition-colors ${showGrid ? "bg-[var(--color-primary-default)] text-white" : "hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"}`}
              title="Toggle grid (G)"
            >
              <Grid3X3 size={18} />
            </button>

            <div className="w-px h-5 bg-[var(--chrome-border)]" />

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="p-1 rounded hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)]" title="Zoom out">
                <ZoomOut size={16} />
              </button>
              <button onClick={() => setZoom(1)} className="px-2 py-0.5 rounded hover:bg-[var(--chrome-bg-subtle)] text-body-xs text-[var(--chrome-text-muted)] min-w-[48px]">
                {Math.round(zoom * 100)}%
              </button>
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="p-1 rounded hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)]" title="Zoom in">
                <ZoomIn size={16} />
              </button>
            </div>

            <span className="text-body-xs text-[var(--chrome-text-muted)] ml-2">
              {canvasItems.length} component{canvasItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear */}
            {canvasItems.length > 0 && (
              <button onClick={clearCanvas} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors" title="Clear canvas">
                <RotateCcw size={18} />
              </button>
            )}

            {/* Export */}
            <button onClick={exportAsImage} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors" title="Export as image">
              <Download size={18} />
            </button>

            {/* Save/Load */}
            <button onClick={handleSave} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors" title="Save (⌘S)">
              <Save size={18} />
            </button>
            <button onClick={() => setShowSavedPanel(!showSavedPanel)} className={`p-1.5 rounded-md transition-colors ${showSavedPanel ? "bg-[var(--color-primary-default)] text-white" : "hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"}`} title="Saved">
              <FolderOpen size={18} />
            </button>

            <div className="w-px h-5 bg-[var(--chrome-border)]" />

            {/* View toggle */}
            <button
              onClick={() => setShowCode(!showCode)}
              className={`px-3 py-1.5 rounded-lg text-body-sm transition-colors ${showCode ? "bg-[var(--color-primary-default)] text-white" : "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"}`}
            >
              <span className="flex items-center gap-1.5">
                <Code2 size={14} />
                {showCode ? "Preview" : "Code"}
              </span>
            </button>

            <button onClick={() => router.back()} className="p-1.5 rounded-md hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)] transition-colors" title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center" style={{ background: "radial-gradient(circle at center, #1a1a1e 0%, #0a0a0b 100%)" }}>
            {showCode ? (
              <div className="w-full max-w-3xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-body-sm text-[var(--chrome-text-muted)]">Generated Code</span>
                  <button onClick={() => navigator.clipboard.writeText(generateCode())} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-body-xs text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] hover:bg-[var(--chrome-bg-subtle)] transition-colors">
                    <Copy size={14} />
                    Copy all
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#1a1a1e] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] overflow-x-auto font-mono">
                  <code>{generateCode() || "// Add components to see generated code"}</code>
                </pre>
              </div>
            ) : (
              <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
                {/* Drag hint */}
                {(draggedComponent || draggedItemId) && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[var(--color-primary-default)] text-white text-body-sm whitespace-nowrap z-50 shadow-xl animate-pulse">
                    {draggedComponent ? "Drop to add component" : "Drag outside to remove"}
                  </div>
                )}

                {/* Phone Frame */}
                <div
                  ref={phoneFrameRef}
                  className="relative transition-all duration-300"
                  style={{
                    background: deviceFrame !== "none" ? "linear-gradient(145deg, #2a2a2e, #1a1a1e)" : "transparent",
                    borderRadius: device.frameRadius,
                    padding: deviceFrame !== "none" ? 12 : 0,
                    boxShadow: deviceFrame !== "none" ? "0 50px 100px -20px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 40px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  {deviceFrame !== "none" && (
                    <>
                      <div className="absolute -left-[3px] top-[120px] w-[3px] h-[30px] bg-[#2d2d2d] rounded-l-sm" />
                      <div className="absolute -left-[3px] top-[170px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-sm" />
                      <div className="absolute -left-[3px] top-[240px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-sm" />
                      <div className="absolute -right-[3px] top-[180px] w-[3px] h-[80px] bg-[#2d2d2d] rounded-r-sm" />
                    </>
                  )}

                  {/* Screen */}
                  <div
                    ref={canvasRef}
                    className={`relative overflow-hidden flex flex-col transition-all duration-300 ${isDraggingOver ? "ring-2 ring-[var(--color-primary-default)] ring-inset" : ""}`}
                    style={{
                      width: device.width,
                      height: device.height,
                      borderRadius: device.radius,
                      backgroundColor: themeColors.bg,
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Grid overlay */}
                    {showGrid && (
                      <div 
                        className="absolute inset-0 pointer-events-none z-50 opacity-20"
                        style={{
                          backgroundImage: `
                            linear-gradient(${themeColors.text}10 1px, transparent 1px),
                            linear-gradient(90deg, ${themeColors.text}10 1px, transparent 1px)
                          `,
                          backgroundSize: "16px 16px",
                        }}
                      />
                    )}

                    {/* Status Bar */}
                    <div
                      className="flex-shrink-0 flex items-center justify-between px-6"
                      style={{
                        height: device.hasIsland ? 54 : 24,
                        paddingTop: device.hasIsland ? 14 : 4,
                        backgroundColor: themeColors.bg,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: themeColors.text }}>9:41</span>
                      <div className="flex items-center gap-1.5">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill={themeColors.text}>
                          <path d="M1 4.5C1 3.67 1.67 3 2.5 3H3.5C4.33 3 5 3.67 5 4.5V10.5C5 11.33 4.33 12 3.5 12H2.5C1.67 12 1 11.33 1 10.5V4.5Z" opacity="0.3"/>
                          <path d="M6 3C6 2.17 6.67 1.5 7.5 1.5H8.5C9.33 1.5 10 2.17 10 3V10.5C10 11.33 9.33 12 8.5 12H7.5C6.67 12 6 11.33 6 10.5V3Z" opacity="0.6"/>
                          <path d="M11 1.5C11 0.67 11.67 0 12.5 0H13.5C14.33 0 15 0.67 15 1.5V10.5C15 11.33 14.33 12 13.5 12H12.5C11.67 12 11 11.33 11 10.5V1.5Z"/>
                        </svg>
                        <svg width="16" height="12" viewBox="0 0 17 12" fill={themeColors.text}>
                          <path d="M8.5 2.5C10.5 2.5 12.3 3.3 13.6 4.6L15 3.2C13.3 1.5 11 0.5 8.5 0.5C6 0.5 3.7 1.5 2 3.2L3.4 4.6C4.7 3.3 6.5 2.5 8.5 2.5Z"/>
                          <path d="M5.1 6.4L6.5 7.8C7.1 7.2 7.8 6.9 8.5 6.9C9.2 6.9 9.9 7.2 10.5 7.8L11.9 6.4C10.9 5.4 9.8 4.9 8.5 4.9C7.2 4.9 6.1 5.4 5.1 6.4Z"/>
                          <circle cx="8.5" cy="10.5" r="1.5"/>
                        </svg>
                        <div className="flex items-center">
                          <div style={{ width: 25, height: 12, border: `2px solid ${themeColors.text}`, borderRadius: 4, position: "relative" }}>
                            <div style={{ position: "absolute", inset: 2, right: 4, backgroundColor: themeColors.text, borderRadius: 1 }} />
                          </div>
                          <div style={{ width: 2, height: 5, backgroundColor: themeColors.text, borderRadius: "0 2px 2px 0", marginLeft: 1 }} />
                        </div>
                      </div>
                    </div>

                    {device.hasIsland && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
                        <div className="w-[126px] h-[37px] bg-black rounded-[20px]" />
                      </div>
                    )}

                    {/* Content - split footer from scrollable content */}
                    {(() => {
                      // Separate footer-nav from other items
                      const footerItem = canvasItems.find(item => item.component.slug === "footer-nav");
                      const contentItems = canvasItems.filter(item => item.component.slug !== "footer-nav");
                      const footerIndex = canvasItems.findIndex(item => item.component.slug === "footer-nav");
                      
                      // Full-width components (no side padding)
                      const fullWidthSlugs = ["footer-nav", "tabs", "banner"];
                      // Components that need internal padding
                      const paddedSlugs = ["hub-header", "section-header", "token-cell", "token-list", "transaction-cell", "list-item", "empty-state", "page-header", "tab-header"];
                      
                      return (
                        <>
                          {/* Scrollable content area */}
                          <div ref={contentRef} className="flex-1 overflow-y-auto relative" data-theme={previewTheme}>
                            {canvasItems.length === 0 && !isDraggingOver ? (
                              showTemplates ? (
                                <div className="p-4">
                                  <p className="text-body-sm mb-4" style={{ color: themeColors.textMuted }}>Start with a template or drag components</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {screenTemplates.map(template => (
                                      <button
                                        key={template.id}
                                        onClick={() => loadTemplate(template)}
                                        className="p-3 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        style={{ backgroundColor: themeColors.bgSection, border: `1px solid ${themeColors.border}` }}
                                      >
                                        <div className="flex items-center gap-2 mb-1" style={{ color: themeColors.text }}>
                                          {template.icon}
                                          <span className="text-body-sm weight-medium">{template.name}</span>
                                        </div>
                                        <p className="text-body-xs" style={{ color: themeColors.textMuted }}>{template.description}</p>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full p-6" style={{ color: themeColors.textMuted }}>
                                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: themeColors.bgSection }}>
                                    <Layers size={28} className="opacity-40" />
                                  </div>
                                  <p className="text-body-md mb-1">Canvas is empty</p>
                                  <p className="text-body-sm text-center opacity-60">Drag components or <button onClick={() => setShowTemplates(true)} className="underline">use a template</button></p>
                                </div>
                              )
                            ) : (
                              <div className="px-4 py-2" data-theme={previewTheme}>
                                {contentItems.map((item, index) => {
                                  const Component = item.component.component;
                                  const isDragging = draggedItemId === item.id;
                                  const isSelected = selectedItemId === item.id;
                                  const actualIndex = canvasItems.findIndex(i => i.id === item.id);
                                  const showDropBefore = dropIndex === actualIndex && (draggedComponent || draggedItemId);
                                  const isFullWidth = fullWidthSlugs.includes(item.component.slug);

                                  return (
                                    <div key={item.id} style={{ margin: isFullWidth ? "0 -16px" : undefined }}>
                                      {showDropBefore && <div className="h-1 bg-[#8b99ff] rounded-full animate-pulse my-1" />}
                                      <div
                                        draggable
                                        onDragStart={(e) => handleItemDragStart(e, item.id, actualIndex)}
                                        onDragEnd={handleItemDragEnd}
                                        onClick={() => setSelectedItemId(item.id)}
                                        className={`relative transition-all cursor-grab active:cursor-grabbing ${isSelected ? "ring-2 ring-[#8b99ff] ring-inset z-10 rounded-lg" : ""} ${isDragging ? "opacity-30 scale-95" : ""}`}
                                      >
                                        <Component {...item.props} />
                                      </div>
                                    </div>
                                  );
                                })}
                                {(draggedComponent || draggedItemId) && typeof dropIndex === "number" && dropIndex >= contentItems.length && (
                                  <div className="h-1 bg-[#8b99ff] rounded-full animate-pulse my-1" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Fixed Footer Nav */}
                          {footerItem && (
                            <div 
                              className="flex-shrink-0"
                              style={{ backgroundColor: themeColors.bgSection }}
                              onClick={() => setSelectedItemId(footerItem.id)}
                            >
                              <div
                                draggable
                                onDragStart={(e) => handleItemDragStart(e, footerItem.id, footerIndex)}
                                onDragEnd={handleItemDragEnd}
                                className={`relative cursor-grab active:cursor-grabbing ${selectedItemId === footerItem.id ? "ring-2 ring-[#8b99ff] ring-inset" : ""} ${draggedItemId === footerItem.id ? "opacity-30" : ""}`}
                              >
                                {(() => {
                                  const FooterComponent = footerItem.component.component;
                                  return <FooterComponent {...footerItem.props} />;
                                })()}
                              </div>
                            </div>
                          )}

                          {/* Home Indicator */}
                          {device.hasIsland && (
                            <div className="flex-shrink-0 flex justify-center pb-2 pt-1" style={{ backgroundColor: footerItem ? themeColors.bgSection : themeColors.bg }}>
                              <div className="w-[134px] h-[5px] rounded-full opacity-30" style={{ backgroundColor: themeColors.text }} />
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Panel */}
          {showSavedPanel && (
            <div className="w-64 border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
              <div className="p-3 border-b border-[var(--chrome-border)]">
                <h3 className="text-body-sm weight-semibold text-[var(--chrome-text)]">Saved Screens</h3>
              </div>
              <div className="p-2">
                {savedCompositions.length === 0 ? (
                  <p className="text-body-sm text-[var(--chrome-text-muted)] text-center py-8">No saved screens yet.<br />Press ⌘S to save.</p>
                ) : (
                  <div className="space-y-2">
                    {savedCompositions.map((comp) => (
                      <div key={comp.id} className="p-3 rounded-lg bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] group cursor-pointer transition-colors" onClick={() => handleLoad(comp)}>
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm text-[var(--chrome-text)]">{comp.name}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSaved(comp.id); }} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)] transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-body-xs text-[var(--chrome-text-muted)]">
                          <span>{comp.items.length} components</span>
                          <span>•</span>
                          <span>{deviceFrames[comp.deviceFrame]?.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Props Panel */}
          {selectedItem && !showCode && (
            <div className="w-80 border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
              <div className="p-4 border-b border-[var(--chrome-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-body-md weight-semibold text-[var(--chrome-text)]">{selectedItem.component.name}</h3>
                  <div className="flex items-center gap-1">
                    <button onClick={() => duplicateComponent(selectedItem.id)} className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]" title="Duplicate (⌘D)">
                      <Copy size={16} />
                    </button>
                    <button onClick={() => removeComponent(selectedItem.id)} className="p-1.5 rounded-md hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)]" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-body-xs text-[var(--chrome-text-muted)] mt-1">{selectedItem.component.description}</p>
              </div>

              {selectedItem.component.variants && selectedItem.component.variants.length > 0 && (
                <div className="p-4 border-b border-[var(--chrome-border)]">
                  <h4 className="text-body-xs weight-medium text-[var(--chrome-text-muted)] mb-2">Presets</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.component.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => setCanvasItems(prev => prev.map(item => item.id === selectedItem.id ? { ...item, props: { ...item.props, ...variant.props } } : item))}
                        className="px-2 py-1 rounded-md text-body-xs bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] hover:bg-[var(--color-primary-muted)] transition-colors"
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 space-y-4">
                {selectedItem.component.props.map((prop) => (
                  <div key={prop.name}>
                    <label className="block text-body-sm weight-medium text-[var(--chrome-text)] mb-1.5">{prop.name}</label>
                    {prop.type === "boolean" ? (
                      <button
                        onClick={() => updateProp(selectedItem.id, prop.name, !selectedItem.props[prop.name])}
                        className={`w-full px-3 py-2 rounded-lg text-body-sm text-left transition-colors ${selectedItem.props[prop.name] ? "bg-[var(--color-primary-default)] text-white" : "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)]"}`}
                      >
                        {selectedItem.props[prop.name] ? "true" : "false"}
                      </button>
                    ) : prop.options ? (
                      <select
                        value={selectedItem.props[prop.name] || ""}
                        onChange={(e) => updateProp(selectedItem.id, prop.name, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
                      >
                        {prop.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type={prop.type === "number" ? "number" : "text"}
                        value={selectedItem.props[prop.name] || ""}
                        onChange={(e) => updateProp(selectedItem.id, prop.name, prop.type === "number" ? Number(e.target.value) : e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
                      />
                    )}
                    <p className="text-body-xs text-[var(--chrome-text-muted)] mt-1">{prop.description}</p>
                  </div>
                ))}
              </div>

              {/* Quick code copy */}
              <div className="p-4 border-t border-[var(--chrome-border)]">
                <button onClick={copyComponentCode} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] text-body-sm text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors">
                  <Copy size={14} />
                  Copy component code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
