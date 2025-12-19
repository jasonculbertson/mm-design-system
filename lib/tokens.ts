/**
 * MetaMask Design Tokens
 * 
 * Official design tokens extracted from MetaMask's Figma design system.
 * Based on: https://github.com/eriknson/metamask-ds
 * 
 * These are the canonical values - never use raw hex values in components.
 */

// ============================================
// DARK MODE COLORS (Default)
// ============================================
export const colors = {
  // Background - for surfaces and containers
  background: {
    default: '#131416',           // Default neutral surface
    section: '#1c1d1f',           // Section bg over default
    subsection: '#252628',        // Subsection bg over section
    muted: 'rgba(255, 255, 255, 0.04)', // Raised neutral surface
    alternative: '#0a0b0c',       // Sunken surface below default
    // Interactive states
    defaultHover: '#1a1b1c',
    defaultPressed: '#222424',
    mutedHover: 'rgba(255, 255, 255, 0.08)',
    mutedPressed: 'rgba(255, 255, 255, 0.16)',
    hover: 'rgba(218, 220, 229, 0.04)',
    pressed: 'rgba(218, 220, 229, 0.08)',
  },

  // Text - for text content
  text: {
    default: '#ffffff',           // Default text color
    alternative: '#9b9b9b',       // Softer/secondary text
    muted: '#48484e',             // Muted text (⚠️ low contrast)
  },

  // Icon - for icons and symbols
  icon: {
    default: '#ffffff',           // Default icon color
    alternative: '#9b9b9b',       // Softer icon color
    muted: '#48484e',             // Muted icons
    inverse: '#131416',           // Icons on colored backgrounds
  },

  // Border - for borders and dividers
  border: {
    default: '#848c96',           // Default border color
    muted: 'rgba(133, 139, 154, 0.2)', // Subtle borders
  },

  // Overlay - for modals and drawers
  overlay: {
    default: 'rgba(0, 0, 0, 0.6)',
    alternative: 'rgba(0, 0, 0, 0.8)',
    inverse: '#ffffff',
  },

  // Primary - interactive, active, selected elements
  primary: {
    default: '#43aefc',           // Cyan blue
    muted: 'rgba(67, 174, 252, 0.15)',
    inverse: '#131416',
    defaultHover: '#26a2fc',
    defaultPressed: '#3baafc',
  },

  // Error - destructive, critical actions
  error: {
    default: '#ff7584',           // Coral red
    muted: 'rgba(255, 117, 132, 0.15)',
    inverse: '#131416',
    defaultHover: '#ff8a96',
    defaultPressed: '#ffb2bb',
  },

  // Warning - caution, attention
  warning: {
    default: '#f0b034',           // Amber
    muted: 'rgba(240, 176, 52, 0.15)',
    inverse: '#131416',
    defaultHover: '#f3be59',
    defaultPressed: '#f6cd7f',
  },

  // Success - confirmation, completion
  success: {
    default: '#baf24a',           // Lime green
    muted: 'rgba(186, 242, 74, 0.15)',
    inverse: '#131416',
    defaultHover: '#c9f570',
    defaultPressed: '#d7f796',
  },

  // Info - hints, reminders
  info: {
    default: '#43aefc',           // Same as primary
    muted: 'rgba(67, 174, 252, 0.15)',
    inverse: '#131416',
  },

  // Brand - MetaMask orange
  brand: {
    default: '#E2761B',
  },
};

// ============================================
// LIGHT MODE COLORS
// ============================================
export const lightColors = {
  background: {
    default: '#ffffff',
    section: '#f5f6f8',
    subsection: '#ffffff',
    muted: 'rgba(60, 77, 157, 0.1)',
    alternative: '#f0f1f3',
    defaultHover: '#f6f6f7',
    defaultPressed: '#ebecef',
    mutedHover: 'rgba(60, 77, 157, 0.15)',
    mutedPressed: 'rgba(60, 77, 157, 0.2)',
    hover: 'rgba(133, 139, 154, 0.08)',
    pressed: 'rgba(133, 139, 154, 0.16)',
  },

  text: {
    default: '#141618',
    alternative: '#6a737d',
    muted: '#9fa6ae',
  },

  icon: {
    default: '#141618',
    alternative: '#6a737d',
    muted: '#9fa6ae',
    inverse: '#ffffff',
  },

  border: {
    default: '#bbc0c5',
    muted: 'rgba(183, 187, 200, 0.4)',
  },

  overlay: {
    default: 'rgba(63, 67, 74, 0.3)',
    alternative: 'rgba(0, 0, 0, 0.8)',
    inverse: '#ffffff',
  },

  primary: {
    default: '#0376c9',
    muted: 'rgba(3, 118, 201, 0.1)',
    inverse: '#ffffff',
    defaultHover: '#025ea1',
    defaultPressed: '#024272',
  },

  error: {
    default: '#ca3542',
    muted: 'rgba(202, 53, 66, 0.1)',
    inverse: '#ffffff',
    defaultHover: '#ba313d',
    defaultPressed: '#9a2832',
  },

  warning: {
    default: '#9a6300',
    muted: 'rgba(154, 99, 0, 0.1)',
    inverse: '#ffffff',
    defaultHover: '#855500',
    defaultPressed: '#5c3b00',
  },

  success: {
    default: '#457a39',
    muted: 'rgba(69, 122, 57, 0.1)',
    inverse: '#ffffff',
    defaultHover: '#3d6c32',
    defaultPressed: '#2d5025',
  },

  info: {
    default: '#0376c9',
    muted: 'rgba(3, 118, 201, 0.1)',
    inverse: '#ffffff',
  },

  brand: {
    default: '#E2761B',
  },
};

// ============================================
// CHROME COLORS (Website UI shell)
// ============================================
export const chromeColors = {
  dark: {
    bg: '#000000',
    bgSubtle: '#1c1c1e',
    bgVerySubtle: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.08)',
    text: '#f5f5f7',
    textMuted: '#86868b',
    accent: '#2997ff',
  },
  light: {
    bg: '#ffffff',
    bgSubtle: '#f5f5f7',
    bgVerySubtle: 'rgba(0, 0, 0, 0.015)',
    border: 'rgba(0, 0, 0, 0.06)',
    text: '#1d1d1f',
    textMuted: '#86868b',
    accent: '#0071e3',
  },
};

// ============================================
// SPACING (4px base unit)
// ============================================
export const spacing = {
  0: 0,
  xs: 4,    // 0.25rem
  sm: 8,    // 0.5rem
  md: 16,   // 1rem
  lg: 24,   // 1.5rem
  xl: 32,   // 2rem
  '2xl': 48,
  '3xl': 64,
  // Numeric aliases
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: 0,
  xs: 2,    // extra small
  sm: 4,    // 0.25rem - subtle rounding
  md: 6,    // 0.375rem - default buttons
  lg: 12,   // 0.75rem - cards
  xl: 16,   // 1rem - large cards
  '2xl': 24,
  full: 9999,
  pill: 9999,
};

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    // Display - hero text
    displayLg: { size: 40, lineHeight: 50 },
    displayMd: { size: 32, lineHeight: 40 },
    // Headings
    headingLg: { size: 24, lineHeight: 32 },
    headingMd: { size: 18, lineHeight: 24 },
    headingSm: { size: 16, lineHeight: 24 },
    // Body text
    bodyLg: { size: 18, lineHeight: 24 },
    bodyLgMedium: { size: 18, lineHeight: 24 },
    bodyMd: { size: 16, lineHeight: 24 },
    bodySm: { size: 14, lineHeight: 22 },
    bodyXs: { size: 12, lineHeight: 20 },
  },
};

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// ============================================
// EXPORTS
// ============================================
export const tokens = {
  colors,
  lightColors,
  chromeColors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default tokens;
