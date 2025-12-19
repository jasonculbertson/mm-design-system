import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Platform } from "react-native";
import { colors as darkColors, lightColors, chromeColors } from "./tokens";

type ThemeMode = "dark" | "light";

// Create a merged color type
type ColorTokens = typeof darkColors;

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: ColorTokens;
  chrome: typeof chromeColors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light"); // Default to light like reference

  // Apply theme class to HTML element on web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Select colors based on theme
  const currentColors = theme === "dark" ? darkColors : lightColors as ColorTokens;
  const currentChrome = theme === "dark" ? chromeColors.dark : chromeColors.light;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors, chrome: currentChrome }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook to access theme-aware colors for app components
 * Maps semantic names to current theme colors
 */
export function useAppColors() {
  const { colors, chrome } = useTheme();
  
  return {
    // Chrome UI (website shell)
    chromeBg: chrome.bg,
    chromeBgSubtle: chrome.bgSubtle,
    chromeBorder: chrome.border,
    chromeText: chrome.text,
    chromeTextMuted: chrome.textMuted,
    chromeAccent: chrome.accent,

    // Component preview backgrounds
    bgApp: colors.background.default,
    bgSidebar: chrome.bg,
    bgContent: chrome.bg, // Main content area uses chrome bg
    bgCard: colors.background.section,
    bgCardHover: colors.background.subsection,
    bgInput: colors.background.subsection,
    bgMuted: colors.background.muted,

    // Light mode content bg for contrast
    lightBgContent: lightColors.background.default,

    // Text
    textPrimary: colors.text.default,
    textSecondary: colors.text.alternative,
    textMuted: colors.text.muted,
    textInverse: colors.icon.inverse,

    // Icons
    iconDefault: colors.icon.default,
    iconAlternative: colors.icon.alternative,
    iconMuted: colors.icon.muted,
    iconInverse: colors.icon.inverse,

    // Borders
    borderDefault: colors.border.default,
    borderMuted: colors.border.muted,

    // Primary (interactive)
    primaryDefault: colors.primary.default,
    primaryMuted: colors.primary.muted,
    primaryInverse: colors.primary.inverse,
    primaryHover: colors.primary.defaultHover,

    // Status colors
    errorDefault: colors.error.default,
    errorMuted: colors.error.muted,
    errorInverse: colors.error.inverse,
    
    successDefault: colors.success.default,
    successMuted: colors.success.muted,
    successInverse: colors.success.inverse,
    
    warningDefault: colors.warning.default,
    warningMuted: colors.warning.muted,
    warningInverse: colors.warning.inverse,
    
    infoDefault: colors.info.default,
    infoMuted: colors.info.muted,
    infoInverse: colors.info.inverse,

    // Overlay
    overlayDefault: colors.overlay.default,
    overlayAlternative: colors.overlay.alternative,

    // Brand
    brandDefault: colors.brand.default,

    // Interactive states
    bgHover: colors.background.hover,
    bgPressed: colors.background.pressed,

    // Code background
    bgCode: colors.background.section,
  };
}

/**
 * Hook to get raw color tokens for the current theme
 */
export function useColorTokens() {
  const { colors } = useTheme();
  return colors;
}
