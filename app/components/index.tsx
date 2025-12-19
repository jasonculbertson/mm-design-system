import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { componentRegistry } from "../../registry/components";
import { useAppColors } from "../../lib/ThemeContext";

type CategoryFilter = "all" | "components" | "primitives";

export default function ComponentsIndex() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const appColors = useAppColors();

  const filteredComponents = componentRegistry.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const components = filteredComponents.filter((c) => c.category === "components");
  const primitives = filteredComponents.filter((c) => c.category === "primitives");

  const totalCount = componentRegistry.length;
  const componentsCount = componentRegistry.filter((c) => c.category === "components").length;
  const primitivesCount = componentRegistry.filter((c) => c.category === "primitives").length;

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: appColors.chromeBg }}
      contentContainerStyle={{ minHeight: "100%" }}
    >
      <View style={{ maxWidth: 900, marginHorizontal: "auto", paddingHorizontal: 24, paddingVertical: 64 }}>
        {/* Header */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 32, fontWeight: "600", marginBottom: 8, color: appColors.chromeText }}>
            Components
          </Text>
          <Text style={{ fontSize: 16, marginBottom: 24, lineHeight: 24, color: appColors.chromeTextMuted }}>
            Browse all available components. Click any component to open the interactive playground.
          </Text>

          {/* Search */}
          <View style={{ marginBottom: 12 }}>
            <TextInput
              style={{ 
                borderRadius: 6, 
                paddingHorizontal: 12, 
                paddingVertical: 10, 
                fontSize: 14, 
                maxWidth: 300,
                backgroundColor: appColors.chromeBgSubtle, 
                color: appColors.chromeText 
              }}
              placeholder="Search components..."
              placeholderTextColor={appColors.chromeTextMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          
          {/* Category Filters */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["all", "components", "primitives"] as const).map((filter) => {
              const isActive = categoryFilter === filter;
              const count = filter === "all" ? totalCount : filter === "components" ? componentsCount : primitivesCount;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setCategoryFilter(filter)}
                  style={{ 
                    paddingHorizontal: 12, 
                    paddingVertical: 8, 
                    borderRadius: 6, 
                    backgroundColor: isActive ? appColors.chromeText : appColors.chromeBgSubtle 
                  }}
                >
                  <Text style={{ 
                    fontSize: 13, 
                    fontWeight: "500", 
                    color: isActive ? appColors.chromeBg : appColors.chromeTextMuted 
                  }}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Components Section */}
        {components.length > 0 && (categoryFilter === "all" || categoryFilter === "components") && (
          <View style={{ marginBottom: 40 }}>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: "600", 
              textTransform: "uppercase", 
              letterSpacing: 0.5, 
              marginBottom: 16,
              color: appColors.chromeTextMuted 
            }}>
              Our components
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {components.map((component) => (
                <ComponentCard key={component.slug} component={component} />
              ))}
            </View>
          </View>
        )}

        {/* Primitives Section */}
        {primitives.length > 0 && (categoryFilter === "all" || categoryFilter === "primitives") && (
          <View style={{ marginBottom: 40 }}>
            <Text style={{ 
              fontSize: 11, 
              fontWeight: "600", 
              textTransform: "uppercase", 
              letterSpacing: 0.5, 
              marginBottom: 16,
              color: appColors.chromeTextMuted 
            }}>
              Primitives
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              {primitives.map((component) => (
                <ComponentCard key={component.slug} component={component} />
              ))}
            </View>
          </View>
        )}

        {filteredComponents.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 64 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, color: appColors.chromeText }}>
              No components found
            </Text>
            <Text style={{ fontSize: 14, marginBottom: 24, color: appColors.chromeTextMuted }}>
              No components matching "{search}"
            </Text>
            <Pressable 
              onPress={() => { setSearch(""); setCategoryFilter("all"); }}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, backgroundColor: appColors.chromeText }}
            >
              <Text style={{ fontWeight: "500", fontSize: 14, color: appColors.chromeBg }}>Clear filters</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ComponentCard({
  component,
}: {
  component: (typeof componentRegistry)[number];
}) {
  const Component = component.component;
  const appColors = useAppColors();

  return (
    <Link href={`/components/${component.slug}`} asChild>
      <Pressable style={{ borderRadius: 12, overflow: "hidden", width: 260, backgroundColor: appColors.chromeBgSubtle }}>
        {/* Preview */}
        <View style={{ padding: 20, alignItems: "center", justifyContent: "center", minHeight: 120, backgroundColor: appColors.bgApp }}>
          <Component {...component.defaultProps} />
        </View>
        
        {/* Info */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: "500", marginBottom: 4, color: appColors.chromeText }}>
            {component.name}
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 18, color: appColors.chromeTextMuted }} numberOfLines={2}>
            {component.description}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
