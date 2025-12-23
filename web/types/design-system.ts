/**
 * MetaMask Design System Type Definitions
 * Used by AI tools for type safety and autocompletion
 */

// ===== Colors =====
export type TextColorVariant = 'default' | 'alternative' | 'muted';
export type BackgroundColorVariant = 'default' | 'alternative' | 'section';
export type SemanticColor = 'error' | 'success' | 'warning' | 'info';
export type BorderColor = 'default' | 'muted';

// ===== Spacing =====
export type SpacingValue = 1 | 2 | 3 | 4 | 6 | 8;

// ===== Border Radius =====
export type BorderRadiusSize = 'xs' | 'sm' | 'md' | 'lg' | 'pill';

// ===== Component Variants =====
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ComponentSize = 'sm' | 'md' | 'lg';
export type ComponentSizeExtended = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CardVariant = 'default' | 'elevated' | 'outlined';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type ListItemVariant = 'default' | 'destructive';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// ===== Transaction Types =====
export type TransactionType = 'send' | 'receive' | 'swap' | 'approve';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type GasFeeLevel = 'low' | 'medium' | 'high' | 'custom';

// ===== Network Types =====
export type SupportedNetwork = 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Optimism' | 'Avalanche' | 'BNB' | 'Base';

// ===== UI State =====
export type DialogVariant = 'default' | 'danger';
export type TabVariant = 'default' | 'pills';
export type BottomSheetPosition = 'bottom';
export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type SegmentedControlSize = 'sm' | 'md' | 'lg';

// ===== Navigation =====
export type NavTab = 'wallet' | 'browser' | 'settings';

// ===== Common Props Interfaces =====
export interface DesignSystemColors {
  background: {
    default: string;
    alternative: string;
    section: string;
  };
  text: {
    default: string;
    alternative: string;
    muted: string;
  };
  primary: {
    default: string;
    muted: string;
  };
  semantic: {
    error: string;
    success: string;
    warning: string;
  };
}

export interface DesignSystemSpacing {
  [key: number]: number | string;
}

export interface DesignSystemBorderRadius {
  xs: number | string;
  sm: number | string;
  md: number | string;
  lg: number | string;
  pill: number | string;
}

// ===== Component Base Props =====
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// ===== Specific Component Props =====
export interface ButtonProps extends BaseComponentProps, InteractiveProps {
  label: string;
  variant?: ButtonVariant;
  size?: ComponentSize;
}

export interface TokenCellProps extends BaseComponentProps {
  symbol: string;
  name: string;
  balance: string;
  value?: string;
  change?: string;
  changePositive?: boolean;
}

export interface HubHeaderProps extends BaseComponentProps {
  balance: string;
  label?: string;
  primaryAction?: string;
  secondaryAction?: string;
  showAvatar?: boolean;
}

export interface PageHeaderProps extends BaseComponentProps {
  title: string;
  showBack?: boolean;
  action?: string;
}

export interface TransactionCellProps extends BaseComponentProps {
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  value?: string;
  address?: string;
  timestamp?: string;
}

