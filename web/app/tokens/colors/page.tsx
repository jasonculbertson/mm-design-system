"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

// ============================================
// COLOR TOKENS - From official MetaMask design tokens
// ============================================

const lightColors = {
  // Neutral / Background
  "background-default": "#ffffff",
  "background-section": "#f5f6f8",
  "background-subsection": "#ffffff",
  "background-muted": "rgba(60,77,157,0.1)",
  // Neutral / Text
  "text-default": "#121314",
  "text-alternative": "#686e7d",
  "text-muted": "#b7bbc8",
  // Neutral / Icon
  "icon-default": "#121314",
  "icon-alternative": "#686e7d",
  "icon-muted": "#b7bbc8",
  "icon-inverse": "#ffffff",
  // Neutral / Border
  "border-default": "#858b9a",
  "border-muted": "rgba(183,187,200,0.4)",
  // Neutral / Overlay
  "overlay-default": "rgba(63,67,74,0.3)",
  // Semantic / Primary
  "primary-default": "#4459ff",
  "primary-muted": "rgba(68,89,255,0.1)",
  "primary-inverse": "#ffffff",
  // Semantic / Error
  "error-default": "#ca3542",
  "error-muted": "rgba(202,53,66,0.1)",
  "error-inverse": "#ffffff",
  // Semantic / Success
  "success-default": "#457a39",
  "success-muted": "rgba(69,122,57,0.1)",
  "success-inverse": "#ffffff",
  // Semantic / Warning
  "warning-default": "#9a6300",
  "warning-muted": "#ffefc6",
  "warning-inverse": "#121314",
  // Semantic / Info
  "info-default": "#4459ff",
  "info-muted": "rgba(68,89,255,0.1)",
  "info-inverse": "#ffffff",
  // Interaction
  "hover-background": "#f5f6f8",
  "hover-primary": "#384df5",
  "pressed-background": "#e8e9eb",
  "pressed-primary": "#2b3eda",
};

const darkColors = {
  // Neutral / Background
  "background-default": "#131416",
  "background-section": "#1c1d1f",
  "background-subsection": "#252628",
  "background-muted": "rgba(255,255,255,0.04)",
  // Neutral / Text
  "text-default": "#ffffff",
  "text-alternative": "#9b9b9b",
  "text-muted": "#48484e",
  // Neutral / Icon
  "icon-default": "#ffffff",
  "icon-alternative": "#9b9b9b",
  "icon-muted": "#48484e",
  "icon-inverse": "#131416",
  // Neutral / Border
  "border-default": "#848c96",
  "border-muted": "rgba(133,139,154,0.2)",
  // Neutral / Overlay
  "overlay-default": "rgba(0,0,0,0.5)",
  // Semantic / Primary
  "primary-default": "#8b99ff",
  "primary-muted": "rgba(139,153,255,0.15)",
  "primary-inverse": "#131416",
  // Semantic / Error
  "error-default": "#ff7584",
  "error-muted": "rgba(255,117,132,0.15)",
  "error-inverse": "#131416",
  // Semantic / Success
  "success-default": "#baf24a",
  "success-muted": "rgba(186,242,74,0.15)",
  "success-inverse": "#131416",
  // Semantic / Warning
  "warning-default": "#f0b034",
  "warning-muted": "rgba(240,176,52,0.15)",
  "warning-inverse": "#131416",
  // Semantic / Info
  "info-default": "#8b99ff",
  "info-muted": "rgba(139,153,255,0.15)",
  "info-inverse": "#131416",
  // Interaction
  "hover-background": "rgba(255,255,255,0.08)",
  "hover-primary": "#a3aeff",
  "pressed-background": "rgba(255,255,255,0.16)",
  "pressed-primary": "#bbc4ff",
};

// Helper to count colors by category
const countColorsByCategory = (colors: Record<string, string>, prefix: string) => {
  if (prefix === "all") return Object.keys(colors).length;
  return Object.keys(colors).filter(name => name.startsWith(prefix)).length;
};

const colorCategories = [
  { id: "all", label: "All" },
  { id: "background", label: "Background" },
  { id: "text", label: "Text" },
  { id: "icon", label: "Icon" },
  { id: "border", label: "Border" },
  { id: "primary", label: "Primary" },
  { id: "error", label: "Error" },
  { id: "success", label: "Success" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
  { id: "hover", label: "Hover" },
  { id: "pressed", label: "Pressed" },
];

export default function ColorsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const colors = isDark ? darkColors : lightColors;

  const filteredColors = Object.entries(colors).filter(([name]) => {
    if (selectedCategory === "all") return true;
    return name.startsWith(selectedCategory);
  });

  const copyToken = async (name: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="animate-in fade-in space-y-8 pb-24 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
          Colors
        </h1>
        <p className="text-body-md text-[var(--chrome-text-muted)]">
          Semantic color tokens for backgrounds, text, borders, and status states.
        </p>
      </div>

      {/* Tabs - horizontally scrollable */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-1 p-1 bg-[var(--chrome-bg-subtle)] rounded-[var(--radius-lg)] w-max">
          {colorCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-body-sm rounded-[var(--radius-md)] transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                  : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
              }`}
            >
              {cat.label}
              <span className="ml-2 text-body-xs opacity-60">{countColorsByCategory(colors, cat.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredColors.map(([name, hex]) => (
          <button
            key={name}
            onClick={() => copyToken(name, hex)}
            className="group relative flex flex-col rounded-[var(--radius-lg)] bg-[var(--chrome-bg-subtle)] overflow-hidden hover:ring-2 hover:ring-[var(--color-primary-default)] transition-all"
          >
            {/* Color swatch */}
            <div 
              className="h-16 w-full"
              style={{ backgroundColor: hex }}
            />
            
            {/* Info */}
            <div className="p-3 text-left">
              <div className="text-body-xs weight-medium text-[var(--chrome-text)] truncate">
                {name}
              </div>
              <div className="text-body-xs text-[var(--chrome-text-muted)] font-mono">
                {hex}
              </div>
            </div>

            {/* Copy indicator */}
            {copiedToken === name && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-success-default)]">
                <Check size={24} className="text-white" />
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
{`// CSS Variables
background: var(--color-background-default);
color: var(--color-text-default);
border-color: var(--color-border-muted);

// JavaScript tokens
import { colors } from "@/lib/tokens";
const bg = colors.dark.background.default;`}
          </pre>
        </div>
      </div>
    </div>
  );
}
