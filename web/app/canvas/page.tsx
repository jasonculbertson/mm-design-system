"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Undo2, Redo2, Copy, Smartphone, Monitor, Save, FolderOpen, Trash2, Plus, ChevronDown, ChevronRight, Search, Layers, Settings, Download } from "lucide-react";
import { componentRegistry, type ComponentEntry } from "@/lib/components";

// Types
interface CanvasItem {
  id: string;
  component: ComponentEntry;
  props: Record<string, any>;
}

interface HistoryState {
  items: CanvasItem[];
  selectedId: string | null;
}

interface SavedComposition {
  id: string;
  name: string;
  items: CanvasItem[];
  deviceFrame: DeviceFrame;
  createdAt: number;
}

type DeviceFrame = "iphone-15-pro" | "iphone-14" | "iphone-se" | "pixel-8" | "none";

// Device configurations
const deviceFrames: Record<DeviceFrame, { name: string; width: number; height: number; radius: number; frameRadius: number; hasIsland: boolean }> = {
  "iphone-15-pro": { name: "iPhone 15 Pro", width: 393, height: 852, radius: 47, frameRadius: 55, hasIsland: true },
  "iphone-14": { name: "iPhone 14", width: 390, height: 844, radius: 47, frameRadius: 55, hasIsland: true },
  "iphone-se": { name: "iPhone SE", width: 375, height: 667, radius: 0, frameRadius: 44, hasIsland: false },
  "pixel-8": { name: "Pixel 8", width: 412, height: 915, radius: 32, frameRadius: 40, hasIsland: false },
  "none": { name: "No Frame", width: 375, height: 812, radius: 0, frameRadius: 0, hasIsland: false },
};

// Component categories
const componentCategories: { name: string; slugs: string[] }[] = [
  { name: "Navigation", slugs: ["page-header", "footer-nav", "tabs"] },
  { name: "Headers", slugs: ["hub-header", "section-header", "tab-header"] },
  { name: "Content", slugs: ["token-cell", "token-list", "transaction-cell", "list-item", "nft-card"] },
  { name: "Actions", slugs: ["button", "chip", "segmented-control"] },
  { name: "Feedback", slugs: ["banner", "toast", "empty-state", "skeleton"] },
  { name: "Inputs", slugs: ["input", "search", "text-area", "checkbox", "switch", "slider"] },
  { name: "Data Display", slugs: ["badge", "avatar", "progress-bar", "status-indicator"] },
  { name: "Overlays", slugs: ["dialog", "bottom-sheet", "tooltip"] },
];

export default function CanvasPage() {
  const router = useRouter();
  
  // Core state
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>("iphone-15-pro");
  
  // UI state
  const [showCode, setShowCode] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Navigation", "Headers", "Content"]);
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [savedCompositions, setSavedCompositions] = useState<SavedComposition[]>([]);
  
  // Drag state
  const [draggedComponent, setDraggedComponent] = useState<ComponentEntry | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([{ items: [], selectedId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Refs
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load saved compositions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("canvas-compositions");
    if (saved) {
      try {
        setSavedCompositions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved compositions");
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          redo();
        } else if (e.key === "s") {
          e.preventDefault();
          handleSave();
        } else if (e.key === "c" && selectedItemId) {
          e.preventDefault();
          copyComponentCode();
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedItemId && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          removeComponent(selectedItemId);
        }
      } else if (e.key === "Escape") {
        setSelectedItemId(null);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, historyIndex, history]);

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId);

  // History management
  const pushHistory = useCallback((items: CanvasItem[], selectedId: string | null) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ items: JSON.parse(JSON.stringify(items)), selectedId });
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setCanvasItems(state.items);
      setSelectedItemId(state.selectedId);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      setCanvasItems(state.items);
      setSelectedItemId(state.selectedId);
    }
  }, [historyIndex, history]);

  // Component management
  const addComponent = useCallback((component: ComponentEntry, index?: number) => {
    const newItem: CanvasItem = {
      id: `${component.slug}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      component,
      props: { ...component.defaultProps },
    };
    
    setCanvasItems(prev => {
      const newItems = [...prev];
      if (index !== undefined) {
        newItems.splice(index, 0, newItem);
      } else {
        newItems.push(newItem);
      }
      pushHistory(newItems, newItem.id);
      return newItems;
    });
    setSelectedItemId(newItem.id);
  }, [pushHistory]);

  const removeComponent = useCallback((id: string) => {
    setCanvasItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      pushHistory(newItems, null);
      return newItems;
    });
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  }, [selectedItemId, pushHistory]);

  const moveComponent = useCallback((fromIndex: number, toIndex: number) => {
    setCanvasItems(prev => {
      const newItems = [...prev];
      const [moved] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, moved);
      pushHistory(newItems, moved.id);
      return newItems;
    });
  }, [pushHistory]);

  const updateProp = useCallback((id: string, key: string, value: any) => {
    setCanvasItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, props: { ...item.props, [key]: value } } : item
      );
      return newItems;
    });
  }, []);

  const duplicateComponent = useCallback((id: string) => {
    const item = canvasItems.find(i => i.id === id);
    if (item) {
      const index = canvasItems.findIndex(i => i.id === id);
      addComponent(item.component, index + 1);
    }
  }, [canvasItems, addComponent]);

  // Drag handlers for palette
  const handlePaletteDragStart = (e: React.DragEvent, component: ComponentEntry) => {
    setDraggedComponent(component);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "new", slug: component.slug }));
  };

  const handlePaletteDragEnd = () => {
    setDraggedComponent(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  // Drag handlers for canvas items
  const handleItemDragStart = (e: React.DragEvent, id: string, index: number) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/json", JSON.stringify({ type: "reorder", id, index }));
  };

  const handleItemDragEnd = (e: React.DragEvent) => {
    if (draggedItemId && phoneFrameRef.current) {
      const rect = phoneFrameRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      
      const isOutside = 
        clientX < rect.left - 50 || 
        clientX > rect.right + 50 || 
        clientY < rect.top - 50 || 
        clientY > rect.bottom + 50;
      
      if (isOutside) {
        removeComponent(draggedItemId);
      }
    }
    setDraggedItemId(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  // Drop zone handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedComponent ? "copy" : "move";
    setIsDraggingOver(true);
    
    // Calculate drop index based on mouse position
    if (contentRef.current) {
      const children = Array.from(contentRef.current.children);
      const mouseY = e.clientY;
      
      let newDropIndex = children.length;
      for (let i = 0; i < children.length; i++) {
        const rect = children[i].getBoundingClientRect();
        if (mouseY < rect.top + rect.height / 2) {
          newDropIndex = i;
          break;
        }
      }
      setDropIndex(newDropIndex);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
      setDropIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      
      if (data.type === "new" && draggedComponent) {
        addComponent(draggedComponent, dropIndex ?? undefined);
      } else if (data.type === "reorder" && draggedItemId) {
        const fromIndex = canvasItems.findIndex(item => item.id === draggedItemId);
        const toIndex = dropIndex ?? canvasItems.length;
        if (fromIndex !== -1 && fromIndex !== toIndex) {
          moveComponent(fromIndex, toIndex > fromIndex ? toIndex - 1 : toIndex);
        }
      }
    } catch (err) {
      console.error("Drop error:", err);
    }
    
    setDraggedComponent(null);
    setDraggedItemId(null);
    setDropIndex(null);
    setIsDraggingOver(false);
  };

  // Save/Load
  const handleSave = () => {
    const name = prompt("Enter composition name:", `Screen ${savedCompositions.length + 1}`);
    if (name) {
      const composition: SavedComposition = {
        id: Date.now().toString(),
        name,
        items: JSON.parse(JSON.stringify(canvasItems)),
        deviceFrame,
        createdAt: Date.now(),
      };
      const newSaved = [...savedCompositions, composition];
      setSavedCompositions(newSaved);
      localStorage.setItem("canvas-compositions", JSON.stringify(newSaved));
    }
  };

  const handleLoad = (composition: SavedComposition) => {
    // Reconstruct items with actual component references
    const items = composition.items.map(item => ({
      ...item,
      component: componentRegistry.find(c => c.slug === item.component.slug) || item.component,
    }));
    setCanvasItems(items);
    setDeviceFrame(composition.deviceFrame);
    pushHistory(items, null);
    setShowSavedPanel(false);
  };

  const handleDeleteSaved = (id: string) => {
    const newSaved = savedCompositions.filter(c => c.id !== id);
    setSavedCompositions(newSaved);
    localStorage.setItem("canvas-compositions", JSON.stringify(newSaved));
  };

  // Code generation
  const generateCode = () => {
    return canvasItems
      .map((item) => {
        const props = Object.entries(item.props)
          .filter(([, value]) => value !== undefined && value !== "")
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

  const copyComponentCode = () => {
    if (selectedItem) {
      const props = Object.entries(selectedItem.props)
        .filter(([, value]) => value !== undefined && value !== "")
        .map(([key, value]) => {
          if (typeof value === "string") return `${key}="${value}"`;
          if (typeof value === "boolean") return value ? key : `${key}={false}`;
          return `${key}={${JSON.stringify(value)}}`;
        })
        .join(" ");
      const code = `<${selectedItem.component.name}${props ? " " + props : ""} />`;
      navigator.clipboard.writeText(code);
    }
  };

  // Filter components
  const filteredComponents = componentRegistry.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const device = deviceFrames[deviceFrame];

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden bg-[#0a0a0b]">
      {/* Component Palette */}
      <div className="w-72 border-r border-[var(--chrome-border)] bg-[var(--chrome-bg)] flex flex-col">
        {/* Palette Header */}
        <div className="p-3 border-b border-[var(--chrome-border)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--chrome-text-muted)]" />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[var(--chrome-bg-subtle)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] placeholder:text-[var(--chrome-text-muted)]"
            />
          </div>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-y-auto p-2">
          {search ? (
            // Flat search results
            <div className="space-y-1">
              {filteredComponents.map((component) => (
                <div
                  key={component.slug}
                  draggable
                  onDragStart={(e) => handlePaletteDragStart(e, component)}
                  onDragEnd={handlePaletteDragEnd}
                  onClick={() => addComponent(component)}
                  className="px-3 py-2.5 rounded-lg text-body-sm text-[var(--chrome-text)] bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-[var(--color-primary-default)]/30"
                >
                  {component.name}
                </div>
              ))}
            </div>
          ) : (
            // Categorized list
            <div className="space-y-1">
              {componentCategories.map((category) => {
                const categoryComponents = componentRegistry.filter(c => category.slugs.includes(c.slug));
                if (categoryComponents.length === 0) return null;
                
                const isExpanded = expandedCategories.includes(category.name);
                
                return (
                  <div key={category.name}>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-body-sm text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="weight-medium">{category.name}</span>
                      <span className="ml-auto text-body-xs opacity-50">{categoryComponents.length}</span>
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-2 space-y-1 mt-1">
                        {categoryComponents.map((component) => (
                          <div
                            key={component.slug}
                            draggable
                            onDragStart={(e) => handlePaletteDragStart(e, component)}
                            onDragEnd={handlePaletteDragEnd}
                            onClick={() => addComponent(component)}
                            className="px-3 py-2 rounded-lg text-body-sm text-[var(--chrome-text)] hover:bg-[var(--chrome-bg-subtle)] cursor-grab active:cursor-grabbing transition-colors"
                          >
                            {component.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="p-3 border-t border-[var(--chrome-border)] text-body-xs text-[var(--chrome-text-muted)]">
          <div className="flex justify-between"><span>Undo</span><span className="opacity-60">⌘Z</span></div>
          <div className="flex justify-between"><span>Redo</span><span className="opacity-60">⌘⇧Z</span></div>
          <div className="flex justify-between"><span>Delete</span><span className="opacity-60">⌫</span></div>
          <div className="flex justify-between"><span>Copy code</span><span className="opacity-60">⌘C</span></div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--chrome-border)] bg-[var(--chrome-bg)]">
          <div className="flex items-center gap-3">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
                title="Undo (⌘Z)"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] disabled:opacity-30 disabled:cursor-not-allowed text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
                title="Redo (⌘⇧Z)"
              >
                <Redo2 size={18} />
              </button>
            </div>

            <div className="w-px h-5 bg-[var(--chrome-border)]" />

            {/* Device selector */}
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

            <span className="text-body-xs text-[var(--chrome-text-muted)]">
              {canvasItems.length} component{canvasItems.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save/Load */}
            <button
              onClick={handleSave}
              className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
              title="Save (⌘S)"
            >
              <Save size={18} />
            </button>
            <button
              onClick={() => setShowSavedPanel(!showSavedPanel)}
              className={`p-1.5 rounded-md transition-colors ${showSavedPanel ? "bg-[var(--color-primary-default)] text-white" : "hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)]"}`}
              title="Saved compositions"
            >
              <FolderOpen size={18} />
            </button>

            <div className="w-px h-5 bg-[var(--chrome-border)]" />

            {/* View toggle */}
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

            {/* Close */}
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-md hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)] transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
            {showCode ? (
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-body-sm text-[var(--chrome-text-muted)]">Generated Code</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-body-xs text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] hover:bg-[var(--chrome-bg-subtle)] transition-colors"
                  >
                    <Copy size={14} />
                    Copy all
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[var(--chrome-bg)] border border-[var(--chrome-border)] text-body-sm text-[var(--chrome-text)] overflow-x-auto">
                  {generateCode() || "// Add components to see generated code"}
                </pre>
              </div>
            ) : (
              <div className="relative">
                {/* Drag hint */}
                {(draggedComponent || draggedItemId) && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--color-primary-default)] text-white text-body-xs whitespace-nowrap z-50 shadow-lg">
                    {draggedComponent ? "Drop to add" : "Drag outside to remove"}
                  </div>
                )}

                {/* Phone Frame */}
                <div
                  ref={phoneFrameRef}
                  className="relative transition-all duration-300"
                  style={{
                    background: deviceFrame !== "none" ? "linear-gradient(145deg, #1a1a1a, #2d2d2d)" : "transparent",
                    borderRadius: device.frameRadius,
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

                  {/* Screen */}
                  <div
                    className={`relative bg-[var(--color-background-default)] overflow-hidden flex flex-col transition-all duration-300 ${
                      isDraggingOver ? "ring-2 ring-[var(--color-primary-default)] ring-inset" : ""
                    }`}
                    style={{
                      width: device.width,
                      height: device.height,
                      borderRadius: device.radius,
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {/* Status Bar */}
                    <div
                      className="flex-shrink-0 flex items-center justify-between px-6 bg-[var(--color-background-default)]"
                      style={{
                        height: device.hasIsland ? 54 : 24,
                        paddingTop: device.hasIsland ? 14 : 4,
                      }}
                    >
                      <span className="text-[14px] weight-semibold text-[var(--color-text-default)]">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" className="text-[var(--color-text-default)]">
                          <path d="M1 4.5C1 3.67 1.67 3 2.5 3H3.5C4.33 3 5 3.67 5 4.5V10.5C5 11.33 4.33 12 3.5 12H2.5C1.67 12 1 11.33 1 10.5V4.5Z" opacity="0.3"/>
                          <path d="M6 3C6 2.17 6.67 1.5 7.5 1.5H8.5C9.33 1.5 10 2.17 10 3V10.5C10 11.33 9.33 12 8.5 12H7.5C6.67 12 6 11.33 6 10.5V3Z" opacity="0.6"/>
                          <path d="M11 1.5C11 0.67 11.67 0 12.5 0H13.5C14.33 0 15 0.67 15 1.5V10.5C15 11.33 14.33 12 13.5 12H12.5C11.67 12 11 11.33 11 10.5V1.5Z"/>
                        </svg>
                        <svg width="16" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-[var(--color-text-default)]">
                          <path d="M8.5 2.5C10.5 2.5 12.3 3.3 13.6 4.6L15 3.2C13.3 1.5 11 0.5 8.5 0.5C6 0.5 3.7 1.5 2 3.2L3.4 4.6C4.7 3.3 6.5 2.5 8.5 2.5Z"/>
                          <path d="M5.1 6.4L6.5 7.8C7.1 7.2 7.8 6.9 8.5 6.9C9.2 6.9 9.9 7.2 10.5 7.8L11.9 6.4C10.9 5.4 9.8 4.9 8.5 4.9C7.2 4.9 6.1 5.4 5.1 6.4Z"/>
                          <circle cx="8.5" cy="10.5" r="1.5"/>
                        </svg>
                        <div className="flex items-center">
                          <div className="w-[25px] h-[12px] border-2 border-current rounded-[4px] relative text-[var(--color-text-default)]">
                            <div className="absolute inset-[2px] right-[4px] bg-current rounded-[1px]" />
                          </div>
                          <div className="w-[2px] h-[5px] bg-[var(--color-text-default)] rounded-r-sm ml-px" />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Island */}
                    {device.hasIsland && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
                        <div className="w-[126px] h-[37px] bg-black rounded-[20px]" />
                      </div>
                    )}

                    {/* Content */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto relative">
                      {canvasItems.length === 0 && !isDraggingOver ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-muted)] p-6">
                          <div className="w-16 h-16 rounded-2xl bg-[var(--color-background-muted)] flex items-center justify-center mb-4">
                            <Layers size={28} className="opacity-40" />
                          </div>
                          <p className="text-body-md mb-1">No components yet</p>
                          <p className="text-body-sm text-center opacity-60">
                            Drag components from the left panel<br />or click to add them
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {canvasItems.map((item, index) => {
                            const Component = item.component.component;
                            const isDragging = draggedItemId === item.id;
                            const isSelected = selectedItemId === item.id;
                            const showDropBefore = dropIndex === index && (draggedComponent || draggedItemId);
                            const showDropAfter = dropIndex === index + 1 && index === canvasItems.length - 1 && (draggedComponent || draggedItemId);

                            return (
                              <div key={item.id}>
                                {/* Drop indicator before */}
                                {showDropBefore && (
                                  <div className="h-1 bg-[var(--color-primary-default)] mx-2 rounded-full" />
                                )}
                                
                                <div
                                  draggable
                                  onDragStart={(e) => handleItemDragStart(e, item.id, index)}
                                  onDragEnd={handleItemDragEnd}
                                  onClick={() => setSelectedItemId(item.id)}
                                  className={`relative transition-all cursor-grab active:cursor-grabbing ${
                                    isSelected ? "ring-2 ring-[var(--color-primary-default)] ring-inset z-10" : ""
                                  } ${isDragging ? "opacity-30" : ""}`}
                                >
                                  <Component {...item.props} />
                                </div>

                                {/* Drop indicator after (only for last item) */}
                                {showDropAfter && (
                                  <div className="h-1 bg-[var(--color-primary-default)] mx-2 rounded-full" />
                                )}
                              </div>
                            );
                          })}
                          
                          {/* Drop zone at end when dragging */}
                          {(draggedComponent || draggedItemId) && dropIndex === canvasItems.length && (
                            <div className="h-1 bg-[var(--color-primary-default)] mx-2 rounded-full" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Home Indicator */}
                    {device.hasIsland && (
                      <div className="flex-shrink-0 flex justify-center pb-2 pt-1">
                        <div className="w-[134px] h-[5px] bg-[var(--color-text-default)] rounded-full opacity-30" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Compositions Panel */}
          {showSavedPanel && (
            <div className="w-64 border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
              <div className="p-3 border-b border-[var(--chrome-border)]">
                <h3 className="text-body-sm weight-semibold text-[var(--chrome-text)]">Saved Compositions</h3>
              </div>
              <div className="p-2">
                {savedCompositions.length === 0 ? (
                  <p className="text-body-sm text-[var(--chrome-text-muted)] text-center py-8">
                    No saved compositions yet.<br />Press ⌘S to save.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {savedCompositions.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-3 rounded-lg bg-[var(--chrome-bg-subtle)] hover:bg-[var(--color-primary-muted)] group cursor-pointer transition-colors"
                        onClick={() => handleLoad(comp)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm text-[var(--chrome-text)]">{comp.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSaved(comp.id);
                            }}
                            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)] transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-body-xs text-[var(--chrome-text-muted)]">
                            {comp.items.length} components
                          </span>
                          <span className="text-body-xs text-[var(--chrome-text-muted)]">•</span>
                          <span className="text-body-xs text-[var(--chrome-text-muted)]">
                            {deviceFrames[comp.deviceFrame]?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Props Panel */}
          {selectedItem && !showCode && (
            <div className="w-80 border-l border-[var(--chrome-border)] bg-[var(--chrome-bg)] overflow-y-auto">
              <div className="p-4 border-b border-[var(--chrome-border)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-body-md weight-semibold text-[var(--chrome-text)]">
                    {selectedItem.component.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateComponent(selectedItem.id)}
                      className="p-1.5 rounded-md hover:bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => removeComponent(selectedItem.id)}
                      className="p-1.5 rounded-md hover:bg-[var(--color-error-muted)] text-[var(--chrome-text-muted)] hover:text-[var(--color-error-default)] transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-body-xs text-[var(--chrome-text-muted)] mt-1">
                  {selectedItem.component.description}
                </p>
              </div>

              {/* Quick Variants */}
              {selectedItem.component.variants && selectedItem.component.variants.length > 0 && (
                <div className="p-4 border-b border-[var(--chrome-border)]">
                  <h4 className="text-body-xs weight-medium text-[var(--chrome-text-muted)] mb-2">Quick Presets</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.component.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCanvasItems(prev =>
                            prev.map(item =>
                              item.id === selectedItem.id
                                ? { ...item, props: { ...item.props, ...variant.props } }
                                : item
                            )
                          );
                        }}
                        className="px-2 py-1 rounded-md text-body-xs bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text-muted)] hover:text-[var(--chrome-text)] hover:bg-[var(--color-primary-muted)] transition-colors"
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Props Editor */}
              <div className="p-4 space-y-4">
                {selectedItem.component.props.map((prop) => (
                  <div key={prop.name}>
                    <label className="block text-body-sm weight-medium text-[var(--chrome-text)] mb-1.5">
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
      </div>
    </div>
  );
}
