"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { getComponentBySlug } from "@/lib/components";
import { Copy, Check, RotateCcw } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ComponentPage() {
  const params = useParams();
  const slug = params.slug as string;
  const component = getComponentBySlug(slug);

  if (!component) {
    return (
      <div className="animate-in fade-in space-y-12 pb-24 duration-500">
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)]">
            Component not found
          </h1>
          <p className="text-body-md text-[var(--chrome-text-muted)] mt-2">
            The component &ldquo;{slug}&rdquo; doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return <ComponentPlayground component={component} />;
}

function ComponentPlayground({
  component,
}: {
  component: NonNullable<ReturnType<typeof getComponentBySlug>>;
}) {
  const [currentProps, setCurrentProps] = useState(component.defaultProps);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const Component = component.component;

  const codeString = useMemo(() => {
    const componentName = component.name.replace(/\s/g, "");
    const propsString = Object.entries(currentProps)
      .filter(([key, value]) => value !== component.defaultProps[key])
      .map(([key, value]) => {
        if (typeof value === "string") return `  ${key}="${value}"`;
        if (typeof value === "boolean") return value ? `  ${key}` : `  ${key}={false}`;
        if (typeof value === "number") return `  ${key}={${value}}`;
        return `  ${key}={${JSON.stringify(value)}}`;
      })
      .join("\n");

    if (propsString) {
      return `<${componentName}\n${propsString}\n/>`;
    }
    return `<${componentName} />`;
  }, [currentProps, component]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateProp = (name: string, value: any) => {
    setCurrentProps((prev) => ({ ...prev, [name]: value }));
  };

  const resetProps = () => {
    setCurrentProps(component.defaultProps);
  };

  const hasProps = component.props.length > 0;

  return (
    <div className={hasProps ? "lg:pr-64" : ""}>
      {/* Main Content */}
      <div className="flex-1 min-w-0 animate-in fade-in space-y-10 pb-24 duration-500 max-w-2xl mx-auto">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-heading-lg weight-medium text-[var(--chrome-text)] tracking-tight">
            {component.name}
          </h1>
          <p className="text-body-md text-[var(--chrome-text-muted)]">
            {component.description}
          </p>
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
              <Component {...currentProps} />
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
        {component.variants.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-body-md text-[var(--chrome-text)] weight-medium">
              Variants
            </h2>
            <div className="space-y-6">
              {component.variants.map((variant) => (
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
                    <Component {...component.defaultProps} {...variant.props} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Props */}
      {component.props.length > 0 && (
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
            {component.props.map((prop) => (
              <PropControl
                key={prop.name}
                prop={prop}
                value={currentProps[prop.name]}
                onChange={(value) => updateProp(prop.name, value)}
              />
            ))}
          </div>
        </div>
      )}
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
      {/* Row: Label + Control */}
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
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
