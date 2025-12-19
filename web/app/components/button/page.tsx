"use client";

import { useState, useMemo } from "react";
import { BaseButton, Button } from "@/lib/components";
import { Copy, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

type ComponentTab = "button" | "buttonBase";

// Props definitions for each component type
const buttonProps = [
  { name: "label", type: "string", default: "Button", description: "Button label" },
  { name: "variant", type: "select", default: "primary", options: ["primary", "secondary", "tertiary", "danger"], description: "Button style" },
  { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "Button size" },
  { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
  { name: "loading", type: "boolean", default: false, description: "Loading state" },
  { name: "fullWidth", type: "boolean", default: false, description: "Full width" },
  { name: "icon", type: "select", default: "", options: ["", "add", "send", "close", "settings", "check", "arrow-right"], description: "Icon" },
];

const buttonBaseProps = [
  { name: "label", type: "string", default: "Action", description: "Button label" },
  { name: "variant", type: "select", default: "default", options: ["default", "primary", "danger", "subtle", "outline"], description: "Button style" },
  { name: "size", type: "select", default: "lg", options: ["sm", "md", "lg"], description: "Button size" },
  { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
  { name: "fullWidth", type: "boolean", default: false, description: "Full width" },
];

const buttonVariants = [
  { name: "Primary", description: "Main call-to-action", props: { variant: "primary" } },
  { name: "Secondary", description: "Secondary actions", props: { variant: "secondary" } },
  { name: "Tertiary", description: "Low emphasis actions", props: { variant: "tertiary" } },
  { name: "Danger", description: "Destructive actions", props: { variant: "danger" } },
  { name: "With Icon", description: "Button with leading icon", props: { variant: "primary", icon: "add" } },
  { name: "Loading", description: "Loading state", props: { variant: "primary", loading: true } },
];

const buttonBaseVariants = [
  { name: "Default", description: "bg-background-section, standard button", props: { variant: "default" } },
  { name: "Primary", description: "Solid primary color", props: { variant: "primary" } },
  { name: "Danger", description: "Destructive actions", props: { variant: "danger" } },
  { name: "Subtle", description: "Low emphasis background", props: { variant: "subtle" } },
  { name: "Outline", description: "Border only, transparent bg", props: { variant: "outline" } },
];

export default function ButtonPage() {
  const [componentTab, setComponentTab] = useState<ComponentTab>("button");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Props state for Button
  const [buttonState, setButtonState] = useState({
    label: "Button",
    variant: "primary" as "primary" | "secondary" | "tertiary" | "danger",
    size: "md" as "sm" | "md" | "lg",
    disabled: false,
    loading: false,
    fullWidth: false,
    icon: "" as "" | "add" | "send" | "close" | "settings" | "check" | "arrow-right",
  });

  // Props state for ButtonBase
  const [buttonBaseState, setButtonBaseState] = useState({
    label: "Action",
    variant: "default" as "default" | "primary" | "danger" | "subtle" | "outline",
    size: "lg" as "sm" | "md" | "lg",
    disabled: false,
    fullWidth: false,
  });

  const currentProps = componentTab === "button" ? buttonState : buttonBaseState;
  const currentPropsDef = componentTab === "button" ? buttonProps : buttonBaseProps;
  const currentVariants = componentTab === "button" ? buttonVariants : buttonBaseVariants;
  const componentName = componentTab === "button" ? "Button" : "BaseButton";
  const defaultProps = componentTab === "button" 
    ? { label: "Button", variant: "primary", size: "md", disabled: false, loading: false, fullWidth: false, icon: "" }
    : { label: "Action", variant: "default", size: "lg", disabled: false, fullWidth: false };

  const updateProp = (name: string, value: any) => {
    if (componentTab === "button") {
      setButtonState((prev) => ({ ...prev, [name]: value }));
    } else {
      setButtonBaseState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetProps = () => {
    if (componentTab === "button") {
      setButtonState({
        label: "Button",
        variant: "primary",
        size: "md",
        disabled: false,
        loading: false,
        fullWidth: false,
        icon: "",
      });
    } else {
      setButtonBaseState({
        label: "Action",
        variant: "default",
        size: "lg",
        disabled: false,
        fullWidth: false,
      });
    }
  };

  const codeString = useMemo(() => {
    const propsString = Object.entries(currentProps)
      .filter(([key, value]) => {
        const def = defaultProps[key as keyof typeof defaultProps];
        return value !== def && value !== "";
      })
      .map(([key, value]) => {
        if (typeof value === "string") return `  ${key}="${value}"`;
        if (typeof value === "boolean") return value ? `  ${key}` : null;
        if (typeof value === "number") return `  ${key}={${value}}`;
        return `  ${key}={${JSON.stringify(value)}}`;
      })
      .filter(Boolean)
      .join("\n");

    if (propsString) {
      return `<${componentName}\n${propsString}\n/>`;
    }
    return `<${componentName} />`;
  }, [currentProps, componentName, defaultProps]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="lg:pr-64">
      {/* Main Content */}
      <div className="flex-1 min-w-0 animate-in fade-in space-y-10 pb-24 duration-500 max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
            Button
          </h1>
          <p className="text-body-md text-[var(--chrome-text-muted)]">
            Action buttons for user interactions. Button includes icons and loading states, ButtonBase is the minimal implementation.
          </p>
        </div>

        {/* Component Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--chrome-bg-subtle)] rounded-[var(--radius-lg)] w-fit">
          <button
            onClick={() => setComponentTab("button")}
            className={`px-4 py-2 text-body-sm rounded-[var(--radius-md)] transition-all ${
              componentTab === "button"
                ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
            }`}
          >
            Button
          </button>
          <button
            onClick={() => setComponentTab("buttonBase")}
            className={`px-4 py-2 text-body-sm rounded-[var(--radius-md)] transition-all ${
              componentTab === "buttonBase"
                ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
            }`}
          >
            ButtonBase
          </button>
        </div>

        {/* Preview/Code Section */}
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--chrome-bg-subtle)]">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 text-body-xs weight-medium rounded-md transition-colors ${
                  activeTab === "preview"
                    ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                    : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1.5 text-body-xs weight-medium rounded-md transition-colors ${
                  activeTab === "code"
                    ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                    : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
                }`}
              >
                Code
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--chrome-bg-subtle)]">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`px-3 py-1.5 text-body-xs weight-medium rounded-md transition-colors ${
                  theme === "light"
                    ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                    : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`px-3 py-1.5 text-body-xs weight-medium rounded-md transition-colors ${
                  theme === "dark"
                    ? "bg-[var(--chrome-bg)] text-[var(--chrome-text)] shadow-sm"
                    : "text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {activeTab === "preview" ? (
            <div className="rounded-xl bg-[var(--color-background-default)] p-10 flex items-center justify-center min-h-[280px] border border-[var(--chrome-border)]">
              {componentTab === "button" ? (
                <Button
                  label={buttonState.label}
                  variant={buttonState.variant}
                  size={buttonState.size}
                  disabled={buttonState.disabled}
                  loading={buttonState.loading}
                  fullWidth={buttonState.fullWidth}
                  icon={buttonState.icon || undefined}
                />
              ) : (
                <BaseButton
                  label={buttonBaseState.label}
                  variant={buttonBaseState.variant}
                  size={buttonBaseState.size}
                  disabled={buttonBaseState.disabled}
                  fullWidth={buttonBaseState.fullWidth}
                />
              )}
            </div>
          ) : (
            <div className="rounded-xl bg-[#0d0d0d] p-5 relative min-h-[280px] border border-[var(--chrome-border)]">
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <Check size={16} className="text-green-400" />
                ) : (
                  <Copy size={16} className="text-white/40" />
                )}
              </button>
              <pre className="text-sm font-mono text-white/80 overflow-x-auto">
                {codeString}
              </pre>
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="space-y-6">
          <h2 className="text-body-md text-[var(--chrome-text)] weight-medium">
            Variants
          </h2>
          <div className="space-y-6">
            {currentVariants.map((variant) => (
              <div key={variant.name} className="space-y-3">
                <div>
                  <h3 className="text-body-sm text-[var(--chrome-text)] weight-medium">
                    {variant.name}
                  </h3>
                  <p className="text-body-sm text-[var(--chrome-text-muted)]">
                    {variant.description}
                  </p>
                </div>
                <div className="rounded-xl bg-[var(--color-background-default)] p-8 flex items-center justify-center border border-[var(--chrome-border)]">
                  {componentTab === "button" ? (
                    <Button
                      label={buttonState.label}
                      {...(variant.props as any)}
                    />
                  ) : (
                    <BaseButton
                      label={buttonBaseState.label}
                      {...(variant.props as any)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-6">
          <h2 className="text-body-md text-[var(--chrome-text)] weight-medium">
            Sizes
          </h2>
          <div className="space-y-3">
            <div className="rounded-xl bg-[var(--color-background-default)] p-8 flex items-end justify-center gap-4 border border-[var(--chrome-border)]">
              {["sm", "md", "lg"].map((size) => (
                <div key={size} className="text-center space-y-2">
                  {componentTab === "button" ? (
                    <Button label="Button" variant="primary" size={size as "sm" | "md" | "lg"} />
                  ) : (
                    <BaseButton label="Action" variant="default" size={size as "sm" | "md" | "lg"} />
                  )}
                  <div className="text-body-xs text-[var(--chrome-text-muted)]">
                    {size} ({size === "sm" ? "32px" : size === "md" ? "40px" : "48px"})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Props */}
      <div className="hidden lg:flex flex-col fixed top-0 right-0 w-64 h-screen border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--chrome-border)]">
          <h3 className="text-body-xs weight-medium text-[var(--chrome-text-muted)] uppercase tracking-wide">
            Props
          </h3>
          <button
            onClick={resetProps}
            className="text-body-xs text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Props List */}
        <div className="flex-1 overflow-y-auto px-4">
          {currentPropsDef.map((prop) => (
            <PropControl
              key={prop.name}
              prop={prop}
              value={currentProps[prop.name as keyof typeof currentProps]}
              onChange={(value) => updateProp(prop.name, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PropControl({
  prop,
  value,
  onChange,
}: {
  prop: {
    name: string;
    type: string;
    default: any;
    options?: string[];
    description: string;
  };
  value: any;
  onChange: (value: any) => void;
}) {
  return (
    <div className="py-3 border-b border-[var(--chrome-border)] last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <label className="text-body-xs text-[var(--chrome-text-muted)]">
          {prop.name}
        </label>

        {prop.type === "string" && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-36 px-2 py-1 text-body-xs rounded-md bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] border-0 focus:outline-none focus:ring-1 focus:ring-[var(--chrome-accent)]"
          />
        )}

        {prop.type === "number" && (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-20 px-2 py-1 text-body-xs rounded-md bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] border-0 focus:outline-none focus:ring-1 focus:ring-[var(--chrome-accent)]"
          />
        )}

        {prop.type === "boolean" && (
          <button
            onClick={() => onChange(!value)}
            className={`relative w-9 h-5 rounded-full transition-colors ${
              value ? "bg-[var(--color-primary-default)]" : "bg-[var(--chrome-bg-subtle)]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                value ? "left-4" : "left-0.5"
              }`}
            />
          </button>
        )}

        {prop.type === "select" && prop.options && (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-36 px-2 py-1 text-body-xs rounded-md bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] border-0 focus:outline-none focus:ring-1 focus:ring-[var(--chrome-accent)] cursor-pointer"
          >
            {prop.options.map((option) => (
              <option key={option} value={option}>
                {option || "(none)"}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
