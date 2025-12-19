import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, Platform } from "react-native";
import { colors, borderRadius, spacing } from "../lib/tokens";
import { useComponentColors } from "../lib/ComponentTheme";
import { MMIcon, ICON_NAMES as SVG_ICON_NAMES } from "../components/icons/MMIcon";

// ============================================
// WHY WE CAN'T USE @metamask/design-system-react-native DIRECTLY
// ============================================
// 
// The official package imports native-only React Native modules like:
// - react-native/Libraries/ReactPrivate/ReactNativePrivateInitializeCore
// - Native animation drivers
// - Platform-specific renderers
//
// These are NOT compatible with react-native-web, which is required
// for our web-based design system documentation site.
//
// For a NATIVE iOS/Android app, you CAN import directly:
// import { Button, AvatarAccount, Icon } from "@metamask/design-system-react-native";
//
// For this WEB documentation site, we recreate the components using
// web-compatible primitives (View, Text, Pressable, etc.)

// Icon names are exported from MetaMaskIcon component

// ============================================
// ICON HELPER (maps old names to MMIcon)
// ============================================

type IconName = 
  | "arrow-back" | "arrow-forward" | "close" | "menu" | "search" | "copy" 
  | "check" | "chevron-down" | "chevron-right" | "chevron-up" | "add"
  | "remove" | "eye" | "eye-off" | "settings" | "wallet" | "globe"
  | "send" | "download" | "swap" | "qr-code" | "lock" | "unlock"
  | "trash" | "edit" | "info" | "warning" | "error" | "success"
  | "notification" | "heart" | "star" | "refresh" | "external-link";

// Map old icon names to new MMIcon names
const iconNameMap: Record<IconName, string> = {
  "arrow-back": "ArrowLeft",
  "arrow-forward": "ArrowRight",
  "close": "Close",
  "menu": "Menu",
  "search": "Search",
  "copy": "Copy",
  "check": "Check",
  "chevron-down": "ArrowDown",
  "chevron-right": "ArrowRight",
  "chevron-up": "ArrowUp",
  "add": "Add",
  "remove": "Close",
  "eye": "Eye",
  "eye-off": "EyeSlash",
  "settings": "Setting",
  "wallet": "Wallet",
  "globe": "Global",
  "send": "Send",
  "download": "Download",
  "swap": "SwapHorizontal",
  "qr-code": "QrCode",
  "lock": "Lock",
  "unlock": "LockSlash",
  "trash": "Trash",
  "edit": "Edit",
  "info": "Info",
  "warning": "Warning",
  "error": "Error",
  "success": "Confirmation",
  "notification": "Notification",
  "heart": "Heart",
  "star": "Star",
  "refresh": "Refresh",
  "external-link": "Share",
};

// Wrapper component for backward compatibility
function Icon({ 
  name, 
  size = 24, 
  color = colors.icon.default 
}: { 
  name: IconName; 
  size?: number; 
  color?: string;
}) {
  const mmIconName = iconNameMap[name] || "Info";
  const sizeKey = size <= 16 ? "xs" : size <= 20 ? "sm" : size <= 24 ? "md" : size <= 32 ? "lg" : "xl";
  
  // For the Icon wrapper, we pass color directly to MMIcon via its wrapper
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <MMIcon name={mmIconName} size={sizeKey} color="default" />
    </View>
  );
}

// ============================================
// METAMASK ICON COMPONENT
// ============================================

// MetaMask Icon component - uses real SVG icons from assets/icons/
export function MetaMaskIcon({ 
  name, 
  size = "md", 
  color = "default",
}: { 
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "alternative" | "muted" | "primary" | "error" | "success" | "warning";
}) {
  return <MMIcon name={name} size={size} color={color} />;
}

// Export icon names for the registry
export const METAMASK_ICON_NAMES = SVG_ICON_NAMES;

// ============================================
// PROP TYPES FOR INTERACTIVE CONTROLS
// ============================================

export type PropType = 
  | { type: "string"; default: string; placeholder?: string }
  | { type: "number"; default: number; min?: number; max?: number }
  | { type: "boolean"; default: boolean }
  | { type: "select"; default: string; options: string[] }
  | { type: "color"; default: string };

export interface PropDefinition {
  name: string;
  propType: PropType;
  description: string;
}

export interface ComponentVariant {
  name: string;
  description: string;
  props: Record<string, any>;
}

export interface ComponentEntry {
  name: string;
  slug: string;
  category: "primitives" | "components";
  description: string;
  component: React.ComponentType<any>;
  props: PropDefinition[];
  defaultProps: Record<string, any>;
  variants: ComponentVariant[];
  figmaUrl?: string;
}

// ============================================
// COMPONENT IMPLEMENTATIONS (Using MM Tokens)
// ============================================

// Button Component
function Button({
  label = "Button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
}: {
  label?: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}) {
  const themeColors = useComponentColors();
  
  const variantStyles = {
    primary: { backgroundColor: disabled ? themeColors.primary.muted : themeColors.primary.default },
    secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: themeColors.primary.default },
    tertiary: { backgroundColor: "transparent" },
    danger: { backgroundColor: disabled ? themeColors.error.muted : themeColors.error.default },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
    md: { paddingHorizontal: spacing[4], paddingVertical: spacing[3] },
    lg: { paddingHorizontal: spacing[6], paddingVertical: spacing[4] },
  };

  const textColors = {
    primary: themeColors.primary.inverse,
    secondary: themeColors.primary.default,
    tertiary: themeColors.primary.default,
    danger: themeColors.error.inverse,
  };

  return (
    <Pressable
      disabled={disabled || loading}
      style={{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: borderRadius.sm,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      <Text style={{ fontWeight: "600", fontSize: 16, color: textColors[variant] }}>
        {loading ? "Loading..." : label}
      </Text>
    </Pressable>
  );
}

// Input Component
function Input({
  placeholder = "Enter text...",
  value = "",
  label = "",
  error = "",
  disabled = false,
  onChangeText,
}: {
  placeholder?: string;
  value?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  onChangeText?: (text: string) => void;
}) {
  const themeColors = useComponentColors();
  const [internalValue, setInternalValue] = useState(value);
  
  const handleChange = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  return (
    <View style={{ width: "100%" }}>
      {label ? (
        <Text style={{ fontSize: 14, color: themeColors.text.alternative, marginBottom: spacing[2] }}>
          {label}
        </Text>
      ) : null}
      <TextInput
        style={{
          width: "100%",
          backgroundColor: themeColors.background.alternative,
          borderWidth: 1,
          borderColor: error ? themeColors.error.default : themeColors.border.muted,
          borderRadius: borderRadius.sm,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          color: themeColors.text.default,
          fontSize: 16,
          opacity: disabled ? 0.5 : 1,
        }}
        placeholder={placeholder}
        placeholderTextColor={themeColors.text.muted}
        value={onChangeText ? value : internalValue}
        onChangeText={handleChange}
        editable={!disabled}
      />
      {error ? (
        <Text style={{ fontSize: 12, color: themeColors.error.default, marginTop: spacing[1] }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

// Card Component
function Card({
  title = "Card Title",
  description = "Card description goes here",
  variant = "default",
  hasAction = false,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "elevated" | "outlined";
  hasAction?: boolean;
}) {
  const themeColors = useComponentColors();
  
  const variantStyles = {
    default: { backgroundColor: themeColors.background.section },
    elevated: { backgroundColor: themeColors.background.section },
    outlined: { backgroundColor: "transparent", borderWidth: 1, borderColor: themeColors.border.muted },
  };

  return (
    <View style={{ padding: spacing[4], borderRadius: borderRadius.md, ...variantStyles[variant] }}>
      <Text style={{ fontSize: 18, fontWeight: "600", color: themeColors.text.default, marginBottom: spacing[2] }}>
        {title}
      </Text>
      <Text style={{ fontSize: 16, color: themeColors.text.alternative, marginBottom: spacing[4] }}>
        {description}
      </Text>
      {hasAction && (
        <Pressable style={{
          alignSelf: "flex-start",
          backgroundColor: themeColors.primary.default,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[2],
          borderRadius: borderRadius.sm,
        }}>
          <Text style={{ color: themeColors.primary.inverse, fontWeight: "500", fontSize: 14 }}>
            Action
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// Badge Component
function Badge({
  label = "Badge",
  variant = "default",
  size = "md",
}: {
  label?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
}) {
  const themeColors = useComponentColors();
  
  const variantStyles = {
    default: { backgroundColor: themeColors.background.section },
    primary: { backgroundColor: themeColors.primary.muted },
    success: { backgroundColor: themeColors.success.muted },
    warning: { backgroundColor: themeColors.warning.muted },
    error: { backgroundColor: themeColors.error.muted },
  };

  const textColors = {
    default: themeColors.text.default,
    primary: themeColors.primary.default,
    success: themeColors.success.default,
    warning: themeColors.warning.default,
    error: themeColors.error.default,
  };

  const sizeStyles = {
    sm: { paddingHorizontal: spacing[2], paddingVertical: 2 },
    md: { paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
  };

  return (
    <View style={{ borderRadius: borderRadius.pill, ...variantStyles[variant], ...sizeStyles[size] }}>
      <Text style={{ fontWeight: "500", fontSize: 14, color: textColors[variant] }}>{label}</Text>
    </View>
  );
}

// Avatar Component
function Avatar({
  size = "md",
  name = "User",
  showBadge = false,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  name?: string;
  showBadge?: boolean;
}) {
  const sizeValues = { sm: 32, md: 40, lg: 48, xl: 64 };
  const fontSize = { sm: 12, md: 14, lg: 16, xl: 20 };
  const dimension = sizeValues[size];
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <View>
      <View style={[avatarStyles.container, { width: dimension, height: dimension }]}>
        <Text style={[avatarStyles.initials, { fontSize: fontSize[size] }]}>{initials}</Text>
      </View>
      {showBadge && <View style={avatarStyles.badge} />}
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontWeight: "600", color: colors.primary.default },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: colors.success.default,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.background.default,
  },
});

// Switch Component
function CustomSwitch({
  value = false,
  label = "",
  disabled = false,
  onValueChange,
}: {
  value?: boolean;
  label?: string;
  disabled?: boolean;
  onValueChange?: (value: boolean) => void;
}) {
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = onValueChange ? value : internalValue;

  const handlePress = () => {
    if (disabled) return;
    const newValue = !currentValue;
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Pressable style={switchStyles.container} onPress={handlePress} disabled={disabled}>
      <View style={[
        switchStyles.track, 
        currentValue ? { backgroundColor: colors.primary.default } : { backgroundColor: colors.border.default },
        disabled ? { opacity: 0.5 } : undefined
      ]}>
        <View style={[switchStyles.thumb, currentValue ? { marginLeft: 20 } : undefined]} />
      </View>
      {label ? <Text style={switchStyles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const switchStyles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  track: { width: 48, height: 28, borderRadius: 14, padding: 2 },
  thumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.text.default },
  label: { fontSize: 16, color: colors.text.default },
});

// Skeleton Component
function Skeleton({
  variant = "text",
  width = 100,
  height = 20,
}: {
  variant?: "text" | "circular" | "rectangular";
  width?: number;
  height?: number;
}) {
  const borderRadiusValue = variant === "circular" ? height / 2 : variant === "text" ? 4 : 8;
  return (
    <View
      style={[
        skeletonStyles.base,
        { width: variant === "circular" ? height : width, height, borderRadius: borderRadiusValue },
      ]}
    />
  );
}

const skeletonStyles = StyleSheet.create({
  base: { backgroundColor: colors.border.muted },
});

// Banner Component
function Banner({
  title = "Banner Title",
  description = "Banner description",
  variant = "info",
  dismissible = false,
}: {
  title?: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
  dismissible?: boolean;
}) {
  const colorMap = {
    info: { bg: colors.info.muted, border: colors.info.default, text: colors.info.default },
    success: { bg: colors.success.muted, border: colors.success.default, text: colors.success.default },
    warning: { bg: colors.warning.muted, border: colors.warning.default, text: colors.warning.default },
    error: { bg: colors.error.muted, border: colors.error.default, text: colors.error.default },
  };
  const c = colorMap[variant];

  return (
    <View style={[bannerStyles.container, { backgroundColor: c.bg, borderLeftColor: c.border }]}>
      <View style={bannerStyles.content}>
        <Text style={[bannerStyles.title, { color: c.text }]}>{title}</Text>
        <Text style={bannerStyles.description}>{description}</Text>
      </View>
      {dismissible && (
        <Pressable style={bannerStyles.dismiss}>
          <Text style={bannerStyles.dismissText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const bannerStyles = StyleSheet.create({
  container: {
    padding: spacing[4],
    borderRadius: borderRadius.sm,
    borderLeftWidth: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: spacing[1] },
  description: { fontSize: 14, color: colors.text.alternative },
  dismiss: { padding: spacing[1] },
  dismissText: { color: colors.text.muted, fontSize: 16 },
});

// Hub Header Component
function HubHeader({
  balance = "$100",
  label = "Available balance",
  primaryAction = "Add funds",
  secondaryAction = "",
  showAvatar = false,
}: {
  balance?: string;
  label?: string;
  primaryAction?: string;
  secondaryAction?: string;
  showAvatar?: boolean;
}) {
  const themeColors = useComponentColors();
  
  return (
    <View style={{
      backgroundColor: themeColors.background.section,
      padding: spacing[6],
      borderRadius: borderRadius.lg,
      alignItems: "center",
    }}>
      {showAvatar && (
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: themeColors.warning.default,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: spacing[4],
        }}>
          <Text style={{ fontSize: 24 }}>🦊</Text>
        </View>
      )}
      <Text style={{ fontSize: 32, fontWeight: "bold", color: themeColors.text.default, marginBottom: spacing[1] }}>
        {balance}
      </Text>
      <Text style={{ fontSize: 14, color: themeColors.text.alternative, marginBottom: spacing[6] }}>
        {label}
      </Text>
      <View style={{ flexDirection: "row", gap: spacing[3] }}>
        {primaryAction ? (
          <Pressable style={{
            backgroundColor: themeColors.primary.default,
            paddingHorizontal: spacing[6],
            paddingVertical: spacing[3],
            borderRadius: borderRadius.pill,
          }}>
            <Text style={{ color: themeColors.primary.inverse, fontWeight: "600", fontSize: 16 }}>
              {primaryAction}
            </Text>
          </Pressable>
        ) : null}
        {secondaryAction ? (
          <Pressable style={{
            borderWidth: 1,
            borderColor: themeColors.border.default,
            paddingHorizontal: spacing[6],
            paddingVertical: spacing[3],
            borderRadius: borderRadius.pill,
          }}>
            <Text style={{ color: themeColors.text.default, fontWeight: "600", fontSize: 16 }}>
              {secondaryAction}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const hubHeaderStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warning.default,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  avatarText: { fontSize: 24 },
  balance: { fontSize: 32, fontWeight: "bold", color: colors.text.default, marginBottom: spacing[1] },
  label: { fontSize: 14, color: colors.text.alternative, marginBottom: spacing[6] },
  actions: { flexDirection: "row", gap: spacing[3] },
  primaryButton: {
    backgroundColor: colors.primary.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.pill,
  },
  primaryButtonText: { color: colors.primary.inverse, fontWeight: "600", fontSize: 16 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.pill,
  },
  secondaryButtonText: { color: colors.text.default, fontWeight: "600", fontSize: 16 },
});

// Account Picker Component
function AccountPicker({
  name = "Account 1",
  connected = true,
  loading = false,
}: {
  name?: string;
  connected?: boolean;
  loading?: boolean;
}) {
  const themeColors = useComponentColors();
  
  if (loading) {
    return (
      <View style={{
        backgroundColor: themeColors.background.default,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.sm,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing[3],
        borderWidth: 1,
        borderColor: themeColors.border.muted,
      }}>
        <View style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: themeColors.border.muted }} />
        <View style={{ width: 80, height: 16, borderRadius: 4, backgroundColor: themeColors.border.muted }} />
      </View>
    );
  }

  // Jazzicon-style colors - warm earth tones like the reference
  const baseColor = "#8B4513"; // Saddle brown base
  const color1 = "#CD853F"; // Peru - lighter tan
  const color2 = "#A0522D"; // Sienna - medium brown
  const color3 = "#DEB887"; // Burlywood - light tan

  return (
    <Pressable style={{
      backgroundColor: themeColors.background.default,
      paddingLeft: spacing[2],
      paddingRight: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: borderRadius.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing[3],
      borderWidth: 1,
      borderColor: themeColors.border.muted,
    }}>
      {/* Jazzicon-style avatar - square with rounded corners */}
      <View style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: baseColor,
        overflow: "hidden",
      }}>
        {/* Geometric pattern matching reference */}
        <View style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          width: 0, 
          height: 0, 
          borderLeftWidth: 16, 
          borderRightWidth: 16, 
          borderBottomWidth: 32, 
          borderLeftColor: "transparent", 
          borderRightColor: "transparent", 
          borderBottomColor: color1 
        }} />
        <View style={{ 
          position: "absolute", 
          bottom: 0, 
          right: 0, 
          width: 20, 
          height: 20, 
          backgroundColor: color2,
          transform: [{ rotate: "45deg" }],
        }} />
        <View style={{ 
          position: "absolute", 
          top: 4, 
          right: 4, 
          width: 12, 
          height: 12, 
          backgroundColor: color3,
        }} />
      </View>
      <Text style={{ color: themeColors.text.default, fontWeight: "500", fontSize: 15 }}>{name}</Text>
      <MMIcon name="ArrowDown" size="sm" color="muted" />
    </Pressable>
  );
}

// Token Cell Component - Theme-aware
function TokenCell({
  symbol = "ETH",
  name = "Ethereum",
  balance = "1.5",
  value = "$3,000.00",
  change = "+2.5%",
  changePositive = true,
}: {
  symbol?: string;
  name?: string;
  balance?: string;
  value?: string;
  change?: string;
  changePositive?: boolean;
}) {
  const themeColors = useComponentColors();
  
  // Map symbols to icons
  const iconMap: Record<string, string> = {
    ETH: "Ethereum",
    BTC: "Coin",
    USDC: "Coin",
    USDT: "Coin",
    DAI: "Coin",
    MATIC: "Coin",
    default: "Coin",
  };
  const iconName = iconMap[symbol] || iconMap.default;
  
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[4],
      backgroundColor: themeColors.background.section,
      borderRadius: borderRadius.lg,
      minWidth: 340,
    }}>
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: themeColors.primary.muted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacing[3],
      }}>
        <MMIcon name={iconName} size="md" color="primary" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: themeColors.text.default }}>
          {name}
        </Text>
        <Text style={{ fontSize: 14, color: themeColors.text.alternative, marginTop: 2 }}>
          {balance} {symbol}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: themeColors.text.default }}>
          {value}
        </Text>
        <Text style={{ fontSize: 14, marginTop: 2, color: changePositive ? themeColors.success.default : themeColors.error.default }}>
          {change}
        </Text>
      </View>
    </View>
  );
}

// Footer Nav Component - Based on official MetaMask experimental-ds pattern
// 5 tabs: Home, Explore, Trade (center action), Activity, Rewards
function FooterNav({ 
  activeTab = "home",
  showActionSheet = false,
  onTabChange,
  onActionPress,
}: { 
  activeTab?: "home" | "explore" | "activity" | "rewards";
  showActionSheet?: boolean;
  onTabChange?: (tab: string) => void;
  onActionPress?: () => void;
}) {
  const [internalShowSheet, setInternalShowSheet] = useState(showActionSheet);
  const isSheetOpen = onActionPress ? showActionSheet : internalShowSheet;

  // Official MetaMask tab structure
  const leftTabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "explore", label: "Explore", icon: "🔍" },
  ];

  const rightTabs = [
    { id: "activity", label: "Activity", icon: "🕐" },
    { id: "rewards", label: "Rewards", icon: "🦊" },
  ];

  const handleActionPress = () => {
    if (onActionPress) {
      onActionPress();
    } else {
      setInternalShowSheet(!internalShowSheet);
    }
  };

  const handleTabPress = (tabId: string) => {
    onTabChange?.(tabId);
  };

  const actionSheetItems = [
    { icon: "↑", label: "Send", color: colors.primary.default },
    { icon: "↓", label: "Receive", color: colors.success.default },
    { icon: "⇄", label: "Swap", color: colors.warning.default },
    { icon: "⊞", label: "Buy", color: colors.info.default },
  ];

  return (
    <View style={footerNavStyles.wrapper}>
      {/* Action Sheet */}
      {isSheetOpen && (
        <View style={footerNavStyles.actionSheet}>
          <View style={footerNavStyles.sheetHandle} />
          <View style={footerNavStyles.sheetContent}>
            {actionSheetItems.map((item) => (
              <Pressable key={item.label} style={footerNavStyles.sheetItem}>
                <View style={[footerNavStyles.sheetIconWrapper, { backgroundColor: `${item.color}20` }]}>
                  <Text style={{ fontSize: 24, color: item.color }}>{item.icon}</Text>
                </View>
                <Text style={footerNavStyles.sheetLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Nav Bar */}
    <View style={footerNavStyles.container}>
        {/* Left tabs */}
        {leftTabs.map((tab) => (
          <Pressable key={tab.id} style={footerNavStyles.tab} onPress={() => handleTabPress(tab.id)}>
            <Text style={{ fontSize: 22, color: activeTab === tab.id ? colors.primary.default : colors.text.alternative }}>
              {tab.icon}
            </Text>
          <Text style={activeTab === tab.id ? footerNavStyles.labelActive : footerNavStyles.label}>
            {tab.label}
          </Text>
        </Pressable>
      ))}

        {/* Center Trade Action Button */}
        <Pressable style={footerNavStyles.actionButton} onPress={handleActionPress}>
          <View style={[footerNavStyles.actionButtonInner, isSheetOpen ? footerNavStyles.actionButtonActive : undefined]}>
            <Text style={{ fontSize: 28, color: "#FFFFFF", fontWeight: "300" }}>
              {isSheetOpen ? "✕" : "+"}
            </Text>
          </View>
          <Text style={footerNavStyles.actionLabel}>Trade</Text>
        </Pressable>

        {/* Right tabs */}
        {rightTabs.map((tab) => (
          <Pressable key={tab.id} style={footerNavStyles.tab} onPress={() => handleTabPress(tab.id)}>
            <Text style={{ fontSize: 22, color: activeTab === tab.id ? colors.primary.default : colors.text.alternative }}>
              {tab.icon}
            </Text>
            <Text style={activeTab === tab.id ? footerNavStyles.labelActive : footerNavStyles.label}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const footerNavStyles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.section,
    borderTopWidth: 1,
    borderTopColor: colors.border.muted,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    alignItems: "flex-end",
  },
  tab: { 
    flex: 1, 
    alignItems: "center", 
    paddingVertical: spacing[2],
    gap: spacing[1],
  },
  label: { fontSize: 11, color: colors.text.alternative },
  labelActive: { fontSize: 11, color: colors.primary.default, fontWeight: "600" },
  actionButton: {
    flex: 1,
    alignItems: "center",
    marginTop: -spacing[4],
  },
  actionButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonActive: {
    backgroundColor: colors.text.muted,
  },
  actionLabel: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: "500",
    marginTop: spacing[1],
  },
  actionSheet: {
    position: "absolute",
    bottom: 80,
    left: spacing[4],
    right: spacing[4],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: spacing[4],
  },
  sheetContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  sheetItem: {
    alignItems: "center",
    gap: spacing[2],
  },
  sheetIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetLabel: {
    fontSize: 12,
    color: colors.text.default,
    fontWeight: "500",
  },
});

// Empty State Component
function EmptyState({
  title = "No items found",
  description = "There are no items to display",
  actionLabel = "",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
}) {
  return (
    <View style={emptyStateStyles.container}>
      <View style={emptyStateStyles.iconContainer}>
        <Text style={emptyStateStyles.icon}>📭</Text>
      </View>
      <Text style={emptyStateStyles.title}>{title}</Text>
      <Text style={emptyStateStyles.description}>{description}</Text>
      {actionLabel ? (
        <Pressable style={emptyStateStyles.action}>
          <Text style={emptyStateStyles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const emptyStateStyles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: spacing[12], paddingHorizontal: spacing[6] },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border.muted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  icon: { fontSize: 24 },
  title: { fontSize: 18, fontWeight: "600", color: colors.text.default, marginBottom: spacing[2], textAlign: "center" },
  description: { fontSize: 16, color: colors.text.alternative, textAlign: "center", marginBottom: spacing[6] },
  action: {
    backgroundColor: colors.primary.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
  },
  actionText: { color: colors.primary.inverse, fontWeight: "600", fontSize: 16 },
});

// ============================================
// NEW COMPONENTS
// ============================================

// Dialog Component
function Dialog({
  open = true,
  title = "Dialog Title",
  description = "",
  primaryAction = "Confirm",
  secondaryAction = "Cancel",
  variant = "default",
}: {
  open?: boolean;
  title?: string;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
  variant?: "default" | "danger";
}) {
  if (!open) return null;
  
  return (
    <View style={dialogStyles.overlay}>
      <View style={dialogStyles.container}>
        <Text style={dialogStyles.title}>{title}</Text>
        {description ? <Text style={dialogStyles.description}>{description}</Text> : null}
        <View style={dialogStyles.actions}>
          {secondaryAction ? (
            <Pressable style={dialogStyles.secondaryButton}>
              <Text style={dialogStyles.secondaryButtonText}>{secondaryAction}</Text>
            </Pressable>
          ) : null}
          <Pressable style={variant === "danger" ? dialogStyles.dangerButton : dialogStyles.primaryButton}>
            <Text style={dialogStyles.primaryButtonText}>{primaryAction}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const dialogStyles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlay.default,
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.lg,
    padding: spacing[6],
    width: 320,
    maxWidth: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.default,
    marginBottom: spacing[2],
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.text.alternative,
    textAlign: "center",
    marginBottom: spacing[6],
  },
  actions: {
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
    flex: 1,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: colors.error.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
    flex: 1,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
    flex: 1,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.primary.inverse,
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: colors.text.default,
    fontWeight: "600",
    fontSize: 16,
  },
});

// Select Component
function Select({
  label = "",
  value = "Option 1",
  options = ["Option 1", "Option 2", "Option 3"],
  placeholder = "Select an option",
  disabled = false,
}: {
  label?: string;
  value?: string;
  options?: string[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <View style={selectStyles.container}>
      {label ? <Text style={selectStyles.label}>{label}</Text> : null}
      <Pressable style={disabled ? selectStyles.selectDisabled : selectStyles.select}>
        <Text style={value ? selectStyles.value : selectStyles.placeholder}>
          {value || placeholder}
        </Text>
        <Text style={selectStyles.chevron}>▼</Text>
      </Pressable>
    </View>
  );
}

const selectStyles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, color: colors.text.alternative, marginBottom: spacing[2] },
  select: {
    backgroundColor: colors.background.alternative,
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectDisabled: {
    backgroundColor: colors.background.alternative,
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    opacity: 0.5,
  },
  value: { fontSize: 16, color: colors.text.default },
  placeholder: { fontSize: 16, color: colors.text.muted },
  chevron: { fontSize: 12, color: colors.text.muted },
});

// Page Header Component
function PageHeader({
  title = "Page Title",
  showBack = false,
  action = "",
}: {
  title?: string;
  showBack?: boolean;
  action?: string;
}) {
  return (
    <View style={pageHeaderStyles.container}>
      <View style={pageHeaderStyles.left}>
        {showBack ? (
          <Pressable style={pageHeaderStyles.backButton}>
            <Text style={pageHeaderStyles.backIcon}>←</Text>
          </Pressable>
        ) : null}
        <Text style={pageHeaderStyles.title}>{title}</Text>
      </View>
      {action ? (
        <Pressable style={pageHeaderStyles.actionButton}>
          <Text style={pageHeaderStyles.actionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const pageHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.background.default,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.muted,
  },
  left: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  backButton: { padding: spacing[2] },
  backIcon: { fontSize: 20, color: colors.text.default },
  title: { fontSize: 18, fontWeight: "600", color: colors.text.default },
  actionButton: { padding: spacing[2] },
  actionText: { fontSize: 16, color: colors.primary.default, fontWeight: "500" },
});

// Section Header Component
function SectionHeader({
  title = "Section",
  action = "",
}: {
  title?: string;
  action?: string;
}) {
  return (
    <View style={sectionHeaderStyles.container}>
      <Text style={sectionHeaderStyles.title}>{title}</Text>
      {action ? (
        <Pressable>
          <Text style={sectionHeaderStyles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[3],
  },
  title: { fontSize: 14, fontWeight: "600", color: colors.text.alternative, textTransform: "uppercase", letterSpacing: 1 },
  action: { fontSize: 14, color: colors.primary.default, fontWeight: "500" },
});

// Divider Component
function Divider({
  variant = "full",
}: {
  variant?: "full" | "inset" | "middle";
}) {
  const insetStyles = {
    full: {},
    inset: { marginLeft: spacing[4] },
    middle: { marginHorizontal: spacing[4] },
  };
  
  return <View style={[dividerStyles.divider, insetStyles[variant]]} />;
}

const dividerStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.border.muted,
  },
});

// List Item Component
function ListItem({
  title = "List Item",
  subtitle = "",
  leftIcon = "",
  showChevron = false,
  variant = "default",
}: {
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  showChevron?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <Pressable style={listItemStyles.container}>
      {leftIcon ? (
        <View style={listItemStyles.iconContainer}>
          <Text style={listItemStyles.icon}>{leftIcon}</Text>
        </View>
      ) : null}
      <View style={listItemStyles.content}>
        <Text style={variant === "destructive" ? listItemStyles.titleDestructive : listItemStyles.title}>
          {title}
        </Text>
        {subtitle ? <Text style={listItemStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showChevron ? <Text style={listItemStyles.chevron}>›</Text> : null}
    </Pressable>
  );
}

const listItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.section,
    gap: spacing[3],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 18 },
  content: { flex: 1 },
  title: { fontSize: 16, color: colors.text.default, fontWeight: "500" },
  titleDestructive: { fontSize: 16, color: colors.error.default, fontWeight: "500" },
  subtitle: { fontSize: 14, color: colors.text.alternative, marginTop: 2 },
  chevron: { fontSize: 24, color: colors.text.muted },
});

// Chip Component
function Chip({
  label = "Chip",
  selected = false,
  disabled = false,
}: {
  label?: string;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable style={[
      chipStyles.container,
      selected ? chipStyles.selected : chipStyles.default,
      disabled ? { opacity: 0.5 } : undefined,
    ]}>
      <Text style={selected ? chipStyles.labelSelected : chipStyles.label}>{label}</Text>
    </Pressable>
  );
}

const chipStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.pill,
  },
  default: {
    backgroundColor: colors.background.section,
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  selected: {
    backgroundColor: colors.primary.muted,
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  label: { fontSize: 14, color: colors.text.default },
  labelSelected: { fontSize: 14, color: colors.primary.default, fontWeight: "500" },
});

// Toast Component
function Toast({
  message = "Toast message",
  variant = "default",
  action = "",
}: {
  message?: string;
  variant?: "default" | "success" | "error";
  action?: string;
}) {
  const variantStyles = {
    default: { backgroundColor: colors.background.section },
    success: { backgroundColor: colors.success.muted },
    error: { backgroundColor: colors.error.muted },
  };
  const textColors = {
    default: colors.text.default,
    success: colors.success.default,
    error: colors.error.default,
  };

  return (
    <View style={[toastStyles.container, variantStyles[variant]]}>
      <Text style={[toastStyles.message, { color: textColors[variant] }]}>{message}</Text>
      {action ? <Text style={toastStyles.action}>{action}</Text> : null}
    </View>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
  },
  message: { fontSize: 14, flex: 1 },
  action: { fontSize: 14, color: colors.primary.default, fontWeight: "600", marginLeft: spacing[3] },
});

// Progress Bar Component
function ProgressBar({
  progress = 50,
  variant = "primary",
  showLabel = false,
}: {
  progress?: number;
  variant?: "primary" | "success" | "warning" | "error";
  showLabel?: boolean;
}) {
  const progressColors = {
    primary: colors.primary.default,
    success: colors.success.default,
    warning: colors.warning.default,
    error: colors.error.default,
  };

  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.track}>
        <View style={[progressStyles.fill, { flex: normalizedProgress / 100, backgroundColor: progressColors[variant] }]} />
        <View style={{ flex: (100 - normalizedProgress) / 100 }} />
      </View>
      {showLabel ? <Text style={progressStyles.label}>{progress}%</Text> : null}
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  track: { flex: 1, height: 8, backgroundColor: colors.border.muted, borderRadius: 4, overflow: "hidden", flexDirection: "row" },
  fill: { height: 8, borderRadius: 4 },
  label: { fontSize: 14, color: colors.text.alternative, minWidth: 40, textAlign: "right" },
});

// ============================================
// ADDITIONAL COMPONENTS
// ============================================

// Avatar Network Component
function AvatarNetwork({
  name = "Ethereum",
  size = "md",
  imageUrl = "",
}: {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  imageUrl?: string;
}) {
  const sizeValues = { xs: 16, sm: 24, md: 32, lg: 40 };
  const fontSize = { xs: 8, sm: 10, md: 12, lg: 16 };
  const dimension = sizeValues[size];
  
  // Network colors/icons
  const networkColors: Record<string, string> = {
    "Ethereum": "#627EEA",
    "Polygon": "#8247E5",
    "Arbitrum": "#28A0F0",
    "Optimism": "#FF0420",
    "Avalanche": "#E84142",
    "BNB": "#F0B90B",
  };

  const bgColor = networkColors[name] || colors.primary.default;
  const initial = name.charAt(0).toUpperCase();

  return (
    <View style={[avatarNetworkStyles.container, { width: dimension, height: dimension, backgroundColor: bgColor }]}>
      <Text style={[avatarNetworkStyles.initial, { fontSize: fontSize[size] }]}>{initial}</Text>
    </View>
  );
}

const avatarNetworkStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#FFFFFF", fontWeight: "bold" },
});

// Avatar Token Component
function AvatarToken({
  symbol = "ETH",
  name = "Ethereum",
  size = "md",
}: {
  symbol?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  const themeColors = useComponentColors();
  const sizeValues = { sm: 24, md: 32, lg: 48 };
  const iconSizes: Record<string, "xs" | "sm" | "md"> = { sm: "xs", md: "sm", lg: "md" };
  const dimension = sizeValues[size];

  // Map symbols to icons
  const iconMap: Record<string, string> = {
    ETH: "Ethereum",
    BTC: "Coin",
    USDC: "Coin",
    USDT: "Coin",
    default: "Coin",
  };
  const iconName = iconMap[symbol] || iconMap.default;

  return (
    <View style={{
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: themeColors.primary.muted,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <MMIcon name={iconName} size={iconSizes[size]} color="primary" />
    </View>
  );
}

// Button Icon Component
function ButtonIcon({
  icon = "close",
  size = "md",
  variant = "default",
  disabled = false,
}: {
  icon?: IconName | string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "danger";
  disabled?: boolean;
}) {
  const sizeStyles = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  };
  const iconSize = { sm: 16, md: 20, lg: 24 };
  
  const variantStyles = {
    default: { backgroundColor: colors.background.section },
    primary: { backgroundColor: colors.primary.muted },
    danger: { backgroundColor: colors.error.muted },
  };
  const iconColors = {
    default: colors.icon.default,
    primary: colors.primary.default,
    danger: colors.error.default,
  };

  // Map common string icons to IconName
  const iconNameMap: Record<string, IconName> = {
    "✕": "close",
    "←": "arrow-back",
    "+": "add",
    "☰": "menu",
  };
  const resolvedIcon = iconNameMap[icon] || icon;
  const isValidIcon = typeof resolvedIcon === "string" && [
    "arrow-back", "arrow-forward", "close", "menu", "search", "copy",
    "check", "chevron-down", "chevron-right", "chevron-up", "add",
    "remove", "eye", "eye-off", "settings", "wallet", "globe",
    "send", "download", "swap", "qr-code", "lock", "unlock",
    "trash", "edit", "info", "warning", "error", "success",
    "notification", "heart", "star", "refresh", "external-link"
  ].includes(resolvedIcon);

  return (
    <Pressable 
      disabled={disabled}
      style={[
        buttonIconStyles.container, 
        sizeStyles[size], 
        variantStyles[variant],
        disabled ? { opacity: 0.5 } : undefined
      ]}
    >
      {isValidIcon ? (
        <Icon name={resolvedIcon as IconName} size={iconSize[size]} color={iconColors[variant]} />
      ) : (
      <Text style={[buttonIconStyles.icon, { fontSize: iconSize[size], color: iconColors[variant] }]}>
        {icon}
      </Text>
      )}
    </Pressable>
  );
}

const buttonIconStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontWeight: "500" },
});

// Checkbox Component
function Checkbox({
  checked = false,
  label = "",
  disabled = false,
  onValueChange,
}: {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  onValueChange?: (checked: boolean) => void;
}) {
  const [internalChecked, setInternalChecked] = useState(checked);
  const currentChecked = onValueChange ? checked : internalChecked;

  const handlePress = () => {
    if (disabled) return;
    const newValue = !currentChecked;
    setInternalChecked(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Pressable 
      style={[checkboxStyles.container, disabled ? { opacity: 0.5 } : undefined]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={currentChecked ? checkboxStyles.boxChecked : checkboxStyles.box}>
        {currentChecked ? <Icon name="check" size={16} color="#FFFFFF" /> : null}
      </View>
      {label ? <Text style={checkboxStyles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const checkboxStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.xs,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  boxChecked: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  label: { fontSize: 16, color: colors.text.default },
});

// Tabs Component
function Tabs({
  tabs = ["Tab 1", "Tab 2", "Tab 3"],
  activeIndex = 0,
  variant = "default",
  onTabChange,
}: {
  tabs?: string[];
  activeIndex?: number;
  variant?: "default" | "pills";
  onTabChange?: (index: number) => void;
}) {
  const [internalIndex, setInternalIndex] = useState(activeIndex);
  const currentIndex = onTabChange ? activeIndex : internalIndex;

  const handleTabPress = (index: number) => {
    setInternalIndex(index);
    onTabChange?.(index);
  };

  return (
    <View style={variant === "pills" ? tabsStyles.containerPills : tabsStyles.container}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab}
          onPress={() => handleTabPress(index)}
          style={
            variant === "pills"
              ? index === currentIndex ? tabsStyles.tabPillActive : tabsStyles.tabPill
              : index === currentIndex ? tabsStyles.tabActive : tabsStyles.tab
          }
        >
          <Text style={index === currentIndex ? tabsStyles.tabTextActive : tabsStyles.tabText}>
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const tabsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.muted,
  },
  containerPills: {
    flexDirection: "row",
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.sm,
    padding: spacing[1],
    gap: spacing[1],
  },
  tab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.default,
  },
  tabPill: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.xs,
    alignItems: "center",
  },
  tabPillActive: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.xs,
    alignItems: "center",
    backgroundColor: colors.background.default,
  },
  tabText: { fontSize: 14, color: colors.text.alternative, fontWeight: "500" },
  tabTextActive: { fontSize: 14, color: colors.primary.default, fontWeight: "600" },
});

// TextArea Component
function TextArea({
  placeholder = "Enter text...",
  value = "",
  label = "",
  rows = 4,
  disabled = false,
}: {
  placeholder?: string;
  value?: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <View style={textAreaStyles.container}>
      {label ? <Text style={textAreaStyles.label}>{label}</Text> : null}
      <TextInput
        style={[textAreaStyles.input, { height: rows * 24 }, disabled ? { opacity: 0.5 } : undefined]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        value={value}
        editable={!disabled}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const textAreaStyles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, color: colors.text.alternative, marginBottom: spacing[2] },
  input: {
    backgroundColor: colors.background.alternative,
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.text.default,
    fontSize: 16,
  },
});

// Badge Count Component
function BadgeCount({
  count = 0,
  max = 99,
  variant = "default",
}: {
  count?: number;
  max?: number;
  variant?: "default" | "primary" | "error";
}) {
  const displayCount = count > max ? `${max}+` : String(count);
  
  const variantStyles = {
    default: { backgroundColor: colors.background.section },
    primary: { backgroundColor: colors.primary.default },
    error: { backgroundColor: colors.error.default },
  };
  const textColors = {
    default: colors.text.default,
    primary: colors.primary.inverse,
    error: colors.error.inverse,
  };

  if (count === 0) return null;

  return (
    <View style={[badgeCountStyles.container, variantStyles[variant]]}>
      <Text style={[badgeCountStyles.text, { color: textColors[variant] }]}>{displayCount}</Text>
    </View>
  );
}

const badgeCountStyles = StyleSheet.create({
  container: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: spacing[2],
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 12, fontWeight: "bold" },
});

// Network Badge Component  
function NetworkBadge({
  network = "Ethereum",
  size = "sm",
}: {
  network?: string;
  size?: "xs" | "sm";
}) {
  const sizeValues = { xs: 12, sm: 16 };
  const dimension = sizeValues[size];
  
  const networkColors: Record<string, string> = {
    "Ethereum": "#627EEA",
    "Polygon": "#8247E5", 
    "Arbitrum": "#28A0F0",
    "Optimism": "#FF0420",
  };

  return (
    <View style={[networkBadgeStyles.container, { 
      width: dimension, 
      height: dimension, 
      backgroundColor: networkColors[network] || colors.primary.default 
    }]}>
      <Text style={[networkBadgeStyles.text, { fontSize: dimension * 0.5 }]}>
        {network.charAt(0)}
      </Text>
    </View>
  );
}

const networkBadgeStyles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.background.default,
  },
  text: { color: "#FFFFFF", fontWeight: "bold" },
});

// ============================================
// NEW PRIMITIVES
// ============================================

// Radio Component
function Radio({
  selected = false,
  label = "",
  disabled = false,
  onPress,
}: {
  selected?: boolean;
  label?: string;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable 
      style={[radioStyles.container, disabled ? { opacity: 0.5 } : undefined]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={selected ? radioStyles.outerSelected : radioStyles.outer}>
        {selected && <View style={radioStyles.inner} />}
      </View>
      {label ? <Text style={radioStyles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const radioStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  outer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  outerSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.default,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.default,
  },
  label: { fontSize: 16, color: colors.text.default },
});

// RadioGroup Component
function RadioGroup({
  options = "Option 1,Option 2,Option 3",
  selected = 0,
  disabled = false,
  onSelectionChange,
}: {
  options?: string;
  selected?: number;
  disabled?: boolean;
  onSelectionChange?: (index: number) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(selected);
  const currentSelected = onSelectionChange ? selected : internalSelected;
  const optionList = typeof options === 'string' ? options.split(',') : options;

  const handleSelect = (index: number) => {
    if (disabled) return;
    setInternalSelected(index);
    onSelectionChange?.(index);
  };

  return (
    <View style={radioGroupStyles.container}>
      {optionList.map((option, index) => (
        <Radio 
          key={option} 
          label={option.trim()} 
          selected={index === currentSelected} 
          disabled={disabled}
          onPress={() => handleSelect(index)}
        />
      ))}
    </View>
  );
}

const radioGroupStyles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
});

// Spinner Component
function Spinner({
  size = "md",
  variant = "primary",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default" | "inverse";
}) {
  const sizeValues = { sm: 20, md: 32, lg: 48 };
  const dimension = sizeValues[size];
  const colorMap = {
    primary: colors.primary.default,
    default: colors.text.alternative,
    inverse: colors.text.default,
  };

  return (
    <View style={[spinnerStyles.container, { width: dimension, height: dimension }]}>
      <View style={[spinnerStyles.spinner, { 
        width: dimension, 
        height: dimension, 
        borderWidth: dimension / 8,
        borderColor: colors.border.muted,
        borderTopColor: colorMap[variant],
      }]} />
    </View>
  );
}

const spinnerStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    borderRadius: 999,
  },
});

// Tooltip Component
function Tooltip({
  text = "Tooltip text",
  position = "top",
}: {
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <View style={tooltipStyles.container}>
      <View style={tooltipStyles.trigger}>
        <Icon name="info" size={16} color={colors.text.alternative} />
      </View>
      <View style={[
        tooltipStyles.tooltip, 
        position === "top" ? tooltipStyles.positionTop : 
        position === "bottom" ? tooltipStyles.positionBottom :
        position === "left" ? tooltipStyles.positionLeft : 
        tooltipStyles.positionRight
      ]}>
        <Text style={tooltipStyles.text}>{text}</Text>
      </View>
    </View>
  );
}

const tooltipStyles = StyleSheet.create({
  container: {
    position: "relative",
  },
  trigger: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.section,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: colors.background.section,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
    minWidth: 120,
  },
  positionTop: {
    bottom: 32,
    left: 0,
  },
  positionBottom: {
    top: 32,
    left: 0,
  },
  positionLeft: {
    right: 32,
    top: 0,
  },
  positionRight: {
    left: 32,
    top: 0,
  },
  text: {
    color: colors.text.default,
    fontSize: 14,
  },
});

// Link Component
function Link({
  text = "Link text",
  variant = "default",
  disabled = false,
}: {
  text?: string;
  variant?: "default" | "primary" | "subtle";
  disabled?: boolean;
}) {
  const colorMap = {
    default: colors.primary.default,
    primary: colors.primary.default,
    subtle: colors.text.alternative,
  };

  return (
    <Pressable disabled={disabled} style={disabled ? { opacity: 0.5 } : undefined}>
      <Text style={[linkStyles.text, { color: colorMap[variant] }]}>{text}</Text>
    </Pressable>
  );
}

const linkStyles = StyleSheet.create({
  text: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

// Slider Component
function Slider({
  value = 50,
  min = 0,
  max = 100,
  showValue = false,
  disabled = false,
}: {
  value?: number;
  min?: number;
  max?: number;
  showValue?: boolean;
  disabled?: boolean;
}) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <View style={[sliderStyles.container, disabled ? sliderStyles.disabled : undefined]}>
      <View style={sliderStyles.track}>
        <View style={[sliderStyles.fill, { flex: percentage / 100 }]} />
        <View style={[sliderStyles.trackRemaining, { flex: (100 - percentage) / 100 }]} />
      </View>
      {showValue ? <Text style={sliderStyles.value}>{value}</Text> : null}
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border.muted,
    borderRadius: 3,
    flexDirection: "row",
    overflow: "hidden",
  },
  fill: {
    height: 6,
    backgroundColor: colors.primary.default,
    borderRadius: 3,
  },
  trackRemaining: {
    height: 6,
  },
  value: {
    fontSize: 14,
    color: colors.text.alternative,
    minWidth: 32,
    textAlign: "right",
  },
});

// Accordion Component
function Accordion({
  title = "Accordion Title",
  content = "Accordion content goes here...",
  expanded = false,
}: {
  title?: string;
  content?: string;
  expanded?: boolean;
}) {
  return (
    <View style={accordionStyles.container}>
      <Pressable style={accordionStyles.header}>
        <Text style={accordionStyles.title}>{title}</Text>
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.text.muted} />
      </Pressable>
      {expanded && (
        <View style={accordionStyles.content}>
          <Text style={accordionStyles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const accordionStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  icon: {
    fontSize: 12,
    color: colors.text.muted,
  },
  content: {
    padding: spacing[4],
    paddingTop: 0,
  },
  contentText: {
    fontSize: 14,
    color: colors.text.alternative,
    lineHeight: 20,
  },
});

// BottomSheet Component
function BottomSheet({
  title = "Bottom Sheet",
  visible = true,
  hasHandle = true,
}: {
  title?: string;
  visible?: boolean;
  hasHandle?: boolean;
}) {
  if (!visible) return null;

  return (
    <View style={bottomSheetStyles.container}>
      <View style={bottomSheetStyles.sheet}>
        {hasHandle && <View style={bottomSheetStyles.handle} />}
        <View style={bottomSheetStyles.header}>
          <Text style={bottomSheetStyles.title}>{title}</Text>
          <Pressable style={bottomSheetStyles.closeButton}>
            <Icon name="close" size={20} color={colors.text.muted} />
          </Pressable>
        </View>
        <View style={bottomSheetStyles.content}>
          <Text style={bottomSheetStyles.placeholder}>Sheet content goes here</Text>
        </View>
      </View>
    </View>
  );
}

const bottomSheetStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.overlay.default,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    minHeight: 200,
  },
  sheet: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.muted,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.default,
  },
  closeButton: {
    padding: spacing[2],
  },
  closeText: {
    fontSize: 18,
    color: colors.text.muted,
  },
  content: {
    padding: spacing[4],
    minHeight: 100,
  },
  placeholder: {
    color: colors.text.alternative,
    fontSize: 14,
  },
});

// Popover Component
function Popover({
  trigger = "Click me",
  content = "Popover content",
  visible = true,
}: {
  trigger?: string;
  content?: string;
  visible?: boolean;
}) {
  return (
    <View style={popoverStyles.container}>
      <Pressable style={popoverStyles.trigger}>
        <Text style={popoverStyles.triggerText}>{trigger}</Text>
      </Pressable>
      {visible && (
        <View style={popoverStyles.popover}>
          <Text style={popoverStyles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const popoverStyles = StyleSheet.create({
  container: {
    position: "relative",
  },
  trigger: {
    backgroundColor: colors.background.section,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
  },
  triggerText: {
    color: colors.text.default,
    fontSize: 14,
  },
  popover: {
    position: "absolute",
    top: 48,
    left: 0,
    backgroundColor: colors.background.section,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.sm,
    minWidth: 150,
    borderWidth: 1,
    borderColor: colors.border.muted,
  },
  content: {
    color: colors.text.default,
    fontSize: 14,
  },
});

// SegmentedControl Component
function SegmentedControl({
  segments = "Option 1,Option 2",
  selected = 0,
  disabled = false,
  onSelectionChange,
}: {
  segments?: string;
  selected?: number;
  disabled?: boolean;
  onSelectionChange?: (index: number) => void;
}) {
  const [internalSelected, setInternalSelected] = useState(selected);
  const currentSelected = onSelectionChange ? selected : internalSelected;
  const segmentList = typeof segments === 'string' ? segments.split(',') : segments;

  const handleSelect = (index: number) => {
    if (disabled) return;
    setInternalSelected(index);
    onSelectionChange?.(index);
  };
  
  return (
    <View style={[segmentedStyles.container, disabled ? { opacity: 0.5 } : undefined]}>
      {segmentList.map((segment, index) => (
        <Pressable 
          key={segment} 
          style={index === currentSelected ? segmentedStyles.segmentActive : segmentedStyles.segment}
          onPress={() => handleSelect(index)}
          disabled={disabled}
        >
          <Text style={index === currentSelected ? segmentedStyles.textActive : segmentedStyles.text}>
            {segment.trim()}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const segmentedStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.sm,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    alignItems: "center",
    borderRadius: borderRadius.xs,
  },
  segmentActive: {
    flex: 1,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    alignItems: "center",
    borderRadius: borderRadius.xs,
    backgroundColor: colors.primary.default,
  },
  text: {
    fontSize: 14,
    color: colors.text.alternative,
    fontWeight: "500",
  },
  textActive: {
    fontSize: 14,
    color: colors.primary.inverse,
    fontWeight: "600",
  },
});

// PasswordInput Component
function PasswordInput({
  placeholder = "Enter password",
  value = "",
  label = "",
  showPassword = false,
  error = "",
}: {
  placeholder?: string;
  value?: string;
  label?: string;
  showPassword?: boolean;
  error?: string;
}) {
  return (
    <View style={passwordInputStyles.container}>
      {label ? <Text style={passwordInputStyles.label}>{label}</Text> : null}
      <View style={[passwordInputStyles.inputContainer, error ? { borderColor: colors.error.default } : undefined]}>
        <TextInput
          style={passwordInputStyles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          value={value}
          secureTextEntry={!showPassword}
        />
        <Pressable style={passwordInputStyles.toggle}>
          <Icon name={showPassword ? "eye" : "eye-off"} size={20} color={colors.text.muted} />
        </Pressable>
      </View>
      {error ? <Text style={passwordInputStyles.error}>{error}</Text> : null}
    </View>
  );
}

const passwordInputStyles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 14, color: colors.text.alternative, marginBottom: spacing[2] },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.alternative,
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: borderRadius.sm,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.text.default,
    fontSize: 16,
  },
  toggle: {
    padding: spacing[3],
  },
  toggleText: {
    fontSize: 18,
  },
  error: { fontSize: 12, color: colors.error.default, marginTop: spacing[1] },
});

// SearchBar Component
function SearchBar({
  placeholder = "Search...",
  value = "",
  showClear = false,
}: {
  placeholder?: string;
  value?: string;
  showClear?: boolean;
}) {
  return (
    <View style={searchBarStyles.container}>
      <Icon name="search" size={18} color={colors.text.muted} />
      <TextInput
        style={searchBarStyles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        value={value}
      />
      {showClear && value && (
        <Pressable style={searchBarStyles.clear}>
          <Icon name="close" size={16} color={colors.text.muted} />
        </Pressable>
      )}
    </View>
  );
}

const searchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.alternative,
    borderWidth: 1,
    borderColor: colors.border.muted,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing[4],
  },
  icon: {
    fontSize: 16,
    marginRight: spacing[2],
  },
  input: {
    flex: 1,
    paddingVertical: spacing[3],
    color: colors.text.default,
    fontSize: 16,
  },
  clear: {
    padding: spacing[2],
  },
  clearText: {
    color: colors.text.muted,
    fontSize: 14,
  },
});

// ============================================
// WALLET-SPECIFIC COMPONENTS
// ============================================

// TransactionCell Component
function TransactionCell({
  type = "send",
  status = "confirmed",
  amount = "-0.5 ETH",
  value = "$1,000.00",
  address = "0x1234...5678",
  timestamp = "2 hours ago",
}: {
  type?: "send" | "receive" | "swap" | "approve";
  status?: "pending" | "confirmed" | "failed";
  amount?: string;
  value?: string;
  address?: string;
  timestamp?: string;
}) {
  const typeIcons: Record<string, IconName> = {
    send: "send",
    receive: "download",
    swap: "swap",
    approve: "check",
  };
  const typeColors = {
    send: colors.error.default,
    receive: colors.success.default,
    swap: colors.primary.default,
    approve: colors.warning.default,
  };
  const statusColors = {
    pending: colors.warning.default,
    confirmed: colors.success.default,
    failed: colors.error.default,
  };

  return (
    <Pressable style={transactionCellStyles.container}>
      <View style={[transactionCellStyles.icon, { backgroundColor: `${typeColors[type]}26` }]}>
        <Icon name={typeIcons[type]} size={22} color={typeColors[type]} />
      </View>
      <View style={transactionCellStyles.info}>
        <View style={transactionCellStyles.row}>
          <Text style={transactionCellStyles.type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <Text style={transactionCellStyles.amount}>{amount}</Text>
        </View>
        <View style={transactionCellStyles.row}>
          <Text style={transactionCellStyles.address}>{address}</Text>
          <Text style={transactionCellStyles.value}>{value}</Text>
        </View>
        <View style={transactionCellStyles.row}>
          <View style={transactionCellStyles.statusBadge}>
            <View style={[transactionCellStyles.statusDot, { backgroundColor: statusColors[status] }]} />
            <Text style={[transactionCellStyles.status, { color: statusColors[status] }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
          <Text style={transactionCellStyles.timestamp}>{timestamp}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const transactionCellStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing[4],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    gap: spacing[3],
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  address: {
    fontSize: 14,
    color: colors.text.alternative,
  },
  value: {
    fontSize: 14,
    color: colors.text.alternative,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.muted,
  },
});

// AddressDisplay Component
function AddressDisplay({
  address = "0x1234567890abcdef1234567890abcdef12345678",
  truncate = true,
  showCopy = true,
  variant = "default",
}: {
  address?: string;
  truncate?: boolean;
  showCopy?: boolean;
  variant?: "default" | "compact" | "full";
}) {
  const displayAddress = truncate 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  return (
    <View style={addressDisplayStyles.container}>
      <View style={addressDisplayStyles.addressBox}>
        <Text style={addressDisplayStyles.address} numberOfLines={variant === "full" ? 2 : 1}>
          {variant === "full" ? address : displayAddress}
        </Text>
      </View>
      {showCopy && (
        <Pressable style={addressDisplayStyles.copyButton}>
          <Icon name="copy" size={18} color={colors.text.alternative} />
        </Pressable>
      )}
    </View>
  );
}

const addressDisplayStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  addressBox: {
    flex: 1,
    backgroundColor: colors.background.alternative,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.sm,
  },
  address: {
    fontSize: 14,
    color: colors.text.default,
    fontFamily: "monospace",
  },
  copyButton: {
    padding: spacing[2],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.sm,
  },
  copyIcon: {
    fontSize: 16,
  },
});

// GasFeeSelector Component
function GasFeeSelector({
  selected = "medium",
  lowFee = "$0.50",
  mediumFee = "$1.00",
  highFee = "$2.50",
  showCustom = false,
}: {
  selected?: "low" | "medium" | "high" | "custom";
  lowFee?: string;
  mediumFee?: string;
  highFee?: string;
  showCustom?: boolean;
}) {
  const options = [
    { id: "low", label: "Slow", fee: lowFee, time: "~10 min" },
    { id: "medium", label: "Normal", fee: mediumFee, time: "~3 min" },
    { id: "high", label: "Fast", fee: highFee, time: "~30 sec" },
  ];

  return (
    <View style={gasFeeStyles.container}>
      <Text style={gasFeeStyles.title}>Gas Fee</Text>
      <View style={gasFeeStyles.options}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={selected === option.id ? gasFeeStyles.optionSelected : gasFeeStyles.option}
          >
            <Text style={selected === option.id ? gasFeeStyles.labelSelected : gasFeeStyles.label}>
              {option.label}
            </Text>
            <Text style={gasFeeStyles.fee}>{option.fee}</Text>
            <Text style={gasFeeStyles.time}>{option.time}</Text>
          </Pressable>
        ))}
      </View>
      {showCustom && (
        <Pressable style={gasFeeStyles.customButton}>
          <Text style={gasFeeStyles.customText}>⚙️ Advanced</Text>
        </Pressable>
      )}
    </View>
  );
}

const gasFeeStyles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.alternative,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  options: {
    flexDirection: "row",
    gap: spacing[2],
  },
  option: {
    flex: 1,
    backgroundColor: colors.background.section,
    padding: spacing[3],
    borderRadius: borderRadius.sm,
    alignItems: "center",
    gap: spacing[1],
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionSelected: {
    flex: 1,
    backgroundColor: colors.primary.muted,
    padding: spacing[3],
    borderRadius: borderRadius.sm,
    alignItems: "center",
    gap: spacing[1],
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.default,
  },
  labelSelected: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary.default,
  },
  fee: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.default,
  },
  time: {
    fontSize: 12,
    color: colors.text.muted,
  },
  customButton: {
    padding: spacing[2],
    alignItems: "center",
  },
  customText: {
    fontSize: 14,
    color: colors.primary.default,
  },
});

// NFTCard Component
function NFTCard({
  name = "Cool NFT #1234",
  collection = "Cool Collection",
  price = "0.5 ETH",
  showPrice = true,
}: {
  name?: string;
  collection?: string;
  price?: string;
  showPrice?: boolean;
}) {
  return (
    <Pressable style={nftCardStyles.container}>
      <View style={nftCardStyles.image}>
        <Text style={nftCardStyles.placeholder}>🖼️</Text>
      </View>
      <View style={nftCardStyles.info}>
        <Text style={nftCardStyles.name} numberOfLines={1}>{name}</Text>
        <Text style={nftCardStyles.collection} numberOfLines={1}>{collection}</Text>
        {showPrice && <Text style={nftCardStyles.price}>{price}</Text>}
      </View>
    </Pressable>
  );
}

const nftCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    width: 160,
  },
  image: {
    height: 160,
    backgroundColor: colors.background.alternative,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 48,
  },
  info: {
    padding: spacing[3],
    gap: spacing[1],
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.default,
  },
  collection: {
    fontSize: 12,
    color: colors.text.alternative,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary.default,
    marginTop: spacing[1],
  },
});

// NetworkSelector Component
function NetworkSelector({
  selected = "Ethereum",
  networks = "Ethereum,Polygon,Arbitrum,Optimism",
}: {
  selected?: string;
  networks?: string;
}) {
  const networkList = typeof networks === 'string' ? networks.split(',') : networks;
  const networkColors: Record<string, string> = {
    "Ethereum": "#627EEA",
    "Polygon": "#8247E5",
    "Arbitrum": "#28A0F0",
    "Optimism": "#FF0420",
    "Avalanche": "#E84142",
    "BNB": "#F0B90B",
  };

  return (
    <View style={networkSelectorStyles.container}>
      <Text style={networkSelectorStyles.title}>Select Network</Text>
      <View style={networkSelectorStyles.list}>
        {networkList.map((network) => (
          <Pressable
            key={network}
            style={network.trim() === selected ? networkSelectorStyles.itemSelected : networkSelectorStyles.item}
          >
            <View style={[networkSelectorStyles.icon, { backgroundColor: networkColors[network.trim()] || colors.primary.default }]}>
              <Text style={networkSelectorStyles.iconText}>{network.trim().charAt(0)}</Text>
            </View>
            <Text style={networkSelectorStyles.networkName}>{network.trim()}</Text>
            {network.trim() === selected && <Text style={networkSelectorStyles.check}>✓</Text>}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const networkSelectorStyles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.default,
  },
  list: {
    gap: spacing[2],
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.sm,
    gap: spacing[3],
  },
  itemSelected: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[3],
    backgroundColor: colors.primary.muted,
    borderRadius: borderRadius.sm,
    gap: spacing[3],
    borderWidth: 1,
    borderColor: colors.primary.default,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  networkName: {
    flex: 1,
    fontSize: 16,
    color: colors.text.default,
    fontWeight: "500",
  },
  check: {
    color: colors.primary.default,
    fontSize: 18,
    fontWeight: "bold",
  },
});

// QRCode Component (Placeholder representation)
function QRCode({
  value = "0x1234567890abcdef",
  size = "md",
  showValue = true,
}: {
  value?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}) {
  const sizeValues = { sm: 120, md: 180, lg: 240 };
  const dimension = sizeValues[size];

  return (
    <View style={qrCodeStyles.container}>
      <View style={[qrCodeStyles.qrBox, { width: dimension, height: dimension }]}>
        <View style={qrCodeStyles.qrPattern}>
          {/* Simplified QR pattern representation */}
          <View style={qrCodeStyles.corner} />
          <View style={[qrCodeStyles.corner, { right: 8, left: undefined }]} />
          <View style={[qrCodeStyles.corner, { bottom: 8, top: undefined }]} />
          <Text style={qrCodeStyles.qrIcon}>▣</Text>
        </View>
      </View>
      {showValue && (
        <Text style={qrCodeStyles.value} numberOfLines={1}>
          {value.slice(0, 10)}...{value.slice(-6)}
        </Text>
      )}
    </View>
  );
}

const qrCodeStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing[3],
  },
  qrBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: borderRadius.md,
    padding: spacing[4],
    alignItems: "center",
    justifyContent: "center",
  },
  qrPattern: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 4,
  },
  qrIcon: {
    fontSize: 48,
    color: "#000",
  },
  value: {
    fontSize: 14,
    color: colors.text.alternative,
    fontFamily: "monospace",
  },
});

// StatusIndicator Component
function StatusIndicator({
  status = "confirmed",
  label = "",
  showPulse = false,
}: {
  status?: "pending" | "confirmed" | "failed" | "processing";
  label?: string;
  showPulse?: boolean;
}) {
  const statusConfig: Record<string, { color: string; icon: IconName }> = {
    pending: { color: colors.warning.default, icon: "warning" },
    confirmed: { color: colors.success.default, icon: "check" },
    failed: { color: colors.error.default, icon: "close" },
    processing: { color: colors.primary.default, icon: "refresh" },
  };
  const config = statusConfig[status];

  return (
    <View style={statusIndicatorStyles.container}>
      <View style={[statusIndicatorStyles.dot, { backgroundColor: config.color }]}>
        <Icon name={config.icon} size={14} color="#FFFFFF" />
      </View>
      {label ? (
        <Text style={[statusIndicatorStyles.label, { color: config.color }]}>{label}</Text>
      ) : null}
    </View>
  );
}

const statusIndicatorStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});

// WalletConnectSession Component
function WalletConnectSession({
  dappName = "Uniswap",
  dappUrl = "app.uniswap.org",
  connected = true,
  network = "Ethereum",
}: {
  dappName?: string;
  dappUrl?: string;
  connected?: boolean;
  network?: string;
}) {
  return (
    <View style={wcSessionStyles.container}>
      <View style={wcSessionStyles.icon}>
        <Text style={wcSessionStyles.iconText}>{dappName.charAt(0)}</Text>
      </View>
      <View style={wcSessionStyles.info}>
        <Text style={wcSessionStyles.name}>{dappName}</Text>
        <Text style={wcSessionStyles.url}>{dappUrl}</Text>
        <View style={wcSessionStyles.badges}>
          <View style={wcSessionStyles.networkBadge}>
            <Text style={wcSessionStyles.networkText}>{network}</Text>
          </View>
          <View style={connected ? wcSessionStyles.connectedBadge : wcSessionStyles.disconnectedBadge}>
            <Text style={connected ? wcSessionStyles.connectedText : wcSessionStyles.disconnectedText}>
              {connected ? "Connected" : "Disconnected"}
            </Text>
          </View>
        </View>
      </View>
      <Pressable style={wcSessionStyles.disconnectButton}>
        <Text style={wcSessionStyles.disconnectText}>✕</Text>
      </Pressable>
    </View>
  );
}

const wcSessionStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing[4],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    gap: spacing[3],
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary.default,
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  url: {
    fontSize: 14,
    color: colors.text.muted,
  },
  badges: {
    flexDirection: "row",
    gap: spacing[2],
    marginTop: spacing[1],
  },
  networkBadge: {
    backgroundColor: colors.background.alternative,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  networkText: {
    fontSize: 12,
    color: colors.text.alternative,
  },
  connectedBadge: {
    backgroundColor: colors.success.muted,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  connectedText: {
    fontSize: 12,
    color: colors.success.default,
  },
  disconnectedBadge: {
    backgroundColor: colors.error.muted,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  disconnectedText: {
    fontSize: 12,
    color: colors.error.default,
  },
  disconnectButton: {
    padding: spacing[2],
  },
  disconnectText: {
    fontSize: 18,
    color: colors.text.muted,
  },
});

// AmountInput Component
function AmountInput({
  value = "0.0",
  token = "ETH",
  fiatValue = "$0.00",
  balance = "1.5",
  showMax = true,
}: {
  value?: string;
  token?: string;
  fiatValue?: string;
  balance?: string;
  showMax?: boolean;
}) {
  return (
    <View style={amountInputStyles.container}>
      <View style={amountInputStyles.inputRow}>
        <TextInput
          style={amountInputStyles.input}
          value={value}
          placeholder="0.0"
          placeholderTextColor={colors.text.muted}
          keyboardType="decimal-pad"
        />
        <View style={amountInputStyles.tokenPicker}>
          <Text style={amountInputStyles.tokenText}>{token}</Text>
          <Text style={amountInputStyles.chevron}>▼</Text>
        </View>
      </View>
      <View style={amountInputStyles.footer}>
        <Text style={amountInputStyles.fiatValue}>{fiatValue}</Text>
        <View style={amountInputStyles.balanceRow}>
          <Text style={amountInputStyles.balance}>Balance: {balance} {token}</Text>
          {showMax && (
            <Pressable style={amountInputStyles.maxButton}>
              <Text style={amountInputStyles.maxText}>MAX</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const amountInputStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    gap: spacing[3],
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: "600",
    color: colors.text.default,
  },
  tokenPicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.alternative,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.pill,
    gap: spacing[2],
  },
  tokenText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  chevron: {
    fontSize: 10,
    color: colors.text.muted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fiatValue: {
    fontSize: 16,
    color: colors.text.alternative,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  balance: {
    fontSize: 14,
    color: colors.text.muted,
  },
  maxButton: {
    backgroundColor: colors.primary.muted,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  maxText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary.default,
  },
});

// SwapPreview Component
function SwapPreview({
  fromToken = "ETH",
  fromAmount = "1.0",
  toToken = "USDC",
  toAmount = "2,000.00",
  rate = "1 ETH = 2,000 USDC",
  fee = "$2.50",
}: {
  fromToken?: string;
  fromAmount?: string;
  toToken?: string;
  toAmount?: string;
  rate?: string;
  fee?: string;
}) {
  return (
    <View style={swapPreviewStyles.container}>
      {/* From */}
      <View style={swapPreviewStyles.tokenRow}>
        <View style={swapPreviewStyles.tokenInfo}>
          <View style={swapPreviewStyles.tokenIcon}>
            <Text style={swapPreviewStyles.tokenIconText}>{fromToken.slice(0, 2)}</Text>
          </View>
          <Text style={swapPreviewStyles.tokenLabel}>From</Text>
        </View>
        <View style={swapPreviewStyles.amountInfo}>
          <Text style={swapPreviewStyles.amount}>{fromAmount}</Text>
          <Text style={swapPreviewStyles.tokenSymbol}>{fromToken}</Text>
        </View>
      </View>

      {/* Arrow */}
      <View style={swapPreviewStyles.arrowContainer}>
        <View style={swapPreviewStyles.arrowIcon}>
          <Text style={swapPreviewStyles.arrow}>↓</Text>
        </View>
      </View>

      {/* To */}
      <View style={swapPreviewStyles.tokenRow}>
        <View style={swapPreviewStyles.tokenInfo}>
          <View style={[swapPreviewStyles.tokenIcon, { backgroundColor: colors.success.muted }]}>
            <Text style={[swapPreviewStyles.tokenIconText, { color: colors.success.default }]}>
              {toToken.slice(0, 2)}
            </Text>
          </View>
          <Text style={swapPreviewStyles.tokenLabel}>To</Text>
        </View>
        <View style={swapPreviewStyles.amountInfo}>
          <Text style={swapPreviewStyles.amount}>{toAmount}</Text>
          <Text style={swapPreviewStyles.tokenSymbol}>{toToken}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={swapPreviewStyles.details}>
        <View style={swapPreviewStyles.detailRow}>
          <Text style={swapPreviewStyles.detailLabel}>Rate</Text>
          <Text style={swapPreviewStyles.detailValue}>{rate}</Text>
        </View>
        <View style={swapPreviewStyles.detailRow}>
          <Text style={swapPreviewStyles.detailLabel}>Network Fee</Text>
          <Text style={swapPreviewStyles.detailValue}>{fee}</Text>
        </View>
      </View>
    </View>
  );
}

const swapPreviewStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    padding: spacing[4],
    gap: spacing[2],
  },
  tokenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing[3],
    backgroundColor: colors.background.alternative,
    borderRadius: borderRadius.sm,
  },
  tokenInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenIconText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary.default,
  },
  tokenLabel: {
    fontSize: 14,
    color: colors.text.alternative,
  },
  amountInfo: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.default,
  },
  tokenSymbol: {
    fontSize: 14,
    color: colors.text.muted,
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: -spacing[2],
    zIndex: 1,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.section,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.background.default,
  },
  arrow: {
    fontSize: 16,
    color: colors.text.alternative,
  },
  details: {
    marginTop: spacing[2],
    gap: spacing[2],
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.muted,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text.alternative,
  },
});

// ConfirmationSheet Component
function ConfirmationSheet({
  title = "Confirm Transaction",
  amount = "1.0 ETH",
  recipient = "0x1234...5678",
  fee = "$2.50",
  total = "$2,002.50",
}: {
  title?: string;
  amount?: string;
  recipient?: string;
  fee?: string;
  total?: string;
}) {
  return (
    <View style={confirmSheetStyles.container}>
      <View style={confirmSheetStyles.handle} />
      <Text style={confirmSheetStyles.title}>{title}</Text>
      
      <View style={confirmSheetStyles.details}>
        <View style={confirmSheetStyles.row}>
          <Text style={confirmSheetStyles.label}>Amount</Text>
          <Text style={confirmSheetStyles.value}>{amount}</Text>
        </View>
        <View style={confirmSheetStyles.row}>
          <Text style={confirmSheetStyles.label}>To</Text>
          <Text style={confirmSheetStyles.value}>{recipient}</Text>
        </View>
        <View style={confirmSheetStyles.divider} />
        <View style={confirmSheetStyles.row}>
          <Text style={confirmSheetStyles.label}>Network Fee</Text>
          <Text style={confirmSheetStyles.value}>{fee}</Text>
        </View>
        <View style={confirmSheetStyles.row}>
          <Text style={confirmSheetStyles.labelBold}>Total</Text>
          <Text style={confirmSheetStyles.valueBold}>{total}</Text>
        </View>
      </View>

      <View style={confirmSheetStyles.buttons}>
        <Pressable style={confirmSheetStyles.cancelButton}>
          <Text style={confirmSheetStyles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable style={confirmSheetStyles.confirmButton}>
          <Text style={confirmSheetStyles.confirmText}>Confirm</Text>
        </Pressable>
      </View>
    </View>
  );
}

const confirmSheetStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    gap: spacing[4],
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: 2,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.default,
    textAlign: "center",
  },
  details: {
    gap: spacing[3],
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: colors.text.alternative,
  },
  value: {
    fontSize: 14,
    color: colors.text.default,
  },
  labelBold: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  valueBold: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.muted,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing[3],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.alternative,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: spacing[4],
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary.default,
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary.inverse,
  },
});

// Blockies/Identicon Component
function Identicon({
  address = "0x1234567890abcdef",
  size = "md",
}: {
  address?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeValues = { sm: 24, md: 40, lg: 64 };
  const dimension = sizeValues[size];
  
  // Generate deterministic colors from address
  const hash = address.slice(2, 10);
  const hue = parseInt(hash.slice(0, 2), 16) * 1.4;
  const saturation = 60 + (parseInt(hash.slice(2, 4), 16) % 20);
  const lightness = 45 + (parseInt(hash.slice(4, 6), 16) % 15);

  return (
    <View style={[identiconStyles.container, { 
      width: dimension, 
      height: dimension,
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    }]}>
      <View style={[identiconStyles.pattern, { 
        width: dimension * 0.4, 
        height: dimension * 0.4,
        backgroundColor: `hsl(${(hue + 180) % 360}, ${saturation}%, ${lightness + 20}%)`,
      }]} />
    </View>
  );
}

const identiconStyles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  pattern: {
    borderRadius: 4,
    transform: [{ rotate: "45deg" }],
  },
});

// ChainBadge Component
function ChainBadge({
  chain = "Ethereum",
  showName = true,
}: {
  chain?: string;
  showName?: boolean;
}) {
  const chainColors: Record<string, string> = {
    "Ethereum": "#627EEA",
    "Polygon": "#8247E5",
    "Arbitrum": "#28A0F0",
    "Optimism": "#FF0420",
    "Avalanche": "#E84142",
    "BNB": "#F0B90B",
    "Base": "#0052FF",
  };

  return (
    <View style={chainBadgeStyles.container}>
      <View style={[chainBadgeStyles.dot, { backgroundColor: chainColors[chain] || colors.primary.default }]} />
      {showName && <Text style={chainBadgeStyles.name}>{chain}</Text>}
    </View>
  );
}

const chainBadgeStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.section,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.pill,
    gap: spacing[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.default,
  },
});

// Stepper Component
function Stepper({
  steps = "Connect,Approve,Confirm",
  current = 0,
  variant = "default",
}: {
  steps?: string;
  current?: number;
  variant?: "default" | "compact";
}) {
  const stepList = typeof steps === 'string' ? steps.split(',') : steps;

  return (
    <View style={stepperStyles.container}>
      {stepList.map((step, index) => (
        <React.Fragment key={step}>
          <View style={stepperStyles.step}>
            <View style={[
              stepperStyles.circle,
              index < current ? stepperStyles.circleCompleted :
              index === current ? stepperStyles.circleCurrent :
              stepperStyles.circleUpcoming
            ]}>
              {index < current ? (
                <Icon name="check" size={16} color={colors.success.inverse} />
              ) : (
                <Text style={[
                  stepperStyles.circleText,
                  index === current ? stepperStyles.circleTextCurrent :
                  stepperStyles.circleTextUpcoming
                ]}>
                  {index + 1}
                </Text>
              )}
            </View>
            {variant === "default" && (
              <Text style={[
                stepperStyles.label,
                index <= current ? stepperStyles.labelActive : stepperStyles.labelInactive
              ]}>
                {step.trim()}
              </Text>
            )}
          </View>
          {index < stepList.length - 1 && (
            <View style={[
              stepperStyles.line,
              index < current ? stepperStyles.lineCompleted : stepperStyles.lineUpcoming
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  step: {
    alignItems: "center",
    gap: spacing[2],
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  circleCompleted: {
    backgroundColor: colors.success.default,
  },
  circleCurrent: {
    backgroundColor: colors.primary.default,
  },
  circleUpcoming: {
    backgroundColor: colors.background.section,
    borderWidth: 2,
    borderColor: colors.border.muted,
  },
  circleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  circleTextCompleted: {
    color: colors.success.inverse,
  },
  circleTextCurrent: {
    color: colors.primary.inverse,
  },
  circleTextUpcoming: {
    color: colors.text.muted,
  },
  label: {
    fontSize: 12,
    maxWidth: 70,
    textAlign: "center",
  },
  labelActive: {
    color: colors.text.default,
    fontWeight: "500",
  },
  labelInactive: {
    color: colors.text.muted,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: spacing[2],
    marginTop: 15,
    maxWidth: 60,
  },
  lineCompleted: {
    backgroundColor: colors.success.default,
  },
  lineUpcoming: {
    backgroundColor: colors.border.muted,
  },
});

// NotificationCell Component
function NotificationCell({
  title = "Transaction Complete",
  message = "Your transaction has been confirmed",
  timestamp = "2 min ago",
  type = "success",
  unread = true,
}: {
  title?: string;
  message?: string;
  timestamp?: string;
  type?: "info" | "success" | "warning" | "error";
  unread?: boolean;
}) {
  const typeConfig: Record<string, { icon: IconName; color: string }> = {
    info: { icon: "info", color: colors.info.default },
    success: { icon: "check", color: colors.success.default },
    warning: { icon: "warning", color: colors.warning.default },
    error: { icon: "close", color: colors.error.default },
  };
  const config = typeConfig[type];

  return (
    <Pressable style={[notificationCellStyles.container, unread ? notificationCellStyles.unread : undefined]}>
      <View style={[notificationCellStyles.icon, { backgroundColor: `${config.color}26` }]}>
        <Icon name={config.icon} size={22} color={config.color} />
      </View>
      <View style={notificationCellStyles.content}>
        <View style={notificationCellStyles.header}>
          <Text style={notificationCellStyles.title}>{title}</Text>
          {unread && <View style={notificationCellStyles.dot} />}
        </View>
        <Text style={notificationCellStyles.message} numberOfLines={2}>{message}</Text>
        <Text style={notificationCellStyles.timestamp}>{timestamp}</Text>
      </View>
    </Pressable>
  );
}

const notificationCellStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing[4],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    gap: spacing[3],
  },
  unread: {
    backgroundColor: colors.primary.muted,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    gap: spacing[1],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.default,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.default,
  },
  message: {
    fontSize: 14,
    color: colors.text.alternative,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
});

// CollectibleGrid Component
function CollectibleGrid({
  count = 4,
  columns = 2,
}: {
  count?: number;
  columns?: number;
}) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={collectibleGridStyles.container}>
      <View style={[collectibleGridStyles.grid, { gap: spacing[3] }]}>
        {items.map((item) => (
          <View key={item} style={collectibleGridStyles.item}>
            <View style={collectibleGridStyles.image}>
              <Text style={collectibleGridStyles.placeholder}>🖼️</Text>
            </View>
            <View style={collectibleGridStyles.info}>
              <Text style={collectibleGridStyles.name}>NFT #{item + 1}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const collectibleGridStyles = StyleSheet.create({
  container: {
    width: "100%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "48%",
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  image: {
    aspectRatio: 1,
    backgroundColor: colors.background.alternative,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 32,
  },
  info: {
    padding: spacing[3],
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.default,
  },
});

// ============================================
// ICON SHOWCASE COMPONENT
// ============================================

// Use only the icons that actually have SVG files imported
// This uses SVG_ICON_NAMES which is imported from MMIcon
const ALL_ICON_NAMES = SVG_ICON_NAMES;

function IconShowcase({
  iconName = "Wallet",
  size = "md",
  color = "default",
}: {
  iconName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "primary" | "error" | "success" | "warning";
}) {
  return (
    <View style={iconShowcaseStyles.container}>
      <View style={iconShowcaseStyles.preview}>
        <MetaMaskIcon name={iconName} size={size} color={color} />
      </View>
      <Text style={iconShowcaseStyles.name}>{iconName}</Text>
    </View>
  );
}

const iconShowcaseStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing[4],
    backgroundColor: colors.background.section,
    borderRadius: borderRadius.md,
    minWidth: 100,
  },
  preview: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[2],
  },
  name: {
    fontSize: 12,
    color: colors.text.alternative,
    textAlign: "center",
  },
});

// Icon Grid for showing all icons
function IconGrid({ category = "all" }: { category?: string }) {
  const themeColors = useComponentColors();
  
  // Categories use only icons that actually exist in ALL_ICON_NAMES
  const categoryMap: Record<string, string[]> = {
    navigation: ["Home", "HomeFilled", "Menu", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Expand", "Collapse"],
    actions: ["Add", "AddCircle", "Close", "Check", "CheckBold", "Copy", "CopySuccess", "Edit", "Trash", "Refresh", "Search", "Filter", "Download", "Upload", "Share", "Link", "Scan", "QrCode", "MoreVertical", "MoreHorizontal"],
    wallet: ["Wallet", "Send", "Receive", "SwapHorizontal", "SwapVertical", "Gas", "Bridge", "Stake", "Bank", "Card", "Money", "Coin", "BuySell"],
    security: ["Lock", "LockSlash", "Key", "SecurityKey", "Security", "ShieldLock", "Eye", "EyeSlash", "Fingerprint", "FaceId"],
    status: ["Info", "Question", "Warning", "Danger", "Error", "Confirmation", "Clock", "Pending"],
    social: ["Heart", "HeartFilled", "Star", "StarFilled", "User", "UserCircle", "People", "Notification"],
    all: ALL_ICON_NAMES as string[],
  };

  const icons = categoryMap[category] || categoryMap.all;

  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[2], justifyContent: "center" }}>
        {icons.map((name) => (
          <View 
            key={name} 
            style={{
              width: 72,
              height: 72,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: themeColors.background.section,
              borderRadius: borderRadius.sm,
              padding: spacing[2],
            }}
          >
            <MetaMaskIcon name={name} size="md" color="default" />
            <Text style={{ fontSize: 9, color: themeColors.text.muted, marginTop: spacing[1], textAlign: "center" }} numberOfLines={1}>
              {name}
            </Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 12, color: themeColors.text.alternative, marginTop: spacing[3], textAlign: "center" }}>
        {icons.length} icons in {category === "all" ? "library" : category}
      </Text>
    </View>
  );
}

// ============================================
// COMPONENT REGISTRY
// ============================================

export const componentRegistry: ComponentEntry[] = [
  // === COMPONENTS ===
  {
    name: "Account Picker",
    slug: "account-picker",
    category: "components",
    description: "Select and view connected accounts.",
    component: AccountPicker,
    props: [
      { name: "name", propType: { type: "string", default: "Account 1" }, description: "Account display name" },
      { name: "connected", propType: { type: "boolean", default: true }, description: "Connection state" },
      { name: "loading", propType: { type: "boolean", default: false }, description: "Loading state" },
    ],
    defaultProps: { name: "Account 1", connected: true, loading: false },
    variants: [
      { name: "Connected", description: "Active account state", props: { name: "Account 1", connected: true, loading: false } },
      { name: "Loading", description: "Skeleton loading state", props: { name: "Account 1", connected: true, loading: true } },
    ],
  },
  {
    name: "Token Cell",
    slug: "token-cell",
    category: "components",
    description: "Display token balance and value information.",
    component: TokenCell,
    props: [
      { name: "symbol", propType: { type: "string", default: "ETH" }, description: "Token symbol" },
      { name: "name", propType: { type: "string", default: "Ethereum" }, description: "Token name" },
      { name: "balance", propType: { type: "string", default: "1.5" }, description: "Token balance" },
      { name: "value", propType: { type: "string", default: "$3,000.00" }, description: "Fiat value" },
      { name: "change", propType: { type: "string", default: "+2.5%" }, description: "Price change" },
      { name: "changePositive", propType: { type: "boolean", default: true }, description: "Is change positive" },
    ],
    defaultProps: { symbol: "ETH", name: "Ethereum", balance: "1.5", value: "$3,000.00", change: "+2.5%", changePositive: true },
    variants: [
      { name: "Positive", description: "Positive price change", props: { symbol: "ETH", name: "Ethereum", balance: "1.5", value: "$3,000.00", change: "+2.5%", changePositive: true } },
      { name: "Negative", description: "Negative price change", props: { symbol: "BTC", name: "Bitcoin", balance: "0.05", value: "$2,500.00", change: "-1.2%", changePositive: false } },
    ],
  },
  {
    name: "Hub Header",
    slug: "hub-header",
    category: "components",
    description: "Balance display card with action buttons.",
    component: HubHeader,
    props: [
      { name: "balance", propType: { type: "string", default: "$100" }, description: "Display balance" },
      { name: "label", propType: { type: "string", default: "Available balance" }, description: "Balance label" },
      { name: "primaryAction", propType: { type: "string", default: "Add funds" }, description: "Primary button" },
      { name: "secondaryAction", propType: { type: "string", default: "" }, description: "Secondary button" },
      { name: "showAvatar", propType: { type: "boolean", default: false }, description: "Show avatar" },
    ],
    defaultProps: { balance: "$100", label: "Available balance", primaryAction: "Add funds", secondaryAction: "", showAvatar: false },
    variants: [
      { name: "Single Button", description: "One action button", props: { balance: "$100", label: "Available balance", primaryAction: "Add funds", secondaryAction: "" } },
      { name: "Dual Buttons", description: "Two action buttons", props: { balance: "$100", label: "Available balance", primaryAction: "Add funds", secondaryAction: "Withdraw" } },
      { name: "With Avatar", description: "Shows avatar icon", props: { balance: "$100", label: "Available balance", primaryAction: "Add funds", showAvatar: true } },
    ],
  },
  {
    name: "Footer Nav",
    slug: "footer-nav",
    category: "components",
    description: "Bottom navigation bar with 5 tabs: Home, Explore, Trade (action), Activity, Rewards.",
    component: FooterNav,
    props: [
      { name: "activeTab", propType: { type: "select", default: "home", options: ["home", "explore", "activity", "rewards"] }, description: "Active tab" },
      { name: "showActionSheet", propType: { type: "boolean", default: false }, description: "Show action sheet" },
    ],
    defaultProps: { activeTab: "home", showActionSheet: false },
    variants: [
      { name: "Default", description: "Home selected", props: { activeTab: "home", showActionSheet: false } },
      { name: "With Sheet", description: "Trade action sheet open", props: { activeTab: "home", showActionSheet: true } },
      { name: "Explore Active", description: "Explore tab selected", props: { activeTab: "explore", showActionSheet: false } },
      { name: "Activity Active", description: "Activity selected", props: { activeTab: "activity", showActionSheet: false } },
      { name: "Rewards Active", description: "Rewards selected", props: { activeTab: "rewards", showActionSheet: false } },
    ],
  },
  {
    name: "Empty State",
    slug: "empty-state",
    category: "components",
    description: "Placeholder when no content.",
    component: EmptyState,
    props: [
      { name: "title", propType: { type: "string", default: "No items found" }, description: "Heading" },
      { name: "description", propType: { type: "string", default: "There are no items to display" }, description: "Description" },
      { name: "actionLabel", propType: { type: "string", default: "" }, description: "Action button" },
    ],
    defaultProps: { title: "No items found", description: "There are no items to display", actionLabel: "" },
    variants: [
      { name: "Basic", description: "Simple empty state", props: { title: "No items found", description: "There are no items to display" } },
      { name: "With Action", description: "With call to action", props: { title: "No tokens yet", description: "Add your first token", actionLabel: "Add Token" } },
    ],
  },

  // === PRIMITIVES ===
  {
    name: "Button",
    slug: "button",
    category: "primitives",
    description: "Primary action button with multiple variants.",
    component: Button,
    props: [
      { name: "label", propType: { type: "string", default: "Button" }, description: "Button text" },
      { name: "variant", propType: { type: "select", default: "primary", options: ["primary", "secondary", "tertiary", "danger"] }, description: "Visual style" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Button size" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
      { name: "loading", propType: { type: "boolean", default: false }, description: "Loading state" },
    ],
    defaultProps: { label: "Button", variant: "primary", size: "md", disabled: false, loading: false },
    variants: [
      { name: "Primary", description: "Default primary", props: { label: "Button", variant: "primary" } },
      { name: "Secondary", description: "Outlined button", props: { label: "Button", variant: "secondary" } },
      { name: "Danger", description: "Destructive action", props: { label: "Delete", variant: "danger" } },
    ],
  },
  {
    name: "Input",
    slug: "input",
    category: "primitives",
    description: "Text input field with label and error states.",
    component: Input,
    props: [
      { name: "placeholder", propType: { type: "string", default: "Enter text..." }, description: "Placeholder" },
      { name: "value", propType: { type: "string", default: "" }, description: "Value" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label" },
      { name: "error", propType: { type: "string", default: "" }, description: "Error message" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { placeholder: "Enter text...", value: "", label: "", error: "", disabled: false },
    variants: [
      { name: "Default", description: "Basic input", props: { placeholder: "Enter text..." } },
      { name: "With Label", description: "With label", props: { label: "Name", placeholder: "Enter name" } },
      { name: "Error", description: "Error state", props: { label: "Email", error: "Invalid email", value: "invalid" } },
    ],
  },
  {
    name: "Card",
    slug: "card",
    category: "primitives",
    description: "Content container with optional action.",
    component: Card,
    props: [
      { name: "title", propType: { type: "string", default: "Card Title" }, description: "Heading" },
      { name: "description", propType: { type: "string", default: "Card description goes here" }, description: "Content" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "elevated", "outlined"] }, description: "Style" },
      { name: "hasAction", propType: { type: "boolean", default: false }, description: "Show action" },
    ],
    defaultProps: { title: "Card Title", description: "Card description goes here", variant: "default", hasAction: false },
    variants: [
      { name: "Default", description: "Basic card", props: { title: "Card Title", description: "Card description" } },
      { name: "With Action", description: "With button", props: { title: "Action Card", description: "With action button", hasAction: true } },
    ],
  },
  {
    name: "Badge",
    slug: "badge",
    category: "primitives",
    description: "Small label for status or counts.",
    component: Badge,
    props: [
      { name: "label", propType: { type: "string", default: "Badge" }, description: "Text" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "primary", "success", "warning", "error"] }, description: "Color" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md"] }, description: "Size" },
    ],
    defaultProps: { label: "Badge", variant: "default", size: "md" },
    variants: [
      { name: "Primary", description: "Primary colored", props: { label: "Primary", variant: "primary" } },
      { name: "Success", description: "Success state", props: { label: "Success", variant: "success" } },
      { name: "Error", description: "Error state", props: { label: "Error", variant: "error" } },
    ],
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "primitives",
    description: "User profile image or initials.",
    component: Avatar,
    props: [
      { name: "name", propType: { type: "string", default: "User" }, description: "Name for initials" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg", "xl"] }, description: "Size" },
      { name: "showBadge", propType: { type: "boolean", default: false }, description: "Show badge" },
    ],
    defaultProps: { name: "User", size: "md", showBadge: false },
    variants: [
      { name: "Initials", description: "With initials", props: { name: "John Doe", size: "md" } },
      { name: "With Badge", description: "Online indicator", props: { name: "Jane", size: "md", showBadge: true } },
    ],
  },
  {
    name: "Switch",
    slug: "switch",
    category: "primitives",
    description: "Toggle switch for boolean settings.",
    component: CustomSwitch,
    props: [
      { name: "value", propType: { type: "boolean", default: false }, description: "State" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { value: false, label: "", disabled: false },
    variants: [
      { name: "Off", description: "Off state", props: { value: false } },
      { name: "On", description: "On state", props: { value: true } },
      { name: "With Label", description: "With label", props: { value: true, label: "Enable notifications" } },
    ],
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "primitives",
    description: "Loading placeholder.",
    component: Skeleton,
    props: [
      { name: "variant", propType: { type: "select", default: "text", options: ["text", "circular", "rectangular"] }, description: "Shape" },
      { name: "width", propType: { type: "number", default: 100, min: 20, max: 300 }, description: "Width" },
      { name: "height", propType: { type: "number", default: 20, min: 10, max: 100 }, description: "Height" },
    ],
    defaultProps: { variant: "text", width: 100, height: 20 },
    variants: [
      { name: "Text", description: "Text placeholder", props: { variant: "text", width: 150, height: 16 } },
      { name: "Circular", description: "Avatar placeholder", props: { variant: "circular", width: 48, height: 48 } },
    ],
  },
  {
    name: "Banner",
    slug: "banner",
    category: "primitives",
    description: "Notification banner.",
    component: Banner,
    props: [
      { name: "title", propType: { type: "string", default: "Banner Title" }, description: "Heading" },
      { name: "description", propType: { type: "string", default: "Banner description" }, description: "Content" },
      { name: "variant", propType: { type: "select", default: "info", options: ["info", "success", "warning", "error"] }, description: "Type" },
      { name: "dismissible", propType: { type: "boolean", default: false }, description: "Can dismiss" },
    ],
    defaultProps: { title: "Banner Title", description: "Banner description", variant: "info", dismissible: false },
    variants: [
      { name: "Info", description: "Informational", props: { title: "Info", description: "Informational message", variant: "info" } },
      { name: "Success", description: "Success message", props: { title: "Success", description: "Operation completed", variant: "success" } },
      { name: "Error", description: "Error message", props: { title: "Error", description: "Something went wrong", variant: "error", dismissible: true } },
    ],
  },

  // === NEW COMPONENTS ===
  {
    name: "Dialog",
    slug: "dialog",
    category: "primitives",
    description: "Modal dialog for confirmations and alerts.",
    component: Dialog,
    props: [
      { name: "open", propType: { type: "boolean", default: true }, description: "Show dialog" },
      { name: "title", propType: { type: "string", default: "Dialog Title" }, description: "Title" },
      { name: "description", propType: { type: "string", default: "" }, description: "Description" },
      { name: "primaryAction", propType: { type: "string", default: "Confirm" }, description: "Primary button" },
      { name: "secondaryAction", propType: { type: "string", default: "Cancel" }, description: "Secondary button" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "danger"] }, description: "Style" },
    ],
    defaultProps: { open: true, title: "Dialog Title", description: "Are you sure you want to proceed?", primaryAction: "Confirm", secondaryAction: "Cancel", variant: "default" },
    variants: [
      { name: "Confirmation", description: "Standard confirmation", props: { title: "Confirm Action", description: "Are you sure?", primaryAction: "Confirm", secondaryAction: "Cancel" } },
      { name: "Danger", description: "Destructive action", props: { title: "Delete Item", description: "This cannot be undone.", primaryAction: "Delete", secondaryAction: "Cancel", variant: "danger" } },
      { name: "Alert", description: "Simple alert", props: { title: "Notice", description: "Something happened.", primaryAction: "OK", secondaryAction: "" } },
    ],
  },
  {
    name: "Select",
    slug: "select",
    category: "primitives",
    description: "Dropdown selector for choosing options.",
    component: Select,
    props: [
      { name: "label", propType: { type: "string", default: "" }, description: "Label" },
      { name: "value", propType: { type: "string", default: "Option 1" }, description: "Selected value" },
      { name: "placeholder", propType: { type: "string", default: "Select an option" }, description: "Placeholder" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { label: "", value: "Option 1", placeholder: "Select an option", disabled: false },
    variants: [
      { name: "Default", description: "With selection", props: { value: "Ethereum Mainnet" } },
      { name: "With Label", description: "Labeled select", props: { label: "Network", value: "Ethereum Mainnet" } },
      { name: "Placeholder", description: "No selection", props: { value: "", placeholder: "Choose a network" } },
    ],
  },
  {
    name: "Page Header",
    slug: "page-header",
    category: "components",
    description: "Navigation header with title and actions.",
    component: PageHeader,
    props: [
      { name: "title", propType: { type: "string", default: "Page Title" }, description: "Title" },
      { name: "showBack", propType: { type: "boolean", default: false }, description: "Show back button" },
      { name: "action", propType: { type: "string", default: "" }, description: "Action button text" },
    ],
    defaultProps: { title: "Page Title", showBack: false, action: "" },
    variants: [
      { name: "Simple", description: "Title only", props: { title: "Settings" } },
      { name: "With Back", description: "With back button", props: { title: "Token Details", showBack: true } },
      { name: "With Action", description: "With action button", props: { title: "Accounts", action: "Add" } },
    ],
  },
  {
    name: "Section Header",
    slug: "section-header",
    category: "components",
    description: "Section title with optional action.",
    component: SectionHeader,
    props: [
      { name: "title", propType: { type: "string", default: "Section" }, description: "Title" },
      { name: "action", propType: { type: "string", default: "" }, description: "Action text" },
    ],
    defaultProps: { title: "Section", action: "" },
    variants: [
      { name: "Simple", description: "Title only", props: { title: "Recent Activity" } },
      { name: "With Action", description: "With action link", props: { title: "Tokens", action: "See all" } },
    ],
  },
  {
    name: "Divider",
    slug: "divider",
    category: "primitives",
    description: "Visual separator between content.",
    component: Divider,
    props: [
      { name: "variant", propType: { type: "select", default: "full", options: ["full", "inset", "middle"] }, description: "Inset style" },
    ],
    defaultProps: { variant: "full" },
    variants: [
      { name: "Full", description: "Full width", props: { variant: "full" } },
      { name: "Inset", description: "Left inset", props: { variant: "inset" } },
      { name: "Middle", description: "Both sides inset", props: { variant: "middle" } },
    ],
  },
  {
    name: "List Item",
    slug: "list-item",
    category: "components",
    description: "Row item for lists and menus.",
    component: ListItem,
    props: [
      { name: "title", propType: { type: "string", default: "List Item" }, description: "Title" },
      { name: "subtitle", propType: { type: "string", default: "" }, description: "Subtitle" },
      { name: "leftIcon", propType: { type: "string", default: "" }, description: "Icon emoji" },
      { name: "showChevron", propType: { type: "boolean", default: false }, description: "Show arrow" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "destructive"] }, description: "Style" },
    ],
    defaultProps: { title: "List Item", subtitle: "", leftIcon: "", showChevron: false, variant: "default" },
    variants: [
      { name: "Simple", description: "Title only", props: { title: "General" } },
      { name: "With Icon", description: "With left icon", props: { title: "Security", leftIcon: "🔒", showChevron: true } },
      { name: "With Subtitle", description: "Two lines", props: { title: "Network", subtitle: "Ethereum Mainnet", showChevron: true } },
      { name: "Destructive", description: "Red text", props: { title: "Delete Account", leftIcon: "🗑️", variant: "destructive" } },
    ],
  },
  {
    name: "Chip",
    slug: "chip",
    category: "primitives",
    description: "Selectable chip for filters and tags.",
    component: Chip,
    props: [
      { name: "label", propType: { type: "string", default: "Chip" }, description: "Label" },
      { name: "selected", propType: { type: "boolean", default: false }, description: "Selected" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { label: "Chip", selected: false, disabled: false },
    variants: [
      { name: "Default", description: "Unselected", props: { label: "All" } },
      { name: "Selected", description: "Selected state", props: { label: "NFTs", selected: true } },
      { name: "Disabled", description: "Disabled state", props: { label: "Hidden", disabled: true } },
    ],
  },
  {
    name: "Toast",
    slug: "toast",
    category: "primitives",
    description: "Brief notification message.",
    component: Toast,
    props: [
      { name: "message", propType: { type: "string", default: "Toast message" }, description: "Message" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "success", "error"] }, description: "Type" },
      { name: "action", propType: { type: "string", default: "" }, description: "Action text" },
    ],
    defaultProps: { message: "Toast message", variant: "default", action: "" },
    variants: [
      { name: "Default", description: "Neutral message", props: { message: "Changes saved" } },
      { name: "Success", description: "Success message", props: { message: "Transaction complete", variant: "success" } },
      { name: "Error", description: "Error message", props: { message: "Failed to send", variant: "error", action: "Retry" } },
    ],
  },
  {
    name: "Progress Bar",
    slug: "progress-bar",
    category: "primitives",
    description: "Progress indicator bar.",
    component: ProgressBar,
    props: [
      { name: "progress", propType: { type: "number", default: 50, min: 0, max: 100 }, description: "Progress %" },
      { name: "variant", propType: { type: "select", default: "primary", options: ["primary", "success", "warning", "error"] }, description: "Color" },
      { name: "showLabel", propType: { type: "boolean", default: false }, description: "Show percentage" },
    ],
    defaultProps: { progress: 50, variant: "primary", showLabel: false },
    variants: [
      { name: "Default", description: "50% progress", props: { progress: 50 } },
      { name: "Complete", description: "100% success", props: { progress: 100, variant: "success", showLabel: true } },
      { name: "Warning", description: "Low progress", props: { progress: 25, variant: "warning", showLabel: true } },
    ],
  },

  // === NEW COMPONENTS ===
  {
    name: "Avatar Network",
    slug: "avatar-network",
    category: "primitives",
    description: "Network logo avatar (Ethereum, Polygon, etc).",
    component: AvatarNetwork,
    props: [
      { name: "name", propType: { type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB"] }, description: "Network name" },
      { name: "size", propType: { type: "select", default: "md", options: ["xs", "sm", "md", "lg"] }, description: "Size" },
    ],
    defaultProps: { name: "Ethereum", size: "md" },
    variants: [
      { name: "Ethereum", description: "ETH network", props: { name: "Ethereum", size: "md" } },
      { name: "Polygon", description: "Polygon network", props: { name: "Polygon", size: "md" } },
      { name: "Arbitrum", description: "Arbitrum network", props: { name: "Arbitrum", size: "md" } },
      { name: "Small", description: "Extra small size", props: { name: "Ethereum", size: "xs" } },
      { name: "Large", description: "Large size", props: { name: "Optimism", size: "lg" } },
    ],
  },
  {
    name: "Avatar Token",
    slug: "avatar-token",
    category: "primitives",
    description: "Token icon avatar.",
    component: AvatarToken,
    props: [
      { name: "symbol", propType: { type: "string", default: "ETH" }, description: "Token symbol" },
      { name: "name", propType: { type: "string", default: "Ethereum" }, description: "Token name" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Size" },
    ],
    defaultProps: { symbol: "ETH", name: "Ethereum", size: "md" },
    variants: [
      { name: "ETH", description: "Ethereum token", props: { symbol: "ETH", name: "Ethereum" } },
      { name: "USDC", description: "USD Coin", props: { symbol: "USDC", name: "USD Coin" } },
      { name: "MATIC", description: "Polygon token", props: { symbol: "MATIC", name: "Polygon" } },
    ],
  },
  {
    name: "Button Icon",
    slug: "button-icon",
    category: "primitives",
    description: "Icon-only button for toolbars.",
    component: ButtonIcon,
    props: [
      { name: "icon", propType: { type: "string", default: "✕" }, description: "Icon character" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Size" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "primary", "danger"] }, description: "Style" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { icon: "✕", size: "md", variant: "default", disabled: false },
    variants: [
      { name: "Close", description: "Close button", props: { icon: "✕" } },
      { name: "Menu", description: "Menu button", props: { icon: "☰" } },
      { name: "Back", description: "Back arrow", props: { icon: "←" } },
      { name: "Add", description: "Add button", props: { icon: "+", variant: "primary" } },
      { name: "Delete", description: "Delete button", props: { icon: "🗑", variant: "danger" } },
    ],
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "primitives",
    description: "Selectable checkbox with label.",
    component: Checkbox,
    props: [
      { name: "checked", propType: { type: "boolean", default: false }, description: "Checked state" },
      { name: "label", propType: { type: "string", default: "Checkbox label" }, description: "Label text" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { checked: false, label: "Checkbox label", disabled: false },
    variants: [
      { name: "Unchecked", description: "Default unchecked", props: { label: "Accept terms" } },
      { name: "Checked", description: "Checked state", props: { label: "Accept terms", checked: true } },
      { name: "Disabled", description: "Disabled state", props: { label: "Unavailable", disabled: true } },
    ],
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "primitives",
    description: "Tab navigation component.",
    component: Tabs,
    props: [
      { name: "tabs", propType: { type: "string", default: "Tokens,NFTs,Activity" }, description: "Tab labels (comma separated)" },
      { name: "activeIndex", propType: { type: "number", default: 0, min: 0, max: 4 }, description: "Active tab index" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "pills"] }, description: "Tab style" },
    ],
    defaultProps: { tabs: ["Tokens", "NFTs", "Activity"], activeIndex: 0, variant: "default" },
    variants: [
      { name: "Default", description: "Underline tabs", props: { tabs: ["Tokens", "NFTs", "Activity"], activeIndex: 0 } },
      { name: "Pills", description: "Pill style tabs", props: { tabs: ["All", "Sent", "Received"], activeIndex: 0, variant: "pills" } },
      { name: "Two Tabs", description: "Two tab layout", props: { tabs: ["Buy", "Sell"], activeIndex: 1, variant: "pills" } },
    ],
  },
  {
    name: "TextArea",
    slug: "textarea",
    category: "primitives",
    description: "Multi-line text input.",
    component: TextArea,
    props: [
      { name: "placeholder", propType: { type: "string", default: "Enter text..." }, description: "Placeholder" },
      { name: "value", propType: { type: "string", default: "" }, description: "Value" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label" },
      { name: "rows", propType: { type: "number", default: 4, min: 2, max: 10 }, description: "Number of rows" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled" },
    ],
    defaultProps: { placeholder: "Enter text...", value: "", label: "", rows: 4, disabled: false },
    variants: [
      { name: "Default", description: "Basic textarea", props: { placeholder: "Enter message..." } },
      { name: "With Label", description: "With label", props: { label: "Message", placeholder: "Type your message" } },
      { name: "Large", description: "More rows", props: { label: "Description", rows: 6 } },
    ],
  },
  {
    name: "Badge Count",
    slug: "badge-count",
    category: "primitives",
    description: "Numeric notification badge.",
    component: BadgeCount,
    props: [
      { name: "count", propType: { type: "number", default: 5, min: 0, max: 999 }, description: "Count" },
      { name: "max", propType: { type: "number", default: 99, min: 9, max: 999 }, description: "Max display" },
      { name: "variant", propType: { type: "select", default: "error", options: ["default", "primary", "error"] }, description: "Color" },
    ],
    defaultProps: { count: 5, max: 99, variant: "error" },
    variants: [
      { name: "Low Count", description: "Small number", props: { count: 3, variant: "error" } },
      { name: "High Count", description: "Large number", props: { count: 150, max: 99, variant: "error" } },
      { name: "Primary", description: "Primary color", props: { count: 12, variant: "primary" } },
    ],
  },
  {
    name: "Network Badge",
    slug: "network-badge",
    category: "primitives",
    description: "Small network indicator badge.",
    component: NetworkBadge,
    props: [
      { name: "network", propType: { type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism"] }, description: "Network" },
      { name: "size", propType: { type: "select", default: "sm", options: ["xs", "sm"] }, description: "Size" },
    ],
    defaultProps: { network: "Ethereum", size: "sm" },
    variants: [
      { name: "Ethereum", description: "ETH badge", props: { network: "Ethereum" } },
      { name: "Polygon", description: "Polygon badge", props: { network: "Polygon" } },
      { name: "Extra Small", description: "Tiny badge", props: { network: "Arbitrum", size: "xs" } },
    ],
  },

  // ============================================
  // NEW PRIMITIVES
  // ============================================
  {
    name: "Radio",
    slug: "radio",
    category: "primitives",
    description: "Radio button for single selection.",
    component: Radio,
    props: [
      { name: "selected", propType: { type: "boolean", default: false }, description: "Selected state" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label text" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
    ],
    defaultProps: { selected: false, label: "Option", disabled: false },
    variants: [
      { name: "Unselected", description: "Default state", props: { label: "Option A" } },
      { name: "Selected", description: "Selected state", props: { label: "Option B", selected: true } },
      { name: "Disabled", description: "Disabled state", props: { label: "Unavailable", disabled: true } },
    ],
  },
  {
    name: "Radio Group",
    slug: "radio-group",
    category: "primitives",
    description: "Group of radio buttons for single selection.",
    component: RadioGroup,
    props: [
      { name: "options", propType: { type: "string", default: "Option 1,Option 2,Option 3" }, description: "Options (comma separated)" },
      { name: "selected", propType: { type: "number", default: 0, min: 0, max: 5 }, description: "Selected index" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
    ],
    defaultProps: { options: "Option 1,Option 2,Option 3", selected: 0, disabled: false },
    variants: [
      { name: "Default", description: "First option selected", props: { options: "Low,Medium,High", selected: 0 } },
      { name: "Middle Selected", description: "Middle option selected", props: { options: "Low,Medium,High", selected: 1 } },
    ],
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "primitives",
    description: "Loading spinner indicator.",
    component: Spinner,
    props: [
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Size" },
      { name: "variant", propType: { type: "select", default: "primary", options: ["primary", "default", "inverse"] }, description: "Color variant" },
    ],
    defaultProps: { size: "md", variant: "primary" },
    variants: [
      { name: "Small", description: "Small spinner", props: { size: "sm" } },
      { name: "Medium", description: "Medium spinner", props: { size: "md" } },
      { name: "Large", description: "Large spinner", props: { size: "lg" } },
    ],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "primitives",
    description: "Tooltip for additional information.",
    component: Tooltip,
    props: [
      { name: "text", propType: { type: "string", default: "Tooltip text" }, description: "Tooltip content" },
      { name: "position", propType: { type: "select", default: "top", options: ["top", "bottom", "left", "right"] }, description: "Position" },
    ],
    defaultProps: { text: "Helpful information", position: "top" },
    variants: [
      { name: "Top", description: "Shows above", props: { text: "Tooltip above", position: "top" } },
      { name: "Bottom", description: "Shows below", props: { text: "Tooltip below", position: "bottom" } },
    ],
  },
  {
    name: "Link",
    slug: "link",
    category: "primitives",
    description: "Text link component.",
    component: Link,
    props: [
      { name: "text", propType: { type: "string", default: "Link text" }, description: "Link text" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "primary", "subtle"] }, description: "Style" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
    ],
    defaultProps: { text: "Learn more", variant: "default", disabled: false },
    variants: [
      { name: "Default", description: "Standard link", props: { text: "View details" } },
      { name: "Subtle", description: "Subtle link", props: { text: "Terms of service", variant: "subtle" } },
    ],
  },
  {
    name: "Slider",
    slug: "slider",
    category: "primitives",
    description: "Range slider input.",
    component: Slider,
    props: [
      { name: "value", propType: { type: "number", default: 50, min: 0, max: 100 }, description: "Current value" },
      { name: "min", propType: { type: "number", default: 0, min: 0, max: 100 }, description: "Minimum value" },
      { name: "max", propType: { type: "number", default: 100, min: 0, max: 100 }, description: "Maximum value" },
      { name: "showValue", propType: { type: "boolean", default: false }, description: "Show value label" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
    ],
    defaultProps: { value: 50, min: 0, max: 100, showValue: false, disabled: false },
    variants: [
      { name: "Default", description: "50% value", props: { value: 50 } },
      { name: "With Label", description: "Shows value", props: { value: 75, showValue: true } },
      { name: "Low", description: "25% value", props: { value: 25, showValue: true } },
    ],
  },
  {
    name: "Accordion",
    slug: "accordion",
    category: "primitives",
    description: "Collapsible content section.",
    component: Accordion,
    props: [
      { name: "title", propType: { type: "string", default: "Accordion Title" }, description: "Header title" },
      { name: "content", propType: { type: "string", default: "Accordion content goes here..." }, description: "Body content" },
      { name: "expanded", propType: { type: "boolean", default: false }, description: "Expanded state" },
    ],
    defaultProps: { title: "Accordion Title", content: "This is the accordion content that appears when expanded.", expanded: false },
    variants: [
      { name: "Collapsed", description: "Closed state", props: { title: "Click to expand", content: "Hidden content" } },
      { name: "Expanded", description: "Open state", props: { title: "Details", content: "This content is now visible.", expanded: true } },
    ],
  },
  {
    name: "Bottom Sheet",
    slug: "bottom-sheet",
    category: "primitives",
    description: "Slide-up modal sheet.",
    component: BottomSheet,
    props: [
      { name: "title", propType: { type: "string", default: "Bottom Sheet" }, description: "Sheet title" },
      { name: "visible", propType: { type: "boolean", default: true }, description: "Visibility" },
      { name: "hasHandle", propType: { type: "boolean", default: true }, description: "Show drag handle" },
    ],
    defaultProps: { title: "Bottom Sheet", visible: true, hasHandle: true },
    variants: [
      { name: "Default", description: "With handle", props: { title: "Select Option", hasHandle: true } },
      { name: "No Handle", description: "Without handle", props: { title: "Confirmation", hasHandle: false } },
    ],
  },
  {
    name: "Popover",
    slug: "popover",
    category: "primitives",
    description: "Floating content container.",
    component: Popover,
    props: [
      { name: "trigger", propType: { type: "string", default: "Click me" }, description: "Trigger text" },
      { name: "content", propType: { type: "string", default: "Popover content" }, description: "Popover content" },
      { name: "visible", propType: { type: "boolean", default: true }, description: "Visibility" },
    ],
    defaultProps: { trigger: "Click me", content: "Additional information here", visible: true },
    variants: [
      { name: "Visible", description: "Showing popover", props: { trigger: "More info", content: "Here are more details", visible: true } },
      { name: "Hidden", description: "Popover hidden", props: { trigger: "Click to show", visible: false } },
    ],
  },
  {
    name: "Segmented Control",
    slug: "segmented-control",
    category: "primitives",
    description: "iOS-style segmented buttons.",
    component: SegmentedControl,
    props: [
      { name: "segments", propType: { type: "string", default: "Option 1,Option 2" }, description: "Segments (comma separated)" },
      { name: "selected", propType: { type: "number", default: 0, min: 0, max: 4 }, description: "Selected index" },
      { name: "disabled", propType: { type: "boolean", default: false }, description: "Disabled state" },
    ],
    defaultProps: { segments: "Buy,Sell", selected: 0, disabled: false },
    variants: [
      { name: "Two Options", description: "Binary choice", props: { segments: "Buy,Sell", selected: 0 } },
      { name: "Three Options", description: "Triple choice", props: { segments: "Day,Week,Month", selected: 1 } },
    ],
  },
  {
    name: "Password Input",
    slug: "password-input",
    category: "primitives",
    description: "Password field with show/hide toggle.",
    component: PasswordInput,
    props: [
      { name: "placeholder", propType: { type: "string", default: "Enter password" }, description: "Placeholder" },
      { name: "value", propType: { type: "string", default: "" }, description: "Value" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label" },
      { name: "showPassword", propType: { type: "boolean", default: false }, description: "Show password" },
      { name: "error", propType: { type: "string", default: "" }, description: "Error message" },
    ],
    defaultProps: { placeholder: "Enter password", value: "", label: "Password", showPassword: false, error: "" },
    variants: [
      { name: "Hidden", description: "Password hidden", props: { label: "Password", value: "secret123", showPassword: false } },
      { name: "Visible", description: "Password shown", props: { label: "Password", value: "secret123", showPassword: true } },
      { name: "Error", description: "With error", props: { label: "Password", error: "Password too short" } },
    ],
  },
  {
    name: "Search Bar",
    slug: "search-bar",
    category: "primitives",
    description: "Search input with icon.",
    component: SearchBar,
    props: [
      { name: "placeholder", propType: { type: "string", default: "Search..." }, description: "Placeholder" },
      { name: "value", propType: { type: "string", default: "" }, description: "Value" },
      { name: "showClear", propType: { type: "boolean", default: false }, description: "Show clear button" },
    ],
    defaultProps: { placeholder: "Search tokens...", value: "", showClear: false },
    variants: [
      { name: "Empty", description: "No search value", props: { placeholder: "Search..." } },
      { name: "With Value", description: "Has search value", props: { value: "ETH", showClear: true } },
    ],
  },

  // ============================================
  // WALLET-SPECIFIC COMPONENTS
  // ============================================
  {
    name: "Transaction Cell",
    slug: "transaction-cell",
    category: "components",
    description: "Transaction history row item.",
    component: TransactionCell,
    props: [
      { name: "type", propType: { type: "select", default: "send", options: ["send", "receive", "swap", "approve"] }, description: "Transaction type" },
      { name: "status", propType: { type: "select", default: "confirmed", options: ["pending", "confirmed", "failed"] }, description: "Status" },
      { name: "amount", propType: { type: "string", default: "-0.5 ETH" }, description: "Amount" },
      { name: "value", propType: { type: "string", default: "$1,000.00" }, description: "Fiat value" },
      { name: "address", propType: { type: "string", default: "0x1234...5678" }, description: "Address" },
      { name: "timestamp", propType: { type: "string", default: "2 hours ago" }, description: "Time" },
    ],
    defaultProps: { type: "send", status: "confirmed", amount: "-0.5 ETH", value: "$1,000.00", address: "0x1234...5678", timestamp: "2 hours ago" },
    variants: [
      { name: "Send", description: "Outgoing transaction", props: { type: "send", amount: "-1.0 ETH", status: "confirmed" } },
      { name: "Receive", description: "Incoming transaction", props: { type: "receive", amount: "+0.5 ETH", status: "confirmed" } },
      { name: "Pending", description: "Pending transaction", props: { type: "send", status: "pending", amount: "-0.1 ETH" } },
      { name: "Swap", description: "Token swap", props: { type: "swap", amount: "ETH → USDC", status: "confirmed" } },
    ],
  },
  {
    name: "Address Display",
    slug: "address-display",
    category: "components",
    description: "Display crypto address with copy button.",
    component: AddressDisplay,
    props: [
      { name: "address", propType: { type: "string", default: "0x1234567890abcdef1234567890abcdef12345678" }, description: "Wallet address" },
      { name: "truncate", propType: { type: "boolean", default: true }, description: "Truncate address" },
      { name: "showCopy", propType: { type: "boolean", default: true }, description: "Show copy button" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "compact", "full"] }, description: "Display variant" },
    ],
    defaultProps: { address: "0x1234567890abcdef1234567890abcdef12345678", truncate: true, showCopy: true, variant: "default" },
    variants: [
      { name: "Truncated", description: "Shortened address", props: { truncate: true } },
      { name: "Full", description: "Full address", props: { variant: "full", truncate: false } },
      { name: "No Copy", description: "Without copy button", props: { showCopy: false } },
    ],
  },
  {
    name: "Gas Fee Selector",
    slug: "gas-fee-selector",
    category: "components",
    description: "Gas fee estimation and selection.",
    component: GasFeeSelector,
    props: [
      { name: "selected", propType: { type: "select", default: "medium", options: ["low", "medium", "high", "custom"] }, description: "Selected option" },
      { name: "lowFee", propType: { type: "string", default: "$0.50" }, description: "Low fee" },
      { name: "mediumFee", propType: { type: "string", default: "$1.00" }, description: "Medium fee" },
      { name: "highFee", propType: { type: "string", default: "$2.50" }, description: "High fee" },
      { name: "showCustom", propType: { type: "boolean", default: false }, description: "Show advanced" },
    ],
    defaultProps: { selected: "medium", lowFee: "$0.50", mediumFee: "$1.00", highFee: "$2.50", showCustom: false },
    variants: [
      { name: "Normal", description: "Medium selected", props: { selected: "medium" } },
      { name: "Fast", description: "High selected", props: { selected: "high" } },
      { name: "With Advanced", description: "Shows custom option", props: { selected: "medium", showCustom: true } },
    ],
  },
  {
    name: "NFT Card",
    slug: "nft-card",
    category: "components",
    description: "NFT display card.",
    component: NFTCard,
    props: [
      { name: "name", propType: { type: "string", default: "Cool NFT #1234" }, description: "NFT name" },
      { name: "collection", propType: { type: "string", default: "Cool Collection" }, description: "Collection name" },
      { name: "price", propType: { type: "string", default: "0.5 ETH" }, description: "Price" },
      { name: "showPrice", propType: { type: "boolean", default: true }, description: "Show price" },
    ],
    defaultProps: { name: "Cool NFT #1234", collection: "Cool Collection", price: "0.5 ETH", showPrice: true },
    variants: [
      { name: "With Price", description: "Shows price", props: { name: "Bored Ape #1234", collection: "BAYC", price: "50 ETH" } },
      { name: "No Price", description: "Without price", props: { name: "My NFT", collection: "Collection", showPrice: false } },
    ],
  },
  {
    name: "Network Selector",
    slug: "network-selector",
    category: "components",
    description: "Network selection list.",
    component: NetworkSelector,
    props: [
      { name: "selected", propType: { type: "string", default: "Ethereum" }, description: "Selected network" },
      { name: "networks", propType: { type: "string", default: "Ethereum,Polygon,Arbitrum,Optimism" }, description: "Networks (comma separated)" },
    ],
    defaultProps: { selected: "Ethereum", networks: "Ethereum,Polygon,Arbitrum,Optimism" },
    variants: [
      { name: "Ethereum Selected", description: "Default selection", props: { selected: "Ethereum" } },
      { name: "Polygon Selected", description: "L2 selected", props: { selected: "Polygon" } },
    ],
  },
  {
    name: "QR Code",
    slug: "qr-code",
    category: "components",
    description: "QR code display for addresses.",
    component: QRCode,
    props: [
      { name: "value", propType: { type: "string", default: "0x1234567890abcdef" }, description: "Value to encode" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Size" },
      { name: "showValue", propType: { type: "boolean", default: true }, description: "Show value below" },
    ],
    defaultProps: { value: "0x1234567890abcdef1234567890abcdef12345678", size: "md", showValue: true },
    variants: [
      { name: "Small", description: "Compact QR", props: { size: "sm" } },
      { name: "Large", description: "Large QR", props: { size: "lg" } },
      { name: "No Value", description: "Without text", props: { showValue: false } },
    ],
  },
  {
    name: "Status Indicator",
    slug: "status-indicator",
    category: "components",
    description: "Transaction/connection status indicator.",
    component: StatusIndicator,
    props: [
      { name: "status", propType: { type: "select", default: "confirmed", options: ["pending", "confirmed", "failed", "processing"] }, description: "Status" },
      { name: "label", propType: { type: "string", default: "" }, description: "Label text" },
      { name: "showPulse", propType: { type: "boolean", default: false }, description: "Animate" },
    ],
    defaultProps: { status: "confirmed", label: "Confirmed", showPulse: false },
    variants: [
      { name: "Confirmed", description: "Success state", props: { status: "confirmed", label: "Confirmed" } },
      { name: "Pending", description: "Waiting state", props: { status: "pending", label: "Pending" } },
      { name: "Failed", description: "Error state", props: { status: "failed", label: "Failed" } },
      { name: "Processing", description: "In progress", props: { status: "processing", label: "Processing" } },
    ],
  },
  {
    name: "WalletConnect Session",
    slug: "walletconnect-session",
    category: "components",
    description: "Connected dApp display.",
    component: WalletConnectSession,
    props: [
      { name: "dappName", propType: { type: "string", default: "Uniswap" }, description: "dApp name" },
      { name: "dappUrl", propType: { type: "string", default: "app.uniswap.org" }, description: "dApp URL" },
      { name: "connected", propType: { type: "boolean", default: true }, description: "Connection state" },
      { name: "network", propType: { type: "string", default: "Ethereum" }, description: "Network" },
    ],
    defaultProps: { dappName: "Uniswap", dappUrl: "app.uniswap.org", connected: true, network: "Ethereum" },
    variants: [
      { name: "Connected", description: "Active session", props: { dappName: "Uniswap", connected: true } },
      { name: "Disconnected", description: "Inactive session", props: { dappName: "OpenSea", connected: false } },
    ],
  },
  {
    name: "Amount Input",
    slug: "amount-input",
    category: "components",
    description: "Crypto amount input with token selector.",
    component: AmountInput,
    props: [
      { name: "value", propType: { type: "string", default: "0.0" }, description: "Amount value" },
      { name: "token", propType: { type: "string", default: "ETH" }, description: "Token symbol" },
      { name: "fiatValue", propType: { type: "string", default: "$0.00" }, description: "Fiat equivalent" },
      { name: "balance", propType: { type: "string", default: "1.5" }, description: "Available balance" },
      { name: "showMax", propType: { type: "boolean", default: true }, description: "Show MAX button" },
    ],
    defaultProps: { value: "0.0", token: "ETH", fiatValue: "$0.00", balance: "1.5", showMax: true },
    variants: [
      { name: "Empty", description: "No amount entered", props: { value: "0.0", fiatValue: "$0.00" } },
      { name: "With Amount", description: "Amount entered", props: { value: "0.5", fiatValue: "$1,000.00" } },
      { name: "Different Token", description: "USDC selected", props: { token: "USDC", balance: "1000" } },
    ],
  },
  {
    name: "Swap Preview",
    slug: "swap-preview",
    category: "components",
    description: "Token swap preview with rates.",
    component: SwapPreview,
    props: [
      { name: "fromToken", propType: { type: "string", default: "ETH" }, description: "From token" },
      { name: "fromAmount", propType: { type: "string", default: "1.0" }, description: "From amount" },
      { name: "toToken", propType: { type: "string", default: "USDC" }, description: "To token" },
      { name: "toAmount", propType: { type: "string", default: "2,000.00" }, description: "To amount" },
      { name: "rate", propType: { type: "string", default: "1 ETH = 2,000 USDC" }, description: "Exchange rate" },
      { name: "fee", propType: { type: "string", default: "$2.50" }, description: "Network fee" },
    ],
    defaultProps: { fromToken: "ETH", fromAmount: "1.0", toToken: "USDC", toAmount: "2,000.00", rate: "1 ETH = 2,000 USDC", fee: "$2.50" },
    variants: [
      { name: "ETH to USDC", description: "Common swap", props: { fromToken: "ETH", toToken: "USDC" } },
      { name: "USDC to ETH", description: "Reverse swap", props: { fromToken: "USDC", fromAmount: "2000", toToken: "ETH", toAmount: "1.0" } },
    ],
  },
  {
    name: "Confirmation Sheet",
    slug: "confirmation-sheet",
    category: "components",
    description: "Transaction confirmation bottom sheet.",
    component: ConfirmationSheet,
    props: [
      { name: "title", propType: { type: "string", default: "Confirm Transaction" }, description: "Title" },
      { name: "amount", propType: { type: "string", default: "1.0 ETH" }, description: "Amount" },
      { name: "recipient", propType: { type: "string", default: "0x1234...5678" }, description: "Recipient" },
      { name: "fee", propType: { type: "string", default: "$2.50" }, description: "Fee" },
      { name: "total", propType: { type: "string", default: "$2,002.50" }, description: "Total" },
    ],
    defaultProps: { title: "Confirm Transaction", amount: "1.0 ETH", recipient: "0x1234...5678", fee: "$2.50", total: "$2,002.50" },
    variants: [
      { name: "Send", description: "Send confirmation", props: { title: "Confirm Send", amount: "0.5 ETH" } },
      { name: "Swap", description: "Swap confirmation", props: { title: "Confirm Swap", amount: "1 ETH → 2000 USDC" } },
    ],
  },
  {
    name: "Identicon",
    slug: "identicon",
    category: "components",
    description: "Address-based avatar/identicon.",
    component: Identicon,
    props: [
      { name: "address", propType: { type: "string", default: "0x1234567890abcdef" }, description: "Wallet address" },
      { name: "size", propType: { type: "select", default: "md", options: ["sm", "md", "lg"] }, description: "Size" },
    ],
    defaultProps: { address: "0x1234567890abcdef", size: "md" },
    variants: [
      { name: "Small", description: "Small identicon", props: { size: "sm" } },
      { name: "Medium", description: "Medium identicon", props: { size: "md" } },
      { name: "Large", description: "Large identicon", props: { size: "lg" } },
      { name: "Different Address", description: "Different colors", props: { address: "0xabcdef1234567890" } },
    ],
  },
  {
    name: "Chain Badge",
    slug: "chain-badge",
    category: "components",
    description: "Current chain indicator.",
    component: ChainBadge,
    props: [
      { name: "chain", propType: { type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB", "Base"] }, description: "Chain name" },
      { name: "showName", propType: { type: "boolean", default: true }, description: "Show chain name" },
    ],
    defaultProps: { chain: "Ethereum", showName: true },
    variants: [
      { name: "Ethereum", description: "Mainnet", props: { chain: "Ethereum" } },
      { name: "Polygon", description: "Polygon network", props: { chain: "Polygon" } },
      { name: "Icon Only", description: "Just the dot", props: { chain: "Arbitrum", showName: false } },
    ],
  },
  {
    name: "Stepper",
    slug: "stepper",
    category: "components",
    description: "Multi-step progress indicator.",
    component: Stepper,
    props: [
      { name: "steps", propType: { type: "string", default: "Connect,Approve,Confirm" }, description: "Steps (comma separated)" },
      { name: "current", propType: { type: "number", default: 0, min: 0, max: 5 }, description: "Current step" },
      { name: "variant", propType: { type: "select", default: "default", options: ["default", "compact"] }, description: "Display variant" },
    ],
    defaultProps: { steps: "Connect,Approve,Confirm", current: 0, variant: "default" },
    variants: [
      { name: "First Step", description: "At beginning", props: { current: 0 } },
      { name: "Middle Step", description: "In progress", props: { current: 1 } },
      { name: "Completed", description: "All done", props: { current: 3 } },
      { name: "Compact", description: "Without labels", props: { variant: "compact", current: 1 } },
    ],
  },
  {
    name: "Notification Cell",
    slug: "notification-cell",
    category: "components",
    description: "In-app notification row.",
    component: NotificationCell,
    props: [
      { name: "title", propType: { type: "string", default: "Transaction Complete" }, description: "Title" },
      { name: "message", propType: { type: "string", default: "Your transaction has been confirmed" }, description: "Message" },
      { name: "timestamp", propType: { type: "string", default: "2 min ago" }, description: "Time" },
      { name: "type", propType: { type: "select", default: "success", options: ["info", "success", "warning", "error"] }, description: "Type" },
      { name: "unread", propType: { type: "boolean", default: true }, description: "Unread state" },
    ],
    defaultProps: { title: "Transaction Complete", message: "Your transaction has been confirmed", timestamp: "2 min ago", type: "success", unread: true },
    variants: [
      { name: "Success", description: "Success notification", props: { type: "success", title: "Success!", message: "Transaction confirmed" } },
      { name: "Warning", description: "Warning notification", props: { type: "warning", title: "Low Balance", message: "Your ETH balance is low" } },
      { name: "Read", description: "Already read", props: { unread: false } },
    ],
  },
  {
    name: "Collectible Grid",
    slug: "collectible-grid",
    category: "components",
    description: "NFT grid layout.",
    component: CollectibleGrid,
    props: [
      { name: "count", propType: { type: "number", default: 4, min: 1, max: 8 }, description: "Number of items" },
      { name: "columns", propType: { type: "number", default: 2, min: 2, max: 3 }, description: "Grid columns" },
    ],
    defaultProps: { count: 4, columns: 2 },
    variants: [
      { name: "2 Items", description: "Small collection", props: { count: 2 } },
      { name: "4 Items", description: "Default grid", props: { count: 4 } },
      { name: "6 Items", description: "Larger grid", props: { count: 6 } },
    ],
  },
];

// Helper to get component by slug
export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((c) => c.slug === slug);
}
