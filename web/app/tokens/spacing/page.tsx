"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// ============================================
// SPACING TOKENS - 4px base unit scale
// ============================================

const spacingTokens = [
  { name: "0", value: "0px", multiplier: 0 },
  { name: "0.5", value: "2px", multiplier: 0.5 },
  { name: "1", value: "4px", multiplier: 1 },
  { name: "1.5", value: "6px", multiplier: 1.5 },
  { name: "2", value: "8px", multiplier: 2 },
  { name: "2.5", value: "10px", multiplier: 2.5 },
  { name: "3", value: "12px", multiplier: 3 },
  { name: "3.5", value: "14px", multiplier: 3.5 },
  { name: "4", value: "16px", multiplier: 4 },
  { name: "5", value: "20px", multiplier: 5 },
  { name: "6", value: "24px", multiplier: 6 },
  { name: "7", value: "28px", multiplier: 7 },
  { name: "8", value: "32px", multiplier: 8 },
  { name: "9", value: "36px", multiplier: 9 },
  { name: "10", value: "40px", multiplier: 10 },
  { name: "11", value: "44px", multiplier: 11 },
  { name: "12", value: "48px", multiplier: 12 },
  { name: "14", value: "56px", multiplier: 14 },
  { name: "16", value: "64px", multiplier: 16 },
  { name: "20", value: "80px", multiplier: 20 },
  { name: "24", value: "96px", multiplier: 24 },
];

export default function SpacingPage() {
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
          Spacing
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          Consistent spacing scale based on a 4px base unit. Use for padding, margins, and gaps.
        </p>
      </div>

      {/* Base Unit Info */}
      <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--color-primary-muted)] border border-[var(--color-primary-default)]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-[var(--color-primary-default)] rounded-sm" />
          <span className="text-body-sm text-[var(--chrome-text)]">
            Base unit: <strong>4px</strong> — All spacing values are multiples of this base.
          </span>
        </div>
      </div>

      {/* Spacing Scale */}
      <div className="space-y-3">
        {spacingTokens.map((token) => (
          <button
            key={token.name}
            onClick={() => copyToken(token.value, token.name)}
            className="w-full flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative"
          >
            {/* Visual bar */}
            <div
              className="bg-[var(--color-primary-default)] rounded-sm flex-shrink-0 h-6"
              style={{ width: token.value, minWidth: token.value === "0px" ? "2px" : undefined }}
            />
            
            {/* Name */}
            <span className="text-body-sm text-[var(--chrome-text)] weight-medium w-20">
              spacing-{token.name}
            </span>
            
            {/* Multiplier */}
            <span className="text-body-xs text-[var(--chrome-text-muted)] w-16">
              {token.multiplier}×
            </span>
            
            {/* Value */}
            <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded ml-auto">
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

      {/* Usage */}
      <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
        <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
          <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`// JavaScript tokens
import { spacing } from "@/lib/tokens";

const styles = {
  padding: spacing[4],      // 16px
  gap: spacing[2],          // 8px
  marginTop: spacing[6],    // 24px
};

// Tailwind-style usage
<div className="p-4 gap-2 mt-6">...</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}





