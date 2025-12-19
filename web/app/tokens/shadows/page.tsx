"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

// ============================================
// SHADOW TOKENS - From official MetaMask design tokens
// https://github.com/MetaMask/metamask-design-system/blob/main/packages/design-tokens/src/css/shadow.css
// ============================================

const shadowSizes = [
  { 
    name: "xs", 
    value: "0 2px 4px 0", 
    color: "rgba(0, 0, 0, 0.1)",
    description: "Extra small - subtle elevation",
    usage: "Toast, tooltips"
  },
  { 
    name: "sm", 
    value: "0 2px 8px 0", 
    color: "rgba(0, 0, 0, 0.15)",
    description: "Small - light elevation",
    usage: "Cards, dropdowns"
  },
  { 
    name: "md", 
    value: "0 2px 16px 0", 
    color: "rgba(0, 0, 0, 0.15)",
    description: "Medium - moderate elevation",
    usage: "Modals, popovers"
  },
  { 
    name: "lg", 
    value: "0 2px 40px 0", 
    color: "rgba(0, 0, 0, 0.2)",
    description: "Large - high elevation",
    usage: "Dialogs, sheets"
  },
];

const shadowColors = {
  light: {
    default: "rgba(0, 0, 0, 0.1)",
    primary: "rgba(68, 89, 255, 0.3)",
    error: "rgba(202, 53, 66, 0.3)",
    success: "rgba(69, 122, 57, 0.3)",
  },
  dark: {
    default: "rgba(0, 0, 0, 0.5)",
    primary: "rgba(139, 153, 255, 0.3)",
    error: "rgba(255, 117, 132, 0.3)",
    success: "rgba(186, 242, 74, 0.3)",
  }
};

export default function ShadowsPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);

  // Listen to theme changes from the document
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    checkTheme();
    
    // Watch for class changes on the document element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    
    return () => observer.disconnect();
  }, []);

  const copyToken = async (value: string, name: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colors = isDark ? shadowColors.dark : shadowColors.light;
  const bgColor = isDark ? "#1c1d1f" : "#f5f6f8";
  const cardBg = isDark ? "#252628" : "#ffffff";
  const textColor = isDark ? "#fff" : "#121314";
  const mutedColor = isDark ? "#9b9b9b" : "#686e7d";

  return (
    <div className="animate-in fade-in space-y-8 pb-24 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
          Shadows
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          Elevation shadows for creating depth and visual hierarchy.
        </p>
      </div>

      {/* Shadow Sizes */}
      <div className="space-y-4">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Shadow Sizes</h2>
        <div 
          className="p-8 rounded-[var(--radius-xl)]"
          style={{ backgroundColor: bgColor }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {shadowSizes.map((shadow) => (
              <button
                key={shadow.name}
                onClick={() => copyToken(`${shadow.value} ${colors.default}`, shadow.name)}
                className="flex flex-col items-center gap-4 relative group"
              >
                <div
                  className="w-20 h-20 rounded-[var(--radius-xl)] transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: cardBg,
                    boxShadow: `${shadow.value} ${colors.default}`
                  }}
                />
                <div className="text-center">
                  <div 
                    className="text-body-sm weight-medium"
                    style={{ color: textColor }}
                  >
                    shadow-{shadow.name}
                  </div>
                  <div 
                    className="text-body-xs"
                    style={{ color: mutedColor }}
                  >
                    {shadow.usage}
                  </div>
                </div>
                {copiedToken === shadow.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                    <Check size={20} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shadow Values Table */}
      <div className="space-y-4">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Token Values</h2>
        <div className="space-y-3">
          {shadowSizes.map((shadow) => (
            <button
              key={`table-${shadow.name}`}
              onClick={() => copyToken(`${shadow.value} ${colors.default}`, `table-${shadow.name}`)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative text-left"
            >
              <div className="flex-1">
                <div className="text-body-sm text-[var(--chrome-text)] weight-medium">
                  --shadow-size-{shadow.name}
                </div>
                <div className="text-body-xs text-[var(--chrome-text-muted)]">
                  {shadow.description}
                </div>
              </div>
              <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded">
                {shadow.value}
              </code>
              {copiedToken === `table-${shadow.name}` && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                  <Check size={20} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Colored Shadows */}
      <div className="space-y-4">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Colored Shadows</h2>
        <p className="text-body-sm text-[var(--chrome-text-muted)]">
          Use semantic colors for interactive elements like buttons.
        </p>
        <div 
          className="p-8 rounded-[var(--radius-xl)]"
          style={{ backgroundColor: bgColor }}
        >
          <div className="flex flex-wrap gap-8 justify-center">
            {Object.entries(colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="w-16 h-16 rounded-[var(--radius-xl)] mb-3 mx-auto"
                  style={{ 
                    backgroundColor: cardBg,
                    boxShadow: `0 4px 16px 0 ${color}`
                  }}
                />
                <span 
                  className="text-body-xs"
                  style={{ color: mutedColor }}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
        <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
          <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`// CSS Variables
box-shadow: var(--shadow-size-sm) rgba(0, 0, 0, 0.1);
box-shadow: var(--shadow-size-md) rgba(0, 0, 0, 0.15);

// JavaScript tokens
import { shadow } from "@/lib/tokens";

const styles = {
  boxShadow: shadow.sm,   // "0 2px 8px rgba(0,0,0,0.2)"
  boxShadow: shadow.lg,   // "0 8px 32px rgba(0,0,0,0.3)"
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
