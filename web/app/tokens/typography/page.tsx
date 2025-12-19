"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// ============================================
// TYPOGRAPHY TOKENS - From official MetaMask design tokens
// https://github.com/MetaMask/metamask-design-system/blob/main/packages/design-tokens/src/css/typography.css
// ============================================

const fontFamilies = [
  { name: "font-family-default", value: "'Geist', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { name: "font-family-accent", value: "'MMSans', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { name: "font-family-hero", value: "'MMPoly', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
];

const fontSizes = [
  { name: "font-size-1", value: "0.625rem", px: "10px" },
  { name: "font-size-2", value: "0.75rem", px: "12px" },
  { name: "font-size-3", value: "0.875rem", px: "14px" },
  { name: "font-size-4", value: "1rem", px: "16px" },
  { name: "font-size-5", value: "1.125rem", px: "18px" },
  { name: "font-size-6", value: "1.5rem", px: "24px" },
  { name: "font-size-7", value: "2rem", px: "32px" },
  { name: "font-size-8", value: "2.5rem", px: "40px" },
  { name: "font-size-9", value: "3rem", px: "48px" },
  { name: "font-size-10", value: "3.75rem", px: "60px" },
];

const lineHeights = [
  { name: "line-height-1", value: "1rem", px: "16px" },
  { name: "line-height-2", value: "1.25rem", px: "20px" },
  { name: "line-height-3", value: "1.375rem", px: "22px" },
  { name: "line-height-4", value: "1.5rem", px: "24px" },
  { name: "line-height-5", value: "2rem", px: "32px" },
  { name: "line-height-6", value: "2.5rem", px: "40px" },
  { name: "line-height-7", value: "3.125rem", px: "50px" },
  { name: "line-height-8", value: "3.5rem", px: "56px" },
  { name: "line-height-9", value: "4.6875rem", px: "75px" },
];

const fontWeights = [
  { name: "font-weight-regular", value: "400" },
  { name: "font-weight-medium", value: "500" },
  { name: "font-weight-bold", value: "700" },
];

const typographyScale = [
  { name: "display-lg", size: "2.5rem", lineHeight: "3.125rem", weight: "700", preview: "Display Large" },
  { name: "display-md", size: "2rem", lineHeight: "2.5rem", weight: "700", preview: "Display Medium" },
  { name: "heading-lg", size: "1.5rem", lineHeight: "2rem", weight: "700", preview: "Heading Large" },
  { name: "heading-md", size: "1.125rem", lineHeight: "1.5rem", weight: "700", preview: "Heading Medium" },
  { name: "heading-sm", size: "1rem", lineHeight: "1.5rem", weight: "700", preview: "Heading Small" },
  { name: "body-lg-medium", size: "1.125rem", lineHeight: "1.5rem", weight: "500", preview: "Body Large Medium" },
  { name: "body-md-bold", size: "1rem", lineHeight: "1.5rem", weight: "700", preview: "Body Medium Bold" },
  { name: "body-md-medium", size: "1rem", lineHeight: "1.5rem", weight: "500", preview: "Body Medium Medium" },
  { name: "body-md", size: "1rem", lineHeight: "1.5rem", weight: "400", preview: "Body Medium Regular" },
  { name: "body-sm-bold", size: "0.875rem", lineHeight: "1.375rem", weight: "700", preview: "Body Small Bold" },
  { name: "body-sm-medium", size: "0.875rem", lineHeight: "1.375rem", weight: "500", preview: "Body Small Medium" },
  { name: "body-sm", size: "0.875rem", lineHeight: "1.375rem", weight: "400", preview: "Body Small Regular" },
  { name: "body-xs-medium", size: "0.75rem", lineHeight: "1.25rem", weight: "500", preview: "Body XS Medium" },
  { name: "body-xs", size: "0.75rem", lineHeight: "1.25rem", weight: "400", preview: "Body XS Regular" },
];

type TabType = "scale" | "sizes" | "weights" | "families";

const tabs = [
  { id: "scale" as TabType, label: "Type Scale", count: typographyScale.length },
  { id: "sizes" as TabType, label: "Font Sizes", count: fontSizes.length },
  { id: "weights" as TabType, label: "Font Weights", count: fontWeights.length },
  { id: "families" as TabType, label: "Font Families", count: fontFamilies.length },
];

export default function TypographyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("scale");
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
          Typography
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          Font families, sizes, weights, and pre-composed type scales.
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

      {/* Type Scale */}
      {activeTab === "scale" && (
        <div className="space-y-3">
          {typographyScale.map((token) => (
            <div
              key={token.name}
              className="flex items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)]"
            >
              <div className="flex-1 min-w-0">
                <div className="text-body-xs text-[var(--chrome-text-muted)] mb-1">
                  {token.name}
                </div>
                <span
                  style={{ 
                    fontSize: token.size, 
                    fontWeight: token.weight,
                    lineHeight: token.lineHeight 
                  }}
                  className="text-[var(--chrome-text)] block truncate"
                >
                  {token.preview}
                </span>
              </div>
              <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded whitespace-nowrap">
                {token.size} / {token.weight}
              </code>
            </div>
          ))}
        </div>
      )}

      {/* Font Sizes */}
      {activeTab === "sizes" && (
        <div className="space-y-3">
          {fontSizes.map((token) => (
            <button
              key={token.name}
              onClick={() => copyToken(token.value, token.name)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-body-sm text-[var(--chrome-text)] weight-medium w-32">
                  {token.name}
                </span>
                <span
                  style={{ fontSize: token.value }}
                  className="text-[var(--chrome-text)]"
                >
                  Aa
                </span>
              </div>
              <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded">
                {token.value} ({token.px})
              </code>
              {copiedToken === token.name && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                  <Check size={20} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Font Weights */}
      {activeTab === "weights" && (
        <div className="space-y-3">
          {fontWeights.map((token) => (
            <button
              key={token.name}
              onClick={() => copyToken(token.value, token.name)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-body-sm text-[var(--chrome-text)] weight-medium w-40">
                  {token.name}
                </span>
                <span
                  style={{ fontWeight: token.value }}
                  className="text-[var(--chrome-text)] text-xl"
                >
                  The quick brown fox
                </span>
              </div>
              <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded">
                {token.value}
              </code>
              {copiedToken === token.name && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                  <Check size={20} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Font Families */}
      {activeTab === "families" && (
        <div className="space-y-3">
          {fontFamilies.map((token) => (
            <button
              key={token.name}
              onClick={() => copyToken(token.value, token.name)}
              className="w-full flex flex-col gap-2 p-4 rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all relative text-left"
            >
              <span className="text-body-sm text-[var(--chrome-text)] weight-medium">
                {token.name}
              </span>
              <span
                style={{ fontFamily: token.value }}
                className="text-[var(--chrome-text)] text-xl"
              >
                The quick brown fox jumps over the lazy dog
              </span>
              <code className="text-body-xs font-mono text-[var(--chrome-text-muted)] bg-[var(--chrome-bg)] px-2 py-1 rounded self-start">
                {token.value}
              </code>
              {copiedToken === token.name && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)] rounded-[var(--radius-lg)]">
                  <Check size={20} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Usage */}
      <div className="space-y-4 pt-8 border-t border-[var(--chrome-border)]">
        <h2 className="text-body-md weight-medium text-[var(--chrome-text)]">Usage</h2>
        <div className="rounded-[var(--radius-lg)] bg-[#1e1e1e] p-4">
          <pre className="text-sm font-mono text-[#d4d4d4] overflow-x-auto">
{`// CSS Variables
font-family: var(--font-family-default);
font-size: var(--font-size-4);
font-weight: var(--font-weight-medium);
line-height: var(--line-height-4);

// Utility Classes
<p className="text-body-md weight-medium">...</p>
<h1 className="text-heading-lg">...</h1>`}
          </pre>
        </div>
      </div>
    </div>
  );
}

