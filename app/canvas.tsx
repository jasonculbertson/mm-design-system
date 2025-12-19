import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform, Modal } from "react-native";
import { useState, useEffect } from "react";

// Simple text icons to avoid @expo/vector-icons issues
const TextIcon = ({ name, size = 16, color = "#fff" }: { name: string; size?: number; color?: string }) => {
  const icons: Record<string, string> = {
    "save-outline": "💾",
    "folder-open-outline": "📂",
    "eye-outline": "👁",
    "code-slash": "</>",
    "download-outline": "↓",
    "copy-outline": "📋",
    "checkmark": "✓",
    "trash-outline": "🗑",
    "chevron-up": "▲",
    "chevron-down": "▼",
    "close": "✕",
    "add": "+",
    "remove": "−",
    "duplicate-outline": "⧉",
    "arrow-up": "↑",
    "arrow-down": "↓",
    "phone-portrait-outline": "📱",
    "radio-button-on": "●",
    "radio-button-off": "○",
  };
  return <Text style={{ fontSize: size, color }}>{icons[name] || "?"}</Text>;
};
import { componentRegistry, ComponentEntry, PropDefinition } from "../registry/components";
import { useAppColors } from "../lib/ThemeContext";

interface CanvasItem {
  id: string;
  component: ComponentEntry;
  props: Record<string, any>;
}

interface SavedComposition {
  id: string;
  name: string;
  items: Array<{
    componentSlug: string;
    props: Record<string, any>;
  }>;
  createdAt: number;
}

const STORAGE_KEY = "mm-ds-canvas-compositions";

export default function CanvasPage() {
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [compositionName, setCompositionName] = useState("");
  const [savedCompositions, setSavedCompositions] = useState<SavedComposition[]>([]);
  const [exportFormat, setExportFormat] = useState<"react-native" | "json" | "props-only">("react-native");
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const appColors = useAppColors();

  const selectedItem = canvasItems.find((item) => item.id === selectedItemId);

  // Load saved compositions from localStorage
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSavedCompositions(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load compositions:", e);
      }
    }
  }, []);

  // Save compositions to localStorage
  const saveCompositionsToStorage = (compositions: SavedComposition[]) => {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compositions));
        setSavedCompositions(compositions);
      } catch (e) {
        console.error("Failed to save compositions:", e);
      }
    }
  };

  const addComponent = (component: ComponentEntry) => {
    const newItem: CanvasItem = {
      id: `${component.slug}-${Date.now()}`,
      component,
      props: { ...component.defaultProps },
    };
    setCanvasItems((prev) => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  const duplicateComponent = (id: string) => {
    const item = canvasItems.find((i) => i.id === id);
    if (!item) return;
    
    const newItem: CanvasItem = {
      id: `${item.component.slug}-${Date.now()}`,
      component: item.component,
      props: { ...item.props },
    };
    
    const index = canvasItems.findIndex((i) => i.id === id);
    setCanvasItems((prev) => [
      ...prev.slice(0, index + 1),
      newItem,
      ...prev.slice(index + 1),
    ]);
    setSelectedItemId(newItem.id);
  };

  const removeComponent = (id: string) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const moveComponent = (id: string, direction: "up" | "down") => {
    setCanvasItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      if (direction === "up" && index === 0) return prev;
      if (direction === "down" && index === prev.length - 1) return prev;
      
      const newItems = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
      return newItems;
    });
  };

  const updateComponentProps = (id: string, propName: string, value: any) => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, props: { ...item.props, [propName]: value } }
          : item
      )
    );
  };

  const clearCanvas = () => {
    setCanvasItems([]);
    setSelectedItemId(null);
  };

  // Save composition
  const saveComposition = () => {
    if (!compositionName.trim() || canvasItems.length === 0) return;

    const newComposition: SavedComposition = {
      id: `comp-${Date.now()}`,
      name: compositionName.trim(),
      items: canvasItems.map((item) => ({
        componentSlug: item.component.slug,
        props: item.props,
      })),
      createdAt: Date.now(),
    };

    saveCompositionsToStorage([newComposition, ...savedCompositions]);
    setCompositionName("");
    setShowSaveModal(false);
  };

  // Load composition
  const loadComposition = (composition: SavedComposition) => {
    const items: CanvasItem[] = composition.items
      .map((saved) => {
        const component = componentRegistry.find((c) => c.slug === saved.componentSlug);
        if (!component) return null;
        return {
          id: `${saved.componentSlug}-${Date.now()}-${Math.random()}`,
          component,
          props: saved.props,
        };
      })
      .filter((item): item is CanvasItem => item !== null);

    setCanvasItems(items);
    setShowLoadModal(false);
    setSelectedItemId(null);
  };

  // Delete saved composition
  const deleteComposition = (id: string) => {
    saveCompositionsToStorage(savedCompositions.filter((c) => c.id !== id));
  };

  // Generate code for a single component
  const generateComponentCode = (item: CanvasItem) => {
    const name = item.component.name.replace(/\s/g, "");
    const propsEntries = Object.entries(item.props).filter(([key, value]) => {
      const defaultValue = item.component.defaultProps[key];
      return value !== defaultValue;
    });
    
    if (propsEntries.length === 0) {
      return `<${name} />`;
    }
    
    const propsString = propsEntries.map(([key, value]) => {
      if (typeof value === "string") return `${key}="${value}"`;
      if (typeof value === "boolean") return value ? key : `${key}={false}`;
      return `${key}={${JSON.stringify(value)}}`;
    }).join("\n  ");
    
    return `<${name}\n  ${propsString}\n/>`;
  };

  // Copy single component code
  const copyComponentCode = async (item: CanvasItem) => {
    const code = generateComponentCode(item);
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(code);
    }
    setCopiedItemId(item.id);
    setTimeout(() => setCopiedItemId(null), 2000);
  };

  // Generate full code
  const generateCode = (format: "react-native" | "json" | "props-only" = "react-native") => {
    if (canvasItems.length === 0) return "// Add components to generate code";

    if (format === "json") {
      return JSON.stringify(
        canvasItems.map((item) => ({
          component: item.component.name,
          props: item.props,
        })),
        null,
        2
      );
    }

    if (format === "props-only") {
      return canvasItems
        .map((item) => {
          const name = item.component.name.replace(/\s/g, "");
          const propsStr = JSON.stringify(item.props, null, 2);
          return `// ${name}\n${propsStr}`;
        })
        .join("\n\n");
    }
    
    const componentNames = [...new Set(canvasItems.map((item) => item.component.name.replace(/\s/g, "")))];
    const imports = `import { View, StyleSheet } from "react-native";
import { ${componentNames.join(", ")} } from "@/registry/components";
import { colors, spacing } from "@/lib/tokens";`;

    const componentCode = canvasItems.map((item) => {
      const name = item.component.name.replace(/\s/g, "");
      const propsEntries = Object.entries(item.props).filter(([key, value]) => {
        const defaultValue = item.component.defaultProps[key];
        return value !== defaultValue;
      });
      
      if (propsEntries.length === 0) {
        return `      <${name} />`;
      }
      
      const propsString = propsEntries.map(([key, value]) => {
        if (typeof value === "string") return `${key}="${value}"`;
        if (typeof value === "boolean") return value ? key : `${key}={false}`;
        return `${key}={${JSON.stringify(value)}}`;
      }).join(" ");
      
      return `      <${name} ${propsString} />`;
    }).join("\n");

    return `${imports}

export function MyScreen() {
  return (
    <View style={styles.container}>
${componentCode}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: spacing[4],
    gap: spacing[4],
  },
});`;
  };

  const copyToClipboard = async () => {
    const code = generateCode(exportFormat);
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(code);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    if (Platform.OS !== "web") return;
    
    const code = generateCode(exportFormat);
    const extension = exportFormat === "json" ? "json" : "tsx";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-screen.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredComponents = componentRegistry.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: appColors.bgContent }]}>
      {/* Component Palette */}
      <View style={[styles.palette, { backgroundColor: appColors.chromeBgSubtle, borderRightColor: appColors.chromeBorder }]}>
        <View style={[styles.paletteHeader, { borderBottomColor: appColors.borderMuted }]}>
          <Text style={[styles.paletteTitle, { color: appColors.textPrimary }]}>Components</Text>
          <Text style={[styles.paletteHint, { color: appColors.textMuted }]}>Tap to add</Text>
        </View>
        
        <TextInput
          style={[styles.searchInput, { backgroundColor: appColors.bgInput, color: appColors.textPrimary }]}
          placeholder="Search..."
          placeholderTextColor={appColors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        
        <ScrollView style={styles.paletteScroll}>
          <Text style={[styles.categoryTitle, { color: appColors.textMuted }]}>Components</Text>
          {filteredComponents
            .filter((c) => c.category === "components")
            .map((component) => (
              <Pressable
                key={component.slug}
                onPress={() => addComponent(component)}
                style={styles.paletteItem}
              >
                <Text style={[styles.paletteItemText, { color: appColors.textSecondary }]}>{component.name}</Text>
              </Pressable>
            ))}

          <Text style={[styles.categoryTitleSpaced, { color: appColors.textMuted }]}>Primitives</Text>
          {filteredComponents
            .filter((c) => c.category === "primitives")
            .map((component) => (
              <Pressable
                key={component.slug}
                onPress={() => addComponent(component)}
                style={styles.paletteItem}
              >
                <Text style={[styles.paletteItemText, { color: appColors.textSecondary }]}>{component.name}</Text>
              </Pressable>
            ))}
        </ScrollView>
      </View>

      {/* Canvas Area */}
      <View style={[styles.canvasArea, { backgroundColor: appColors.bgContent }]}>
        <View style={[styles.toolbar, { backgroundColor: appColors.bgCard, borderBottomColor: appColors.borderMuted }]}>
          <View style={styles.toolbarLeft}>
            <Text style={[styles.toolbarTitle, { color: appColors.textPrimary }]}>Screen Canvas</Text>
            <View style={[styles.badge, { backgroundColor: appColors.bgInput }]}>
              <Text style={[styles.badgeText, { color: appColors.textSecondary }]}>{canvasItems.length} components</Text>
            </View>
          </View>
          <View style={styles.toolbarRight}>
            {/* Save/Load buttons */}
            <Pressable
              onPress={() => setShowSaveModal(true)}
              style={[styles.toolbarButton, { backgroundColor: appColors.bgInput }]}
              disabled={canvasItems.length === 0}
            >
              <View style={styles.buttonContent}>
                <TextIcon name="save-outline" size={16} color={appColors.textSecondary} />
                <Text style={[styles.toolbarButtonText, { color: appColors.textSecondary }]}>Save</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setShowLoadModal(true)}
              style={[styles.toolbarButton, { backgroundColor: appColors.bgInput }]}
            >
              <View style={styles.buttonContent}>
                <TextIcon name="folder-open-outline" size={16} color={appColors.textSecondary} />
                <Text style={[styles.toolbarButtonText, { color: appColors.textSecondary }]}>Load</Text>
              </View>
            </Pressable>
            
            <View style={[styles.divider, { backgroundColor: appColors.borderMuted }]} />
            
            <Pressable
              onPress={() => setShowCode(!showCode)}
              style={[styles.toolbarButton, { backgroundColor: showCode ? appColors.primaryDefault : appColors.bgInput }]}
            >
              <View style={styles.buttonContent}>
                <TextIcon 
                  name={showCode ? "eye-outline" : "code-slash"} 
                  size={16} 
                  color={showCode ? "#FFFFFF" : appColors.textSecondary} 
                />
                <Text style={[styles.toolbarButtonText, { color: showCode ? "#FFFFFF" : appColors.textSecondary }]}>
                  {showCode ? "Preview" : "Code"}
                </Text>
              </View>
            </Pressable>
            
            {showCode && (
              <>
                <Pressable
                  onPress={() => setShowExportModal(true)}
                  style={[styles.toolbarButton, { backgroundColor: appColors.primaryDefault }]}
                >
                  <View style={styles.buttonContent}>
                    <TextIcon name="download-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.toolbarButtonTextWhite}>Export</Text>
                  </View>
                </Pressable>
                <Pressable onPress={copyToClipboard} style={[styles.toolbarButton, { backgroundColor: appColors.success }]}>
                  <View style={styles.buttonContent}>
                    <TextIcon name={copied ? "checkmark" : "copy-outline"} size={16} color="#FFFFFF" />
                    <Text style={styles.toolbarButtonTextWhite}>
                      {copied ? "Copied!" : "Copy"}
                    </Text>
                  </View>
                </Pressable>
              </>
            )}
            <Pressable onPress={clearCanvas} style={[styles.toolbarButton, { backgroundColor: appColors.bgInput }]}>
              <View style={styles.buttonContent}>
                <TextIcon name="trash-outline" size={16} color={appColors.textSecondary} />
                <Text style={[styles.toolbarButtonText, { color: appColors.textSecondary }]}>Clear</Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.canvasContent}>
          {showCode ? (
            <ScrollView style={styles.codeScrollView}>
              <View style={[styles.codeHeader, { borderBottomColor: appColors.borderMuted }]}>
                <View style={styles.formatSelector}>
                  {(["react-native", "json", "props-only"] as const).map((format) => (
                    <Pressable
                      key={format}
                      onPress={() => setExportFormat(format)}
                      style={[
                        styles.formatButton,
                        {
                          backgroundColor: exportFormat === format ? appColors.primaryDefault : appColors.bgInput,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.formatButtonText,
                          { color: exportFormat === format ? "#FFFFFF" : appColors.textSecondary },
                        ]}
                      >
                        {format === "react-native" ? "React Native" : format === "json" ? "JSON" : "Props Only"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={[styles.codeView, { backgroundColor: appColors.bgCode, borderColor: appColors.borderMuted }]}>
                <Text style={[styles.codeText, { color: appColors.codeText }]}>{generateCode(exportFormat)}</Text>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.phoneFrame}>
              <View style={styles.phoneNotch} />
              <View style={styles.phoneScreen}>
                {canvasItems.length === 0 ? (
                  <View style={styles.emptyCanvas}>
                    <TextIcon name="phone-portrait-outline" size={48} color="#6A737D" />
                    <Text style={styles.emptyTitle}>Empty Canvas</Text>
                    <Text style={styles.emptyHint}>Tap components from the left panel to add them</Text>
                  </View>
                ) : (
                  <ScrollView style={styles.canvasScroll}>
                    {canvasItems.map((item, index) => {
                      const Component = item.component.component;
                      const isSelected = selectedItemId === item.id;
                      const isCopied = copiedItemId === item.id;
                      return (
                        <View key={item.id} style={styles.canvasItemWrapper}>
                          <View style={styles.reorderControls}>
                            <Pressable
                              onPress={() => moveComponent(item.id, "up")}
                              style={index === 0 ? styles.reorderButtonDisabled : styles.reorderButton}
                              disabled={index === 0}
                            >
                              <TextIcon name="chevron-up" size={14} color="#FFFFFF" />
                            </Pressable>
                            <Text style={styles.orderNumber}>{index + 1}</Text>
                            <Pressable
                              onPress={() => moveComponent(item.id, "down")}
                              style={index === canvasItems.length - 1 ? styles.reorderButtonDisabled : styles.reorderButton}
                              disabled={index === canvasItems.length - 1}
                            >
                              <TextIcon name="chevron-down" size={14} color="#FFFFFF" />
                            </Pressable>
                          </View>
                          
                          <Pressable
                            onPress={() => setSelectedItemId(item.id)}
                            style={[styles.canvasItem, isSelected ? { borderColor: appColors.primaryDefault } : undefined]}
                          >
                            <Component {...item.props} />
                          </Pressable>

                          {/* Quick actions */}
                          <View style={styles.quickActions}>
                            <Pressable
                              onPress={() => copyComponentCode(item)}
                              style={[styles.quickActionButton, isCopied ? { backgroundColor: appColors.success } : undefined]}
                            >
                              <TextIcon 
                                name={isCopied ? "checkmark" : "copy-outline"} 
                                size={14} 
                                color={isCopied ? "#FFFFFF" : "#9FA6AE"} 
                              />
                            </Pressable>
                            <Pressable
                              onPress={() => duplicateComponent(item.id)}
                              style={styles.quickActionButton}
                            >
                              <TextIcon name="duplicate-outline" size={14} color="#9FA6AE" />
                            </Pressable>
                            <Pressable
                              onPress={() => removeComponent(item.id)}
                              style={styles.quickActionButton}
                            >
                              <TextIcon name="trash-outline" size={14} color="#FF7584" />
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Props Panel */}
      {selectedItem && !showCode && (
        <View style={[styles.propsPanel, { backgroundColor: appColors.chromeBgSubtle, borderLeftColor: appColors.chromeBorder }]}>
          <View style={[styles.propsPanelHeader, { borderBottomColor: appColors.borderMuted }]}>
            <Text style={[styles.propsPanelTitle, { color: appColors.textPrimary }]}>{selectedItem.component.name}</Text>
            <Pressable onPress={() => setSelectedItemId(null)}>
              <TextIcon name="close" size={20} color={appColors.textSecondary} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.propsList}>
            {selectedItem.component.props.map((prop) => (
              <PropControl
                key={prop.name}
                prop={prop}
                value={selectedItem.props[prop.name]}
                onChange={(value) => updateComponentProps(selectedItem.id, prop.name, value)}
              />
            ))}
          </ScrollView>

          <View style={[styles.propsPanelActions, { borderTopColor: appColors.borderMuted }]}>
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => moveComponent(selectedItem.id, "up")}
                style={[styles.actionButtonSmall, { backgroundColor: appColors.bgInput }]}
              >
                <TextIcon name="arrow-up" size={16} color={appColors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => moveComponent(selectedItem.id, "down")}
                style={[styles.actionButtonSmall, { backgroundColor: appColors.bgInput }]}
              >
                <TextIcon name="arrow-down" size={16} color={appColors.textSecondary} />
              </Pressable>
              <Pressable
                onPress={() => duplicateComponent(selectedItem.id)}
                style={[styles.actionButtonSmall, { backgroundColor: appColors.bgInput, flex: 1 }]}
              >
                <View style={styles.buttonContent}>
                  <TextIcon name="duplicate-outline" size={16} color={appColors.textSecondary} />
                  <Text style={[styles.actionButtonSmallText, { color: appColors.textSecondary }]}>Duplicate</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => copyComponentCode(selectedItem)}
                style={[styles.actionButtonSmall, { backgroundColor: appColors.bgInput, flex: 1 }]}
              >
                <View style={styles.buttonContent}>
                  <TextIcon 
                    name={copiedItemId === selectedItem.id ? "checkmark" : "copy-outline"} 
                    size={16} 
                    color={copiedItemId === selectedItem.id ? appColors.success : appColors.textSecondary} 
                  />
                  <Text style={[styles.actionButtonSmallText, { 
                    color: copiedItemId === selectedItem.id ? appColors.success : appColors.textSecondary 
                  }]}>
                    {copiedItemId === selectedItem.id ? "Copied!" : "Copy Code"}
                  </Text>
                </View>
              </Pressable>
            </View>
            <Pressable
              onPress={() => removeComponent(selectedItem.id)}
              style={[styles.removeButton, { backgroundColor: `${appColors.error}20` }]}
            >
              <View style={styles.buttonContent}>
                <TextIcon name="trash-outline" size={16} color={appColors.error} />
                <Text style={[styles.removeButtonText, { color: appColors.error }]}>Remove Component</Text>
              </View>
            </Pressable>
          </View>
        </View>
      )}

      {/* Save Modal */}
      <Modal visible={showSaveModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: appColors.bgCard }]}>
            <Text style={[styles.modalTitle, { color: appColors.textPrimary }]}>Save Composition</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: appColors.bgInput, color: appColors.textPrimary, borderColor: appColors.borderMuted }]}
              placeholder="Enter composition name..."
              placeholderTextColor={appColors.textMuted}
              value={compositionName}
              onChangeText={setCompositionName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowSaveModal(false)} style={[styles.modalButton, { backgroundColor: appColors.bgInput }]}>
                <Text style={[styles.modalButtonText, { color: appColors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable 
                onPress={saveComposition} 
                style={[styles.modalButton, { backgroundColor: appColors.primaryDefault }]}
                disabled={!compositionName.trim()}
              >
                <Text style={styles.modalButtonTextWhite}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Load Modal */}
      <Modal visible={showLoadModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, styles.modalWide, { backgroundColor: appColors.bgCard }]}>
            <Text style={[styles.modalTitle, { color: appColors.textPrimary }]}>Load Composition</Text>
            {savedCompositions.length === 0 ? (
              <View style={styles.emptyState}>
                <TextIcon name="folder-open-outline" size={48} color={appColors.textMuted} />
                <Text style={[styles.emptyStateText, { color: appColors.textMuted }]}>No saved compositions yet</Text>
              </View>
            ) : (
              <ScrollView style={styles.compositionsList}>
                {savedCompositions.map((comp) => (
                  <View key={comp.id} style={[styles.compositionItem, { borderBottomColor: appColors.borderMuted }]}>
                    <View style={styles.compositionInfo}>
                      <Text style={[styles.compositionName, { color: appColors.textPrimary }]}>{comp.name}</Text>
                      <Text style={[styles.compositionMeta, { color: appColors.textMuted }]}>
                        {comp.items.length} components • {new Date(comp.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.compositionActions}>
                      <Pressable onPress={() => loadComposition(comp)} style={[styles.loadButton, { backgroundColor: appColors.primaryDefault }]}>
                        <Text style={styles.modalButtonTextWhite}>Load</Text>
                      </Pressable>
                      <Pressable onPress={() => deleteComposition(comp.id)} style={styles.deleteButton}>
                        <TextIcon name="trash-outline" size={18} color={appColors.error} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowLoadModal(false)} style={[styles.modalButton, { backgroundColor: appColors.bgInput }]}>
                <Text style={[styles.modalButtonText, { color: appColors.textSecondary }]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal visible={showExportModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: appColors.bgCard }]}>
            <Text style={[styles.modalTitle, { color: appColors.textPrimary }]}>Export Options</Text>
            
            <View style={styles.exportOptions}>
              {([
                { id: "react-native", label: "React Native", desc: "Full component file" },
                { id: "json", label: "JSON", desc: "Component structure" },
                { id: "props-only", label: "Props Only", desc: "Just the prop values" },
              ] as const).map((opt) => (
                <Pressable
                  key={opt.id}
                  onPress={() => setExportFormat(opt.id)}
                  style={[
                    styles.exportOption,
                    { 
                      backgroundColor: exportFormat === opt.id ? `${appColors.primaryDefault}20` : appColors.bgInput,
                      borderColor: exportFormat === opt.id ? appColors.primaryDefault : "transparent",
                    }
                  ]}
                >
                  <TextIcon 
                    name={exportFormat === opt.id ? "radio-button-on" : "radio-button-off"} 
                    size={20} 
                    color={exportFormat === opt.id ? appColors.primaryDefault : appColors.textMuted} 
                  />
                  <View>
                    <Text style={[styles.exportOptionLabel, { color: appColors.textPrimary }]}>{opt.label}</Text>
                    <Text style={[styles.exportOptionDesc, { color: appColors.textMuted }]}>{opt.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowExportModal(false)} style={[styles.modalButton, { backgroundColor: appColors.bgInput }]}>
                <Text style={[styles.modalButtonText, { color: appColors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => { copyToClipboard(); setShowExportModal(false); }} style={[styles.modalButton, { backgroundColor: appColors.success }]}>
                <View style={styles.buttonContent}>
                  <TextIcon name="copy-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.modalButtonTextWhite}>Copy</Text>
                </View>
              </Pressable>
              <Pressable onPress={() => { downloadCode(); setShowExportModal(false); }} style={[styles.modalButton, { backgroundColor: appColors.primaryDefault }]}>
                <View style={styles.buttonContent}>
                  <TextIcon name="download-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.modalButtonTextWhite}>Download</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PropControl({
  prop,
  value,
  onChange,
}: {
  prop: PropDefinition;
  value: any;
  onChange: (value: any) => void;
}) {
  const { propType } = prop;
  const appColors = useAppColors();

  return (
    <View style={styles.propControl}>
      <Text style={[styles.propLabel, { color: appColors.textSecondary }]}>{prop.name}</Text>

      {propType.type === "string" && (
        <TextInput
          style={[styles.propInput, { backgroundColor: appColors.bgInput, borderColor: appColors.borderMuted, color: appColors.textPrimary }]}
          value={value}
          onChangeText={onChange}
          placeholder="Enter text..."
          placeholderTextColor={appColors.textMuted}
        />
      )}

      {propType.type === "number" && (
        <View style={styles.numberControl}>
          <Pressable
            onPress={() => onChange(Math.max((propType.min ?? 0), value - 1))}
            style={[styles.numberButton, { backgroundColor: appColors.bgInput, borderColor: appColors.borderMuted }]}
          >
            <TextIcon name="remove" size={18} color={appColors.textPrimary} />
          </Pressable>
          <Text style={[styles.numberValue, { color: appColors.textPrimary }]}>{value}</Text>
          <Pressable
            onPress={() => onChange(Math.min((propType.max ?? 999), value + 1))}
            style={[styles.numberButton, { backgroundColor: appColors.bgInput, borderColor: appColors.borderMuted }]}
          >
            <TextIcon name="add" size={18} color={appColors.textPrimary} />
          </Pressable>
        </View>
      )}

      {propType.type === "boolean" && (
        <Pressable onPress={() => onChange(!value)} style={styles.booleanControl}>
          <View style={[styles.toggle, { backgroundColor: value ? appColors.primaryDefault : appColors.borderMuted }]}>
            <View style={[styles.toggleKnob, { marginLeft: value ? 18 : 0 }]} />
          </View>
        </Pressable>
      )}

      {propType.type === "select" && (
        <View style={styles.selectControl}>
          {propType.options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={[
                styles.selectOption,
                { 
                  backgroundColor: value === option ? appColors.primaryDefault : appColors.bgInput,
                  borderColor: value === option ? appColors.primaryDefault : appColors.borderMuted,
                }
              ]}
            >
              <Text style={[styles.selectOptionText, { color: value === option ? "#FFFFFF" : appColors.textSecondary }]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  palette: {
    width: 220,
    borderRightWidth: 1,
  },
  paletteHeader: {
    padding: 16,
    borderBottomWidth: 1,
  },
  paletteTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  paletteHint: {
    fontSize: 12,
    marginTop: 4,
  },
  searchInput: {
    margin: 8,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  paletteScroll: {
    flex: 1,
    padding: 8,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  categoryTitleSpaced: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 16,
  },
  paletteItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 2,
  },
  paletteItemText: {
    fontSize: 14,
  },
  canvasArea: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toolbarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  toolbarTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
  },
  toolbarRight: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  toolbarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  toolbarButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  toolbarButtonTextWhite: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 4,
  },
  canvasContent: {
    flex: 1,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  codeScrollView: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
  },
  codeHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  formatSelector: {
    flexDirection: "row",
    gap: 8,
  },
  formatButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  formatButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  codeView: {
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
  },
  codeText: {
    fontFamily: Platform.OS === "web" ? "monospace" : "Menlo",
    fontSize: 13,
    lineHeight: 22,
  },
  phoneFrame: {
    backgroundColor: "#000",
    borderRadius: 40,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  phoneNotch: {
    width: 120,
    height: 28,
    backgroundColor: "#000",
    borderRadius: 14,
    alignSelf: "center",
    marginBottom: -14,
    zIndex: 1,
  },
  phoneScreen: {
    backgroundColor: "#24272A",
    borderRadius: 32,
    width: 375,
    height: 720,
    overflow: "hidden",
  },
  emptyCanvas: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  emptyHint: {
    fontSize: 14,
    color: "#6A737D",
    textAlign: "center",
    lineHeight: 20,
  },
  canvasScroll: {
    flex: 1,
    padding: 16,
  },
  canvasItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  reorderControls: {
    alignItems: "center",
    gap: 2,
  },
  reorderButton: {
    width: 24,
    height: 24,
    backgroundColor: "#3B4046",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  reorderButtonDisabled: {
    width: 24,
    height: 24,
    backgroundColor: "#24272A",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.3,
  },
  orderNumber: {
    fontSize: 10,
    color: "#6A737D",
  },
  canvasItem: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  quickActions: {
    gap: 4,
  },
  quickActionButton: {
    width: 28,
    height: 28,
    backgroundColor: "#2d3035",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  propsPanel: {
    width: 320,
    borderLeftWidth: 1,
  },
  propsPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  propsPanelTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  propsList: {
    flex: 1,
    padding: 16,
  },
  propControl: {
    marginBottom: 16,
  },
  propLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  propInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  numberControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  numberButton: {
    borderWidth: 1,
    borderRadius: 6,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  numberValue: {
    fontSize: 16,
    minWidth: 40,
    textAlign: "center",
  },
  booleanControl: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 3,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  selectControl: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  selectOptionText: {
    fontSize: 12,
  },
  propsPanelActions: {
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButtonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonSmallText: {
    fontSize: 12,
    fontWeight: "500",
  },
  removeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: 400,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  modalWide: {
    width: 500,
    maxHeight: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalButtonTextWhite: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
  },
  compositionsList: {
    maxHeight: 300,
  },
  compositionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  compositionInfo: {
    flex: 1,
    gap: 4,
  },
  compositionName: {
    fontSize: 15,
    fontWeight: "500",
  },
  compositionMeta: {
    fontSize: 12,
  },
  compositionActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  loadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
  },
  exportOptions: {
    gap: 12,
  },
  exportOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
  },
  exportOptionLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  exportOptionDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
