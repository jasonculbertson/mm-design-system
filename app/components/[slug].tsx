import { View, Text, ScrollView, Pressable, TextInput, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useMemo } from "react";
import { 
  getComponentBySlug, 
  PropDefinition, 
  ComponentVariant 
} from "../../registry/components";
import { useTheme, useAppColors } from "../../lib/ThemeContext";
import { ComponentThemeProvider } from "../../lib/ComponentTheme";

export default function ComponentDetailPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const component = getComponentBySlug(slug || "");
  const appColors = useAppColors();

  if (!component) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: appColors.chromeBg }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8, color: appColors.chromeText }}>Component not found</Text>
        <Text style={{ fontSize: 16, color: appColors.chromeTextMuted }}>The component "{slug}" doesn't exist</Text>
      </View>
    );
  }

  return <ComponentPlayground component={component} />;
}

function ComponentPlayground({ 
  component 
}: { 
  component: NonNullable<ReturnType<typeof getComponentBySlug>> 
}) {
  const [currentProps, setCurrentProps] = useState<Record<string, any>>(
    component.defaultProps
  );
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "native">("preview");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const appColors = useAppColors();
  const { theme } = useTheme();
  
  // Preview follows the global theme - no separate toggle needed
  const previewDarkMode = theme === "dark";

  const Component = component.component;

  const codeString = useMemo(() => {
    const propsString = Object.entries(currentProps)
      .filter(([key, value]) => {
        const defaultValue = component.defaultProps[key];
        return value !== defaultValue;
      })
      .map(([key, value]) => {
        if (typeof value === "string") return `  ${key}="${value}"`;
        if (typeof value === "boolean") return value ? `  ${key}` : `  ${key}={false}`;
        if (typeof value === "number") return `  ${key}={${value}}`;
        return `  ${key}={${JSON.stringify(value)}}`;
      })
      .join("\n");

    const componentName = component.name.replace(/\s/g, "");
    if (propsString) {
      return `<${componentName}\n${propsString}\n/>`;
    }
    return `<${componentName} />`;
  }, [currentProps, component]);

  const fullCodeString = useMemo(() => {
    const componentName = component.name.replace(/\s/g, "");
    return `import { ${componentName} } from "@/registry/components";

${codeString}`;
  }, [codeString, component]);

  const updateProp = (name: string, value: any) => {
    setCurrentProps((prev) => ({ ...prev, [name]: value }));
    setSelectedVariant(null);
  };

  const applyVariant = (variant: ComponentVariant) => {
    setCurrentProps({ ...component.defaultProps, ...variant.props });
    setSelectedVariant(variant.name);
  };

  const resetProps = () => {
    setCurrentProps(component.defaultProps);
    setSelectedVariant(null);
  };

  const copyToClipboard = async () => {
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(fullCodeString);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: appColors.chromeBg }}>
      {/* Main Content - Left Side */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ maxWidth: 900, paddingHorizontal: 32, paddingVertical: 48 }}>
          {/* Header */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ 
              fontSize: 32, 
              fontWeight: "500", 
              marginBottom: 8, 
              letterSpacing: -0.5,
              color: appColors.chromeText 
            }}>
              {component.name}
            </Text>
            <Text style={{ fontSize: 16, lineHeight: 24, color: appColors.chromeTextMuted }}>
              {component.description}
            </Text>
          </View>

          {/* Preview/Code Card */}
          <View style={{ 
            borderRadius: 12, 
            overflow: "hidden", 
            marginBottom: 40,
            borderWidth: 1,
            borderColor: appColors.chromeBorder,
            backgroundColor: appColors.chromeBgSubtle 
          }}>
            {/* Tab Bar */}
            <View style={{ 
              flexDirection: "row", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: appColors.chromeBorder,
            }}>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => setActiveTab("preview")}
                  style={{ 
                    paddingHorizontal: 12, 
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: activeTab === "preview" ? appColors.primaryDefault : "transparent",
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: "500", 
                    color: activeTab === "preview" ? appColors.primaryDefault : appColors.chromeTextMuted 
                  }}>
                    Preview
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("code")}
                  style={{ 
                    paddingHorizontal: 12, 
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: activeTab === "code" ? appColors.primaryDefault : "transparent",
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: "500", 
                    color: activeTab === "code" ? appColors.primaryDefault : appColors.chromeTextMuted 
                  }}>
                    Code
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab("native")}
                  style={{ 
                    paddingHorizontal: 12, 
                    paddingVertical: 12,
                    borderBottomWidth: 2,
                    borderBottomColor: activeTab === "native" ? "#4630EB" : "transparent",
                  }}
                >
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: "500", 
                    color: activeTab === "native" ? "#4630EB" : appColors.chromeTextMuted 
                  }}>
                    📱 Native
                  </Text>
                </Pressable>
              </View>
              
              {/* Theme indicator */}
              {activeTab === "preview" && (
                <Text style={{ fontSize: 13, color: appColors.chromeTextMuted }}>
                  {previewDarkMode ? "🌙 Dark" : "☀️ Light"}
                </Text>
              )}
            </View>

          {/* Content Area */}
          {activeTab === "preview" ? (
            <View style={{ 
              padding: 48, 
              alignItems: "center", 
              justifyContent: "center", 
              minHeight: 240,
            }}>
              <ComponentThemeProvider darkMode={previewDarkMode}>
                <Component {...currentProps} />
              </ComponentThemeProvider>
            </View>
          ) : (
              <View style={{ padding: 16, minHeight: 200, backgroundColor: "#1e1e1e" }}>
                <View style={{ 
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: 12 
                }}>
                  <Text style={{ fontSize: 12, fontFamily: "monospace", color: "#888" }}>React Native</Text>
                  <Pressable 
                    onPress={copyToClipboard} 
                    style={{ 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      borderRadius: 6,
                      backgroundColor: copied ? "#4AE39E" : appColors.primaryDefault 
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#FFFFFF", fontWeight: "500" }}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </Text>
                  </Pressable>
                </View>
                <ScrollView horizontal>
                  <Text style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 22, color: "#d4d4d4" }}>
                    {fullCodeString}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>

          {/* Variants Section */}
          {component.variants.length > 0 && (
            <View style={{ marginBottom: 40 }}>
              <Text style={{ fontSize: 20, fontWeight: "500", marginBottom: 16, color: appColors.chromeText }}>
                Variants
              </Text>
              <View style={{ gap: 24 }}>
                {component.variants.map((variant) => (
                  <VariantCard
                    key={variant.name}
                    variant={variant}
                    component={component}
                    isSelected={selectedVariant === variant.name}
                    onSelect={() => applyVariant(variant)}
                    previewDarkMode={previewDarkMode}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Props Panel - Right Rail */}
      {component.props.length > 0 && (
        <View style={{ 
          width: 320, 
          borderLeftWidth: 1, 
          borderLeftColor: appColors.chromeBorder,
          backgroundColor: appColors.chromeBg,
        }}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center", 
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: appColors.chromeBorder,
          }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: appColors.chromeText }}>
              Props
            </Text>
            <Pressable 
              onPress={resetProps} 
              style={{ 
                paddingHorizontal: 10, 
                paddingVertical: 4, 
                borderRadius: 6,
                backgroundColor: appColors.chromeBgSubtle 
              }}
            >
              <Text style={{ fontSize: 12, color: appColors.primaryDefault }}>Reset</Text>
            </Pressable>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
            {component.props.map((prop) => (
              <PropControl
                key={prop.name}
                prop={prop}
                value={currentProps[prop.name]}
                onChange={(value) => updateProp(prop.name, value)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function VariantCard({
  variant,
  component,
  isSelected,
  onSelect,
  previewDarkMode,
}: {
  variant: ComponentVariant;
  component: NonNullable<ReturnType<typeof getComponentBySlug>>;
  isSelected: boolean;
  onSelect: () => void;
  previewDarkMode: boolean;
}) {
  const appColors = useAppColors();
  const [showCode, setShowCode] = useState(false);
  const Component = component.component;

  const variantCode = useMemo(() => {
    const componentName = component.name.replace(/\s/g, "");
    const propsString = Object.entries({ ...component.defaultProps, ...variant.props })
      .filter(([key, value]) => value !== component.defaultProps[key] || variant.props[key] !== undefined)
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
  }, [component, variant]);

  return (
    <Pressable onPress={onSelect}>
      <View style={{ gap: 8 }}>
        {/* Header row with title and Preview/Code toggle */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: appColors.chromeText }}>
              {variant.name}
            </Text>
            <Text style={{ fontSize: 14, color: appColors.chromeTextMuted }}>
              {variant.description}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable onPress={() => setShowCode(false)}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: !showCode ? appColors.chromeText : appColors.chromeTextMuted }}>
                Preview
              </Text>
            </Pressable>
            <Pressable onPress={() => setShowCode(true)}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: showCode ? appColors.chromeText : appColors.chromeTextMuted }}>
                Code
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Preview or Code */}
        {!showCode ? (
          <View style={{ 
            borderRadius: 12, 
            padding: 40, 
            alignItems: "center",
            backgroundColor: appColors.chromeBgSubtle 
          }}>
            <ComponentThemeProvider darkMode={previewDarkMode}>
              <Component {...component.defaultProps} {...variant.props} />
            </ComponentThemeProvider>
          </View>
        ) : (
          <View style={{ 
            borderRadius: 12, 
            padding: 16, 
            backgroundColor: "#1e1e1e" 
          }}>
            <Text style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 20, color: "#d4d4d4" }}>
              {variantCode}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
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
    <View style={{ 
      padding: 12, 
      borderRadius: 8,
      backgroundColor: appColors.chromeBgSubtle 
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: appColors.chromeText }}>{prop.name}</Text>
        <Text style={{ 
          fontSize: 10, 
          paddingHorizontal: 5, 
          paddingVertical: 2, 
          borderRadius: 4, 
          fontFamily: "monospace",
          color: appColors.chromeTextMuted,
          backgroundColor: appColors.chromeBg 
        }}>
          {propType.type}
        </Text>
      </View>

      {propType.type === "string" && (
        <TextInput
          style={{ 
            borderWidth: 1, 
            borderRadius: 6, 
            paddingHorizontal: 10, 
            paddingVertical: 8, 
            fontSize: 13,
            borderColor: appColors.chromeBorder,
            backgroundColor: appColors.chromeBg,
            color: appColors.chromeText 
          }}
          value={value}
          onChangeText={onChange}
          placeholder="Enter text..."
          placeholderTextColor={appColors.chromeTextMuted}
        />
      )}

      {propType.type === "number" && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Pressable
            onPress={() => onChange(Math.max((propType.min ?? 0), value - 1))}
            style={{ 
              borderWidth: 1, 
              borderRadius: 6, 
              width: 32, 
              height: 32, 
              alignItems: "center", 
              justifyContent: "center",
              borderColor: appColors.chromeBorder,
              backgroundColor: appColors.chromeBg 
            }}
          >
            <Text style={{ fontSize: 16, color: appColors.chromeText }}>−</Text>
          </Pressable>
          <TextInput
            style={{ 
              flex: 1, 
              borderWidth: 1, 
              borderRadius: 6, 
              paddingHorizontal: 8, 
              paddingVertical: 6, 
              fontSize: 13, 
              textAlign: "center",
              borderColor: appColors.chromeBorder,
              backgroundColor: appColors.chromeBg,
              color: appColors.chromeText 
            }}
            value={String(value)}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              if (!isNaN(num)) onChange(num);
            }}
            keyboardType="numeric"
          />
          <Pressable
            onPress={() => onChange(Math.min((propType.max ?? 999), value + 1))}
            style={{ 
              borderWidth: 1, 
              borderRadius: 6, 
              width: 32, 
              height: 32, 
              alignItems: "center", 
              justifyContent: "center",
              borderColor: appColors.chromeBorder,
              backgroundColor: appColors.chromeBg 
            }}
          >
            <Text style={{ fontSize: 16, color: appColors.chromeText }}>+</Text>
          </Pressable>
        </View>
      )}

      {propType.type === "boolean" && (
        <Pressable onPress={() => onChange(!value)} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ 
            width: 40, 
            height: 24, 
            borderRadius: 12, 
            padding: 3,
            backgroundColor: value ? appColors.primaryDefault : appColors.chromeBorder 
          }}>
            <View style={{ 
              width: 18, 
              height: 18, 
              borderRadius: 9, 
              backgroundColor: "#FFFFFF",
              marginLeft: value ? 16 : 0 
            }} />
          </View>
          <Text style={{ fontSize: 12, fontFamily: "monospace", color: appColors.chromeTextMuted }}>
            {value ? "true" : "false"}
          </Text>
        </Pressable>
      )}

      {propType.type === "select" && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {propType.options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              style={{ 
                paddingHorizontal: 10, 
                paddingVertical: 6, 
                borderRadius: 6, 
                borderWidth: 1,
                borderColor: value === option ? appColors.primaryDefault : appColors.chromeBorder,
                backgroundColor: value === option ? appColors.primaryDefault : appColors.chromeBg 
              }}
            >
              <Text style={{ 
                fontSize: 12, 
                color: value === option ? "#FFFFFF" : appColors.chromeTextMuted 
              }}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text style={{ fontSize: 11, marginTop: 8, lineHeight: 16, color: appColors.chromeTextMuted }}>
        {prop.description}
      </Text>
    </View>
  );
}
