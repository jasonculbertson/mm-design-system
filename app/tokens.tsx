import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { colors, lightColors, typography, spacing, borderRadius } from "../lib/tokens";
import { useAppColors, useTheme } from "../lib/ThemeContext";
import { ComponentThemeProvider } from "../lib/ComponentTheme";
import { MetaMaskIcon, METAMASK_ICON_NAMES } from "../registry/components";

type TabType = "colors" | "icons" | "typography" | "spacing" | "radius";

export default function TokensPage() {
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const appColors = useAppColors();
  const { theme } = useTheme();

  // Follow the global site theme
  const currentColors = theme === "dark" ? colors : lightColors;

  return (
    <ScrollView style={[styles.mainContent, { backgroundColor: appColors.bgContent }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: appColors.textPrimary }]}>Design Tokens</Text>
            <Text style={[styles.description, { color: appColors.textSecondary }]}>
              Official MetaMask design tokens from @metamask/design-tokens
            </Text>
          </View>

          <View style={[styles.tabBar, { borderBottomColor: appColors.borderMuted }]}>
            {(["colors", "icons", "typography", "spacing", "radius"] as TabType[]).map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tab, 
                  activeTab === tab && { borderBottomColor: appColors.primaryDefault }
                ]}
              >
                <Text style={[styles.tabText, { color: activeTab === tab ? appColors.primaryDefault : appColors.textMuted }]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === "colors" && <ColorsSection colors={currentColors} />}
          {activeTab === "icons" && <IconsSection />}
          {activeTab === "typography" && <TypographySection />}
          {activeTab === "spacing" && <SpacingSection />}
          {activeTab === "radius" && <RadiusSection />}
        </View>
      </ScrollView>
  );
}

function ColorsSection({ colors: c }: { colors: Record<string, Record<string, string>> }) {
  const appColors = useAppColors();
  
  const colorGroups = [
    { name: "Background", tokens: c.background || {} },
    { name: "Text", tokens: c.text || {} },
    { name: "Primary", tokens: c.primary || {} },
    { name: "Error", tokens: c.error || {} },
    { name: "Warning", tokens: c.warning || {} },
    { name: "Success", tokens: c.success || {} },
    { name: "Border", tokens: c.border || {} },
  ].filter(group => Object.keys(group.tokens).length > 0);

  return (
    <View style={styles.tokensContainer}>
      {colorGroups.map((group) => (
        <View key={group.name} style={styles.tokenGroup}>
          <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary }]}>{group.name}</Text>
          <View style={styles.colorGrid}>
            {Object.entries(group.tokens).map(([name, value]) => (
              <View key={name} style={[styles.colorSwatch, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
                <View style={[styles.colorPreview, { backgroundColor: value as string }]} />
                <Text style={[styles.colorName, { color: appColors.textPrimary }]}>{name}</Text>
                <Text style={[styles.colorValue, { color: appColors.textMuted }]}>{value as string}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function IconsSection() {
  const appColors = useAppColors();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", label: "All" },
    { id: "navigation", label: "Navigation" },
    { id: "actions", label: "Actions" },
    { id: "wallet", label: "Wallet" },
    { id: "security", label: "Security" },
    { id: "status", label: "Status" },
    { id: "social", label: "Social" },
  ];

  const categoryMap: Record<string, string[]> = {
    navigation: ["Home", "HomeFilled", "Menu", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Expand", "Collapse"],
    actions: ["Add", "AddCircle", "Close", "Check", "CheckBold", "Copy", "CopySuccess", "Edit", "Trash", "Refresh", "Search", "Filter", "Download", "Upload", "Share", "Link", "Scan", "QrCode", "MoreVertical", "MoreHorizontal"],
    wallet: ["Wallet", "Send", "Receive", "SwapHorizontal", "SwapVertical", "Gas", "Bridge", "Stake", "Bank", "Card", "Money", "Coin", "BuySell"],
    security: ["Lock", "LockSlash", "Key", "SecurityKey", "Security", "ShieldLock", "Eye", "EyeSlash", "Fingerprint", "FaceId"],
    status: ["Info", "Question", "Warning", "Danger", "Error", "Confirmation", "Clock", "Pending"],
    social: ["Heart", "HeartFilled", "Star", "StarFilled", "User", "UserCircle", "People", "Notification"],
    all: METAMASK_ICON_NAMES,
  };

  const icons = categoryMap[selectedCategory] || categoryMap.all;

  return (
    <View style={styles.tokensContainer}>
      <View style={styles.iconHeader}>
        <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary, marginBottom: 0 }]}>
          {icons.length} Icons
        </Text>
        <Text style={[styles.iconSubtitle, { color: appColors.textSecondary }]}>
          Official MetaMask icons from @metamask/design-system-react-native
        </Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilter}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => setSelectedCategory(cat.id)}
            style={[
              styles.categoryButton,
              {
                backgroundColor: selectedCategory === cat.id ? appColors.primaryDefault : appColors.bgCard,
                borderColor: selectedCategory === cat.id ? appColors.primaryDefault : appColors.borderMuted,
              }
            ]}
          >
            <Text style={[
              styles.categoryButtonText,
              { color: selectedCategory === cat.id ? "#FFFFFF" : appColors.textSecondary }
            ]}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Icons Grid - wrapped in ComponentThemeProvider for theme-aware icon colors */}
      <ComponentThemeProvider darkMode={theme === "dark"}>
        <View style={styles.iconsGrid}>
          {icons.map((name) => (
            <View 
              key={name} 
              style={[styles.iconItem, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}
            >
              <MetaMaskIcon name={name} size="lg" color="default" />
              <Text style={[styles.iconName, { color: appColors.textMuted }]} numberOfLines={1}>
                {name}
              </Text>
            </View>
          ))}
        </View>
      </ComponentThemeProvider>
    </View>
  );
}

function TypographySection() {
  const appColors = useAppColors();
  
  const typeStyles = [
    { name: "Display LG", ...typography.fontSize.displayLg },
    { name: "Display MD", ...typography.fontSize.displayMd },
    { name: "Heading LG", ...typography.fontSize.headingLg },
    { name: "Heading MD", ...typography.fontSize.headingMd },
    { name: "Heading SM", ...typography.fontSize.headingSm },
    { name: "Body LG Medium", ...typography.fontSize.bodyLgMedium },
    { name: "Body MD", ...typography.fontSize.bodyMd },
    { name: "Body SM", ...typography.fontSize.bodySm },
    { name: "Body XS", ...typography.fontSize.bodyXs },
  ];

  return (
    <View style={styles.tokensContainer}>
      <View style={styles.fontFamilySection}>
        <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary }]}>Font Families</Text>
        <View style={[styles.fontFamilyCard, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
          <Text style={[styles.fontLabel, { color: appColors.textSecondary }]}>Sans</Text>
          <Text style={[styles.fontValue, { color: appColors.textPrimary }]}>{typography.fontFamily.sans}</Text>
        </View>
        <View style={[styles.fontFamilyCard, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
          <Text style={[styles.fontLabel, { color: appColors.textSecondary }]}>Mono</Text>
          <Text style={[styles.fontValue, { fontFamily: 'monospace', color: appColors.textPrimary }]}>{typography.fontFamily.mono}</Text>
        </View>
      </View>

      <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary }]}>Type Scale</Text>
      {typeStyles.map((style) => (
        <View key={style.name} style={[styles.typographyRow, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
          <Text style={[styles.typographySample, { fontSize: Math.min(style.size, 32), color: appColors.textPrimary }]}>
            {style.name}
          </Text>
          <View style={styles.typographyInfo}>
            <View style={[styles.typographyBadge, { backgroundColor: appColors.bgInput }]}>
              <Text style={[styles.typographyBadgeText, { color: appColors.textSecondary }]}>{style.size}px</Text>
            </View>
            <View style={[styles.typographyBadge, { backgroundColor: appColors.bgInput }]}>
              <Text style={[styles.typographyBadgeText, { color: appColors.textSecondary }]}>/{style.lineHeight}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function SpacingSection() {
  const appColors = useAppColors();
  const spacingEntries = Object.entries(spacing).filter(([_, v]) => v > 0);

  return (
    <View style={styles.tokensContainer}>
      <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary }]}>Spacing Scale (4px base)</Text>
      {spacingEntries.map(([name, value]) => (
        <View key={name} style={[styles.spacingRow, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
          <View style={styles.spacingInfo}>
            <Text style={[styles.spacingName, { color: appColors.textPrimary }]}>spacing.{name}</Text>
            <Text style={[styles.spacingValue, { color: appColors.textMuted }]}>{value}px</Text>
          </View>
          <View style={[styles.spacingBar, { backgroundColor: appColors.bgInput }]}>
            <View style={[styles.spacingFill, { width: value * 4, backgroundColor: appColors.primaryDefault }]} />
          </View>
          <View style={styles.spacingPreview}>
            <View style={[styles.spacingBox, { width: value, height: value, backgroundColor: appColors.primaryDefault }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function RadiusSection() {
  const appColors = useAppColors();
  const radiusEntries = Object.entries(borderRadius);

  return (
    <View style={styles.tokensContainer}>
      <Text style={[styles.tokenGroupTitle, { color: appColors.textPrimary }]}>Border Radius</Text>
      <View style={styles.radiusGrid}>
        {radiusEntries.map(([name, value]) => (
          <View key={name} style={[styles.radiusItem, { backgroundColor: appColors.bgCard, borderColor: appColors.borderMuted }]}>
            <View 
              style={[
                styles.radiusPreview, 
                { borderRadius: Math.min(value, 48), backgroundColor: appColors.primaryDefault }
              ]} 
            />
            <Text style={[styles.radiusName, { color: appColors.textPrimary }]}>{name}</Text>
            <Text style={[styles.radiusValue, { color: appColors.textMuted }]}>{value}px</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  content: {
    padding: 32,
    maxWidth: 1000,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tokensContainer: {
    gap: 24,
  },
  tokenGroup: {
    marginBottom: 24,
  },
  tokenGroupTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorSwatch: {
    width: 140,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  colorPreview: {
    height: 60,
  },
  colorName: {
    fontSize: 14,
    fontWeight: "500",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  colorValue: {
    fontSize: 12,
    fontFamily: "monospace",
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 4,
  },
  // Icons section styles
  iconHeader: {
    marginBottom: 8,
  },
  iconSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  categoryFilter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconItem: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
  },
  iconName: {
    fontSize: 10,
    marginTop: 6,
    textAlign: "center",
  },
  // Typography styles
  fontFamilySection: {
    marginBottom: 32,
  },
  fontFamilyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  fontLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  fontValue: {
    fontSize: 18,
    fontWeight: "500",
  },
  typographyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  typographySample: {
    fontWeight: "500",
  },
  typographyInfo: {
    flexDirection: "row",
    gap: 8,
  },
  typographyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typographyBadgeText: {
    fontSize: 13,
    fontFamily: "monospace",
  },
  spacingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
  },
  spacingInfo: {
    width: 140,
  },
  spacingName: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  spacingValue: {
    fontSize: 12,
    marginTop: 4,
  },
  spacingBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  spacingFill: {
    height: "100%",
    borderRadius: 4,
  },
  spacingPreview: {
    width: 60,
    alignItems: "center",
  },
  spacingBox: {
    borderRadius: 4,
  },
  radiusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  radiusItem: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    width: 140,
    borderWidth: 1,
  },
  radiusPreview: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  radiusName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  radiusValue: {
    fontSize: 12,
    fontFamily: "monospace",
  },
});
