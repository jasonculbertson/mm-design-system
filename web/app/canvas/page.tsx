"use client";

import { useState } from "react";
import { componentRegistry, type ComponentEntry } from "@/lib/components";

interface CanvasItem {
  id: string;
  component: ComponentEntry;
  props: Record<string, any>;
}

export default function CanvasPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [search, setSearch] = useState("");

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId);

  const addComponent = (component: ComponentEntry) => {
    const newItem: CanvasItem = {
      id: `${component.slug}-${Date.now()}`,
      component,
      props: { ...component.defaultProps },
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  const removeComponent = (id: string) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  const updateProp = (id: string, key: string, value: any) => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, props: { ...item.props, [key]: value } } : item
      )
    );
  };

  const generateCode = () => {
    return canvasItems
      .map((item) => {
        const props = Object.entries(item.props)
          .filter(([_, value]) => value !== undefined && value !== "")
          .map(([key, value]) => {
            if (typeof value === "string") return `${key}="${value}"`;
            if (typeof value === "boolean") return value ? key : `${key}={false}`;
            return `${key}={${JSON.stringify(value)}}`;
          })
          .join(" ");
        return `<${item.component.name}${props ? " " + props : ""} />`;
      })
      .join("\n");
  };

  const filteredComponents = componentRegistry.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
      {/* Component Palette */}
      <div className="w-64 border-r border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
        <div className="p-4 border-b border-[var(--chrome-border)]">
          <h2 className="text-body-md weight-semibold text-[var(--chrome-text)] mb-3">Components</h2>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] placeholder:text-[var(--chrome-text-muted)]"
          />
        </div>
        <div className="p-2">
          {filteredComponents.map((component) => (
            <button
              key={component.slug}
              onClick={() => addComponent(component)}
              className="w-full text-left px-3 py-2 rounded-lg text-body-sm text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)] transition-colors"
            >
              {component.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)]">
          <span className="text-body-sm text-[var(--chrome-text-muted)]">
            {canvasItems.length} component{canvasItems.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className={`px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                showCode
                  ? "bg-[var(--color-primary-default)] text-white"
                  : "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"
              }`}
            >
              {showCode ? "Preview" : "Code"}
            </button>
          </div>
        </div>

        {/* Preview / Code */}
        <div className="flex-1 overflow-auto p-6 bg-[var(--color-background-default)]">
          {showCode ? (
            <pre className="p-4 rounded-xl bg-[var(--chrome-bg)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] overflow-x-auto">
              {generateCode() || "// Add components to see generated code"}
            </pre>
          ) : (
            <div className="max-w-[375px] mx-auto space-y-4">
              {canvasItems.length === 0 ? (
                <div className="text-center py-20 text-[var(--chrome-text-muted)]">
                  <p className="text-body-md mb-2">No components yet</p>
                  <p className="text-body-sm">Click a component from the left to add it</p>
                </div>
              ) : (
                canvasItems.map((item) => {
                  const Component = item.component.component;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`relative cursor-pointer rounded-lg transition-all ${
                        selectedItemId === item.id
                          ? "ring-2 ring-[var(--color-primary-default)]"
                          : "hover:ring-1 hover:ring-[var(--chrome-border)]"
                      }`}
                    >
                      <Component {...item.props} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComponent(item.id);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-error-default)] text-white text-body-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Props Panel */}
      {selectedItem && (
        <div className="w-72 border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
          <div className="p-4 border-b border-[var(--chrome-border)]">
            <h3 className="text-body-md weight-semibold text-[var(--chrome-text)]">
              {selectedItem.component.name}
            </h3>
            <p className="text-body-xs text-[var(--chrome-text-muted)] mt-1">
              {selectedItem.component.description}
            </p>
          </div>
          <div className="p-4 space-y-4">
            {selectedItem.component.props.map((prop) => (
              <div key={prop.name}>
                <label className="block text-body-sm weight-medium text-[var(--chrome-text)] mb-1">
                  {prop.name}
                </label>
                {prop.type === "boolean" ? (
                  <button
                    onClick={() =>
                      updateProp(selectedItem.id, prop.name, !selectedItem.props[prop.name])
                    }
                    className={`w-full px-3 py-2 rounded-lg text-body-sm text-left transition-colors ${
                      selectedItem.props[prop.name]
                        ? "bg-[var(--color-primary-default)] text-white"
                        : "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)]"
                    }`}
                  >
                    {selectedItem.props[prop.name] ? "true" : "false"}
                  </button>
                ) : prop.options ? (
                  <select
                    value={selectedItem.props[prop.name] || ""}
                    onChange={(e) => updateProp(selectedItem.id, prop.name, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
                  >
                    {prop.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={prop.type === "number" ? "number" : "text"}
                    value={selectedItem.props[prop.name] || ""}
                    onChange={(e) =>
                      updateProp(
                        selectedItem.id,
                        prop.name,
                        prop.type === "number" ? Number(e.target.value) : e.target.value
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
                  />
                )}
                <p className="text-body-xs text-[var(--chrome-text-muted)] mt-1">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

