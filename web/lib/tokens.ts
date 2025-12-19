// MetaMask Design System Tokens
// Single source of truth - change here to update all components
// Values sourced from Figma: https://www.figma.com/design/kdFzEC7xzSNw7cXteqgzDW/Colors

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  dark: {
    // Neutral
    background: {
      default: "#131416",      // grey-900
      section: "#1c1d1f",      // grey-850
      subsection: "#252628",   // grey-800
      muted: "rgba(255,255,255,0.04)", // white 4%
    },
    text: {
      default: "#ffffff",      // grey-000
      alternative: "#9b9b9b",  // grey-400
      muted: "#48484e",        // grey-600
    },
    icon: {
      default: "#ffffff",      // follows text-default
      alternative: "#9b9b9b",  // follows text-alternative
      muted: "#48484e",        // follows text-muted
      inverse: "#131416",      // background-default (for icons on light fills)
    },
    border: {
      default: "#848c96",      // grey-400
      muted: "rgba(133,139,154,0.2)", // grey-400 20%
    },
    overlay: {
      default: "rgba(0,0,0,0.5)", // black 50%
    },
    // Semantic
    primary: {
      default: "#8b99ff",      // blue-300 (official Figma)
      muted: "rgba(139,153,255,0.15)", // blue-400 15% (official Figma)
      inverse: "#131416",      // grey-900 (text on primary)
    },
    error: {
      default: "#ff7584",      // red-400
      muted: "rgba(255,117,132,0.15)", // red-400 15%
      inverse: "#131416",      // grey-900
    },
    success: {
      default: "#baf24a",      // lime-500
      muted: "rgba(186,242,74,0.15)", // lime-500 15%
      inverse: "#131416",      // grey-900
    },
    warning: {
      default: "#f0b034",      // yellow-400
      muted: "rgba(240,176,52,0.15)", // yellow-400 15%
      inverse: "#131416",      // grey-900
    },
    info: {
      default: "#8b99ff",      // blue-300 (same as primary)
      muted: "rgba(139,153,255,0.15)",
      inverse: "#131416",
    },
    // Interaction states
    hover: {
      background: "rgba(255,255,255,0.08)", // white 8%
      primary: "#a3aeff",      // blue-200 (lighter than primary)
      error: "#ffa1ad",        // red-300
      success: "#ccf566",      // lime-400
    },
    pressed: {
      background: "rgba(255,255,255,0.16)", // white 16%
      primary: "#bbc4ff",      // blue-100 (even lighter)
      error: "#ffced5",        // red-200
      success: "#ddf883",      // lime-300
    },
  },
  light: {
    // Neutral
    background: {
      default: "#ffffff",      // grey-000
      section: "#f5f6f8",      // grey-050
      subsection: "#ffffff",   // grey-000 (on section)
      muted: "rgba(60,77,157,0.1)", // #3C4D9D 10%
    },
    text: {
      default: "#121314",      // grey-900
      alternative: "#686e7d",  // grey-500
      muted: "#b7bbc8",        // grey-200
    },
    icon: {
      default: "#121314",      // follows text-default
      alternative: "#686e7d",  // follows text-alternative
      muted: "#b7bbc8",        // follows text-muted
      inverse: "#ffffff",      // background-default (for icons on dark fills)
    },
    border: {
      default: "#858b9a",      // grey-400
      muted: "rgba(183,187,200,0.4)", // grey-200 40%
    },
    overlay: {
      default: "rgba(63,67,74,0.3)", // #3F434A 30%
    },
    // Semantic
    primary: {
      default: "#4459ff",      // blue-500 (official Figma)
      muted: "rgba(68,89,255,0.1)", // blue-500 10%
      inverse: "#ffffff",      // grey-000 (text on primary)
    },
    error: {
      default: "#ca3542",      // red-500
      muted: "rgba(202,53,66,0.1)", // red-500 10%
      inverse: "#ffffff",
    },
    success: {
      default: "#457a39",      // green-500
      muted: "rgba(69,122,57,0.1)", // green-500 10%
      inverse: "#ffffff",
    },
    warning: {
      default: "#9a6300",      // yellow-500
      muted: "#ffefc6",        // yellow-100
      inverse: "#121314",      // grey-900
    },
    info: {
      default: "#4459ff",      // blue-500 (same as primary)
      muted: "rgba(68,89,255,0.1)",
      inverse: "#ffffff",
    },
    // Interaction states
    hover: {
      background: "#f5f6f8",   // grey-050
      primary: "#384df5",      // blue-500 hover (from CSS)
      error: "#a12a35",        // red-600
      success: "#396230",      // green-600
    },
    pressed: {
      background: "#e8e9eb",   // grey-100
      primary: "#2b3eda",      // blue-500 pressed (from CSS)
      error: "#81222a",        // red-700
      success: "#2e5026",      // green-700
    },
  },
  // Static colors - unchanged across themes
  static: {
    white: "#ffffff",
    black: "#000000",
    transparent: "transparent",
  },
  // Accent colors - brand/product specific colors
  accent: {
    indigo: {
      default: "#4F46E5",     // indigo-600 - Trade button
      hover: "#4338CA",       // indigo-700
      pressed: "#3730A3",     // indigo-800
    },
    orange: {
      default: "#f97316",     // orange-500
      muted: "rgba(249,115,22,0.15)",
    },
    purple: {
      default: "#9747ff",     // purple-500
      muted: "rgba(151,71,255,0.15)",
    },
  },
};

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const typography = {
  fontFamily: {
    sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
    system: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
  },
  fontSize: {
    xs: 12,      // Caption, labels
    sm: 14,      // Small body, subtitles
    base: 16,    // Body text
    lg: 18,      // Large body
    xl: 20,      // Small headings
    "2xl": 24,   // Headings
    "3xl": 30,   // Large headings
    "4xl": 36,   // Display
  },
  lineHeight: {
    xs: 16,      // For fontSize.xs
    sm: 22,      // For fontSize.sm (Figma uses 22px)
    base: 24,    // For fontSize.base
    lg: 28,      // For fontSize.lg
    xl: 28,      // For fontSize.xl
    "2xl": 32,   // For fontSize.2xl
    "3xl": 36,   // For fontSize.3xl
    "4xl": 44,   // For fontSize.4xl
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: -0.3,
    normal: 0,
    wide: 0.5,
  },
};

// =============================================================================
// SPACING TOKENS (4px base unit)
// =============================================================================

export const spacing = {
  0: 0,
  0.5: 2,    // 2px
  1: 4,      // 4px
  1.5: 6,    // 6px
  2: 8,      // 8px
  2.5: 10,   // 10px
  3: 12,     // 12px
  3.5: 14,   // 14px
  4: 16,     // 16px - base
  5: 20,     // 20px
  6: 24,     // 24px
  7: 28,     // 28px
  8: 32,     // 32px
  9: 36,     // 36px
  10: 40,    // 40px
  11: 44,    // 44px - iOS status bar
  12: 48,    // 48px
  14: 56,    // 56px
  16: 64,    // 64px
  20: 80,    // 80px
  24: 96,    // 96px
};

// =============================================================================
// BORDER WIDTH TOKENS
// =============================================================================

export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 4,
};

// =============================================================================
// BORDER RADIUS TOKENS
// Aligned with standard Tailwind CSS values
// =============================================================================

export const radius = {
  none: 0,
  xs: 2,      // rounded-xs (custom)
  sm: 4,      // rounded-sm = 0.25rem = 4px (MetaMask uses 4px for checkboxes)
  md: 6,      // rounded-md = 0.375rem = 6px
  lg: 8,      // rounded-lg = 0.5rem = 8px ← Button sm, Toast action button
  xl: 12,     // rounded-xl = 0.75rem = 12px ← Button md/lg
  "2xl": 16,  // rounded-2xl = 1rem = 16px ← Toast mini
  "3xl": 20,  // rounded-3xl = 1.25rem = 20px ← Toast full
  full: 9999, // rounded-full
};

// =============================================================================
// ICON SIZE TOKENS
// =============================================================================

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,     // Toast icons
  "2xl": 32,
  "3xl": 40,
};

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadow = {
  none: "none",
  xs: "0px 1px 4px 0px rgba(0,0,0,0.5)",   // Toast shadow (dark)
  sm: "0 2px 4px rgba(0,0,0,0.2)",         // Slider thumb
  md: "0 2px 8px rgba(0,0,0,0.2)",         // Tooltip
  lg: "0 4px 12px rgba(0,0,0,0.15)",       // Card elevated, Banner
  xl: "0 8px 32px rgba(0,0,0,0.3)",        // Dialog
};

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

export const components = {
  // iOS Status Bar
  statusBar: {
    height: 44,
  },
  // Header
  header: {
    width: 384,          // Standard mobile width
    titleLarge: 24,      // Large title font size
    titleSmall: 16,      // Small/centered title font size
  },
  // Button - matches official @metamask/design-system-react ButtonBase
  button: {
    heightSm: 32,        // h-8 = 2rem = 32px
    heightMd: 40,        // h-10 = 2.5rem = 40px
    heightLg: 48,        // h-12 = 3rem = 48px
    minWidth: 80,        // min-w-20 = 5rem = 80px
    paddingX: 16,        // px-4 = 1rem = 16px
    borderRadiusSm: 8,   // rounded-lg = 0.5rem = 8px (for sm buttons)
    borderRadiusMd: 12,  // rounded-xl = 0.75rem = 12px (for md buttons)
    borderRadiusLg: 12,  // rounded-xl = 0.75rem = 12px (for lg buttons)
  },
  // Input
  input: {
    height: 44,
  },
  // Thumbnail
  thumbnail: {
    size: 40,
  },
  // Sheet
  sheet: {
    illustrationSize: 120,
    homeIndicatorWidth: 128,
    homeIndicatorHeight: 5,
    closeIconSize: 14,
  },
  // Toast - from Figma
  toast: {
    width: 384,          // w-96 = 24rem = 384px (Figma spec)
    padding: 12,         // p-3
    gap: 12,             // gap-3
    iconSize: 28,        // Icon container (w-7 h-7)
    radiusFull: 20,      // Full toast rounded-[20px]
    radiusMini: 16,      // Mini toast rounded-2xl
    actionHeight: 32,    // Action button height h-8
    actionRadius: 8,     // Action button radius rounded-lg
  },
  // Badge Status
  badgeStatus: {
    sizeSm: 8,           // Inner dot sm
    sizeMd: 10,          // Inner dot md
    outerSm: 12,         // Outer ring sm
    outerMd: 14,         // Outer ring md
  },
  // Checkbox
  checkbox: {
    size: 20,            // w-5 h-5
    borderRadius: 4,     // rounded (4px)
    borderWidth: 2,
    gap: 12,             // gap-3
    checkmarkSize: 14,
  },
};

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorTheme = typeof colors.dark;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type IconSize = typeof iconSize;
export type Shadow = typeof shadow;
