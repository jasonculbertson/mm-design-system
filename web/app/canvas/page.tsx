"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { componentRegistry, type ComponentEntry } from "@/lib/components";

interface CanvasItem {
  id: string;
  component: ComponentEntry;
  props: Record<string, any>;
}

type DeviceFrame = "iphone-15-pro" | "iphone-se" | "none";

const deviceFrames: Record<DeviceFrame, { name: string; width: number; height: number; hasNotch: boolean; hasDynamicIsland: boolean }> = {
  "iphone-15-pro": { name: "iPhone 15 Pro", width: 393, height: 852, hasNotch: false, hasDynamicIsland: true },
  "iphone-se": { name: "iPhone SE", width: 375, height: 667, hasNotch: false, hasDynamicIsland: false },
  "none": { name: "No Frame", width: 375, height: 667, hasNotch: false, hasDynamicIsland: false },
};

export default function CanvasPage() {
  const router = useRouter();
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [search, setSearch] = useState("");
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>("iphone-15-pro");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const phoneFrameRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (draggingId && phoneFrameRef.current) {
      const rect = phoneFrameRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      // Check if dropped outside the phone frame
      const isOutside = 
        clientX < rect.left || 
        clientX > rect.right || 
        clientY < rect.top || 
        clientY > rect.bottom;
      
      if (isOutside) {
        removeComponent(draggingId);
      }
    }
    setDraggingId(null);
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
          <div className="flex items-center gap-4">
            <span className="text-body-sm text-[var(--chrome-text-muted)]">
              {canvasItems.length} component{canvasItems.length !== 1 ? "s" : ""}
            </span>
            <select
              value={deviceFrame}
              onChange={(e) => setDeviceFrame(e.target.value as DeviceFrame)}
              className="px-3 py-1.5 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)]"
            >
              {Object.entries(deviceFrames).map(([key, frame]) => (
                <option key={key} value={key}>
                  {frame.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] hover:bg-[var(--color-error-muted)] transition-colors"
              title="Close Canvas"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview / Code */}
        <div className="flex-1 overflow-auto p-6 bg-[var(--chrome-bg-subtle)] flex items-start justify-center">
          {showCode ? (
            <pre className="p-4 rounded-xl bg-[var(--chrome-bg)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] overflow-x-auto max-w-2xl w-full">
              {generateCode() || "// Add components to see generated code"}
            </pre>
          ) : (
            <div className="relative">
              {/* Drag-to-remove hint */}
              {draggingId && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[var(--color-error-default)] text-white text-body-sm whitespace-nowrap z-50">
                  Drag outside to remove
                </div>
              )}
              
              {/* iPhone Frame Wrapper */}
              <div
                ref={phoneFrameRef}
                className="relative"
                style={{
                  background: deviceFrame !== "none" ? "linear-gradient(145deg, #1a1a1a, #2d2d2d)" : "transparent",
                  borderRadius: deviceFrame === "iphone-15-pro" ? 55 : deviceFrame === "iphone-se" ? 44 : 0,
                  padding: deviceFrame !== "none" ? 12 : 0,
                  boxShadow: deviceFrame !== "none" ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset" : "none",
                }}
              >
                {/* Side buttons */}
                {deviceFrame !== "none" && (
                  <>
                    <div className="absolute -left-[3px] top-[120px] w-[3px] h-[30px] bg-[#2d2d2d] rounded-l-sm" />
                    <div className="absolute -left-[3px] top-[170px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-sm" />
                    <div className="absolute -left-[3px] top-[240px] w-[3px] h-[60px] bg-[#2d2d2d] rounded-l-sm" />
                    <div className="absolute -right-[3px] top-[180px] w-[3px] h-[80px] bg-[#2d2d2d] rounded-r-sm" />
                  </>
                )}
              
                {/* Screen Container */}
                <div
                  className="relative bg-[var(--color-background-default)] overflow-hidden flex flex-col"
                  style={{
                    width: deviceFrames[deviceFrame].width,
                    height: deviceFrames[deviceFrame].height,
                    borderRadius: deviceFrame === "iphone-15-pro" ? 47 : deviceFrame === "iphone-se" ? 36 : 0,
                  }}
                >
                  {/* Fixed Status Bar - Always visible */}
                  <div 
                    className="flex-shrink-0 flex items-center justify-between px-6 bg-[var(--color-background-default)]"
                    style={{ 
                      height: deviceFrame === "iphone-15-pro" ? 54 : 24,
                      paddingTop: deviceFrame === "iphone-15-pro" ? 14 : 4,
                    }}
                  >
                    <span className="text-[14px] weight-semibold text-[var(--color-text-default)]">9:41</span>
                    <div className="flex items-center gap-1.5">
                      {/* Signal */}
                      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" className="text-[var(--color-text-default)]">
                        <path d="M1 4.5C1 3.67 1.67 3 2.5 3H3.5C4.33 3 5 3.67 5 4.5V10.5C5 11.33 4.33 12 3.5 12H2.5C1.67 12 1 11.33 1 10.5V4.5Z" opacity="0.3"/>
                        <path d="M6 3C6 2.17 6.67 1.5 7.5 1.5H8.5C9.33 1.5 10 2.17 10 3V10.5C10 11.33 9.33 12 8.5 12H7.5C6.67 12 6 11.33 6 10.5V3Z" opacity="0.6"/>
                        <path d="M11 1.5C11 0.67 11.67 0 12.5 0H13.5C14.33 0 15 0.67 15 1.5V10.5C15 11.33 14.33 12 13.5 12H12.5C11.67 12 11 11.33 11 10.5V1.5Z"/>
                      </svg>
                      {/* WiFi */}
                      <svg width="16" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-[var(--color-text-default)]">
                        <path d="M8.5 2.5C10.5 2.5 12.3 3.3 13.6 4.6L15 3.2C13.3 1.5 11 0.5 8.5 0.5C6 0.5 3.7 1.5 2 3.2L3.4 4.6C4.7 3.3 6.5 2.5 8.5 2.5Z"/>
                        <path d="M5.1 6.4L6.5 7.8C7.1 7.2 7.8 6.9 8.5 6.9C9.2 6.9 9.9 7.2 10.5 7.8L11.9 6.4C10.9 5.4 9.8 4.9 8.5 4.9C7.2 4.9 6.1 5.4 5.1 6.4Z"/>
                        <circle cx="8.5" cy="10.5" r="1.5"/>
                      </svg>
                      {/* Battery */}
                      <div className="flex items-center">
                        <div className="w-[25px] h-[12px] border-2 border-current rounded-[4px] relative text-[var(--color-text-default)]">
                          <div className="absolute inset-[2px] right-[4px] bg-current rounded-[1px]" />
                        </div>
                        <div className="w-[2px] h-[5px] bg-[var(--color-text-default)] rounded-r-sm ml-px" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Island - overlays status bar */}
                  {deviceFrame === "iphone-15-pro" && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
                      <div className="w-[126px] h-[37px] bg-black rounded-[20px]" />
                    </div>
                  )}

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-2">
                      {canvasItems.length === 0 ? (
                        <div className="text-center py-20 text-[var(--color-text-muted)]">
                          <p className="text-body-md mb-2">No components yet</p>
                          <p className="text-body-sm">Click a component from the left to add it</p>
                        </div>
                      ) : (
                        canvasItems.map((item) => {
                          const Component = item.component.component;
                          const isDragging = draggingId === item.id;
                          return (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, item.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelectedItemId(item.id)}
                              className={`relative cursor-grab active:cursor-grabbing transition-all ${
                                selectedItemId === item.id
                                  ? "ring-2 ring-[var(--color-primary-default)] ring-inset"
                                  : ""
                              } ${isDragging ? "opacity-50" : ""}`}
                            >
                              <Component {...item.props} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Home Indicator */}
                  {deviceFrame === "iphone-15-pro" && (
                    <div className="flex-shrink-0 flex justify-center pb-2 pt-1">
                      <div className="w-[134px] h-[5px] bg-[var(--color-text-default)] rounded-full opacity-30" />
                    </div>
                  )}
              </div>
              {/* End Screen Container */}
            </div>
            {/* End Frame Wrapper */}
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

