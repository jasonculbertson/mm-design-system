"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Copy, Check, RefreshCw, Smartphone, Monitor, 
  ChevronDown, ChevronRight, Code2, Eye
} from "lucide-react";
import { 
  componentRegistry, 
  getComponentBySlug,
  useColors,
} from "@/lib/components";
import { colors, spacing, radius, typography } from "@/lib/tokens";

interface PropConfig {
  name: string;
  type: "string" | "boolean" | "select" | "number";
  default: any;
  options?: string[];
  description?: string;
}

// Get prop configurations for each component
const getPropsForComponent = (slug: string): PropConfig[] => {
  const propsMap: Record<string, PropConfig[]> = {
    "button": [
      { name: "label", type: "string", default: "Click me", description: "Button text" },
      { name: "variant", type: "select", default: "primary", options: ["primary", "secondary", "tertiary", "danger"], description: "Button style variant" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "Button size" },
      { name: "disabled", type: "boolean", default: false, description: "Disable the button" },
      { name: "loading", type: "boolean", default: false, description: "Show loading state" },
      { name: "fullWidth", type: "boolean", default: false, description: "Full width button" },
    ],
    "input": [
      { name: "placeholder", type: "string", default: "Enter text...", description: "Placeholder text" },
      { name: "label", type: "string", default: "Label", description: "Input label" },
      { name: "value", type: "string", default: "", description: "Input value" },
      { name: "error", type: "string", default: "", description: "Error message" },
      { name: "disabled", type: "boolean", default: false, description: "Disable the input" },
    ],
    "badge": [
      { name: "label", type: "string", default: "Badge", description: "Badge text" },
      { name: "variant", type: "select", default: "default", options: ["default", "primary", "success", "warning", "error"], description: "Badge color variant" },
      { name: "size", type: "select", default: "md", options: ["sm", "md"], description: "Badge size" },
    ],
    "card": [
      { name: "title", type: "string", default: "Card Title", description: "Card heading" },
      { name: "description", type: "string", default: "Card description text", description: "Card body text" },
      { name: "variant", type: "select", default: "default", options: ["default", "elevated", "outlined"], description: "Card style" },
    ],
    "avatar": [
      { name: "name", type: "string", default: "John Doe", description: "User name for initials" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg", "xl"], description: "Avatar size" },
      { name: "showBadge", type: "boolean", default: false, description: "Show status badge" },
    ],
    "switch": [
      { name: "value", type: "boolean", default: false, description: "Switch state" },
      { name: "label", type: "string", default: "Toggle", description: "Switch label" },
      { name: "disabled", type: "boolean", default: false, description: "Disable switch" },
    ],
    "banner": [
      { name: "title", type: "string", default: "Notice", description: "Banner title" },
      { name: "description", type: "string", default: "Important information here", description: "Banner message" },
      { name: "variant", type: "select", default: "info", options: ["info", "success", "warning", "error"], description: "Banner type" },
      { name: "dismissible", type: "boolean", default: false, description: "Show dismiss button" },
    ],
    "token-cell": [
      { name: "symbol", type: "string", default: "ETH", description: "Token symbol" },
      { name: "name", type: "string", default: "Ethereum", description: "Token name" },
      { name: "balance", type: "string", default: "2.45", description: "Token balance" },
      { name: "value", type: "string", default: "$4,890.00", description: "Fiat value" },
      { name: "change", type: "string", default: "+5.2%", description: "Price change" },
      { name: "changePositive", type: "boolean", default: true, description: "Is change positive" },
    ],
    "hub-header": [
      { name: "balance", type: "string", default: "$12,450.00", description: "Total balance" },
      { name: "label", type: "string", default: "Total Balance", description: "Balance label" },
      { name: "primaryAction", type: "string", default: "Add funds", description: "Primary button text" },
      { name: "secondaryAction", type: "string", default: "Buy", description: "Secondary button text" },
    ],
    "list-item": [
      { name: "title", type: "string", default: "Settings", description: "Item title" },
      { name: "subtitle", type: "string", default: "Manage your preferences", description: "Item subtitle" },
      { name: "leftIcon", type: "string", default: "⚙️", description: "Left icon" },
      { name: "showChevron", type: "boolean", default: true, description: "Show chevron" },
    ],
    "transaction-cell": [
      { name: "type", type: "select", default: "send", options: ["send", "receive", "swap", "approve"], description: "Transaction type" },
      { name: "status", type: "select", default: "confirmed", options: ["pending", "confirmed", "failed"], description: "Transaction status" },
      { name: "amount", type: "string", default: "-0.5 ETH", description: "Transaction amount" },
      { name: "value", type: "string", default: "$1,000.00", description: "Fiat value" },
      { name: "timestamp", type: "string", default: "2 hours ago", description: "Time of transaction" },
    ],
    "status-indicator": [
      { name: "status", type: "select", default: "confirmed", options: ["pending", "confirmed", "failed", "processing"], description: "Status type" },
      { name: "label", type: "string", default: "Transaction Confirmed", description: "Status label" },
      { name: "showPulse", type: "boolean", default: false, description: "Show pulse animation" },
    ],
    "amount-input": [
      { name: "value", type: "string", default: "0.5", description: "Amount value" },
      { name: "token", type: "string", default: "ETH", description: "Token symbol" },
      { name: "fiatValue", type: "string", default: "$1,000.00", description: "Fiat equivalent" },
      { name: "balance", type: "string", default: "2.45", description: "Available balance" },
      { name: "showMax", type: "boolean", default: true, description: "Show max button" },
    ],
    "notification-cell": [
      { name: "title", type: "string", default: "Transaction Complete", description: "Notification title" },
      { name: "message", type: "string", default: "Your swap was successful", description: "Notification message" },
      { name: "timestamp", type: "string", default: "2m ago", description: "Time" },
      { name: "type", type: "select", default: "success", options: ["info", "success", "warning", "error"], description: "Notification type" },
      { name: "unread", type: "boolean", default: true, description: "Is unread" },
    ],
    "stepper": [
      { name: "steps", type: "string", default: "Create,Secure,Confirm", description: "Comma-separated steps" },
      { name: "current", type: "number", default: 1, description: "Current step (0-indexed)" },
      { name: "variant", type: "select", default: "default", options: ["default", "compact"], description: "Stepper style" },
    ],
    "chain-badge": [
      { name: "chain", type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB", "Base"], description: "Chain name" },
      { name: "showName", type: "boolean", default: true, description: "Show chain name" },
    ],
  };

  return propsMap[slug] || [
    { name: "variant", type: "select", default: "default", options: ["default", "primary"], description: "Component variant" },
  ];
};

// Group components by category
const componentCategories = [
  { name: "Buttons & Actions", slugs: ["button", "switch", "chip"] },
  { name: "Inputs", slugs: ["input", "search-bar", "amount-input", "password-input", "textarea"] },
  { name: "Display", slugs: ["badge", "card", "avatar", "banner", "token-cell", "nft-card"] },
  { name: "Navigation", slugs: ["tabs", "footer-nav", "page-header", "section-header"] },
  { name: "Data", slugs: ["list-item", "transaction-cell", "notification-cell"] },
  { name: "Wallet", slugs: ["hub-header", "confirmation-sheet", "gas-fee-selector", "swap-preview", "qr-code-display", "address-display"] },
  { name: "Feedback", slugs: ["status-indicator", "stepper", "progress-bar", "spinner", "skeleton"] },
  { name: "Utility", slugs: ["chain-badge", "identicon", "divider"] },
];

export default function PlaygroundPage() {
  const router = useRouter();
  const c = useColors();
  const [selectedSlug, setSelectedSlug] = useState("button");
  const [propValues, setPropValues] = useState<Record<string, any>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Buttons & Actions"]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the selected component
  const selectedComponent = useMemo(() => {
    return componentRegistry.find(c => c.slug === selectedSlug);
  }, [selectedSlug]);

  // Get prop configs for selected component
  const propConfigs = useMemo(() => {
    return getPropsForComponent(selectedSlug);
  }, [selectedSlug]);

  // Merge defaults with current values
  const currentProps = useMemo(() => {
    const defaults: Record<string, any> = {};
    propConfigs.forEach(prop => {
      defaults[prop.name] = propValues[prop.name] ?? prop.default;
    });
    return defaults;
  }, [propConfigs, propValues]);

  // Generate code string
  const generatedCode = useMemo(() => {
    const componentName = selectedComponent?.name || "Component";
    const propsStr = Object.entries(currentProps)
      .filter(([key, value]) => {
        const config = propConfigs.find(p => p.name === key);
        return config && value !== config.default;
      })
      .map(([key, value]) => {
        if (typeof value === "boolean") return value ? key : `${key}={false}`;
        if (typeof value === "number") return `${key}={${value}}`;
        return `${key}="${value}"`;
      })
      .join("\n  ");
    
    return `<${componentName}${propsStr ? `\n  ${propsStr}\n` : " "}/>`;
  }, [selectedComponent, currentProps, propConfigs]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetProps = () => {
    setPropValues({});
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filter components by search
  const filteredCategories = componentCategories.map(cat => ({
    ...cat,
    slugs: cat.slugs.filter(slug => {
      const component = componentRegistry.find(c => c.slug === slug);
      return component?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             slug.includes(searchQuery.toLowerCase());
    }),
  })).filter(cat => cat.slugs.length > 0);

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: c.background.default, 
      fontFamily: typography.fontFamily.sans,
      display: "flex",
    }}>
      {/* Sidebar - Component List */}
      <div style={{ 
        width: 280, 
        borderRight: `1px solid ${c.border.muted}`,
        background: c.background.section,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        {/* Sidebar Header */}
        <div style={{ padding: spacing[4], borderBottom: `1px solid ${c.border.muted}` }}>
          <h2 style={{ 
            fontSize: typography.fontSize.lg, 
            fontWeight: typography.fontWeight.semibold, 
            color: c.text.default,
            margin: 0,
          }}>
            Playground
          </h2>
          <p style={{ 
            fontSize: typography.fontSize.xs, 
            color: c.text.alternative,
            margin: `${spacing[1]}px 0 0 0`,
          }}>
            Experiment with component props
          </p>
        </div>

        {/* Search */}
        <div style={{ padding: spacing[3] }}>
          <div style={{ position: "relative" }}>
            <Search 
              size={14} 
              style={{ 
                position: "absolute", 
                left: spacing[2], 
                top: "50%", 
                transform: "translateY(-50%)",
                color: c.text.muted,
              }} 
            />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: `${spacing[1.5]}px ${spacing[2]}px`,
                paddingLeft: spacing[7],
                background: c.background.default,
                border: `1px solid ${c.border.muted}`,
                borderRadius: radius.md,
                color: c.text.default,
                fontSize: typography.fontSize.xs,
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Component Categories */}
        <div style={{ flex: 1, overflow: "auto", padding: `0 ${spacing[2]}px` }}>
          {filteredCategories.map(category => (
            <div key={category.name} style={{ marginBottom: spacing[1] }}>
              <button
                onClick={() => toggleCategory(category.name)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: spacing[1],
                  padding: `${spacing[2]}px ${spacing[2]}px`,
                  background: "transparent",
                  border: "none",
                  color: c.text.alternative,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {expandedCategories.includes(category.name) 
                  ? <ChevronDown size={14} /> 
                  : <ChevronRight size={14} />}
                {category.name}
                <span style={{ 
                  marginLeft: "auto", 
                  color: c.text.muted,
                  fontSize: typography.fontSize.xs,
                }}>
                  {category.slugs.length}
                </span>
              </button>

              {expandedCategories.includes(category.name) && (
                <div style={{ marginLeft: spacing[2] }}>
                  {category.slugs.map(slug => {
                    const component = componentRegistry.find(c => c.slug === slug);
                    if (!component) return null;
                    return (
                      <button
                        key={slug}
                        onClick={() => {
                          setSelectedSlug(slug);
                          setPropValues({});
                        }}
                        style={{
                          width: "100%",
                          display: "block",
                          padding: `${spacing[1.5]}px ${spacing[2]}px`,
                          background: selectedSlug === slug ? c.primary.muted : "transparent",
                          border: "none",
                          borderRadius: radius.md,
                          color: selectedSlug === slug ? c.primary.default : c.text.default,
                          fontSize: typography.fontSize.sm,
                          cursor: "pointer",
                          textAlign: "left",
                          marginBottom: spacing[0.5],
                        }}
                      >
                        {component.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div style={{ 
          padding: `${spacing[3]}px ${spacing[4]}px`, 
          borderBottom: `1px solid ${c.border.muted}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: c.background.section,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
            <h3 style={{ 
              fontSize: typography.fontSize.base, 
              fontWeight: typography.fontWeight.semibold, 
              color: c.text.default,
              margin: 0,
            }}>
              {selectedComponent?.name || "Select Component"}
            </h3>
          </div>

          <div style={{ display: "flex", gap: spacing[2] }}>
            <button
              onClick={handleResetProps}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing[1],
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                background: c.background.muted,
                border: "none",
                borderRadius: radius.md,
                color: c.text.alternative,
                fontSize: typography.fontSize.sm,
                cursor: "pointer",
              }}
            >
              <RefreshCw size={14} />
              Reset
            </button>
            <button
              onClick={handleCopyCode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing[1],
                padding: `${spacing[1.5]}px ${spacing[3]}px`,
                background: copiedCode ? c.success.default : c.primary.default,
                border: "none",
                borderRadius: radius.md,
                color: copiedCode ? c.success.inverse : c.primary.inverse,
                fontSize: typography.fontSize.sm,
                cursor: "pointer",
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              {copiedCode ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>

        {/* Preview & Props Area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Preview */}
          <div style={{ 
            flex: 1, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            background: c.background.default,
            padding: spacing[6],
          }}>
            <div style={{
              background: c.background.section,
              borderRadius: radius.xl,
              padding: spacing[8],
              minWidth: 320,
              maxWidth: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${c.border.muted}`,
            }}>
              {selectedComponent && (
                <selectedComponent.component {...currentProps} />
              )}
            </div>
          </div>

          {/* Props Panel */}
          <div style={{ 
            width: 320, 
            borderLeft: `1px solid ${c.border.muted}`,
            background: c.background.section,
            overflow: "auto",
          }}>
            <div style={{ 
              padding: spacing[4], 
              borderBottom: `1px solid ${c.border.muted}`,
            }}>
              <h4 style={{ 
                fontSize: typography.fontSize.sm, 
                fontWeight: typography.fontWeight.semibold, 
                color: c.text.default,
                margin: 0,
              }}>
                Props
              </h4>
            </div>

            <div style={{ padding: spacing[4] }}>
              {propConfigs.map(prop => (
                <div key={prop.name} style={{ marginBottom: spacing[4] }}>
                  <label style={{
                    display: "block",
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                    color: c.text.alternative,
                    marginBottom: spacing[1],
                  }}>
                    {prop.name}
                    {prop.description && (
                      <span style={{ 
                        fontWeight: typography.fontWeight.normal,
                        color: c.text.muted,
                        marginLeft: spacing[1],
                      }}>
                        – {prop.description}
                      </span>
                    )}
                  </label>

                  {prop.type === "string" && (
                    <input
                      type="text"
                      value={currentProps[prop.name] || ""}
                      onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: `${spacing[2]}px ${spacing[3]}px`,
                        background: c.background.default,
                        border: `1px solid ${c.border.muted}`,
                        borderRadius: radius.md,
                        color: c.text.default,
                        fontSize: typography.fontSize.sm,
                        outline: "none",
                      }}
                    />
                  )}

                  {prop.type === "number" && (
                    <input
                      type="number"
                      value={currentProps[prop.name] || 0}
                      onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: `${spacing[2]}px ${spacing[3]}px`,
                        background: c.background.default,
                        border: `1px solid ${c.border.muted}`,
                        borderRadius: radius.md,
                        color: c.text.default,
                        fontSize: typography.fontSize.sm,
                        outline: "none",
                      }}
                    />
                  )}

                  {prop.type === "boolean" && (
                    <button
                      onClick={() => setPropValues(prev => ({ 
                        ...prev, 
                        [prop.name]: !currentProps[prop.name] 
                      }))}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: radius.full,
                        background: currentProps[prop.name] ? c.primary.default : c.background.muted,
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 150ms ease",
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        width: 18,
                        height: 18,
                        borderRadius: radius.full,
                        background: "white",
                        top: 3,
                        left: currentProps[prop.name] ? 23 : 3,
                        transition: "left 150ms ease",
                      }} />
                    </button>
                  )}

                  {prop.type === "select" && prop.options && (
                    <select
                      value={currentProps[prop.name] || ""}
                      onChange={(e) => setPropValues(prev => ({ ...prev, [prop.name]: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: `${spacing[2]}px ${spacing[3]}px`,
                        background: c.background.default,
                        border: `1px solid ${c.border.muted}`,
                        borderRadius: radius.md,
                        color: c.text.default,
                        fontSize: typography.fontSize.sm,
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      {prop.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Code Preview */}
            <div style={{ 
              padding: spacing[4], 
              borderTop: `1px solid ${c.border.muted}`,
            }}>
              <h4 style={{ 
                fontSize: typography.fontSize.xs, 
                fontWeight: typography.fontWeight.semibold, 
                color: c.text.alternative,
                margin: `0 0 ${spacing[2]}px 0`,
                display: "flex",
                alignItems: "center",
                gap: spacing[1],
              }}>
                <Code2 size={14} />
                Generated Code
              </h4>
              <pre style={{
                background: c.background.default,
                borderRadius: radius.md,
                padding: spacing[3],
                fontSize: typography.fontSize.xs,
                color: c.text.alternative,
                overflow: "auto",
                margin: 0,
                fontFamily: "ui-monospace, monospace",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {generatedCode}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

