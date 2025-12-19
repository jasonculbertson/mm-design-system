"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// ============================================
// BORDER RADIUS TOKENS
// ============================================

const radiusTokens = [
  { name: "none", value: "0px", description: "Square corners" },
  { name: "xs", value: "2px", description: "Extra small" },
  { name: "sm", value: "4px", description: "Small - checkboxes, chips" },
  { name: "md", value: "6px", description: "Medium - default" },
  { name: "lg", value: "8px", description: "Large - buttons (sm), toast actions" },
  { name: "xl", value: "12px", description: "Extra large - buttons (md/lg), cards" },
  { name: "2xl", value: "16px", description: "2X large - toast mini" },
  { name: "3xl", value: "20px", description: "3X large - toast full" },
  { name: "full", value: "9999px", description: "Fully rounded - pills, avatars" },
];

export default function RadiusPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToken = async (value: string, name: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="animate-in fade-in space-y-8 pb-24 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
          Border Radius
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          Consistent corner rounding for cards, buttons, inputs, and other UI elements.
        </p>
      </div>

      {/* Radius Scale */}
      <div className="space-y-3">
        {radiusTokens.map((token) => (
          <button
            key={token.name}
            onClick={() => copyToken(token.value, token.name)}
            className="w-full flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative"
          >
            {/* Visual square */}
            <div
              className="w-12 h-12 bg-[var(--color-primary-default)] flex-shrink-0"
              style={{ borderRadius: token.value }}
            />
            
            {/* Name */}
            <div className="flex-1 text-left">
              <span className="text-body-sm text-[var(--chrome-text)] weight-medium block">
                radius-{token.name}
              </span>
              <span className="text-body-xs text-[var(--chrome-text-muted)]">
                {token.description}
              </span>
            </div>
            
            {/* Value */}
            <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded">
              {token.value}
            </code>

            {/* Copy indicator */}
            {copiedToken === token.name && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                <Check size={20} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Visual Comparison */}
      <div className="space-y-4">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Visual Comparison</h2>
        <div className="flex flex-wrap gap-4 p-6 rounded-[var(--radius-xl)] bg-[var(--chrome-bg-subtle)]">
          {radiusTokens.slice(0, -1).map((token) => (
            <div key={token.name} className="text-center">
              <div
                className="w-16 h-16 bg-[var(--color-primary-default)] mb-2"
                style={{ borderRadius: token.value }}
              />
              <span className="text-body-xs text-[var(--chrome-text-muted)]">{token.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
        <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
          <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`// CSS Variables
border-radius: var(--radius-lg);
border-radius: var(--radius-xl);

// JavaScript tokens
import { radius } from "@/lib/tokens";

const styles = {
  borderRadius: radius.lg,   // 8px
  borderRadius: radius.xl,   // 12px
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}



