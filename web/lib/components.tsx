"use client";

/**
 * MetaMask Design System Components
 * 
 * ARCHITECTURE:
 * =============
 * 
 * 1. TOKENS (from ./tokens.ts)
 *    └── colors, typography, spacing, radius, shadow, etc.
 *    └── Single source of truth for all design values
 * 
 * 2. BASE COMPONENTS (primitives built from tokens only)
 *    └── BaseButton, BaseCheckbox, BaseTabs, BaseSheet, BaseToast
 *    └── BaseHeader, BaseIcon, BaseAvatar, BaseToggle, BaseBadgeStatus
 *    └── These are the building blocks - should only use tokens directly
 * 
 * 3. COMPLEX COMPONENTS (composed from base components)
 *    └── HubHeader (uses BaseButton)
 *    └── Dialog (uses BaseButton)
 *    └── TokenCell, AccountPicker, etc.
 *    └── These compose base components + add layout/business logic
 * 
 * 4. SCREENS (composed from complex components)
 *    └── WalletHome, Settings, Send, Receive, etc.
 *    └── Full pages that compose multiple complex components
 * 
 * RULES:
 * - Base components ONLY use tokens (colors, spacing, etc.)
 * - Complex components compose Base components
 * - Never create inline styles that duplicate Base component functionality
 * - External brand colors (network colors) are acceptable exceptions
 */

import React, { useState } from "react";
import {
  colors,
  typography,
  spacing,
  radius,
  borderWidth,
  iconSize,
  shadow,
  components as componentTokens,
  type ColorTheme,
} from "./tokens";

// Hook to get theme colors based on document class
export function useColors() {
  const [isDark, setIsDark] = useState(true);
  
  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark ? colors.dark : colors.light;
}

// =============================================================================
// COMPLEX COMPONENTS (composed from base components)
// =============================================================================

// Token Cell Component
// TokenCell Component (uses tokens, can later use BaseTokenAvatar)
// TokenCell Component
// Composed from: AvatarToken
// Uses tokens: background.section, text.default, text.alternative, success/error, spacing, typography, radius
export function TokenCell({
  symbol = "ETH",
  name = "Ethereum",
  balance = "0.37",
  value = "$123.45",
  change = "+12.90%",
  changePositive = true,
  variant = "default",
  leverage,
  marketCap,
  tag,
  network = "ethereum",
  showNetworkBadge = true,
}: {
  symbol?: string;
  name?: string;
  balance?: string;
  value?: string;
  change?: string;
  changePositive?: boolean;
  variant?: "default" | "selection" | "perps" | "stock";
  leverage?: string;
  marketCap?: string;
  tag?: string;
  network?: "ethereum" | "polygon" | "arbitrum" | "optimism";
  showNetworkBadge?: boolean;
}) {
  const c = useColors();

  // Verified badge icon - verified-filled.svg from MetaMask icons
  const VerifiedIcon = () => (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path 
        d="m8.6 22.5-1.9-3.2-3.6-.8.35-3.7-2.45-2.8 2.45-2.8-.35-3.7 3.6-.8 1.9-3.2 3.4 1.45 3.4-1.45 1.9 3.2 3.6.8-.35 3.7 2.45 2.8-2.45 2.8.35 3.7-3.6.8-1.9 3.2-3.4-1.45zm2.35-6.95 5.65-5.65-1.4-1.45-4.25 4.25-2.15-2.1-1.4 1.4z" 
        fill={c.text.alternative}
      />
    </svg>
  );

  // After-hours icon for stocks - after-hours.svg from MetaMask icons
  const AfterHoursIcon = () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <path 
        d="M15.25 5C14.9 5 14.6042 4.87917 14.3625 4.6375C14.1208 4.39583 14 4.1 14 3.75C14 3.4 14.1208 3.10417 14.3625 2.8625C14.6042 2.62083 14.9 2.5 15.25 2.5C15.6 2.5 15.8958 2.62083 16.1375 2.8625C16.3792 3.10417 16.5 3.4 16.5 3.75C16.5 4.1 16.3792 4.39583 16.1375 4.6375C15.8958 4.87917 15.6 5 15.25 5ZM15.25 21.5C14.9 21.5 14.6042 21.3792 14.3625 21.1375C14.1208 20.8958 14 20.6 14 20.25C14 19.9 14.1208 19.6042 14.3625 19.3625C14.6042 19.1208 14.9 19 15.25 19C15.6 19 15.8958 19.1208 16.1375 19.3625C16.3792 19.6042 16.5 19.9 16.5 20.25C16.5 20.6 16.3792 20.8958 16.1375 21.1375C15.8958 21.3792 15.6 21.5 15.25 21.5ZM19.25 8.5C18.9 8.5 18.6042 8.37917 18.3625 8.1375C18.1208 7.89583 18 7.6 18 7.25C18 6.9 18.1208 6.60417 18.3625 6.3625C18.6042 6.12083 18.9 6 19.25 6C19.6 6 19.8958 6.12083 20.1375 6.3625C20.3792 6.60417 20.5 6.9 20.5 7.25C20.5 7.6 20.3792 7.89583 20.1375 8.1375C19.8958 8.37917 19.6 8.5 19.25 8.5ZM19.25 18C18.9 18 18.6042 17.8792 18.3625 17.6375C18.1208 17.3958 18 17.1 18 16.75C18 16.4 18.1208 16.1042 18.3625 15.8625C18.6042 15.6208 18.9 15.5 19.25 15.5C19.6 15.5 19.8958 15.6208 20.1375 15.8625C20.3792 16.1042 20.5 16.4 20.5 16.75C20.5 17.1 20.3792 17.3958 20.1375 17.6375C19.8958 17.8792 19.6 18 19.25 18ZM20.75 13.25C20.4 13.25 20.1042 13.1292 19.8625 12.8875C19.6208 12.6458 19.5 12.35 19.5 12C19.5 11.65 19.6208 11.3542 19.8625 11.1125C20.1042 10.8708 20.4 10.75 20.75 10.75C21.1 10.75 21.3958 10.8708 21.6375 11.1125C21.8792 11.3542 22 11.65 22 12C22 12.35 21.8792 12.6458 21.6375 12.8875C21.3958 13.1292 21.1 13.25 20.75 13.25ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2V4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20V22ZM15.3 16.7L11 12.4V7H13V11.6L16.7 15.3L15.3 16.7Z" 
        fill={c.text.alternative}
      />
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[4],
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Token Avatar with network badge - uses AvatarToken */}
      <div style={{ flexShrink: 0 }}>
        <AvatarToken
          name={symbol}
          size="md"
          showNetworkBadge={showNetworkBadge}
          network={network}
        />
      </div>

      {/* Left content */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
        {/* Top row - name/symbol with optional badge */}
        <div style={{ display: "flex", alignItems: "center", gap: spacing[1] }}>
          <span
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: c.text.default,
              lineHeight: `${typography.lineHeight.base}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {variant === "selection" ? symbol : name}
          </span>
          
          {/* Verified badge icon for default, selection, stock */}
          {(variant === "default" || variant === "selection" || variant === "stock") && (
            <div style={{ paddingLeft: spacing[1], display: "flex", alignItems: "center" }}>
              <VerifiedIcon />
            </div>
          )}
          
          {/* Leverage badge for perps - bg-Surface-2 */}
          {variant === "perps" && leverage && (
            <div
              style={{
                background: c.background.subsection, // Surface-2: #252628 dark
                height: 20, // Fixed 20px height
                padding: `0 ${spacing[1]}px`, // px-1
                borderRadius: radius.sm, // rounded (4px)
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: c.text.alternative,
                  lineHeight: `${typography.lineHeight.xs}px`,
                }}
              >
                {leverage}
              </span>
            </div>
          )}
        </div>

        {/* Bottom row - description */}
        <div style={{ display: "flex", alignItems: "center", gap: spacing[1] }}>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: c.text.alternative,
              lineHeight: `${typography.lineHeight.sm}px`,
              whiteSpace: "nowrap",
            }}
          >
            {variant === "selection" ? name : 
             variant === "perps" ? marketCap || "$297.4M" :
             variant === "stock" ? `${balance} ${symbol}` :
             `${balance} ${symbol}`}
          </span>
          
          {/* Stock tag - bg-background-subsection */}
          {variant === "stock" && tag && (
            <div
              style={{
                background: c.background.subsection, // background-subsection
                height: 20, // Fixed 20px height
                paddingLeft: 4, // 4px left
                paddingRight: 4, // 4px right
                borderRadius: radius.full, // rounded-[999px]
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: spacing[0.5], // gap-0.5
              }}
            >
              <AfterHoursIcon />
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: c.text.alternative,
                  lineHeight: `${typography.lineHeight.xs}px`,
                }}
              >
                {tag}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right content - value and change/balance */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", overflow: "hidden" }}>
        <span
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: c.text.default,
            lineHeight: `${typography.lineHeight.base}px`,
            textAlign: "right",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: variant === "selection" ? c.text.alternative : (changePositive ? c.success.default : c.error.default),
            lineHeight: `${typography.lineHeight.sm}px`,
            textAlign: "right",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {variant === "selection" ? `${balance} ${symbol}` : change}
        </span>
      </div>
    </div>
  );
}

// TokenList Component - List of tokens with header
// Composed from: TokenCell
// Uses tokens: background.section, text.default, text.alternative, spacing, radius
export function TokenList({
  title = "Tokens",
  tokens = [],
  seeAllLabel = "See all",
  onSeeAllClick,
  showSeeAll = true,
  maxItems = 3,
  isLoading = false,
}: {
  title?: string;
  tokens?: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: string;
    change: string;
    changePositive: boolean;
    network?: "ethereum" | "polygon" | "arbitrum" | "optimism";
  }>;
  seeAllLabel?: string;
  onSeeAllClick?: () => void;
  showSeeAll?: boolean;
  maxItems?: number;
  isLoading?: boolean;
}) {
  const c = useColors();
  
  // Default tokens if none provided
  const defaultTokens = [
    { symbol: "ETH", name: "Ethereum", balance: "1.45", value: "$2,450.32", change: "+2.5%", changePositive: true, network: "ethereum" as const },
    { symbol: "USDC", name: "USD Coin", balance: "500.00", value: "$500.00", change: "+0.01%", changePositive: true, network: "ethereum" as const },
    { symbol: "MATIC", name: "Polygon", balance: "250.00", value: "$234.56", change: "-4.2%", changePositive: false, network: "polygon" as const },
  ];
  
  const displayTokens = tokens.length > 0 ? tokens.slice(0, maxItems) : defaultTokens.slice(0, maxItems);

  return (
    <div style={{ width: "100%", maxWidth: 375, fontFamily: typography.fontFamily.sans }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: spacing[2],
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      }}>
        <span style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: c.text.default,
          lineHeight: `${typography.lineHeight.base}px`,
        }}>
          {title}
        </span>
        {showSeeAll && (
          <button
            onClick={onSeeAllClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing[1],
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: c.text.alternative,
              lineHeight: `${typography.lineHeight.sm}px`,
              padding: 0,
            }}
          >
            {seeAllLabel}
            <svg width={iconSize.sm} height={iconSize.sm} viewBox="0 0 24 24" fill="none">
              <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>

      {/* Token Cells Container */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing[1],
        backgroundColor: c.background.section,
        borderRadius: radius.lg,
        overflow: "hidden",
      }}>
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: maxItems }).map((_, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing[4],
                padding: spacing[4],
              }}
            >
              <div style={{
                width: spacing[10],
                height: spacing[10],
                borderRadius: radius.full,
                backgroundColor: c.background.muted,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 80, height: spacing[4], backgroundColor: c.background.muted, borderRadius: radius.sm, marginBottom: spacing[1] }} />
                <div style={{ width: 60, height: typography.fontSize.sm, backgroundColor: c.background.muted, borderRadius: radius.sm }} />
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ width: 60, height: spacing[4], backgroundColor: c.background.muted, borderRadius: radius.sm, marginBottom: spacing[1] }} />
                <div style={{ width: spacing[10], height: typography.fontSize.sm, backgroundColor: c.background.muted, borderRadius: radius.sm }} />
              </div>
            </div>
          ))
        ) : (
          displayTokens.map((token, index) => (
            <div key={index} style={{ padding: `${spacing[3]}px ${spacing[4]}px` }}>
              <TokenCell
                symbol={token.symbol}
                name={token.name}
                balance={token.balance}
                value={token.value}
                change={token.change}
                changePositive={token.changePositive}
                network={token.network}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Sorting Component - Sort options drawer/panel
// Uses tokens: background.default, background.section, background.hover, text.default, text.alternative, spacing, radius
export type SortDirection = "asc" | "desc";

export interface SortOption {
  id: string;
  label: string;
  supportsDirection?: boolean;
  defaultDirection?: SortDirection;
  ascLabel?: string;
  descLabel?: string;
}

export function Sorting({
  title = "Sort by",
  options = [],
  value = "",
  direction = "desc",
  onApply,
  onClose,
  showApplyButton = true,
}: {
  title?: string;
  options?: SortOption[];
  value?: string;
  direction?: SortDirection;
  onApply?: (value: string, direction: SortDirection) => void;
  onClose?: () => void;
  showApplyButton?: boolean;
}) {
  const c = useColors();
  const [selectedId, setSelectedId] = useState(value);
  const [selectedDirection, setSelectedDirection] = useState<SortDirection>(direction);

  // Default options if none provided
  const defaultOptions: SortOption[] = [
    { id: "name", label: "Name", supportsDirection: true, ascLabel: "A to Z", descLabel: "Z to A" },
    { id: "balance", label: "Balance", supportsDirection: true, ascLabel: "Low to high", descLabel: "High to low" },
    { id: "value", label: "Value", supportsDirection: true, ascLabel: "Low to high", descLabel: "High to low" },
    { id: "change", label: "Price change", supportsDirection: true, ascLabel: "Low to high", descLabel: "High to low" },
  ];

  const displayOptions = options.length > 0 ? options : defaultOptions;

  const handleOptionClick = (option: SortOption) => {
    if (selectedId === option.id && option.supportsDirection) {
      // Toggle direction if already selected
      setSelectedDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Select new option
      setSelectedId(option.id);
      if (option.supportsDirection) {
        setSelectedDirection(option.defaultDirection || "desc");
      }
    }
  };

  const handleApply = () => {
    onApply?.(selectedId, selectedDirection);
  };

  const getDirectionLabel = (option: SortOption, dir: SortDirection) => {
    if (dir === "asc") return option.ascLabel || "Low to high";
    return option.descLabel || "High to low";
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 375,
      backgroundColor: c.background.default,
      borderRadius: `${radius.xl}px ${radius.xl}px 0 0`,
      fontFamily: typography.fontFamily.sans,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
      }}>
        <div style={{ width: spacing[8] }} />
        <span style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.semibold,
          color: c.text.default,
          lineHeight: `${typography.lineHeight.base}px`,
          textAlign: "center",
        }}>
          {title}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: spacing[8],
              height: spacing[8],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: radius.full,
              color: c.text.default,
            }}
          >
            <svg width={iconSize.md} height={iconSize.md} viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Options */}
      <div style={{ padding: spacing[4], display: "flex", flexDirection: "column", gap: spacing[2] }}>
        {displayOptions.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: `${spacing[3]}px ${spacing[4]}px`,
                backgroundColor: isSelected ? c.background.subsection : "transparent",
                border: "none",
                borderRadius: radius.lg,
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 150ms ease",
              }}
            >
              <span style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.medium,
                color: isSelected ? c.text.default : c.text.alternative,
              }}>
                {option.label}
              </span>
              {isSelected && option.supportsDirection && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing[1],
                  fontSize: typography.fontSize.sm,
                  lineHeight: `${typography.lineHeight.sm}px`,
                  color: c.text.alternative,
                }}>
                  <span>{getDirectionLabel(option, selectedDirection)}</span>
                  <svg width={iconSize.sm} height={iconSize.sm} viewBox="0 0 24 24" fill="none">
                    {selectedDirection === "desc" ? (
                      <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    ) : (
                      <path d="M12 20V4m0 0l6 6m-6-6l-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                    )}
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Apply Button */}
      {showApplyButton && (
        <div style={{ padding: `${spacing[2]}px ${spacing[4]}px ${spacing[6]}px` }}>
          <button
            onClick={handleApply}
            style={{
              width: "100%",
              height: componentTokens.button.heightLg,
              backgroundColor: c.primary.default,
              color: c.primary.inverse,
              border: "none",
              borderRadius: radius.full,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              lineHeight: `${typography.lineHeight.base}px`,
              cursor: "pointer",
              transition: "background-color 150ms ease",
              fontFamily: typography.fontFamily.sans,
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

// Tab Header Component
export function TabHeader({
  label = "Available balance",
  value = "$1,003.30",
  showChevron = true,
  expanded = false,
  subLabel = "",
  subValue = "",
  subValueColor = "success",
}: {
  label?: string;
  value?: string;
  showChevron?: boolean;
  expanded?: boolean;
  subLabel?: string;
  subValue?: string;
  subValueColor?: "default" | "success" | "error";
}) {
  const c = useColors();

  const subValueColors = {
    default: c.text.default,
    success: c.success.default,
    error: c.error.default,
  };

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: 400,
      }}
    >
      {/* Main row */}
      <div
        style={{
          height: 48,
          padding: "0 12px",
          background: c.background.section, // Surface-1 / 1C1D1F
          borderRadius: expanded ? "12px 12px 0 0" : 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: expanded ? `1px solid ${c.background.default}` : "none",
        }}
      >
        {/* Left - Label */}
        <div style={{ display: "flex", alignItems: "center", gap: spacing[1] }}>
          <span
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: c.text.alternative,
            }}
          >
            {label}
          </span>
        </div>

        {/* Right - Value + Chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: c.text.default, // Primary-Text / FFFFFF
            }}
          >
            {value}
          </span>
          {showChevron && (
            <div
              style={{
                width: 6,
                height: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: c.text.alternative,
              }}
            >
              ›
            </div>
          )}
        </div>
      </div>

      {/* Sub row (expanded state) */}
      {expanded && subLabel && (
        <div
          style={{
            height: 48,
            padding: "0 12px",
            background: c.background.section,
            borderRadius: "0 0 12px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left - Sub Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: c.text.alternative, // text-alternative
                lineHeight: "24px",
              }}
            >
              {subLabel}
            </span>
          </div>

          {/* Right - Sub Value */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: subValueColors[subValueColor],
                lineHeight: "24px",
              }}
            >
              {subValue}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Hub Header Component
// HubHeader Component
// Composed from: BaseButton, AvatarToken
// Uses tokens: background.section, text.default, text.alternative, spacing, typography, radius
export function HubHeader({
  balance = "$100",
  label = "Available balance",
  primaryAction = "Add funds",
  secondaryAction = "",
  variant = "single",
  network = "ETH",
  showNetworkBadge = true,
}: {
  balance?: string;
  label?: string;
  primaryAction?: string;
  secondaryAction?: string;
  variant?: "single" | "double";
  network?: string;
  showNetworkBadge?: boolean;
}) {
  const c = useColors();

  const hasTwoButtons = variant === "double" || (secondaryAction && secondaryAction.length > 0);

  return (
    <div
      style={{
        background: c.background.section,
        borderRadius: radius.xl,
        overflow: "hidden",
        width: "100%",
        maxWidth: 360,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Top section - Balance and Network */}
      <div style={{ padding: spacing[4] }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: spacing[3] }}>
          {/* Balance info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Balance - text-lg font-semibold */}
            <div
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.semibold,
                color: c.text.default,
                lineHeight: `${typography.lineHeight.lg}px`,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {balance}
            </div>
            {/* Label - text-sm font-normal */}
            <div
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.regular,
                color: c.text.alternative,
                lineHeight: `${typography.lineHeight.sm}px`,
              }}
            >
              {label}
            </div>
          </div>

          {/* Network badge - using AvatarToken base component */}
          {showNetworkBadge && (
            <AvatarToken
              name={network}
              size="md"
              showNetworkBadge={true}
            />
          )}
        </div>
      </div>

      {/* Bottom section - Action buttons using BaseButton */}
      <div style={{ padding: `0 ${spacing[4]}px ${spacing[4]}px`, display: "flex", gap: spacing[2.5] }}>
        {hasTwoButtons ? (
          <>
            <div style={{ flex: 1 }}>
              <BaseButton label={primaryAction} variant="subtle" size="lg" fullWidth />
            </div>
            <div style={{ flex: 1 }}>
              <BaseButton label={secondaryAction || "Withdraw"} variant="subtle" size="lg" fullWidth />
            </div>
          </>
        ) : (
          <BaseButton label={primaryAction} variant="primary" size="lg" fullWidth />
        )}
      </div>
    </div>
  );
}

// AccountPicker Component
// Composed from: AvatarAccount, BaseBadgeStatus
// Uses tokens: background.section, text.default, text.muted, spacing, radius, typography, borderWidth
export function AccountPicker({
  name = "Account 1",
  address = "0x9Cbf7c41B7787F6c621115010D3B044029FE2Ce8",
  connected = true,
}: {
  name?: string;
  address?: string;
  connected?: boolean;
}) {
  const c = useColors();

  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[3],
        padding: `${spacing[2]}px ${spacing[4]}px`,
        background: c.background.section,
        borderRadius: radius.full,
        border: `${borderWidth.thin}px solid ${c.border.muted}`,
        cursor: "pointer",
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Account Avatar - using AvatarAccount base component */}
      <AvatarAccount
        address={address}
        size="sm"
        badge={connected ? "connection" : "none"}
      />
      
      {/* Account name */}
      <span style={{ fontWeight: typography.fontWeight.medium, color: c.text.default }}>
        {name}
      </span>
      
      {/* Connection status - using BaseBadgeStatus */}
      {connected && (
        <BaseBadgeStatus status="success" size="sm" />
      )}
      
      {/* Dropdown chevron */}
      <span style={{ color: c.text.muted, fontSize: typography.fontSize.xs }}>▼</span>
    </button>
  );
}

// Card Component
export function Card({
  title = "Card Title",
  description = "Card description text goes here.",
  variant = "default",
}: {
  title?: string;
  description?: string;
  variant?: "default" | "elevated" | "outlined";
}) {
  const c = useColors();

  const variants = {
    default: { background: c.background.section, border: "none", boxShadow: shadow.none },
    elevated: { background: c.background.section, border: "none", boxShadow: shadow.lg },
    outlined: { background: "transparent", border: `1px solid ${c.border.muted}`, boxShadow: shadow.none },
  };

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        width: "100%",
        maxWidth: 300,
        ...variants[variant],
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: c.text.default }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: c.text.alternative, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

// Badge Component
export function Badge({
  label = "Badge",
  variant = "default",
}: {
  label?: string;
  variant?: "default" | "primary" | "success" | "warning" | "error";
}) {
  const c = useColors();

  const variants = {
    default: { background: c.background.muted, color: c.text.default },
    primary: { background: c.primary.default + "26", color: c.primary.default },
    success: { background: c.success.default + "26", color: c.success.default },
    warning: { background: c.warning.default + "26", color: c.warning.default },
    error: { background: c.error.default + "26", color: c.error.default },
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        ...variants[variant],
      }}
    >
      {label}
    </span>
  );
}

// Input Component
export function Input({
  placeholder = "Enter text...",
  label = "",
  error = "",
  disabled = false,
}: {
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}) {
  const c = useColors();

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: c.text.default }}>
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: c.background.section,
          border: `1px solid ${error ? c.error.default : c.border.muted}`,
          borderRadius: 8,
          color: c.text.default,
          fontSize: 16,
          outline: "none",
          opacity: disabled ? 0.5 : 1,
        }}
      />
      {error && (
        <span style={{ display: "block", marginTop: 4, fontSize: 12, color: c.error.default }}>{error}</span>
      )}
    </div>
  );
}

// Avatar Component
export function Avatar({
  name = "User",
  size = "md",
}: {
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const c = useColors();

  const sizes = { sm: 32, md: 40, lg: 56, xl: 72 };
  const fontSizes = { sm: 12, md: 14, lg: 20, xl: 24 };

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        borderRadius: "50%",
        background: c.primary.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: c.background.default,
        fontWeight: 600,
        fontSize: fontSizes[size],
      }}
    >
      {initials}
    </div>
  );
}

// Switch Component
// Uses: primary.default (ON), background.subsection (OFF), white knob
export function Switch({
  checked = false,
  label = "",
}: {
  checked?: boolean;
  label?: string;
}) {
  const c = useColors();
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: spacing[3] }}>
      <button
        onClick={() => setIsChecked(!isChecked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: radius.full,
          background: isChecked ? c.primary.default : c.text.muted,
          border: "none",
          padding: 2,
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: radius.full,
            background: "#ffffff",
            transform: isChecked ? "translateX(20px)" : "translateX(0)",
            transition: "transform 0.2s ease",
            boxShadow: shadow.xs,
          }}
        />
      </button>
      {label && <span style={{ color: c.text.default, fontSize: typography.fontSize.sm }}>{label}</span>}
    </div>
  );
}

// Banner Component
export function Banner({
  title = "Notice",
  description = "This is an informational banner.",
  variant = "info",
}: {
  title?: string;
  description?: string;
  variant?: "info" | "success" | "warning" | "error";
}) {
  const c = useColors();

  const variants = {
    info: { bg: c.primary.default + "15", border: c.primary.default, icon: "ℹ️" },
    success: { bg: c.success.default + "15", border: c.success.default, icon: "✓" },
    warning: { bg: c.warning.default + "15", border: c.warning.default, icon: "⚠" },
    error: { bg: c.error.default + "15", border: c.error.default, icon: "✕" },
  };

  const v = variants[variant];

  return (
    <div
      style={{
        padding: 16,
        background: v.bg,
        borderLeft: `3px solid ${v.border}`,
        borderRadius: 8,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span>{v.icon}</span>
        <span style={{ fontWeight: 600, color: c.text.default }}>{title}</span>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: c.text.alternative }}>{description}</p>
    </div>
  );
}

// Chip Component
export function Chip({
  label = "Chip",
  selected = false,
}: {
  label?: string;
  selected?: boolean;
}) {
  const c = useColors();

  return (
    <button
      style={{
        padding: "8px 16px",
        borderRadius: 999,
        border: `1px solid ${selected ? c.primary.default : c.border.muted}`,
        background: selected ? c.primary.default + "15" : "transparent",
        color: selected ? c.primary.default : c.text.default,
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// Toast Component
export function Toast({
  message = "Action completed",
  variant = "default",
}: {
  message?: string;
  variant?: "default" | "success" | "error";
}) {
  const c = useColors();

  const variants = {
    default: { bg: c.background.section, icon: "📣" },
    success: { bg: c.success.default + "20", icon: "✓" },
    error: { bg: c.error.default + "20", icon: "✕" },
  };

  const v = variants[variant];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[3],
        padding: `${spacing[3]}px ${spacing[4]}px`,
        background: v.bg,
        borderRadius: radius.lg,
        boxShadow: shadow.lg,
      }}
    >
      <span>{v.icon}</span>
      <span style={{ color: c.text.default, fontSize: typography.fontSize.sm }}>{message}</span>
    </div>
  );
}

// Dialog Component
// Dialog Component (composed from BaseButton)
export function Dialog({
  title = "Dialog Title",
  description = "This is a dialog description.",
  primaryAction = "Confirm",
  secondaryAction = "Cancel",
}: {
  title?: string;
  description?: string;
  primaryAction?: string;
  secondaryAction?: string;
}) {
  const c = useColors();

  return (
    <div
      style={{
        padding: spacing[6],
        background: c.background.section,
        borderRadius: radius["2xl"],
        width: "100%",
        maxWidth: 340,
        boxShadow: shadow.xl,
      }}
    >
      <h3 style={{ 
        margin: 0, 
        marginBottom: spacing[2], 
        fontSize: typography.fontSize.lg, 
        fontWeight: typography.fontWeight.semibold, 
        color: c.text.default 
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: 0, 
        marginBottom: spacing[6], 
        fontSize: typography.fontSize.sm, 
        color: c.text.alternative, 
        lineHeight: 1.5 
      }}>
        {description}
      </p>
      <div style={{ display: "flex", gap: spacing[3], justifyContent: "flex-end" }}>
        <BaseButton label={secondaryAction} variant="subtle" size="md" />
        <BaseButton label={primaryAction} variant="primary" size="md" />
      </div>
    </div>
  );
}

// Skeleton Component
export function Skeleton({
  variant = "text",
  width = 200,
  height = 20,
}: {
  variant?: "text" | "circular" | "rectangular";
  width?: number;
  height?: number;
}) {
  const c = useColors();

  const borderRadius = variant === "circular" ? "50%" : variant === "text" ? 4 : 8;

  return (
    <div
      style={{
        width: variant === "circular" ? height : width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${c.background.muted} 25%, ${c.border.muted} 50%, ${c.background.muted} 75%)`,
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
      }}
    />
  );
}

// Select Component
export function Select({
  label = "",
  value = "",
  placeholder = "Select option",
  options = ["Option 1", "Option 2", "Option 3"],
  disabled = false,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
}) {
  const c = useColors();

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: c.text.default }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          value={value}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "12px 40px 12px 16px",
            background: c.background.section,
            border: `1px solid ${c.border.muted}`,
            borderRadius: 8,
            color: value ? c.text.default : c.text.muted,
            fontSize: 16,
            appearance: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: c.text.muted, pointerEvents: "none" }}>
          ▼
        </span>
      </div>
    </div>
  );
}

// ProgressBar Component
export function ProgressBar({
  progress = 50,
  variant = "primary",
  showLabel = true,
}: {
  progress?: number;
  variant?: "primary" | "success" | "warning" | "error";
  showLabel?: boolean;
}) {
  const c = useColors();

  const variantColors = {
    primary: c.primary.default,
    success: c.success.default,
    warning: c.warning.default,
    error: c.error.default,
  };

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <div
        style={{
          height: 8,
          background: c.background.muted,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            height: "100%",
            background: variantColors[variant],
            borderRadius: 4,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {showLabel && (
        <div style={{ marginTop: 8, fontSize: 12, color: c.text.alternative, textAlign: "right" }}>
          {progress}%
        </div>
      )}
    </div>
  );
}

// Divider Component
export function Divider({
  variant = "full",
}: {
  variant?: "full" | "inset" | "middle";
}) {
  const c = useColors();

  const margins = {
    full: { marginLeft: 0, marginRight: 0 },
    inset: { marginLeft: 16, marginRight: 0 },
    middle: { marginLeft: 16, marginRight: 16 },
  };

  return (
    <div
      style={{
        height: 1,
        background: c.border.muted,
        width: "100%",
        maxWidth: 400,
        ...margins[variant],
      }}
    />
  );
}

// Checkbox Component
export function Checkbox({
  checked = false,
  label = "Checkbox label",
  disabled = false,
}: {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const c = useColors();
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <button
      onClick={() => !disabled && setIsChecked(!isChecked)}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        padding: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `2px solid ${isChecked ? c.primary.default : c.border.default}`,
          background: isChecked ? c.primary.default : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s ease",
        }}
      >
        {isChecked && <span style={{ color: c.background.default, fontSize: 14 }}>✓</span>}
      </div>
      <span style={{ color: c.text.default, fontSize: 14 }}>{label}</span>
    </button>
  );
}

// Tabs Component
export function Tabs({
  tabs = ["Tab 1", "Tab 2", "Tab 3"],
  activeIndex = 0,
  variant = "default",
}: {
  tabs?: string[];
  activeIndex?: number;
  variant?: "default" | "pills";
}) {
  const c = useColors();
  const [active, setActive] = useState(activeIndex);

  if (variant === "pills") {
    return (
      <div style={{ display: "flex", gap: 8, background: c.background.muted, padding: 4, borderRadius: 8 }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: active === i ? c.background.section : "transparent",
              color: active === i ? c.text.default : c.text.alternative,
              fontWeight: 500,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${c.border.muted}` }}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          style={{
            padding: "12px 16px",
            border: "none",
            borderBottom: `2px solid ${active === i ? c.primary.default : "transparent"}`,
            background: "transparent",
            color: active === i ? c.primary.default : c.text.alternative,
            fontWeight: 500,
            fontSize: 14,
            cursor: "pointer",
            marginBottom: -1,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// TextArea Component
export function TextArea({
  placeholder = "Enter text...",
  label = "",
  rows = 4,
  disabled = false,
}: {
  placeholder?: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
}) {
  const c = useColors();

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: c.text.default }}>
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        style={{
          width: "100%",
          padding: 12,
          background: c.background.section,
          border: `1px solid ${c.border.muted}`,
          borderRadius: 8,
          color: c.text.default,
          fontSize: 16,
          resize: "vertical",
          fontFamily: "inherit",
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </div>
  );
}

// Radio Component
export function Radio({
  selected = false,
  label = "Option",
  disabled = false,
}: {
  selected?: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const c = useColors();

  return (
    <button
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        padding: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          border: `2px solid ${selected ? c.primary.default : c.border.default}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <div style={{ width: 10, height: 10, borderRadius: 5, background: c.primary.default }} />
        )}
      </div>
      <span style={{ color: c.text.default, fontSize: 14 }}>{label}</span>
    </button>
  );
}

// Spinner Component
export function Spinner({
  size = "md",
  variant = "primary",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default";
}) {
  const c = useColors();

  const sizes = { sm: 16, md: 24, lg: 32 };
  const sizeValue = sizes[size];

  return (
    <div
      style={{
        width: sizeValue,
        height: sizeValue,
        border: `2px solid ${c.border.muted}`,
        borderTopColor: variant === "primary" ? c.primary.default : c.text.default,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}

// Tooltip Component
export function Tooltip({
  text = "Tooltip text",
  position = "top",
}: {
  text?: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const c = useColors();

  return (
    <div
      style={{
        padding: "8px 12px",
        background: c.text.default,
        color: c.background.default,
        fontSize: typography.fontSize.xs,
        borderRadius: radius.md,
        boxShadow: shadow.md,
        maxWidth: 200,
      }}
    >
      {text}
    </div>
  );
}

// Slider Component
export function Slider({
  value = 50,
  min = 0,
  max = 100,
  showValue = true,
}: {
  value?: number;
  min?: number;
  max?: number;
  showValue?: boolean;
}) {
  const c = useColors();
  const [currentValue, setCurrentValue] = useState(value);
  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", height: 4, background: c.border.muted, borderRadius: 2 }}>
          <div style={{ width: `${percentage}%`, height: "100%", background: c.primary.default, borderRadius: 2 }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: `${percentage}%`,
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: radius.lg,
            background: c.primary.default,
            boxShadow: shadow.sm,
          }}
        />
      </div>
      {showValue && (
        <div style={{ marginTop: 8, fontSize: 12, color: c.text.alternative, textAlign: "center" }}>
          {currentValue}
        </div>
      )}
    </div>
  );
}

// SearchBar Component
export function SearchBar({
  placeholder = "Search...",
  value = "",
  showClear = true,
}: {
  placeholder?: string;
  value?: string;
  showClear?: boolean;
}) {
  const c = useColors();
  const [searchValue, setSearchValue] = useState(value);

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 300 }}>
      <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.text.muted }}>
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 40px 12px 40px",
          background: c.background.section,
          border: `1px solid ${c.border.muted}`,
          borderRadius: 8,
          color: c.text.default,
          fontSize: 16,
        }}
      />
      {showClear && searchValue && (
        <button
          onClick={() => setSearchValue("")}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            color: c.text.muted,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// PasswordInput Component
export function PasswordInput({
  placeholder = "Enter password",
  label = "",
  showPassword = false,
}: {
  placeholder?: string;
  label?: string;
  showPassword?: boolean;
}) {
  const c = useColors();
  const [visible, setVisible] = useState(showPassword);

  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 500, color: c.text.default }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "12px 40px 12px 16px",
            background: c.background.section,
            border: `1px solid ${c.border.muted}`,
            borderRadius: 8,
            color: c.text.default,
            fontSize: 16,
          }}
        />
        <button
          onClick={() => setVisible(!visible)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            color: c.text.muted,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {visible ? "👁" : "👁‍🗨"}
        </button>
      </div>
    </div>
  );
}

// SegmentedControl Component
export function SegmentedControl({
  segments = ["Buy", "Sell"],
  selected = 0,
}: {
  segments?: string[];
  selected?: number;
}) {
  const c = useColors();
  const [activeIndex, setActiveIndex] = useState(selected);

  return (
    <div style={{ display: "flex", background: c.background.muted, padding: 4, borderRadius: 8 }}>
      {segments.map((segment, i) => (
        <button
          key={segment}
          onClick={() => setActiveIndex(i)}
          style={{
            flex: 1,
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            background: activeIndex === i ? c.primary.default : "transparent",
            color: activeIndex === i ? c.background.default : c.text.alternative,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          {segment}
        </button>
      ))}
    </div>
  );
}

// Footer Nav Component
export function FooterNav({
  activeTab = "wallet",
}: {
  activeTab?: "wallet" | "browser" | "settings";
}) {
  const c = useColors();

  const tabs = [
    { id: "wallet", label: "Wallet", icon: "💰" },
    { id: "browser", label: "Browser", icon: "🌐" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "12px 0",
        background: c.background.section,
        borderTop: `1px solid ${c.border.muted}`,
        width: "100%",
        maxWidth: 400,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: activeTab === tab.id ? c.primary.default : c.text.muted,
          }}
        >
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Empty State Component
export function EmptyState({
  title = "No items",
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
}) {
  const c = useColors();

  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        background: c.background.section,
        borderRadius: 16,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
      <h3 style={{ margin: 0, marginBottom: 8, fontWeight: 600, color: c.text.default }}>{title}</h3>
      <p style={{ margin: 0, marginBottom: 24, fontSize: 14, color: c.text.alternative }}>{description}</p>
      <button
        style={{
          padding: "12px 24px",
          background: c.primary.default,
          color: c.background.default,
          border: "none",
          borderRadius: 999,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}

// Page Header Component
export function PageHeader({
  title = "Page Title",
  showBack = true,
  action = "",
}: {
  title?: string;
  showBack?: boolean;
  action?: string;
}) {
  const c = useColors();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBack && (
          <button
            style={{
              background: "transparent",
              border: "none",
              color: c.text.default,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ←
          </button>
        )}
        <h2 style={{ margin: 0, fontWeight: 600, color: c.text.default }}>{title}</h2>
      </div>
      {action && (
        <button
          style={{
            background: "transparent",
            border: "none",
            color: c.primary.default,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// Announcement Component - Full-screen announcement modal with image, title, description and CTA
export function Announcement({
  title = "Title must be under 30 chars!",
  description = "Here's a concise description that fits perfectly within the 150-character limit, providing clear and engaging information.",
  buttonLabel = "Click me",
  accentColor = "#d075ff",
  imagePlaceholder = true,
  showCloseButton = true,
  onClose,
  onButtonClick,
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  accentColor?: string;
  imagePlaceholder?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onButtonClick?: () => void;
}) {
  const c = useColors();

  // Image placeholder icon
  const ImageIcon = () => (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h14q.825 0 1.413.587Q21 4.175 21 5v14q0 .825-.587 1.413Q19.825 21 19 21Zm0-2h14V5H5v14Zm1-2h12l-3.75-5-3 4L9 13Zm-1 2V5v14Z"
        fill={accentColor}
        stroke={accentColor}
        strokeWidth={0.5}
      />
    </svg>
  );

  // Close icon
  const CloseIcon = () => (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
        fill={c.icon.default}
      />
    </svg>
  );

  const accentBgColor = `${accentColor}26`; // 15% opacity

  // iOS Status Bar Component
  const IOSStatusBar = () => (
    <div style={{ 
      height: componentTokens.statusBar.height, 
      padding: `0 ${spacing[4]}px`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    }}>
      {/* Time - left side */}
      <span style={{ 
        fontSize: 15, 
        fontWeight: typography.fontWeight.semibold, 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        color: c.icon.default,
        letterSpacing: -0.3,
      }}>
        9:41
      </span>
      
      {/* Right side icons */}
      <div style={{ display: "flex", alignItems: "center", gap: spacing[1] }}>
        {/* Cellular - 4 bars */}
        <svg width="17" height="10.7" viewBox="0 0 17 10.7" fill={c.icon.default}>
          <path d="M1 6.7c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1zM5 4.7c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1v-4c0-.6-.4-1-1-1zM9 2.3c-.6 0-1 .4-1 1v6.3c0 .6.4 1 1 1s1-.4 1-1V3.3c0-.5-.4-1-1-1zM13 0c-.6 0-1 .4-1 1v8.7c0 .6.4 1 1 1s1-.4 1-1V1c0-.6-.4-1-1-1z"/>
        </svg>
        {/* WiFi */}
        <svg width="15.3" height="11" viewBox="0 0 15.3 11" fill={c.icon.default}>
          <path d="M7.7 2.1c-2.4 0-4.6.9-6.3 2.4-.4.3-.4.9 0 1.2.3.4.9.4 1.2 0C4 4.4 5.8 3.7 7.7 3.7s3.6.7 5 2c.4.3.9.3 1.2 0 .4-.3.4-.9 0-1.2-1.6-1.5-3.8-2.4-6.2-2.4z"/>
          <path d="M7.7 5.3c-1.5 0-2.9.6-4 1.5-.4.3-.4.9-.1 1.2.3.4.9.4 1.2.1.8-.6 1.8-1 2.9-1s2.1.4 2.9 1c.2.1.4.2.6.2.2 0 .5-.1.6-.3.3-.4.3-.9-.1-1.2-1.1-.9-2.5-1.5-4-1.5z"/>
          <circle cx="7.7" cy="10" r="1.5"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="11.5" viewBox="0 0 25 11.5" fill={c.icon.default}>
          <rect x="0" y="0" width="22" height="11.5" rx="2.5" ry="2.5" fill="none" stroke={c.icon.default} strokeWidth="1"/>
          <rect x="2" y="2" width="18" height="7.5" rx="1" ry="1"/>
          <path d="M23 4v3.5c.8-.3 1.5-1 1.5-1.8s-.7-1.4-1.5-1.7z"/>
        </svg>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: 393,
        height: 852,
        background: c.background.default,
        display: "flex",
        flexDirection: "column",
        fontFamily: typography.fontFamily.sans,
        overflow: "hidden",
        border: `1px dashed ${c.border.muted}`,
        borderRadius: radius.lg,
      }}
    >
      {/* iOS Status Bar */}
      <IOSStatusBar />

      {/* Header with close button */}
      <div
        style={{
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: spacing[4],
          flexShrink: 0,
        }}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: radius.sm,
            }}
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: spacing[6],
          paddingLeft: spacing[6],
          paddingRight: spacing[6],
          paddingTop: spacing[2],
          paddingBottom: spacing[6],
        }}
      >
        {/* Image Container */}
        <div
          style={{
            width: 336,
            height: 420,
            background: accentBgColor,
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: spacing[4],
            padding: spacing[6],
            flexShrink: 0,
          }}
        >
          {imagePlaceholder && (
            <>
              <ImageIcon />
              <div
                style={{
                  textAlign: "center",
                  color: accentColor,
                }}
              >
                <p
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.medium,
                    lineHeight: `${typography.lineHeight.lg}px`,
                    margin: 0,
                  }}
                >
                  Portrait image (4:5)
                </p>
                <p
                  style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.regular,
                    lineHeight: `${typography.lineHeight.base}px`,
                    margin: 0,
                    marginTop: spacing[1],
                  }}
                >
                  320-420px height
                </p>
              </div>
            </>
          )}
        </div>

        {/* Text Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: spacing[3],
            textAlign: "center",
            width: "100%",
          }}
        >
          <h2
            style={{
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.semibold,
              lineHeight: `${typography.lineHeight["2xl"]}px`,
              color: c.text.default,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.regular,
              lineHeight: `${typography.lineHeight.base}px`,
              color: c.text.default,
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={onButtonClick}
          style={{
            width: "100%",
            height: componentTokens.button.heightLg,
            background: c.background.default === "#131416" ? "#ffffff" : c.primary.default,
            color: c.background.default === "#131416" ? "#131416" : c.primary.inverse,
            borderRadius: componentTokens.button.borderRadiusLg,
            border: "none",
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            lineHeight: `${typography.lineHeight.lg}px`,
            cursor: "pointer",
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// Search Component - Search input field with multiple states
export function Search({
  variant = "default",
  placeholder = "Search tokens, sites, URLs",
  value = "",
  showCancel = false,
  onCancel,
  onClear,
  onChange,
}: {
  variant?: "default" | "selected" | "value" | "website";
  placeholder?: string;
  value?: string;
  showCancel?: boolean;
  onCancel?: () => void;
  onClear?: () => void;
  onChange?: (value: string) => void;
}) {
  const c = useColors();
  const [internalValue, setInternalValue] = useState(value);

  const currentValue = onChange ? value : internalValue;
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  // Search icon - search.svg from MetaMask icons
  const SearchIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path 
        d="m19.6 21-6.3-6.3c-.5.4-1.075.7167-1.725.95s-1.3417.35-2.075.35c-1.81667 0-3.35417-.6292-4.6125-1.8875s-1.8875-2.7958-1.8875-4.6125c0-1.81667.62917-3.35417 1.8875-4.6125s2.79583-1.8875 4.6125-1.8875c1.8167 0 3.3542.62917 4.6125 1.8875s1.8875 2.79583 1.8875 4.6125c0 .7333-.1167 1.425-.35 2.075s-.55 1.225-.95 1.725l6.3 6.3zm-10.1-7c1.25 0 2.3125-.4375 3.1875-1.3125s1.3125-1.9375 1.3125-3.1875-.4375-2.3125-1.3125-3.1875-1.9375-1.3125-3.1875-1.3125-2.3125.4375-3.1875 1.3125-1.3125 1.9375-1.3125 3.1875.4375 2.3125 1.3125 3.1875 1.9375 1.3125 3.1875 1.3125z" 
        fill={c.text.muted}
      />
    </svg>
  );

  // Lock icon for website variant
  const LockIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path 
        d="M6 22c-.55 0-1.02083-.1958-1.4125-.5875S4 20.55 4 20V10c0-.55.19583-1.02083.5875-1.4125S5.45 8 6 8h1V6c0-1.38333.4875-2.5625 1.4625-3.5375S10.6167 1 12 1s2.5625.4875 3.5375 1.4625S17 4.61667 17 6v2h1c.55 0 1.0208.19583 1.4125.5875S20 9.45 20 10v10c0 .55-.1958 1.0208-.5875 1.4125S18.55 22 18 22H6zm0-2h12V10H6v10zm6-3c.55 0 1.0208-.1958 1.4125-.5875S14 15.55 14 15s-.1958-1.02083-.5875-1.4125S12.55 13 12 13s-1.02083.1958-1.4125.5875S10 14.45 10 15s.19583 1.0208.5875 1.4125S11.45 17 12 17zM9 8h6V6c0-.83333-.2917-1.54167-.875-2.125S13.8333 3 13 3h-2c-.83333 0-1.54167.29167-2.125.875S8 5.16667 8 6v2z" 
        fill={c.text.muted}
      />
    </svg>
  );

  // Clear/close icon
  const ClearIcon = () => (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path 
        d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" 
        fill={c.text.alternative}
      />
    </svg>
  );

  const isWebsite = variant === "website";
  const hasValue = variant === "value" || variant === "website";
  const showCancelButton = variant === "selected" || variant === "value";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[4],
        height: 44,
        width: "100%",
        maxWidth: 297,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Search Field */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: spacing[2],
          height: 44,
          background: c.background.subsection,
          borderRadius: radius.lg,
          paddingLeft: spacing[3],
          paddingRight: hasValue ? 0 : spacing[3],
          overflow: "hidden",
        }}
      >
        {/* Icon */}
        <div style={{ flexShrink: 0 }}>
          {isWebsite ? <LockIcon /> : <SearchIcon />}
        </div>

        {/* Input / Text */}
        {hasValue ? (
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: c.text.default,
              lineHeight: `${typography.lineHeight.base}px`,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {isWebsite ? "app.uniswap.org" : currentValue || "uniswap"}
          </span>
        ) : (
          <div
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            <input
              type="text"
              placeholder={placeholder}
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              style={{
                width: "100%",
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.medium,
                color: c.text.default,
                lineHeight: `${typography.lineHeight.base}px`,
                background: "transparent",
                border: "none",
                outline: "none",
                padding: 0,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            />
          </div>
        )}

        {/* Clear button */}
        {hasValue && (
          <button
            onClick={onClear}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ClearIcon />
          </button>
        )}
      </div>

      {/* Cancel button */}
      {showCancelButton && (
        <button
          onClick={onCancel}
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.medium,
            color: c.text.default,
            lineHeight: `${typography.lineHeight.base}px`,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}

// Section Header Component
export function SectionHeader({
  title = "Section title goes here",
  variant = "top-level",
  showChevron = true,
  onClick,
}: {
  title?: string;
  variant?: "top-level" | "details-level";
  showChevron?: boolean;
  onClick?: () => void;
}) {
  const c = useColors();

  // Chevron icon pointing right
  const ChevronIcon = () => (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <path 
        d="M7 5L12 10L7 15" 
        stroke={c.text.alternative} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const isTopLevel = variant === "top-level";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        height: 24,
        width: "100%",
        maxWidth: 361,
        cursor: onClick ? "pointer" : "default",
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <span
        style={{
          fontSize: isTopLevel ? typography.fontSize.lg : typography.fontSize.base, // 18px or 16px
          fontWeight: isTopLevel ? typography.fontWeight.medium : typography.fontWeight.semibold, // 500 or 600
          lineHeight: `${typography.lineHeight.base}px`, // 24px
          color: c.text.default,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
      {showChevron && (
        <div style={{ padding: spacing[1], display: "flex", alignItems: "center" }}>
          <ChevronIcon />
        </div>
      )}
    </div>
  );
}

// List Item Component
export function ListItem({
  title = "List Item",
  subtitle = "",
  leftIcon = "",
  showChevron = true,
}: {
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  showChevron?: boolean;
}) {
  const c = useColors();

  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        background: c.background.section,
        border: "none",
        borderRadius: 12,
        width: "100%",
        maxWidth: 400,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {leftIcon && <span style={{ fontSize: 24 }}>{leftIcon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: c.text.default }}>{title}</div>
        {subtitle && <div style={{ fontSize: 14, color: c.text.alternative, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {showChevron && <span style={{ color: c.text.muted }}>›</span>}
    </button>
  );
}

// Transaction Cell Component
export function TransactionCell({
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
  const c = useColors();

  const icons = { send: "↑", receive: "↓", swap: "⇄", approve: "✓" };
  const statusColors = { pending: c.warning.default, confirmed: c.success.default, failed: c.error.default };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 16,
        background: c.background.section,
        borderRadius: 12,
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: c.background.muted,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color: c.text.default,
        }}
      >
        {icons[type]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 500, color: c.text.default, textTransform: "capitalize" }}>{type}</span>
          <span style={{ fontWeight: 600, color: c.text.default }}>{amount}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: c.text.alternative }}>{address}</span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: statusColors[status],
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: c.text.alternative }}>{value}</span>
        </div>
      </div>
    </div>
  );
}

// ============ REGISTRY ============

export interface ComponentEntry {
  name: string;
  slug: string;
  description: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  props: Array<{
    name: string;
    type: string;
    default: any;
    options?: string[];
    description: string;
  }>;
  variants: Array<{
    name: string;
    description: string;
    props: Record<string, any>;
  }>;
}

// ============ BASE COMPONENTS ============

// Base Header Component
export function BaseHeader({
  title = "Title goes here",
  variant = "default",
  showSearch = true,
  subtitle = "",
  subtitleValue = "",
  searchPlaceholder = "Search tokens, sites, URLs",
}: {
  title?: string;
  variant?: "default" | "scrolled" | "prediction" | "search";
  showSearch?: boolean;
  subtitle?: string;
  subtitleValue?: string;
  searchPlaceholder?: string;
}) {
  const c = useColors();

  // iOS Status Bar Component - matches Apple's SF design
  const IOSStatusBar = () => (
    <div style={{ 
      height: componentTokens.statusBar.height, 
      padding: `0 ${spacing[4]}px`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      {/* Time - left side */}
      <span style={{ 
        fontSize: 15, 
        fontWeight: typography.fontWeight.semibold, 
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        color: c.icon.default,
        letterSpacing: -0.3,
      }}>
        9:41
      </span>
      
      {/* Right side icons */}
      <div style={{ display: "flex", alignItems: "center", gap: spacing[1] }}>
        {/* Cellular - 4 bars */}
        <svg width="17" height="10.7" viewBox="0 0 17 10.7" fill={c.icon.default}>
          <path d="M1 6.7c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1zM5 4.7c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1v-4c0-.6-.4-1-1-1zM9 2.3c-.6 0-1 .4-1 1v6.3c0 .6.4 1 1 1s1-.4 1-1V3.3c0-.5-.4-1-1-1zM13 0c-.6 0-1 .4-1 1v8.7c0 .6.4 1 1 1s1-.4 1-1V1c0-.6-.4-1-1-1z"/>
        </svg>
        {/* WiFi */}
        <svg width="15.3" height="11" viewBox="0 0 15.3 11" fill={c.icon.default}>
          <path d="M7.7 2.1c-2.4 0-4.6.9-6.3 2.4-.4.3-.4.9 0 1.2.3.4.9.4 1.2 0C4 4.4 5.8 3.7 7.7 3.7s3.6.7 5 2c.4.3.9.3 1.2 0 .4-.3.4-.9 0-1.2-1.6-1.5-3.8-2.4-6.2-2.4z"/>
          <path d="M7.7 5.3c-1.5 0-2.9.6-4 1.5-.4.3-.4.9-.1 1.2.3.4.9.4 1.2.1.8-.6 1.8-1 2.9-1s2.1.4 2.9 1c.2.1.4.2.6.2.2 0 .5-.1.6-.3.3-.4.3-.9-.1-1.2-1.1-.9-2.5-1.5-4-1.5z"/>
          <circle cx="7.7" cy="10" r="1.5"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={c.icon.default} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill={c.icon.default}/>
          <path d="M23 4v4c.8-.5 1.3-1.1 1.3-2s-.5-1.5-1.3-2z" fill={c.icon.default} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );

  // Shared icon components
  const BackIcon = () => (
    <svg width={iconSize.lg} height={iconSize.lg} viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke={c.icon.default} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const SearchIcon = ({ size = "lg", color = c.icon.default }: { size?: "md" | "lg"; color?: string }) => (
    <svg width={iconSize[size]} height={iconSize[size]} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2"/>
      <path d="M21 21L16.5 16.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  // Default state - back on top, large title below with optional search
  if (variant === "default") {
    return (
      <div style={{ width: componentTokens.header.width, background: c.background.section, borderRadius: radius.lg, overflow: "hidden" }}>
        <IOSStatusBar />
        {/* Back button row */}
        <div style={{ paddingLeft: spacing[4], paddingRight: spacing[2], paddingTop: spacing[4], display: "flex", alignItems: "center" }}>
          <BackIcon />
        </div>
        {/* Title row */}
        <div style={{ 
          height: spacing[16], 
          padding: spacing[4], 
          display: "flex", 
          alignItems: "center", 
          gap: spacing[4],
        }}>
          <div style={{ 
            flex: 1, 
            fontSize: typography.fontSize["2xl"], 
            fontWeight: typography.fontWeight.semibold, 
            color: c.text.default,
            lineHeight: `${spacing[8]}px`,
          }}>
            {title}
          </div>
          {showSearch && (
            <div style={{ width: spacing[10], height: spacing[10], display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SearchIcon />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Scrolled state - compact centered title
  if (variant === "scrolled") {
    return (
      <div style={{ width: componentTokens.header.width, background: c.background.section, borderRadius: radius.lg, overflow: "hidden" }}>
        <IOSStatusBar />
        {/* Header row */}
        <div style={{ padding: spacing[4], display: "flex", alignItems: "center", gap: spacing[4] }}>
          <BackIcon />
          <div style={{ 
            flex: 1, 
            textAlign: "center", 
            fontSize: typography.fontSize.base, 
            fontWeight: typography.fontWeight.semibold, 
            color: c.text.default,
            lineHeight: `${spacing[6]}px`,
          }}>
            {title}
          </div>
          {showSearch && <SearchIcon />}
        </div>
      </div>
    );
  }

  // Prediction state - with image thumbnail and subtitle
  if (variant === "prediction") {
    return (
      <div style={{ width: componentTokens.header.width, background: c.background.section, borderRadius: radius.lg, overflow: "hidden" }}>
        <IOSStatusBar />
        {/* Header row */}
        <div style={{ 
          height: spacing[14],
          padding: spacing[4], 
          display: "flex", 
          alignItems: "center", 
          gap: spacing[4],
        }}>
          <BackIcon />
          {/* Thumbnail */}
          <div style={{ 
            width: componentTokens.thumbnail.size, 
            height: componentTokens.thumbnail.size, 
            borderRadius: radius.md, 
            background: c.background.subsection,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontSize: typography.fontSize.xl,
          }}>
            🤖
          </div>
          {/* Title & subtitle */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ 
              fontSize: typography.fontSize.base, 
              fontWeight: typography.fontWeight.semibold, 
              color: c.text.default,
              lineHeight: `${spacing[6]}px`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {title}
            </div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: spacing[1], 
              fontSize: typography.fontSize.sm, 
              fontWeight: typography.fontWeight.medium, 
              lineHeight: `${spacing[5]}px` 
            }}>
              <span style={{ color: c.text.alternative }}>{subtitle || "Market"}</span>
              <span style={{ color: c.text.alternative }}>·</span>
              <span style={{ color: c.success.default }}>{subtitleValue || "Yes at 71¢"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Search variant
  if (variant === "search") {
    return (
      <div style={{ width: componentTokens.header.width, background: c.background.section, borderRadius: radius.lg, overflow: "hidden" }}>
        <IOSStatusBar />
        {/* Search row */}
        <div style={{ padding: spacing[4], display: "flex", alignItems: "center", gap: spacing[4] }}>
          {/* Search input */}
          <div style={{ 
            flex: 1, 
            height: componentTokens.input.height, 
            padding: `0 ${spacing[3]}px`,
            background: c.background.subsection,
            borderRadius: radius.md,
            display: "flex",
            alignItems: "center",
            gap: spacing[2],
          }}>
            <SearchIcon size="md" color={c.icon.muted} />
            <span style={{ 
              fontSize: typography.fontSize.base, 
              fontWeight: typography.fontWeight.medium,
              color: c.text.alternative,
              lineHeight: `${spacing[6]}px`,
              flex: 1,
            }}>
              {searchPlaceholder}
            </span>
          </div>
          {/* Cancel */}
          <span style={{ 
            fontSize: typography.fontSize.base, 
            fontWeight: typography.fontWeight.medium, 
            color: c.text.default,
            lineHeight: `${spacing[6]}px`,
          }}>
            Cancel
          </span>
        </div>
      </div>
    );
  }

  return null;
}

// Base Button Component
// BaseButton - matches MetaMask Figma design with hover/pressed states
// Figma CSS: px-4 bg-background-section rounded-xl h-12 text-text-default text-base font-medium
export function BaseButton({
  label = "Action",
  variant = "default",
  size = "lg",
  fullWidth = false,
  disabled = false,
  onClick,
}: {
  label?: string;
  variant?: "default" | "primary" | "danger" | "subtle" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const c = useColors();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sizes from Figma: h-8 (32px), h-10 (40px), h-12 (48px)
  // Border radius scales with size: sm=8px, md=12px, lg=12px
  const sizeStyles = {
    sm: { height: componentTokens.button.heightSm, borderRadius: componentTokens.button.borderRadiusSm },
    md: { height: componentTokens.button.heightMd, borderRadius: componentTokens.button.borderRadiusMd },
    lg: { height: componentTokens.button.heightLg, borderRadius: componentTokens.button.borderRadiusLg },
  };

  // Variant styles with default, hover, and pressed states
  const getBackground = () => {
    if (disabled) {
      if (variant === "default") return c.background.section;
      if (variant === "primary") return c.icon.default;
      if (variant === "danger") return c.error.default;
      if (variant === "subtle") return c.pressed.background;
      if (variant === "outline") return "transparent";
    }
    
    if (variant === "primary") {
      if (isPressed) return c.pressed.primary;
      if (isHovered) return c.hover.primary;
      return c.primary.default;
    }
    if (variant === "danger") {
      if (isPressed) return c.pressed.error;
      if (isHovered) return c.hover.error;
      return c.error.default;
    }
    if (variant === "subtle") {
      if (isPressed) return c.hover.background; // Darker on press
      if (isHovered) return c.background.subsection;
      return c.pressed.background;
    }
    if (variant === "outline") {
      if (isPressed) return c.pressed.background;
      if (isHovered) return c.hover.background;
      return "transparent";
    }
    // default
    if (isPressed) return c.background.subsection;
    if (isHovered) return c.hover.background;
    return c.background.section;
  };

  const variantStyles: Record<string, { color: string; border?: string }> = {
    default: { color: c.text.default },
    primary: { color: c.primary.inverse },
    danger: { color: c.error.inverse },
    subtle: { color: c.text.default },
    outline: { color: c.text.default, border: `${borderWidth.thin}px solid ${c.text.default}` },
  };

  const style = variantStyles[variant];

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: sizeStyles[size].height,
        padding: `0 ${componentTokens.button.paddingX}px`,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        lineHeight: `${typography.lineHeight.base}px`,
        fontFamily: typography.fontFamily.sans,
        borderRadius: sizeStyles[size].borderRadius,
        overflow: "hidden",
        border: style.border || "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        minWidth: componentTokens.button.minWidth,
        transition: "background 150ms ease",
        textAlign: "center",
        background: getBackground(),
        color: style.color,
      }}
    >
      {label}
    </button>
  );
}

// Button Component - Full featured button with icon and loading support
// Built on BaseButton, adds icon support and loading states
export function Button({
  label = "Button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  onClick,
}: {
  label?: string;
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: "add" | "send" | "close" | "settings" | "check" | "arrow-right";
  onClick?: () => void;
}) {
  const c = useColors();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Map variant to styles
  const getBackground = () => {
    if (disabled || loading) {
      if (variant === "primary") return c.primary.default;
      if (variant === "secondary") return c.background.section;
      if (variant === "tertiary") return "transparent";
      if (variant === "danger") return c.error.default;
    }
    
    if (variant === "primary") {
      if (isPressed) return c.pressed.primary;
      if (isHovered) return c.hover.primary;
      return c.primary.default;
    }
    if (variant === "secondary") {
      if (isPressed) return c.background.subsection;
      if (isHovered) return c.hover.background;
      return c.background.section;
    }
    if (variant === "tertiary") {
      if (isPressed) return c.pressed.background;
      if (isHovered) return c.hover.background;
      return "transparent";
    }
    if (variant === "danger") {
      if (isPressed) return c.pressed.error;
      if (isHovered) return c.hover.error;
      return c.error.default;
    }
    return c.primary.default;
  };

  const getColor = () => {
    if (variant === "primary") return c.primary.inverse;
    if (variant === "secondary") return c.text.default;
    if (variant === "tertiary") return c.primary.default;
    if (variant === "danger") return c.error.inverse;
    return c.primary.inverse;
  };

  const sizeStyles = {
    sm: { height: componentTokens.button.heightSm, borderRadius: componentTokens.button.borderRadiusSm, gap: 6 },
    md: { height: componentTokens.button.heightMd, borderRadius: componentTokens.button.borderRadiusMd, gap: 8 },
    lg: { height: componentTokens.button.heightLg, borderRadius: componentTokens.button.borderRadiusLg, gap: 8 },
  };

  const iconSize = size === "sm" ? 14 : size === "md" ? 16 : 18;

  // Icon SVGs
  const icons: Record<string, React.ReactNode> = {
    add: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2v-6z" fill="currentColor"/>
      </svg>
    ),
    send: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="m4.4 19.425-.7-3.2q-.125-.525.1-.987.225-.463.725-.638L20.65 11 4.525 7.4q-.5-.175-.725-.638-.225-.462-.1-.987l.7-3.2q.1-.5.513-.812.412-.313.912-.213l17.05 4.425q.5.125.813.55.312.425.312.975v1q0 .55-.312.975-.313.425-.813.55L5.825 14.45q-.5.1-.912-.213-.413-.312-.513-.812Z" fill="currentColor"/>
      </svg>
    ),
    close: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M6.4 19L5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19z" fill="currentColor"/>
      </svg>
    ),
    settings: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="m9.25 22-.4-3.2q-.325-.125-.613-.3-.287-.175-.537-.375L4.7 19.375l-2.75-4.75 2.575-1.95Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337L1.95 9.375l2.75-4.75 3 1.25q.25-.2.537-.375.288-.175.613-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3.287.175.537.375l3-1.25 2.75 4.75-2.575 1.95q.025.175.025.337v.675q0 .163-.05.338l2.575 1.95-2.75 4.75-2.95-1.25q-.25.2-.55.375-.3.175-.625.3l-.4 3.2h-5.5Zm2.8-6.5q1.45 0 2.475-1.025Q15.55 13.45 15.55 12q0-1.45-1.025-2.475Q13.5 8.5 12.05 8.5q-1.475 0-2.488 1.025Q8.55 10.55 8.55 12q0 1.45 1.012 2.475Q10.575 15.5 12.05 15.5Z" fill="currentColor"/>
      </svg>
    ),
    check: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="M9.55 18l-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4 9.55 18z" fill="currentColor"/>
      </svg>
    ),
    "arrow-right": (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <path d="m14 18-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45 14 6l6 6-6 6z" fill="currentColor"/>
      </svg>
    ),
  };

  // Spinner for loading state
  const Spinner = () => (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizeStyles[size].gap,
        height: sizeStyles[size].height,
        padding: `0 ${componentTokens.button.paddingX}px`,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        lineHeight: `${typography.lineHeight.base}px`,
        fontFamily: typography.fontFamily.sans,
        borderRadius: sizeStyles[size].borderRadius,
        overflow: "hidden",
        border: "none",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? "100%" : "auto",
        minWidth: componentTokens.button.minWidth,
        transition: "background 150ms ease",
        textAlign: "center",
        background: getBackground(),
        color: getColor(),
      }}
    >
      {loading ? <Spinner /> : icon && icons[icon]}
      {label}
    </button>
  );
}

// Base Badge Status Component - matches Figma exactly
// Figma shows: outer ring with bg-background-default, inner circle with status color
export function BaseBadgeStatus({
  status = "success",
  variant = "filled",
  size = "sm",
}: {
  status?: "success" | "error" | "info" | "muted";
  variant?: "filled" | "outline";
  size?: "sm" | "md";
}) {
  const c = useColors();

  // Size tokens from Figma:
  // Sm: outer w-3 (12px), inner w-2 (8px)
  // Md: outer w-3.5 (14px), inner w-2.5 (10px)
  const sizeStyles = {
    sm: { outer: 12, inner: 8 },
    md: { outer: 14, inner: 10 },
  };

  // Status colors from Figma
  const statusColors = {
    success: c.success.default,
    error: c.error.default,
    info: c.primary.default, // info-default maps to primary/blue
    muted: c.icon.muted,
  };

  const { outer, inner } = sizeStyles[size];
  const statusColor = statusColors[status];

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: outer,
        height: outer,
        borderRadius: 999,
      }}
    >
      {/* Outer ring - background-default border */}
      <div
        style={{
          position: "absolute",
          width: outer,
          height: outer,
          background: c.background.default,
          borderRadius: 999,
        }}
      />
      {/* Inner circle - status color */}
      <div
        style={{
          position: "relative",
          width: inner,
          height: inner,
          borderRadius: 999,
          ...(variant === "filled"
            ? { background: statusColor }
            : { border: `2px solid ${statusColor}`, background: "transparent" }),
        }}
      />
    </div>
  );
}

// Base Checkbox Component - matches Figma exactly
// Figma: w-5 h-5 (20px), rounded (4px), border-2, gap-3 (12px)
// Checked: bg-primary-default with outline-2 outline-primary-default, checkmark is primary-inverse
export function BaseCheckbox({
  checked = false,
  label = "Label",
  disabled = false,
  isInvalid = false,
  onChange,
}: {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const c = useColors();
  const [isChecked, setIsChecked] = useState(checked);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleClick = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  // Box background color based on state - from Figma
  const getBoxBackground = () => {
    if (isChecked) {
      // Checked: bg-primary-default
      return c.primary.default;
    }
    // Unchecked: bg-background-default (with hover/pressed variants)
    if (isPressed) return c.background.subsection;
    if (isHovered) return c.background.section;
    return c.background.default;
  };

  // Border/outline color - from Figma
  const getBorderColor = () => {
    if (isInvalid) return c.error.default;
    return c.border.default;
  };

  // Primary inverse color for checkmark - uses token
  const primaryInverse = c.primary.inverse;

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: spacing[3], // gap-3 = 12px
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Hidden input for accessibility */}
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleClick}
        style={{
          position: "absolute",
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />
      
      {/* Checkbox box - matches Figma structure exactly */}
      <div style={{ padding: 1 }}>
        <div
          style={{
            position: "relative",
            width: 20, // w-5
            height: 20, // h-5
            background: getBoxBackground(),
            borderRadius: radius.sm, // rounded = 4px
            // Unchecked: border-2 border-border-default (or error-default if invalid)
            // Checked: outline outline-2 outline-offset-[-2px] outline-primary-default
            border: isChecked ? "none" : `2px solid ${getBorderColor()}`,
            outline: isChecked ? `2px solid ${c.primary.default}` : "none",
            outlineOffset: -2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 100ms ease",
          }}
        >
          {/* Checkmark - w-4 h-4 container with w-2.5 h-2 checkmark, bg-primary-inverse */}
          {isChecked && (
            <div
              style={{
                width: 16, // w-4
                height: 16, // h-4
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke={primaryInverse}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Label */}
      {label && (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: spacing[2],
          }}
        >
          <span
            style={{
              color: c.text.default,
              fontSize: typography.fontSize.base, // text-base = 16px
              fontWeight: typography.fontWeight.regular, // font-normal = 400
              fontFamily: typography.fontFamily.sans,
              lineHeight: "24px", // leading-6
            }}
          >
            {label}
          </span>
        </div>
      )}
    </label>
  );
}

// Base Tabs Component
export function BaseTabs({
  tabs = "Label,Label,Label",
  activeIndex: initialActiveIndex = 0,
  variant = "fixed",
}: {
  tabs?: string;
  activeIndex?: number;
  variant?: "fixed" | "auto";
}) {
  const c = useColors();
  const tabList = tabs.split(",").map(t => t.trim());
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  // Update internal state when prop changes
  React.useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        gap: variant === "fixed" ? spacing[3] : spacing[4],
        padding: `0 ${spacing[4]}px`,
        width: variant === "fixed" ? componentTokens.header.width : "auto",
      }}
    >
      {/* Bottom border line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: borderWidth.thin,
          background: c.border.muted,
          opacity: 0.2,
        }}
      />
      
      {tabList.map((tab, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            style={{
              position: "relative",
              flex: variant === "fixed" ? 1 : "none",
              minWidth: spacing[10],
              padding: `${spacing[2]}px 0`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.opacity = "0.8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <div style={{ padding: `0 ${spacing[1]}px` }}>
              <span
                style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: isActive ? typography.fontWeight.medium : typography.fontWeight.regular,
                  color: isActive ? c.text.default : c.text.alternative,
                  lineHeight: `${spacing[6]}px`,
                  textAlign: "center",
                }}
              >
                {tab}
              </span>
            </div>
            
            {/* Active indicator */}
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: borderWidth.medium,
                  background: c.icon.default,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Base Sheet Component
export function BaseSheet({
  title = "Sheet title",
  showHandle = true,
  showClose = true,
  content = "The market that backs this token is currently closed. Tokens can be transferred on-chain at any time.",
  linkText = "Learn more",
  showHomeIndicator = true,
  variant = "default",
  actionLabel = "Action",
  primaryLabel = "Primary action",
  secondaryLabel = "Secondary action",
}: {
  title?: string;
  showHandle?: boolean;
  showClose?: boolean;
  content?: string;
  linkText?: string;
  showHomeIndicator?: boolean;
  variant?: "default" | "illustration" | "action" | "twoActions";
  actionLabel?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const c = useColors();

  return (
    <div
      style={{
        width: componentTokens.header.width,
        height: variant !== "default" ? componentTokens.header.width : "auto",
        paddingTop: spacing[1],
        background: c.background.section,
        borderRadius: `${spacing[5]}px ${spacing[5]}px 0 0`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[2],
      }}
    >
      {/* Handle */}
      {showHandle && (
        <div
          style={{
            width: spacing[10],
            height: spacing[1],
            background: c.background.muted,
            borderRadius: radius.full,
          }}
        />
      )}
      
      {/* Header */}
      <div
        style={{
          alignSelf: "stretch",
          padding: `${spacing[2]}px ${spacing[4]}px ${spacing[4]}px`,
          display: "flex",
          alignItems: "center",
          gap: spacing[4],
        }}
      >
        {/* Spacer for centering */}
        <div style={{ width: iconSize.lg, height: iconSize.lg }} />
        
        {/* Title */}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: c.text.default,
            lineHeight: `${spacing[6]}px`,
          }}
        >
          {title}
        </div>
        
        {/* Close button */}
        {showClose && (
          <div
            style={{
              width: iconSize.lg,
              height: iconSize.lg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width={componentTokens.sheet.closeIconSize} height={componentTokens.sheet.closeIconSize} viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M1 13L13 1" stroke={c.icon.default} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div
        style={{
          width: componentTokens.header.width,
          flex: variant !== "default" ? 1 : "none",
          padding: `0 ${spacing[4]}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: variant !== "default" ? "center" : "flex-start",
          gap: spacing[5],
        }}
      >
        {variant !== "default" ? (
          // Placeholder for illustration
          <div
            style={{
              width: componentTokens.sheet.illustrationSize,
              height: componentTokens.sheet.illustrationSize,
              borderRadius: radius.lg,
              background: c.background.subsection,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: componentTokens.sheet.illustrationSize * 0.4,
            }}
          >
            🎨
          </div>
        ) : (
          <div
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.regular,
              color: c.text.default,
              lineHeight: `${spacing[6]}px`,
            }}
          >
            {content}{" "}
            {linkText && (
              <span style={{ color: c.primary.default, cursor: "pointer" }}>{linkText}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Footer with optional action button */}
      <div
        style={{
          width: componentTokens.header.width,
          padding: `0 ${spacing[4]}px`,
          background: c.background.section,
        }}
      >
        {/* Single Action Button */}
        {variant === "action" && (
          <BaseButton label={actionLabel} variant="primary" fullWidth />
        )}
        
        {/* Two Action Buttons */}
        {variant === "twoActions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: spacing[2], width: "100%" }}>
            <BaseButton label={secondaryLabel} variant="default" fullWidth />
            <BaseButton label={primaryLabel} variant="primary" fullWidth />
          </div>
        )}
        
        {/* Home Indicator */}
        {showHomeIndicator && (
          <div
            style={{
              height: spacing[8],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: spacing[4],
            }}
          >
            <div
              style={{
                width: componentTokens.sheet.homeIndicatorWidth,
                height: componentTokens.sheet.homeIndicatorHeight,
                background: c.text.default,
                borderRadius: radius.full,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Base Toast Component
// Toast Component - matches MetaMask Figma design
// Uses tokens: background-section, border-muted, shadow.xs, radius["3xl"], spacing[3]
export function BaseToast({
  title = "Action completed",
  subtitle = "",
  variant = "default",
  showClose = true,
  actionLabel = "",
  linkLabel = "",
  mini = false,
}: {
  title?: string;
  subtitle?: string;
  variant?: "default" | "success" | "error" | "warning" | "loading" | "copy" | "action";
  showClose?: boolean;
  actionLabel?: string;
  linkLabel?: string;
  mini?: boolean;
}) {
  const c = useColors();

  // Icon colors using tokens
  const iconColors = {
    default: c.text.alternative,
    success: c.success.default,
    error: colors.light.error.default, // Always use light red for visibility
    warning: colors.dark.warning.default, // Orange warning
    loading: c.text.alternative,
    copy: c.text.alternative,
    action: c.text.default,
  };

  // Inverse colors for icon strokes (dark on light fills)
  const inverseStroke = colors.dark.background.default; // #131416

  // Icon SVGs matching Figma
  const icons: Record<string, React.ReactNode> = {
    success: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none">
        <path d="M14 26.25C20.7655 26.25 26.25 20.7655 26.25 14C26.25 7.23451 20.7655 1.75 14 1.75C7.23451 1.75 1.75 7.23451 1.75 14C1.75 20.7655 7.23451 26.25 14 26.25Z" fill={iconColors.success}/>
        <path d="M9.625 14L12.25 16.625L18.375 10.5" stroke={inverseStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    error: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none">
        <path d="M14 26.25C20.7655 26.25 26.25 20.7655 26.25 14C26.25 7.23451 20.7655 1.75 14 1.75C7.23451 1.75 1.75 7.23451 1.75 14C1.75 20.7655 7.23451 26.25 14 26.25Z" fill={iconColors.error}/>
        <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke={colors.dark.text.default} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    warning: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none">
        <path d="M12.134 3.5L1.634 21C1.4773 21.2716 1.39431 21.5805 1.39331 21.895C1.39231 22.2095 1.47334 22.519 1.6284 22.7915C1.78346 23.064 2.00718 23.2897 2.27832 23.4472C2.54946 23.6046 2.85833 23.6882 3.17273 23.6892H24.1727C24.4871 23.6882 24.796 23.6046 25.0671 23.4472C25.3383 23.2897 25.562 23.064 25.717 22.7915C25.8721 22.519 25.9531 22.2095 25.9521 21.895C25.9511 21.5805 25.8681 21.2716 25.7114 21L15.2114 3.5C15.0536 3.23283 14.8291 3.01133 14.56 2.85687C14.2909 2.70241 13.9864 2.62012 13.6764 2.62012C13.3664 2.62012 13.0619 2.70241 12.7928 2.85687C12.5237 3.01133 12.2992 3.23283 12.1414 3.5H12.134Z" fill={iconColors.warning}/>
        <path d="M14 10.5V15.75" stroke={inverseStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="19.25" r="1.25" fill={inverseStroke}/>
      </svg>
    ),
    loading: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none" style={{ animation: "spin 1s linear infinite" }}>
        <path d="M14 3.5V7" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 21V24.5" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <path d="M6.575 6.575L9.05 9.05" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
        <path d="M18.95 18.95L21.425 21.425" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
        <path d="M3.5 14H7" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        <path d="M21 14H24.5" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
        <path d="M6.575 21.425L9.05 18.95" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        <path d="M18.95 9.05L21.425 6.575" stroke={iconColors.loading} strokeWidth="2" strokeLinecap="round" opacity="0.1"/>
      </svg>
    ),
    copy: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none">
        <rect x="8.75" y="8.75" width="15.75" height="15.75" rx="2" stroke={iconColors.copy} strokeWidth="2"/>
        <path d="M5.25 19.25V5.25C5.25 4.14543 6.14543 3.25 7.25 3.25H19.25" stroke={iconColors.copy} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    action: (
      <svg width={iconSize.xl} height={iconSize.xl} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10.5" stroke={iconColors.action} strokeWidth="2"/>
      </svg>
    ),
  };

  // Close icon
  const closeIcon = (
    <svg width={componentTokens.sheet.closeIconSize} height={componentTokens.sheet.closeIconSize} viewBox="0 0 14 14" fill="none">
      <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke={c.text.default} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: componentTokens.toast.gap,
        padding: componentTokens.toast.padding,
        background: c.background.section,
        outline: `${borderWidth.thin}px solid ${c.border.muted}`,
        outlineOffset: -1,
        borderRadius: mini ? componentTokens.toast.radiusMini : componentTokens.toast.radiusFull,
        boxShadow: shadow.xs,
        width: componentTokens.toast.width, // Fixed width: 384px (w-96)
        fontFamily: typography.fontFamily.sans,
        overflow: "hidden",
      }}
    >
      {/* Left content */}
      <div style={{ display: "flex", alignItems: "center", gap: componentTokens.toast.gap, flex: 1 }}>
        {/* Icon */}
        {variant !== "default" && icons[variant] && (
          <div style={{ flexShrink: 0, width: iconSize.xl, height: iconSize.xl }}>
            {icons[variant]}
          </div>
        )}

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <span
            style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              lineHeight: `${typography.lineHeight.base}px`,
              color: c.text.default,
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.regular,
                lineHeight: `${typography.lineHeight.sm}px`,
                color: c.text.alternative,
              }}
            >
              {subtitle}
            </span>
          )}
          {linkLabel && (
            <span
              style={{
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.medium,
                lineHeight: `${typography.lineHeight.base}px`,
                color: c.primary.default,
                cursor: "pointer",
                marginTop: subtitle ? spacing[1] : 0,
              }}
            >
              {linkLabel}
            </span>
          )}
        </div>
      </div>

      {/* Right action/close */}
      <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
        {actionLabel && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: componentTokens.toast.actionHeight,
              padding: `0 ${spacing[4]}px`,
              background: "transparent",
              border: `${borderWidth.thin}px solid ${c.text.default}`,
              borderRadius: componentTokens.toast.actionRadius,
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.medium,
              color: c.text.default,
              cursor: "pointer",
              fontFamily: typography.fontFamily.sans,
            }}
          >
            {actionLabel}
          </button>
        )}
        {showClose && !actionLabel && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: iconSize.lg,
              height: iconSize.lg,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {closeIcon}
          </button>
        )}
      </div>
    </div>
  );
}

// Base Icon Component
// BaseIcon Component - MetaMask SVG icons
// Uses tokens for colors, proper SVG paths
export function BaseIcon({
  name = "wallet",
  size = "md",
  color = "default",
}: {
  name?: "wallet" | "send" | "receive" | "swap" | "settings" | "search" | "close" | "check" | "add" | "arrow-left" | "arrow-right" | "copy" | "eye" | "eye-slash" | "lock" | "warning" | "info" | "gas" | "qr-code";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "alternative" | "muted" | "primary" | "success" | "error" | "warning";
}) {
  const c = useColors();

  const sizeMap = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };
  const colorMap = {
    default: c.icon.default,
    alternative: c.icon.alternative,
    muted: c.icon.muted,
    primary: c.primary.default,
    success: c.success.default,
    error: c.error.default,
    warning: c.warning.default,
  };

  const s = sizeMap[size];
  const fill = colorMap[color];

  // MetaMask-style SVG icon paths (24x24 viewBox)
  const iconPaths: Record<string, React.ReactNode> = {
    wallet: (
      <path d="M21 7H3C2.45 7 2 7.45 2 8V18C2 18.55 2.45 19 3 19H21C21.55 19 22 18.55 22 18V8C22 7.45 21.55 7 21 7ZM20 17H4V9H20V17ZM18 13C18 13.55 17.55 14 17 14C16.45 14 16 13.55 16 13C16 12.45 16.45 12 17 12C17.55 12 18 12.45 18 13ZM3 5H21V6H3V5Z" fill={fill}/>
    ),
    send: (
      <path d="M4 12L20 12M20 12L14 6M20 12L14 18" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    receive: (
      <path d="M20 12L4 12M4 12L10 6M4 12L10 18" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    swap: (
      <path d="M7 10L3 14L7 18M17 6L21 10L17 14M3 14H15M9 10H21" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    settings: (
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={fill} strokeWidth="2" fill="none"/>
    ),
    search: (
      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
    ),
    close: (
      <path d="M18 6L6 18M6 6L18 18" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    check: (
      <path d="M5 12L10 17L20 7" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    add: (
      <path d="M12 5V19M5 12H19" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
    ),
    "arrow-left": (
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    "arrow-right": (
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" stroke={fill} strokeWidth="2" fill="none"/>
        <path d="M5 15V5C5 3.89543 5.89543 3 7 3H15" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
    eye: (
      <>
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke={fill} strokeWidth="2" fill="none"/>
        <circle cx="12" cy="12" r="3" stroke={fill} strokeWidth="2" fill="none"/>
      </>
    ),
    "eye-slash": (
      <>
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M2 2L22 22" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" stroke={fill} strokeWidth="2" fill="none"/>
        <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
    warning: (
      <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18C1.64 18.3 1.55 18.64 1.55 19C1.55 19.36 1.64 19.7 1.82 20C2 20.3 2.26 20.56 2.56 20.74C2.86 20.92 3.2 21.01 3.55 21H20.45C20.8 21.01 21.14 20.92 21.44 20.74C21.74 20.56 22 20.3 22.18 20C22.36 19.7 22.45 19.36 22.45 19C22.45 18.64 22.36 18.3 22.18 18L13.71 3.86C13.53 3.56 13.27 3.32 12.97 3.15C12.67 2.98 12.34 2.89 12 2.89C11.66 2.89 11.33 2.98 11.03 3.15C10.73 3.32 10.47 3.56 10.29 3.86Z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth="2" fill="none"/>
        <path d="M12 16V12M12 8H12.01" stroke={fill} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </>
    ),
    gas: (
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H14C15.1 22 16 21.1 16 20V4C16 2.9 15.1 2 14 2ZM6 4H14V10H6V4ZM18 10V7L20 9V16C20 17.1 19.1 18 18 18C16.9 18 16 17.1 16 16V13H18V10Z" fill={fill}/>
    ),
    "qr-code": (
      <>
        <rect x="3" y="3" width="7" height="7" stroke={fill} strokeWidth="2" fill="none"/>
        <rect x="14" y="3" width="7" height="7" stroke={fill} strokeWidth="2" fill="none"/>
        <rect x="3" y="14" width="7" height="7" stroke={fill} strokeWidth="2" fill="none"/>
        <rect x="14" y="14" width="3" height="3" fill={fill}/>
        <rect x="18" y="18" width="3" height="3" fill={fill}/>
        <rect x="14" y="18" width="3" height="3" fill={fill}/>
        <rect x="18" y="14" width="3" height="3" fill={fill}/>
      </>
    ),
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      {iconPaths[name] || iconPaths.wallet}
    </svg>
  );
}

// Base Avatar Component
// Avatar Token Component - Circular token avatar with optional network badge
// Uses tokens: radius.full (999px), background colors
export function AvatarToken({
  name = "ETH",
  size = "md",
  showNetworkBadge = false,
  network = "ethereum",
}: {
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showNetworkBadge?: boolean;
  network?: "ethereum" | "polygon" | "arbitrum" | "optimism";
}) {
  const c = useColors();

  // Size mappings matching Figma: XS=16, SM=24, MD=32, LG=40, XL=48
  const sizeMap = { xs: 16, sm: 24, md: 32, lg: 40, xl: 48 };
  
  // Network badge is ALWAYS 16x16 per Figma spec
  const BADGE_SIZE = 16;
  
  // Badge position offsets from top-left (from Figma)
  // SM(24px): left:15, top:12 | MD(32px): left:22, top:18 | LG(40px): left:28, top:26 | XL(48px): left:36, top:34
  const badgePositionMap = {
    xs: { left: 8, top: 6 },    // Calculated proportionally
    sm: { left: 15, top: 12 },  // From Figma
    md: { left: 22, top: 18 },  // From Figma
    lg: { left: 28, top: 26 },  // From Figma
    xl: { left: 36, top: 34 },  // From Figma
  };

  // Token colors
  const tokenColors: Record<string, string> = {
    ETH: "#627eeb",
    BTC: "#f7931a",
    USDC: "#2775ca",
    USDT: "#50af95",
    MATIC: "#8247e5",
    ARB: "#12aaff",
    OP: "#ff0420",
  };

  // Network colors
  const networkColors: Record<string, string> = {
    ethereum: "#627eeb",
    polygon: "#8247e5",
    arbitrum: "#12aaff",
    optimism: "#ff0420",
  };

  const tokenColor = tokenColors[name.toUpperCase()] || c.primary.default;
  const avatarSize = sizeMap[size];
  const badgePos = badgePositionMap[size];

  // Ethereum diamond icon SVG
  const tokenIcon = (
    <svg 
      width={avatarSize * 0.5} 
      height={avatarSize * 0.6} 
      viewBox="0 0 20 24" 
      fill="none"
    >
      <path d="M10 0L0 12.2L10 16.6L20 12.2L10 0Z" fill="rgba(255,255,255,0.9)" />
      <path d="M10 24L0 13.8L10 18.2L20 13.8L10 24Z" fill="rgba(255,255,255,0.6)" />
    </svg>
  );

  // Network badge icon (small ethereum diamond)
  const networkIcon = (
    <svg width={8} height={10} viewBox="0 0 10 12" fill="none">
      <path d="M5 0L0 6.1L5 8.3L10 6.1L5 0Z" fill="rgba(255,255,255,0.9)" />
    </svg>
  );

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {/* Main avatar - circular */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: radius.full,
          background: tokenColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {tokenIcon}
      </div>

      {/* Network badge - always 16x16 with 2px outline */}
      {showNetworkBadge && (
        <div
          style={{
            position: "absolute",
            left: badgePos.left,
            top: badgePos.top,
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: radius.sm, // rounded (4px) per Figma
            background: networkColors[network],
            outline: `2px solid ${c.background.default}`,
            outlineOffset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {networkIcon}
        </div>
      )}
    </div>
  );
}

// Avatar Account Component - Rounded square with Maskicon pattern
// Sizes: XS=16px(r5), SM=24px(r6), MD=32px(r8), LG=40px(r10), XL=48px(r12)
export function AvatarAccount({
  address = "0x9Cbf7c41B7787F6c621115010D3B044029FE2Ce8",
  size = "lg",
  badge = "none",
}: {
  address?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  badge?: "none" | "network" | "connection";
}) {
  const c = useColors();

  // Size and radius mappings matching Figma exactly
  const sizeMap = { xs: 16, sm: 24, md: 32, lg: 40, xl: 48 };
  const radiusMap = { xs: 5, sm: 6, md: 8, lg: 10, xl: 12 };
  const badgeSizeMap = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18 };

  const avatarSize = sizeMap[size];
  const avatarRadius = radiusMap[size];
  const badgeSize = badgeSizeMap[size];

  // Generate Maskicon-style color from address (lime green like in Figma)
  const generateMaskiconColor = (addr: string) => {
    // Hash the address to get a consistent hue
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
      hash = addr.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the default Maskicon lime green (#baf24a) for demo
    // In production, this would generate from the address
    const hue = 72 + (Math.abs(hash) % 40); // Range around lime green
    return `hsl(${hue}, 85%, 62%)`;
  };

  const bgColor = generateMaskiconColor(address);

  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      {/* Main avatar - rounded square with Maskicon pattern */}
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarRadius,
          background: bgColor,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Maskicon chevron/arrow pattern - white upward arrow */}
        <svg
          width={avatarSize}
          height={avatarSize}
          viewBox="0 0 96 96"
          style={{ position: "absolute", top: 0, left: 0 }}
          fill="none"
        >
          {/* Main upward chevron shape matching Figma Maskicon */}
          <path
            d="M48 20 L20 60 L35 60 L35 76 L61 76 L61 60 L76 60 Z"
            fill="rgba(255,255,255,0.9)"
          />
          {/* Inner detail */}
          <path
            d="M48 32 L32 56 L40 56 L40 68 L56 68 L56 56 L64 56 Z"
            fill={bgColor}
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Network badge - Ethereum blue circle */}
      {badge === "network" && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: radius.full,
            background: "#627eeb",
            border: `2px solid ${c.background.default}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ethereum diamond icon */}
          <svg 
            width={badgeSize * 0.5} 
            height={badgeSize * 0.6} 
            viewBox="0 0 10 12" 
            fill="none"
          >
            <path d="M5 0L0 6.1L5 8.3L10 6.1L5 0Z" fill="rgba(255,255,255,0.9)" />
            <path d="M5 12L0 6.9L5 9.1L10 6.9L5 12Z" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
      )}

      {/* Connection status badge - green dot */}
      {badge === "connection" && (
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: radius.full,
            background: c.background.default,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: badgeSize - 4,
              height: badgeSize - 4,
              borderRadius: radius.full,
              background: c.success.default,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Base Avatar - unified component supporting both token and account types
export function BaseAvatar({
  type = "account",
  name = "ETH",
  address = "0x9Cbf7c41B7787F6c621115010D3B044029FE2Ce8",
  size = "lg",
  showBadge = false,
  badge = "none",
}: {
  type?: "token" | "account";
  name?: string;
  address?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showBadge?: boolean;
  badge?: "none" | "network" | "connection";
}) {
  if (type === "token") {
    return (
      <AvatarToken
        name={name}
        size={size as "xs" | "sm" | "md" | "lg"}
        showNetworkBadge={showBadge}
      />
    );
  }
  
  return (
    <AvatarAccount
      address={address}
      size={size}
      badge={badge}
    />
  );
}

// Base Toggle Component
// BaseToggle Component - Interactive toggle switch
// Uses tokens: primary.default (on), border.muted (off), icon.inverse (knob)
export function BaseToggle({
  enabled = false,
  size = "md",
  disabled = false,
  onChange,
}: {
  enabled?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onChange?: (enabled: boolean) => void;
}) {
  const c = useColors();
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Sync with prop changes
  React.useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  const handleClick = () => {
    if (disabled) return;
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onChange?.(newValue);
  };

  // Sizes from Figma - width, height, knob diameter, padding
  const sizeStyles = {
    sm: { width: 36, height: 20, knob: 16, padding: 2 },
    md: { width: 44, height: 24, knob: 20, padding: 2 },
    lg: { width: 52, height: 28, knob: 24, padding: 2 },
  };

  const s = sizeStyles[size];
  const translateX = isEnabled ? s.width - s.knob - (s.padding * 2) : 0;

  // Track colors: ON = primary, OFF = visible gray
  // Use text.muted for OFF state as it's visible in both themes
  const trackColor = isEnabled ? c.primary.default : c.text.muted;
  // Knob should be white in both themes to contrast with colored/gray track
  const knobColor = colors.static.white;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEnabled}
      disabled={disabled}
      onClick={handleClick}
      style={{
        width: s.width,
        height: s.height,
        borderRadius: radius.full,
        background: trackColor,
        padding: s.padding,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background 200ms ease",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: s.knob,
          height: s.knob,
          borderRadius: radius.full,
          background: knobColor,
          transform: `translateX(${translateX}px)`,
          transition: "transform 200ms ease",
          boxShadow: shadow.xs,
        }}
      />
    </button>
  );
}

// PayWith Component - Token selector pill for payments
// Uses tokens: background.subsection, background.muted, text.default, text.alternative, text.muted, spacing, radius
export function PayWith({
  tokenSymbol = "mUSD",
  tokenName = "mUSD",
  balance = "$2,400.35",
  network = "ethereum",
  state = "default",
  onClick,
}: {
  tokenSymbol?: string;
  tokenName?: string;
  balance?: string;
  network?: "ethereum" | "polygon" | "arbitrum" | "optimism";
  state?: "default" | "hovered";
  onClick?: () => void;
}) {
  const c = useColors();
  const [isHovered, setIsHovered] = useState(false);
  
  const currentState = state === "hovered" || isHovered ? "hovered" : "default";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[1],
        padding: `${spacing[2]}px ${spacing[4]}px ${spacing[2]}px ${spacing[2]}px`,
        background: currentState === "hovered" ? c.pressed.background : c.background.section,
        borderRadius: 36, // pill shape per Figma
        border: "none",
        cursor: "pointer",
        fontFamily: typography.fontFamily.sans,
        transition: "background 150ms ease",
      }}
    >
      {/* Token Avatar with Network Badge - uses AvatarToken */}
      <AvatarToken
        name={tokenSymbol}
        size="md"
        showNetworkBadge={true}
        network={network}
      />

      {/* Pay with Token text */}
      <span
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: c.text.default,
          lineHeight: `${typography.lineHeight.base}px`,
          whiteSpace: "nowrap",
        }}
      >
        Pay with {tokenName}
      </span>

      {/* Separator dot */}
      <span
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: c.text.muted,
          lineHeight: `${typography.lineHeight.base}px`,
        }}
      >
        •
      </span>

      {/* Balance */}
      <span
        style={{
          fontSize: typography.fontSize.base,
          fontWeight: typography.fontWeight.medium,
          color: c.text.alternative,
          lineHeight: `${typography.lineHeight.base}px`,
          whiteSpace: "nowrap",
        }}
      >
        {balance}
      </span>

      {/* Chevron/dropdown arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={iconSize.md} height={iconSize.md} viewBox="0 0 20 20" fill="none">
          <path
            d="M5 8L10 13L15 8"
            stroke={c.text.default}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}

// BaseFooterNav Component - Mobile footer navigation bar
// Uses tokens: background.default, text.default, text.alternative, primary.default, spacing, iconSize
export function BaseFooterNav({
  activeTab = "home",
  showTradeButton = true,
  onTabChange,
}: {
  activeTab?: "home" | "browser" | "trade" | "activity" | "rewards";
  showTradeButton?: boolean;
  onTabChange?: (tab: "home" | "browser" | "trade" | "activity" | "rewards") => void;
}) {
  const c = useColors();
  const [internalActiveTab, setInternalActiveTab] = useState<"home" | "browser" | "trade" | "activity" | "rewards">(activeTab);
  
  // Use controlled or uncontrolled mode
  const currentTab = onTabChange ? activeTab : internalActiveTab;
  const handleTabChange = (tab: "home" | "browser" | "trade" | "activity" | "rewards") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  const tabs = [
    { id: "home" as const, label: "Home", icon: "home" },
    { id: "browser" as const, label: "Browser", icon: "browser" },
    { id: "trade" as const, label: "Trade", icon: "trade" },
    { id: "activity" as const, label: "Activity", icon: "activity" },
    { id: "rewards" as const, label: "Rewards", icon: "rewards" },
  ];

  // Icons from official MetaMask design system SVGs (assets/icons/)
  const icons: Record<string, (active: boolean) => React.ReactNode> = {
    // Home icon - home.svg from MetaMask icons
    home: (active) => (
      <svg width={iconSize.lg} height={iconSize.lg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="m6 18.8855h3v-6h6v6h3v-9l-6-4.5-6 4.5zm-2 2v-12l8-6 8 6v12h-7v-6h-2v6z" 
          fill={active ? c.text.default : c.text.alternative}
        />
      </svg>
    ),
    // Browser icon - search.svg from MetaMask icons
    browser: (active) => (
      <svg width={iconSize.lg} height={iconSize.lg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="m19.6 21-6.3-6.3c-.5.4-1.075.7167-1.725.95s-1.3417.35-2.075.35c-1.81667 0-3.35417-.6292-4.6125-1.8875s-1.8875-2.7958-1.8875-4.6125c0-1.81667.62917-3.35417 1.8875-4.6125s2.79583-1.8875 4.6125-1.8875c1.8167 0 3.3542.62917 4.6125 1.8875s1.8875 2.79583 1.8875 4.6125c0 .7333-.1167 1.425-.35 2.075s-.55 1.225-.95 1.725l6.3 6.3zm-10.1-7c1.25 0 2.3125-.4375 3.1875-1.3125s1.3125-1.9375 1.3125-3.1875-.4375-2.3125-1.3125-3.1875-1.9375-1.3125-3.1875-1.3125-2.3125.4375-3.1875 1.3125-1.3125 1.9375-1.3125 3.1875.4375 2.3125 1.3125 3.1875 1.9375 1.3125 3.1875 1.3125z" 
          fill={active ? c.text.default : c.text.alternative}
        />
      </svg>
    ),
    // Trade icon - plus sign for floating button
    trade: () => (
      <svg width={iconSize["2xl"]} height={iconSize["2xl"]} viewBox="0 0 32 32" fill="none">
        <path 
          d="M16 8V24" 
          stroke={colors.static.white} 
          strokeWidth="3" 
          strokeLinecap="round"
        />
        <path 
          d="M8 16H24" 
          stroke={colors.static.white} 
          strokeWidth="3" 
          strokeLinecap="round"
        />
      </svg>
    ),
    // Activity icon - clock.svg from MetaMask icons
    activity: (active) => (
      <svg width={iconSize.lg} height={iconSize.lg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="m15.3 16.7 1.4-1.4-3.7-3.7v-4.6h-2v5.4zm-3.3 5.3c-1.3833 0-2.68333-.2625-3.9-.7875s-2.275-1.2375-3.175-2.1375-1.6125-1.9583-2.1375-3.175-.7875-2.5167-.7875-3.9.2625-2.68333.7875-3.9 1.2375-2.275 2.1375-3.175 1.95833-1.6125 3.175-2.1375 2.5167-.7875 3.9-.7875 2.6833.2625 3.9.7875 2.275 1.2375 3.175 2.1375 1.6125 1.95833 2.1375 3.175.7875 2.5167.7875 3.9-.2625 2.6833-.7875 3.9-1.2375 2.275-2.1375 3.175-1.9583 1.6125-3.175 2.1375-2.5167.7875-3.9.7875zm0-2c2.2167 0 4.1042-.7792 5.6625-2.3375s2.3375-3.4458 2.3375-5.6625c0-2.21667-.7792-4.10417-2.3375-5.6625s-3.4458-2.3375-5.6625-2.3375c-2.21667 0-4.10417.77917-5.6625 2.3375s-2.3375 3.44583-2.3375 5.6625c0 2.2167.77917 4.1042 2.3375 5.6625s3.44583 2.3375 5.6625 2.3375z" 
          fill={active ? c.text.default : c.text.alternative}
        />
      </svg>
    ),
    // Rewards icon - metamask-fox-outline.svg from MetaMask icons
    rewards: (active) => (
      <svg width={iconSize.lg} height={iconSize.lg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="m21.9956 8.43944-1.3524 3.61546 1.3568 4.5348-.1069.2869-1.6403 4.3851-4.0482-1.0159-3.0589 1.7537h-2.2896l-3.05979-1.7537-4.04735 1.0159-1.74278-4.6596 1.35059-4.9671-1.23222-2.88291-.12455-.29051 1.7578-6.46207 6.6902 4.12825h3.1058l6.6902-4.12825zm-7.9295-.49776h-4.1304l-5.06846-3.1283-.95663 3.51535 1.35765 3.17437-1.36295 5.0095.97076 2.5969 3.18788-.7989 3.27265 1.875h1.3285l3.2727-1.875 3.187.7989.9664-2.5845-1.3559-4.5339.1069-.287 1.2534-3.35412-.962-3.5366z" 
          fill={active ? c.text.default : c.text.alternative}
        />
      </svg>
    ),
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 393,
        height: 112, // Increased to accommodate floating button
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Container - positioned below floating button */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          top: 14, // Start below floating button top
          background: c.background.section, // #1c1d1f dark gray
          borderTop: `${borderWidth.thin}px solid ${c.border.muted}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tab Bar - icons row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            padding: `${spacing[4]}px ${spacing[2]}px 0`,
          }}
        >
          {tabs.map((tab) => {
            if (tab.id === "trade") {
              // Empty placeholder for trade button space
              return (
                <div
                  key={tab.id}
                  style={{
                    flex: 1,
                    height: iconSize.lg,
                  }}
                />
              );
            }

            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                {icons[tab.icon](isActive)}
              </button>
            );
          })}
        </div>

        {/* Tab Labels row */}
        <div
          style={{
            display: "flex",
            padding: `${spacing[1]}px ${spacing[2]}px`,
          }}
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <span
                key={tab.id}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                  color: isActive ? c.text.default : c.text.alternative,
                  lineHeight: `${typography.lineHeight.sm}px`,
                }}
              >
                {tab.label}
              </span>
            );
          })}
        </div>

        {/* Home Indicator */}
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 128,
              height: 5,
              borderRadius: radius.full,
              background: colors.static.white,
            }}
          />
        </div>
      </div>

      {/* Floating Trade Button - positioned above the bar */}
      {showTradeButton && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => handleTabChange("trade")}
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.full,
              background: colors.accent.indigo.default,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {icons.trade(true)}
          </button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// WALLET-SPECIFIC COMPONENTS (for screen templates)
// =============================================================================

// Amount Input - Crypto amount entry with token selector
export function AmountInput({
  value = "0.0",
  token = "ETH",
  fiatValue = "$0.00",
  balance = "0.00",
  showMax = true,
  disabled = false,
}: {
  value?: string;
  token?: string;
  fiatValue?: string;
  balance?: string;
  showMax?: boolean;
  disabled?: boolean;
}) {
  const c = useColors();

  return (
    <div
      style={{
        background: c.background.section,
        borderRadius: radius.xl,
        padding: spacing[4],
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Token selector and amount */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: spacing[2] }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.full,
              background: c.primary.muted,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: c.primary.default }}>
              {token.charAt(0)}
            </span>
          </div>
          <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: c.text.default }}>
            {token}
          </span>
          <svg width={16} height={16} viewBox="0 0 24 24" fill={c.text.alternative}>
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
        <span
          style={{
            fontSize: typography.fontSize["2xl"],
            fontWeight: typography.fontWeight.semibold,
            color: disabled ? c.text.muted : c.text.default,
          }}
        >
          {value}
        </span>
      </div>

      {/* Fiat value and balance */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>{fiatValue}</span>
        <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>
            Balance: {balance} {token}
          </span>
          {showMax && (
            <button
              style={{
                background: c.primary.muted,
                color: c.primary.default,
                border: "none",
                borderRadius: radius.sm,
                padding: `${spacing[0.5]}px ${spacing[2]}px`,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                cursor: "pointer",
              }}
            >
              Max
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Confirmation Sheet - Transaction confirmation details
export function ConfirmationSheet({
  title = "Confirm Transaction",
  amount = "0.5 ETH",
  recipient = "0x1234...5678",
  fee = "$2.50",
  total = "$1,002.50",
}: {
  title?: string;
  amount?: string;
  recipient?: string;
  fee?: string;
  total?: string;
}) {
  const c = useColors();

  const Row = ({ label, value, isTotal = false }: { label: string; value: string; isTotal?: boolean }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${spacing[3]}px 0` }}>
      <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>{label}</span>
      <span
        style={{
          fontSize: isTotal ? typography.fontSize.lg : typography.fontSize.sm,
          fontWeight: isTotal ? typography.fontWeight.semibold : typography.fontWeight.medium,
          color: c.text.default,
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      style={{
        background: c.background.section,
        borderRadius: radius.xl,
        padding: spacing[4],
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <div style={{ marginBottom: spacing[3] }}>
        <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: c.text.default }}>
          {title}
        </span>
      </div>

      <Row label="Amount" value={amount} />
      <div style={{ borderTop: `1px solid ${c.border.muted}` }} />
      <Row label="To" value={recipient} />
      <div style={{ borderTop: `1px solid ${c.border.muted}` }} />
      <Row label="Network fee" value={fee} />
      <div style={{ borderTop: `1px solid ${c.border.muted}` }} />
      <Row label="Total" value={total} isTotal />
    </div>
  );
}

// Gas Fee Selector - Gas fee picker
export function GasFeeSelector({
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
  const c = useColors();

  const options = [
    { id: "low", label: "Low", time: "~5 min", fee: lowFee },
    { id: "medium", label: "Medium", time: "~2 min", fee: mediumFee },
    { id: "high", label: "High", time: "~30 sec", fee: highFee },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <div style={{ display: "flex", gap: spacing[2] }}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <div
              key={option.id}
              style={{
                flex: 1,
                background: isSelected ? c.primary.muted : c.background.section,
                border: `2px solid ${isSelected ? c.primary.default : "transparent"}`,
                borderRadius: radius.xl,
                padding: spacing[3],
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: c.text.default, marginBottom: spacing[1] }}>
                {option.label}
              </div>
              <div style={{ fontSize: typography.fontSize.xs, color: c.text.alternative, marginBottom: spacing[1] }}>
                {option.time}
              </div>
              <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: c.text.default }}>
                {option.fee}
              </div>
            </div>
          );
        })}
      </div>
      {showCustom && (
        <button
          style={{
            width: "100%",
            marginTop: spacing[3],
            background: "transparent",
            border: `1px solid ${c.border.muted}`,
            borderRadius: radius.lg,
            padding: spacing[3],
            color: c.text.alternative,
            fontSize: typography.fontSize.sm,
            cursor: "pointer",
          }}
        >
          Custom
        </button>
      )}
    </div>
  );
}

// QR Code - Display QR code for addresses
export function QRCodeDisplay({
  value = "0x1234567890abcdef",
  size = "md",
  showValue = true,
}: {
  value?: string;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}) {
  const c = useColors();
  const sizes = { sm: 120, md: 180, lg: 240 };
  const qrSize = sizes[size];

  // Simple QR code placeholder pattern
  const generatePattern = () => {
    const cells = [];
    const gridSize = 21;
    const cellSize = qrSize / gridSize;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Create finder patterns in corners
        const isFinderArea = 
          (row < 7 && col < 7) || 
          (row < 7 && col >= gridSize - 7) || 
          (row >= gridSize - 7 && col < 7);
        
        // Random data pattern (deterministic based on position + value)
        const hash = (value.charCodeAt(row % value.length) + col * row) % 3;
        const isFilled = isFinderArea ? 
          ((row < 7 && col < 7) && (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4))) ||
          ((row < 7 && col >= gridSize - 7) && (row === 0 || row === 6 || col === gridSize - 1 || col === gridSize - 7 || (row >= 2 && row <= 4 && col >= gridSize - 5 && col <= gridSize - 3))) ||
          ((row >= gridSize - 7 && col < 7) && (row === gridSize - 1 || row === gridSize - 7 || col === 0 || col === 6 || (row >= gridSize - 5 && row <= gridSize - 3 && col >= 2 && col <= 4)))
          : hash === 0;

        if (isFilled) {
          cells.push(
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={c.text.default}
            />
          );
        }
      }
    }
    return cells;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[4],
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <div
        style={{
          background: colors.static.white,
          borderRadius: radius.xl,
          padding: spacing[4],
        }}
      >
        <svg width={qrSize} height={qrSize} viewBox={`0 0 ${qrSize} ${qrSize}`}>
          {generatePattern()}
        </svg>
      </div>
      {showValue && (
        <span
          style={{
            fontSize: typography.fontSize.xs,
            color: c.text.alternative,
            fontFamily: typography.fontFamily.mono,
            maxWidth: qrSize + spacing[8],
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

// Address Display - Address with copy button
export function AddressDisplay({
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
  const c = useColors();
  const [copied, setCopied] = useState(false);

  const displayAddress = truncate && variant !== "full"
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "compact") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: spacing[2], fontFamily: typography.fontFamily.sans }}>
        <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative, fontFamily: typography.fontFamily.mono }}>
          {displayAddress}
        </span>
        {showCopy && (
          <button
            onClick={handleCopy}
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill={copied ? c.success.default : c.text.alternative}>
              {copied ? (
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              ) : (
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              )}
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: c.background.section,
        borderRadius: radius.lg,
        padding: `${spacing[3]}px ${spacing[4]}px`,
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <span
        style={{
          fontSize: typography.fontSize.sm,
          color: c.text.default,
          fontFamily: typography.fontFamily.mono,
          wordBreak: variant === "full" ? "break-all" : undefined,
        }}
      >
        {displayAddress}
      </span>
      {showCopy && (
        <button
          onClick={handleCopy}
          style={{
            background: c.background.subsection,
            border: "none",
            borderRadius: radius.sm,
            padding: spacing[2],
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: spacing[1],
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill={copied ? c.success.default : c.text.alternative}>
            {copied ? (
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            ) : (
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            )}
          </svg>
          <span style={{ fontSize: typography.fontSize.xs, color: copied ? c.success.default : c.text.alternative }}>
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
      )}
    </div>
  );
}

// Swap Preview - Swap rate and fee preview
export function SwapPreview({
  fromToken = "ETH",
  fromAmount = "1.0",
  toToken = "USDC",
  toAmount = "2,000",
  rate = "1 ETH = 2,000 USDC",
  fee = "$5.00",
}: {
  fromToken?: string;
  fromAmount?: string;
  toToken?: string;
  toAmount?: string;
  rate?: string;
  fee?: string;
}) {
  const c = useColors();

  return (
    <div
      style={{
        background: c.background.section,
        borderRadius: radius.xl,
        padding: spacing[4],
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Swap summary */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: spacing[3], marginBottom: spacing[4] }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: c.text.default }}>
            {fromAmount}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>{fromToken}</div>
        </div>
        <svg width={24} height={24} viewBox="0 0 24 24" fill={c.text.alternative}>
          <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: c.text.default }}>
            {toAmount}
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>{toToken}</div>
        </div>
      </div>

      {/* Rate and fee */}
      <div style={{ borderTop: `1px solid ${c.border.muted}`, paddingTop: spacing[3] }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>Rate</span>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.default }}>{rate}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>Network fee</span>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.default }}>{fee}</span>
        </div>
      </div>
    </div>
  );
}

// Wallet Connect Session - Connected dApp row
export function WalletConnectSession({
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
  const c = useColors();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: spacing[3],
        background: c.background.section,
        borderRadius: radius.xl,
        padding: spacing[4],
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* dApp icon placeholder */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.lg,
          background: c.background.subsection,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: c.text.alternative }}>
          {dappName.charAt(0)}
        </span>
      </div>

      {/* dApp info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: c.text.default }}>
            {dappName}
          </span>
          {connected && (
            <div style={{ width: 8, height: 8, borderRadius: radius.full, background: c.success.default }} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.sm, color: c.text.alternative }}>{dappUrl}</span>
          <span style={{ fontSize: typography.fontSize.xs, color: c.text.muted }}>• {network}</span>
        </div>
      </div>

      {/* Chevron */}
      <svg width={20} height={20} viewBox="0 0 24 24" fill={c.text.alternative}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
      </svg>
    </div>
  );
}

// NFT Card - NFT display card
export function NFTCard({
  name = "NFT Name",
  collection = "Collection",
  price = "1.5 ETH",
  showPrice = true,
}: {
  name?: string;
  collection?: string;
  price?: string;
  showPrice?: boolean;
}) {
  const c = useColors();

  return (
    <div
      style={{
        background: c.background.section,
        borderRadius: radius.xl,
        overflow: "hidden",
        width: "100%",
        maxWidth: 180,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          background: `linear-gradient(135deg, ${c.primary.muted} 0%, ${c.background.subsection} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={48} height={48} viewBox="0 0 24 24" fill={c.text.muted}>
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </div>

      {/* Info */}
      <div style={{ padding: spacing[3] }}>
        <div
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: c.text.default,
            marginBottom: spacing[1],
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: typography.fontSize.xs,
            color: c.text.alternative,
            marginBottom: showPrice ? spacing[2] : 0,
          }}
        >
          {collection}
        </div>
        {showPrice && (
          <div style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: c.text.default }}>
            {price}
          </div>
        )}
      </div>
    </div>
  );
}

// Status Indicator - Transaction status badge
export function StatusIndicator({
  status = "confirmed",
  label = "Confirmed",
  showPulse = false,
}: {
  status?: "pending" | "confirmed" | "failed" | "processing";
  label?: string;
  showPulse?: boolean;
}) {
  const c = useColors();

  const statusColors = {
    pending: c.warning.default,
    confirmed: c.success.default,
    failed: c.error.default,
    processing: c.primary.default,
  };

  const statusBgColors = {
    pending: c.warning.muted,
    confirmed: c.success.muted,
    failed: c.error.muted,
    processing: c.primary.muted,
  };

  const statusIcons = {
    pending: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill={statusColors[status]}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    confirmed: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill={statusColors[status]}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    failed: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill={statusColors[status]}>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
      </svg>
    ),
    processing: (
      <svg width={24} height={24} viewBox="0 0 24 24" fill={statusColors[status]} style={{ animation: "spin 1s linear infinite" }}>
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing[4],
        padding: spacing[6],
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: radius.full,
          background: statusBgColors[status],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {showPulse && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: radius.full,
              background: statusBgColors[status],
              animation: "pulse 2s infinite",
            }}
          />
        )}
        <div style={{ transform: "scale(2)" }}>{statusIcons[status]}</div>
      </div>
      <span
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.semibold,
          color: c.text.default,
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Stepper - Multi-step progress indicator
export function Stepper({
  steps = "Step 1,Step 2,Step 3",
  current = 0,
  variant = "default",
}: {
  steps?: string;
  current?: number;
  variant?: "default" | "compact";
}) {
  const c = useColors();
  const stepArray = steps.split(",").map((s) => s.trim());

  if (variant === "compact") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: spacing[2],
          fontFamily: typography.fontFamily.sans,
        }}
      >
        {stepArray.map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 4,
              borderRadius: radius.full,
              background: index <= current ? c.primary.default : c.background.muted,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {stepArray.map((step, index) => {
        const isCompleted = index < current;
        const isCurrent = index === current;
        const isUpcoming = index > current;

        return (
          <React.Fragment key={index}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: spacing[2] }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.full,
                  background: isCompleted || isCurrent ? c.primary.default : c.background.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isCompleted || isCurrent ? c.primary.inverse : c.text.muted,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                {isCompleted ? (
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                style={{
                  fontSize: typography.fontSize.xs,
                  color: isCurrent ? c.text.default : c.text.alternative,
                  fontWeight: isCurrent ? typography.fontWeight.medium : typography.fontWeight.regular,
                  textAlign: "center",
                  maxWidth: 80,
                }}
              >
                {step}
              </span>
            </div>
            {index < stepArray.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: index < current ? c.primary.default : c.background.muted,
                  marginBottom: spacing[6],
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Notification Cell - Notification row
export function NotificationCell({
  title = "Notification",
  message = "Notification message",
  timestamp = "2m ago",
  type = "info",
  unread = false,
}: {
  title?: string;
  message?: string;
  timestamp?: string;
  type?: "info" | "success" | "warning" | "error";
  unread?: boolean;
}) {
  const c = useColors();

  const typeColors = {
    info: c.primary.default,
    success: c.success.default,
    warning: c.warning.default,
    error: c.error.default,
  };

  const typeBgColors = {
    info: c.primary.muted,
    success: c.success.muted,
    warning: c.warning.muted,
    error: c.error.muted,
  };

  return (
    <div
      style={{
        display: "flex",
        gap: spacing[3],
        padding: spacing[4],
        background: unread ? c.background.section : "transparent",
        borderRadius: radius.xl,
        width: "100%",
        maxWidth: 373,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.full,
          background: typeBgColors[type],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill={typeColors[type]}>
          {type === "success" && <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />}
          {type === "error" && <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />}
          {type === "warning" && <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />}
          {type === "info" && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />}
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: spacing[1] }}>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              color: c.text.default,
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: typography.fontSize.xs, color: c.text.muted, flexShrink: 0 }}>{timestamp}</span>
        </div>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: c.text.alternative,
            margin: 0,
            lineHeight: `${typography.lineHeight.sm}px`,
          }}
        >
          {message}
        </p>
      </div>

      {/* Unread indicator */}
      {unread && (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: radius.full,
            background: c.primary.default,
            flexShrink: 0,
            marginTop: spacing[1],
          }}
        />
      )}
    </div>
  );
}

// Chain Badge - Network indicator badge
export function ChainBadge({
  chain = "Ethereum",
  showName = true,
}: {
  chain?: "Ethereum" | "Polygon" | "Arbitrum" | "Optimism" | "Avalanche" | "BNB" | "Base";
  showName?: boolean;
}) {
  const c = useColors();

  const chainColors: Record<string, string> = {
    Ethereum: "#627EEA",
    Polygon: "#8247E5",
    Arbitrum: "#28A0F0",
    Optimism: "#FF0420",
    Avalanche: "#E84142",
    BNB: "#F0B90B",
    Base: "#0052FF",
  };

  const chainColor = chainColors[chain] || c.primary.default;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: spacing[2],
        background: c.background.section,
        borderRadius: radius.full,
        padding: `${spacing[1.5]}px ${spacing[3]}px`,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: radius.full,
          background: chainColor,
        }}
      />
      {showName && (
        <span
          style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: c.text.default,
          }}
        >
          {chain}
        </span>
      )}
    </div>
  );
}

export const componentRegistry: ComponentEntry[] = [
  // Base Components
  {
    name: "Header",
    slug: "base-header",
    description: "Navigation header with multiple state variants.",
    component: BaseHeader,
    defaultProps: { title: "Title goes here", variant: "default", showSearch: true, subtitle: "Market", subtitleValue: "Yes at 71¢", searchPlaceholder: "Search tokens, sites, URLs" },
    props: [
      { name: "title", type: "string", default: "Title goes here", description: "Header title text" },
      { name: "variant", type: "select", default: "default", options: ["default", "scrolled", "prediction", "search"], description: "Header state variant" },
      { name: "showSearch", type: "boolean", default: true, description: "Show search icon (default/scrolled)" },
      { name: "subtitle", type: "string", default: "Market", description: "Subtitle label (prediction variant)" },
      { name: "subtitleValue", type: "string", default: "Yes at 71¢", description: "Subtitle value (prediction variant)" },
      { name: "searchPlaceholder", type: "string", default: "Search tokens, sites, URLs", description: "Search placeholder (search variant)" },
    ],
    variants: [
      { name: "Default", description: "Back arrow with large title below", props: { variant: "default" } },
      { name: "Scrolled", description: "Compact centered title when scrolled", props: { variant: "scrolled" } },
      { name: "Prediction", description: "Header with thumbnail and market info", props: { variant: "prediction", title: "Which company has best AI model end of 2025?" } },
      { name: "Search", description: "Search input with cancel button", props: { variant: "search" } },
    ],
  },
  {
    name: "Button",
    slug: "base-button",
    description: "Action button matching MetaMask Figma design. Uses bg-background-section with rounded-xl.",
    component: BaseButton,
    defaultProps: { label: "Action", variant: "default", size: "lg", fullWidth: false, disabled: false },
    props: [
      { name: "label", type: "string", default: "Action", description: "Button label" },
      { name: "variant", type: "select", default: "default", options: ["default", "primary", "danger"], description: "Button style (default=section bg, primary=solid, danger=red)" },
      { name: "size", type: "select", default: "lg", options: ["sm", "md", "lg"], description: "Button size (sm=32px, md=40px, lg=48px)" },
      { name: "fullWidth", type: "boolean", default: false, description: "Full width button" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Primary", description: "Solid primary button", props: { variant: "primary", label: "Primary" } },
      { name: "Danger", description: "Destructive action", props: { variant: "danger", label: "Delete" } },
      { name: "Small (32px)", description: "Small button - h-8", props: { size: "sm" } },
      { name: "Medium (40px)", description: "Medium button - h-10", props: { size: "md" } },
      { name: "Full Width", description: "Full width button", props: { fullWidth: true } },
    ],
  },
  {
    name: "Badge Status",
    slug: "base-badge-status",
    description: "Status indicator badge with colored dot. Matches Figma exactly with Sm (12px) and Md (14px) sizes.",
    component: BaseBadgeStatus,
    defaultProps: { status: "success", variant: "filled", size: "sm" },
    props: [
      { name: "status", type: "select", default: "success", options: ["success", "error", "info", "muted"], description: "Status color" },
      { name: "variant", type: "select", default: "filled", options: ["filled", "outline"], description: "Filled or outline style" },
      { name: "size", type: "select", default: "sm", options: ["sm", "md"], description: "Badge size (sm=12px, md=14px)" },
    ],
    variants: [
      { name: "Success Filled", description: "Green filled dot", props: { status: "success", variant: "filled" } },
      { name: "Success Outline", description: "Green outline dot", props: { status: "success", variant: "outline" } },
      { name: "Error", description: "Red status dot", props: { status: "error" } },
      { name: "Info", description: "Blue info dot", props: { status: "info" } },
      { name: "Muted", description: "Gray inactive dot", props: { status: "muted" } },
      { name: "Medium Size", description: "Larger 14px badge", props: { size: "md" } },
    ],
  },
  {
    name: "Tabs",
    slug: "base-tabs",
    description: "Tab navigation with underline indicator.",
    component: BaseTabs,
    defaultProps: { tabs: "Trending,Crypto,Sports,Politics", activeIndex: 0, variant: "auto" },
    props: [
      { name: "tabs", type: "string", default: "Trending,Crypto,Sports,Politics", description: "Comma-separated tab labels" },
      { name: "activeIndex", type: "number", default: 0, description: "Active tab index (0-based)" },
      { name: "variant", type: "select", default: "auto", options: ["fixed", "auto"], description: "Fixed width (equal) or auto width tabs" },
    ],
    variants: [
      { name: "Fixed Width", description: "Equal width tabs that fill container", props: { variant: "fixed", tabs: "Label,Label,Label" } },
      { name: "Auto Width", description: "Tabs sized by content", props: { variant: "auto", tabs: "Trending,Crypto,Sports,Politics" } },
    ],
  },
  {
    name: "Checkbox",
    slug: "base-checkbox",
    description: "Checkbox input with label. Supports checked, unchecked, disabled, and invalid states.",
    component: BaseCheckbox,
    defaultProps: { checked: false, label: "Label", disabled: false, isInvalid: false },
    props: [
      { name: "checked", type: "boolean", default: false, description: "Checked state" },
      { name: "label", type: "string", default: "Label", description: "Label text" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
      { name: "isInvalid", type: "boolean", default: false, description: "Invalid/error state (red border)" },
    ],
    variants: [
      { name: "Checked", description: "Checked checkbox", props: { checked: true } },
      { name: "Disabled Unchecked", description: "Disabled unchecked", props: { disabled: true } },
      { name: "Disabled Checked", description: "Disabled checked", props: { checked: true, disabled: true } },
      { name: "Invalid", description: "Invalid/error state", props: { isInvalid: true } },
    ],
  },
  {
    name: "Sheet",
    slug: "base-sheet",
    description: "Bottom sheet modal with handle, title, and home indicator.",
    component: BaseSheet,
    defaultProps: { title: "Sheet title", showHandle: true, showClose: true, content: "The market that backs this token is currently closed. Tokens can be transferred on-chain at any time.", linkText: "Learn more", showHomeIndicator: true, variant: "default", actionLabel: "Action", primaryLabel: "Primary action", secondaryLabel: "Secondary action" },
    props: [
      { name: "title", type: "string", default: "Sheet title", description: "Sheet title text" },
      { name: "variant", type: "select", default: "default", options: ["default", "illustration", "action", "twoActions"], description: "Sheet variant" },
      { name: "showHandle", type: "boolean", default: true, description: "Show drag handle" },
      { name: "showClose", type: "boolean", default: true, description: "Show close button" },
      { name: "content", type: "string", default: "The market that backs this token is currently closed.", description: "Sheet body content (default variant)" },
      { name: "linkText", type: "string", default: "Learn more", description: "Link text (default variant)" },
      { name: "actionLabel", type: "string", default: "Action", description: "Single action button label" },
      { name: "primaryLabel", type: "string", default: "Primary action", description: "Primary button label (twoActions)" },
      { name: "secondaryLabel", type: "string", default: "Secondary action", description: "Secondary button label (twoActions)" },
      { name: "showHomeIndicator", type: "boolean", default: true, description: "Show iOS home indicator" },
    ],
    variants: [
      { name: "Default", description: "Sheet with text content", props: { variant: "default" } },
      { name: "Illustration", description: "Fixed height sheet for illustrations", props: { variant: "illustration" } },
      { name: "1 Button", description: "Sheet with single action button", props: { variant: "action", title: "Sheet with action" } },
      { name: "2 Buttons", description: "Sheet with two action buttons", props: { variant: "twoActions", title: "Sheet with two actions" } },
    ],
  },
  {
    name: "Toast",
    slug: "base-toast",
    description: "Toast notification matching MetaMask Figma design. Supports multiple variants, actions, and links.",
    component: BaseToast,
    defaultProps: { title: "Action completed", subtitle: "", variant: "default", showClose: true, actionLabel: "", linkLabel: "", mini: false },
    props: [
      { name: "title", type: "string", default: "Action completed", description: "Toast title/message" },
      { name: "subtitle", type: "string", default: "", description: "Optional subtitle/description" },
      { name: "variant", type: "select", default: "default", options: ["default", "success", "error", "warning", "loading", "copy", "action"], description: "Toast variant with icon" },
      { name: "showClose", type: "boolean", default: true, description: "Show close button (when no action)" },
      { name: "actionLabel", type: "string", default: "", description: "Action button label (outline style)" },
      { name: "linkLabel", type: "string", default: "", description: "Link text (primary color)" },
      { name: "mini", type: "boolean", default: false, description: "Mini toast (16px radius)" },
    ],
    variants: [
      { name: "Success", description: "Green checkmark icon", props: { variant: "success", title: "Success", subtitle: "Description of success" } },
      { name: "Success with Action", description: "Success with action button", props: { variant: "success", title: "Account funded", subtitle: "$1,000 available", actionLabel: "Swap", showClose: false } },
      { name: "Error with Action", description: "Red X icon with action", props: { variant: "error", title: "Something went wrong", subtitle: "Description of failure", actionLabel: "Update", showClose: false } },
      { name: "Warning", description: "Orange warning icon", props: { variant: "warning", title: "Recoverable warning", subtitle: "Description of failure", showClose: false } },
      { name: "Action Needed", description: "Empty circle icon", props: { variant: "action", title: "Action needed", subtitle: "Description", actionLabel: "Action", showClose: false } },
      { name: "Loading", description: "Spinning loader", props: { variant: "loading", title: "Something's in progress..", mini: true } },
      { name: "Copied", description: "Copy icon", props: { variant: "copy", title: "Copied to clipboard", mini: true } },
      { name: "Text Only", description: "Plain text toast", props: { variant: "default", title: "Private key copied for 1 minute", mini: true } },
      { name: "With Link", description: "Success with link", props: { variant: "success", title: "Account funded", subtitle: "A message that would require two lines of text.", linkLabel: "Swap tokens" } },
    ],
  },
  {
    name: "Icon",
    slug: "base-icon",
    description: "MetaMask SVG icons with multiple sizes and colors.",
    component: BaseIcon,
    defaultProps: { name: "wallet", size: "md", color: "default" },
    props: [
      { name: "name", type: "select", default: "wallet", options: ["wallet", "send", "receive", "swap", "settings", "search", "close", "check", "add", "arrow-left", "arrow-right", "copy", "eye", "eye-slash", "lock", "warning", "info", "gas", "qr-code"], description: "Icon name" },
      { name: "size", type: "select", default: "md", options: ["xs", "sm", "md", "lg", "xl"], description: "Icon size (12-32px)" },
      { name: "color", type: "select", default: "default", options: ["default", "alternative", "muted", "primary", "success", "error", "warning"], description: "Icon color" },
    ],
    variants: [
      { name: "Send", description: "Send arrow icon", props: { name: "send" } },
      { name: "Receive", description: "Receive arrow icon", props: { name: "receive" } },
      { name: "Swap", description: "Swap arrows icon", props: { name: "swap" } },
      { name: "Settings", description: "Settings gear icon", props: { name: "settings" } },
      { name: "Search", description: "Search magnifier icon", props: { name: "search" } },
      { name: "Copy", description: "Copy to clipboard icon", props: { name: "copy" } },
      { name: "Lock", description: "Security lock icon", props: { name: "lock" } },
      { name: "Warning", description: "Warning triangle icon", props: { name: "warning", color: "warning" } },
      { name: "Gas", description: "Gas/fuel icon", props: { name: "gas" } },
      { name: "QR Code", description: "QR code icon", props: { name: "qr-code" } },
      { name: "Primary Color", description: "Primary colored icon", props: { color: "primary" } },
      { name: "Large Size", description: "Large (24px) icon", props: { size: "lg" } },
      { name: "XL Size", description: "Extra large (32px) icon", props: { size: "xl" } },
    ],
  },
  {
    name: "Avatar",
    slug: "base-avatar",
    description: "Token and Account avatars following MetaMask design system. Account avatars use Maskicon pattern.",
    component: BaseAvatar,
    defaultProps: { type: "account", name: "ETH", address: "0x9Cbf7c41B7787F6c621115010D3B044029FE2Ce8", size: "lg", showBadge: false, badge: "none" },
    props: [
      { name: "type", type: "select", default: "account", options: ["token", "account"], description: "Avatar type" },
      { name: "name", type: "string", default: "ETH", description: "Token symbol (for token type)" },
      { name: "address", type: "string", default: "0x9Cbf7c41B7787F6c621115010D3B044029FE2Ce8", description: "Wallet address (for account type)" },
      { name: "size", type: "select", default: "lg", options: ["xs", "sm", "md", "lg", "xl"], description: "Size: XS(16px), SM(24px), MD(32px), LG(40px), XL(48px)" },
      { name: "showBadge", type: "boolean", default: false, description: "Show network badge (token type only)" },
      { name: "badge", type: "select", default: "none", options: ["none", "network", "connection"], description: "Badge type (account type only)" },
    ],
    variants: [
      { name: "Account - XS (16px)", description: "Extra small account", props: { type: "account", size: "xs" } },
      { name: "Account - SM (24px)", description: "Small account", props: { type: "account", size: "sm" } },
      { name: "Account - MD (32px)", description: "Medium account", props: { type: "account", size: "md" } },
      { name: "Account - LG (40px)", description: "Large account", props: { type: "account", size: "lg" } },
      { name: "Account - XL (48px)", description: "Extra large account", props: { type: "account", size: "xl" } },
      { name: "Account + Network Badge", description: "Account with Ethereum badge", props: { type: "account", size: "lg", badge: "network" } },
      { name: "Account + Connection", description: "Account with green status", props: { type: "account", size: "lg", badge: "connection" } },
      { name: "Token - ETH", description: "Ethereum token (circular)", props: { type: "token", name: "ETH", size: "lg" } },
      { name: "Token SM + Network (24px)", description: "Small token with 16x16 network badge", props: { type: "token", name: "ETH", size: "sm", showBadge: true } },
      { name: "Token MD + Network (32px)", description: "Medium token with 16x16 network badge", props: { type: "token", name: "ETH", size: "md", showBadge: true } },
      { name: "Token LG + Network (40px)", description: "Large token with 16x16 network badge", props: { type: "token", name: "ETH", size: "lg", showBadge: true } },
      { name: "Token XL + Network (48px)", description: "Extra large token with 16x16 network badge", props: { type: "token", name: "ETH", size: "xl", showBadge: true } },
    ],
  },
  {
    name: "Toggle",
    slug: "base-toggle",
    description: "Toggle switch for boolean settings.",
    component: BaseToggle,
    defaultProps: { enabled: false, size: "md", disabled: false },
    props: [
      { name: "enabled", type: "boolean", default: false, description: "Toggle state" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "Toggle size" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Enabled", description: "Toggle in on state", props: { enabled: true } },
      { name: "Small", description: "Small toggle", props: { size: "sm" } },
      { name: "Disabled", description: "Disabled toggle", props: { disabled: true } },
    ],
  },
  {
    name: "Tab Header",
    slug: "tab-header",
    description: "Expandable header row showing label, value, and optional sub-row.",
    component: TabHeader,
    defaultProps: { label: "Available balance", value: "$1,003.30", showChevron: true, expanded: true, subLabel: "Unrealized P&L", subValue: "+$46.35 (+20.23%)", subValueColor: "success" },
    props: [
      { name: "label", type: "string", default: "Available balance", description: "Left side label text" },
      { name: "value", type: "string", default: "$1,003.30", description: "Right side value text" },
      { name: "showChevron", type: "boolean", default: true, description: "Show chevron indicator" },
      { name: "expanded", type: "boolean", default: true, description: "Show expanded sub-row" },
      { name: "subLabel", type: "string", default: "Unrealized P&L", description: "Sub-row label" },
      { name: "subValue", type: "string", default: "+$46.35 (+20.23%)", description: "Sub-row value" },
      { name: "subValueColor", type: "select", default: "success", options: ["default", "success", "error"], description: "Sub-row value color" },
    ],
    variants: [
      { name: "Action Link", description: "With action text instead of value", props: { value: "Add funds", expanded: false, subLabel: "", subValue: "" } },
      { name: "Balance Only", description: "Just showing balance", props: { value: "$1,003.30", expanded: false, subLabel: "", subValue: "" } },
      { name: "With P&L", description: "Expanded with unrealized P&L", props: { expanded: true, subLabel: "Unrealized P&L", subValue: "+$46.35 (+20.23%)", subValueColor: "success" } },
      { name: "With Loss", description: "Expanded with negative P&L", props: { expanded: true, subLabel: "Unrealized P&L", subValue: "-$12.50 (-5.2%)", subValueColor: "error" } },
    ],
  },
  {
    name: "Token Cell",
    slug: "token-cell",
    description: "Display token/asset information with price, balance and change. Uses AvatarToken with network badge.",
    component: TokenCell,
    defaultProps: { symbol: "ETH", name: "Ethereum", balance: "0.37", value: "$123.45", change: "+12.90%", changePositive: true, variant: "default", network: "ethereum", showNetworkBadge: true },
    props: [
      { name: "variant", type: "select", default: "default", options: ["default", "selection", "perps", "stock"], description: "Cell variant" },
      { name: "symbol", type: "string", default: "ETH", description: "Token symbol" },
      { name: "name", type: "string", default: "Ethereum", description: "Token/asset name" },
      { name: "balance", type: "string", default: "0.37", description: "Token balance" },
      { name: "value", type: "string", default: "$123.45", description: "Fiat value" },
      { name: "change", type: "string", default: "+12.90%", description: "Price change" },
      { name: "changePositive", type: "boolean", default: true, description: "Is change positive" },
      { name: "leverage", type: "string", default: "20x", description: "Leverage (perps only)" },
      { name: "marketCap", type: "string", default: "$297.4M", description: "Market cap (perps only)" },
      { name: "tag", type: "string", default: "Stock", description: "Asset tag (stock only)" },
      { name: "network", type: "select", default: "ethereum", options: ["ethereum", "polygon", "arbitrum", "optimism"], description: "Network for badge" },
      { name: "showNetworkBadge", type: "boolean", default: true, description: "Show network badge" },
    ],
    variants: [
      { name: "Default", description: "Standard token cell with name, balance, value and change", props: { variant: "default", name: "Ethereum", symbol: "ETH", balance: "0.37", value: "$123.45", change: "+12.90%", changePositive: true } },
      { name: "Selection", description: "Token selector with symbol, name, value and balance", props: { variant: "selection", name: "Ethereum", symbol: "ETH", balance: "0.37", value: "$123.45" } },
      { name: "Perps", description: "Perpetual trading with leverage badge and market cap", props: { variant: "perps", name: "Ethereum", symbol: "ETH", value: "$123.45", change: "+12.90%", changePositive: true, leverage: "20x", marketCap: "$297.4M" } },
      { name: "Stock", description: "Stock asset with shares and tag", props: { variant: "stock", name: "Apple", symbol: "AAPL", balance: "123.456", value: "$123.45", change: "+12.90%", changePositive: true, tag: "Stock" } },
      { name: "MATIC on Polygon", description: "MATIC token on Polygon network", props: { variant: "default", name: "Polygon", symbol: "MATIC", balance: "150.5", value: "$89.25", change: "+5.2%", changePositive: true, network: "polygon" } },
      { name: "ARB on Arbitrum", description: "ARB token on Arbitrum network", props: { variant: "default", name: "Arbitrum", symbol: "ARB", balance: "500", value: "$425.00", change: "-2.1%", changePositive: false, network: "arbitrum" } },
    ],
  },
  {
    name: "Token List",
    slug: "token-list",
    description: "List of tokens with header and 'See all' action. Composes TokenCell components.",
    component: TokenList,
    defaultProps: { title: "Tokens", showSeeAll: true, seeAllLabel: "See all", maxItems: 3, isLoading: false },
    props: [
      { name: "title", type: "string", default: "Tokens", description: "Section title" },
      { name: "showSeeAll", type: "boolean", default: true, description: "Show 'See all' link" },
      { name: "seeAllLabel", type: "string", default: "See all", description: "Label for see all link" },
      { name: "maxItems", type: "number", default: 3, description: "Maximum tokens to display" },
      { name: "isLoading", type: "boolean", default: false, description: "Show loading skeleton" },
    ],
    variants: [
      { name: "Default", description: "Token list with default tokens", props: { title: "Tokens", showSeeAll: true } },
      { name: "Loading", description: "Loading state with skeletons", props: { title: "Tokens", isLoading: true } },
      { name: "No See All", description: "Without see all link", props: { title: "Your Tokens", showSeeAll: false } },
    ],
  },
  {
    name: "Sorting",
    slug: "sorting",
    description: "Sort options panel with directional sorting support.",
    component: Sorting,
    defaultProps: { title: "Sort by", value: "value", direction: "desc", showApplyButton: true },
    props: [
      { name: "title", type: "string", default: "Sort by", description: "Panel title" },
      { name: "value", type: "select", default: "value", options: ["name", "balance", "value", "change"], description: "Selected sort option" },
      { name: "direction", type: "select", default: "desc", options: ["asc", "desc"], description: "Sort direction" },
      { name: "showApplyButton", type: "boolean", default: true, description: "Show apply button" },
    ],
    variants: [
      { name: "Default", description: "Sort by value descending", props: { value: "value", direction: "desc" } },
      { name: "Name A-Z", description: "Sort by name ascending", props: { value: "name", direction: "asc" } },
      { name: "Balance High-Low", description: "Sort by balance descending", props: { value: "balance", direction: "desc" } },
    ],
  },
  {
    name: "Hub Header",
    slug: "hub-header",
    description: "Main wallet header showing balance, network badge, and action buttons.",
    component: HubHeader,
    defaultProps: { balance: "$100", label: "Available balance", primaryAction: "Add funds", secondaryAction: "Withdraw", variant: "double", network: "Ethereum", showNetworkBadge: true },
    props: [
      { name: "balance", type: "string", default: "$100", description: "Balance display (text-lg, font-semibold)" },
      { name: "label", type: "string", default: "Available balance", description: "Balance label (text-sm, text-alternative)" },
      { name: "variant", type: "select", default: "double", options: ["single", "double"], description: "Single (white btn) or double (two dark btns)" },
      { name: "primaryAction", type: "string", default: "Add funds", description: "Primary button label" },
      { name: "secondaryAction", type: "string", default: "Withdraw", description: "Secondary button label (for double variant)" },
      { name: "network", type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism"], description: "Network for badge" },
      { name: "showNetworkBadge", type: "boolean", default: true, description: "Show network badge (32px + 16px indicator)" },
    ],
    variants: [
      { name: "Two Buttons", description: "Add funds + Withdraw (dark buttons)", props: { variant: "double", secondaryAction: "Withdraw" } },
      { name: "Single Button", description: "White solid 'Add funds' button", props: { variant: "single", secondaryAction: "" } },
    ],
  },
  {
    name: "Account Picker",
    slug: "account-picker",
    description: "Account selection dropdown with address preview.",
    component: AccountPicker,
    defaultProps: { name: "Account 1", connected: true },
    props: [
      { name: "name", type: "string", default: "Account 1", description: "Account name" },
      { name: "connected", type: "boolean", default: true, description: "Connection status" },
    ],
    variants: [
      { name: "Connected", description: "Connected account", props: { connected: true } },
      { name: "Disconnected", description: "Disconnected account", props: { connected: false } },
    ],
  },
  {
    name: "Footer Nav",
    slug: "footer-nav",
    description: "Mobile footer navigation bar with Home, Browser, Trade, Activity, and Rewards tabs.",
    component: BaseFooterNav,
    defaultProps: { activeTab: "home", showTradeButton: true },
    props: [
      { name: "activeTab", type: "select", default: "home", options: ["home", "browser", "trade", "activity", "rewards"], description: "Currently active tab" },
      { name: "showTradeButton", type: "boolean", default: true, description: "Show floating trade button" },
    ],
    variants: [
      { name: "Home Active", description: "Home tab selected", props: { activeTab: "home" } },
      { name: "Browser Active", description: "Browser tab selected", props: { activeTab: "browser" } },
      { name: "Activity Active", description: "Activity tab selected", props: { activeTab: "activity" } },
      { name: "Rewards Active", description: "Rewards tab selected", props: { activeTab: "rewards" } },
    ],
  },
  {
    name: "Pay With",
    slug: "pay-with",
    description: "Token selector pill for payment method selection. Uses AvatarToken with network badge.",
    component: PayWith,
    defaultProps: { tokenSymbol: "mUSD", tokenName: "mUSD", balance: "$2,400.35", network: "ethereum", state: "default" },
    props: [
      { name: "tokenSymbol", type: "string", default: "mUSD", description: "Token symbol" },
      { name: "tokenName", type: "string", default: "mUSD", description: "Token display name" },
      { name: "balance", type: "string", default: "$2,400.35", description: "Token balance" },
      { name: "network", type: "select", default: "ethereum", options: ["ethereum", "polygon", "arbitrum", "optimism"], description: "Network for badge" },
      { name: "state", type: "select", default: "default", options: ["default", "hovered"], description: "Component state" },
    ],
    variants: [
      { name: "Default", description: "Default state", props: { state: "default" } },
      { name: "Hovered", description: "Hover state with lighter background", props: { state: "hovered" } },
      { name: "ETH on Ethereum", description: "ETH token on Ethereum network", props: { tokenSymbol: "ETH", tokenName: "ETH", network: "ethereum" } },
      { name: "MATIC on Polygon", description: "MATIC token on Polygon network", props: { tokenSymbol: "MATIC", tokenName: "MATIC", network: "polygon" } },
    ],
  },
  {
    name: "Empty State",
    slug: "empty-state",
    description: "Placeholder for empty content areas.",
    component: EmptyState,
    defaultProps: { title: "No tokens yet", description: "Add your first token to get started", actionLabel: "Add Token" },
    props: [
      { name: "title", type: "string", default: "No tokens yet", description: "Title text" },
      { name: "description", type: "string", default: "Add your first token to get started", description: "Description text" },
      { name: "actionLabel", type: "string", default: "Add Token", description: "Action button label" },
    ],
    variants: [],
  },
  {
    name: "Page Header",
    slug: "page-header",
    description: "Navigation header with back button and actions.",
    component: PageHeader,
    defaultProps: { title: "Settings", showBack: true, action: "Save" },
    props: [
      { name: "title", type: "string", default: "Settings", description: "Page title" },
      { name: "showBack", type: "boolean", default: true, description: "Show back button" },
      { name: "action", type: "string", default: "Save", description: "Action button text" },
    ],
    variants: [],
  },
  {
    name: "Announcement",
    slug: "announcement",
    description: "Full-screen announcement modal with image, title, description and CTA button.",
    component: Announcement,
    defaultProps: { title: "Title must be under 30 chars!", description: "Here's a concise description that fits perfectly within the 150-character limit, providing clear and engaging information.", buttonLabel: "Click me", accentColor: "#d075ff" },
    props: [
      { name: "title", type: "string", default: "Title must be under 30 chars!", description: "Announcement title (max 30 chars)" },
      { name: "description", type: "string", default: "Here's a concise description...", description: "Description text (max 150 chars)" },
      { name: "buttonLabel", type: "string", default: "Click me", description: "CTA button label" },
      { name: "accentColor", type: "string", default: "#d075ff", description: "Accent color for image container" },
      { name: "showCloseButton", type: "boolean", default: true, description: "Show close button" },
      { name: "imagePlaceholder", type: "boolean", default: true, description: "Show image placeholder" },
    ],
    variants: [
      { name: "Default", description: "Standard announcement with purple accent", props: {} },
    ],
  },
  {
    name: "Search",
    slug: "search",
    description: "Search input field with multiple states for searching tokens, sites, and URLs.",
    component: Search,
    defaultProps: { variant: "default", placeholder: "Search tokens, sites, URLs", value: "" },
    props: [
      { name: "variant", type: "select", default: "default", options: ["default", "selected", "value", "website"], description: "Search field state" },
      { name: "placeholder", type: "string", default: "Search tokens, sites, URLs", description: "Placeholder text" },
      { name: "value", type: "string", default: "", description: "Input value" },
    ],
    variants: [
      { name: "Default", description: "Empty search field with placeholder", props: { variant: "default" } },
      { name: "Selected", description: "Focused search field with Cancel button", props: { variant: "selected" } },
      { name: "Value", description: "Search field with entered value and clear button", props: { variant: "value", value: "uniswap" } },
      { name: "Website", description: "URL display with lock icon", props: { variant: "website" } },
    ],
  },
  {
    name: "Section Header",
    slug: "section-header",
    description: "Section title with chevron for navigation.",
    component: SectionHeader,
    defaultProps: { title: "Section title goes here", variant: "top-level", showChevron: true },
    props: [
      { name: "title", type: "string", default: "Section title goes here", description: "Section title" },
      { name: "variant", type: "select", default: "top-level", options: ["top-level", "details-level"], description: "Size variant" },
      { name: "showChevron", type: "boolean", default: true, description: "Show right chevron" },
    ],
    variants: [
      { name: "Top Level", description: "Main section header with 18px medium text", props: { variant: "top-level", title: "Section title goes here" } },
      { name: "Details Level", description: "Subsection header with 16px semibold text", props: { variant: "details-level", title: "Details section title here" } },
    ],
  },
  {
    name: "List Item",
    slug: "list-item",
    description: "Row item for settings and menus.",
    component: ListItem,
    defaultProps: { title: "Security", subtitle: "Manage your security settings", leftIcon: "🔒", showChevron: true },
    props: [
      { name: "title", type: "string", default: "Security", description: "Item title" },
      { name: "subtitle", type: "string", default: "Manage your security settings", description: "Item subtitle" },
      { name: "leftIcon", type: "string", default: "🔒", description: "Left icon/emoji" },
      { name: "showChevron", type: "boolean", default: true, description: "Show chevron" },
    ],
    variants: [],
  },
  {
    name: "Transaction Cell",
    slug: "transaction-cell",
    description: "Transaction history row.",
    component: TransactionCell,
    defaultProps: { type: "send", status: "confirmed", amount: "-0.5 ETH", value: "$1,000.00", address: "0x1234...5678", timestamp: "2 hours ago" },
    props: [
      { name: "type", type: "select", default: "send", options: ["send", "receive", "swap", "approve"], description: "Transaction type" },
      { name: "status", type: "select", default: "confirmed", options: ["pending", "confirmed", "failed"], description: "Transaction status" },
      { name: "amount", type: "string", default: "-0.5 ETH", description: "Amount" },
      { name: "value", type: "string", default: "$1,000.00", description: "Fiat value" },
      { name: "address", type: "string", default: "0x1234...5678", description: "Address" },
    ],
    variants: [
      { name: "Send", description: "Outgoing transaction", props: { type: "send", amount: "-0.5 ETH" } },
      { name: "Receive", description: "Incoming transaction", props: { type: "receive", amount: "+1.0 ETH" } },
      { name: "Pending", description: "Pending transaction", props: { status: "pending" } },
    ],
  },
  {
    name: "Button",
    slug: "button",
    description: "Primary action button with multiple variants.",
    component: Button,
    defaultProps: { label: "Button", variant: "primary", size: "md", disabled: false },
    props: [
      { name: "label", type: "string", default: "Button", description: "Button text" },
      { name: "variant", type: "select", default: "primary", options: ["primary", "secondary", "tertiary", "danger"], description: "Visual style" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "Button size" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Primary", description: "Primary action button", props: { variant: "primary" } },
      { name: "Secondary", description: "Secondary action button", props: { variant: "secondary" } },
      { name: "Danger", description: "Destructive action button", props: { variant: "danger" } },
    ],
  },
  {
    name: "Input",
    slug: "input",
    description: "Text input field with label and error states.",
    component: Input,
    defaultProps: { placeholder: "Enter text...", label: "Label", error: "", disabled: false },
    props: [
      { name: "placeholder", type: "string", default: "Enter text...", description: "Placeholder text" },
      { name: "label", type: "string", default: "Label", description: "Field label" },
      { name: "error", type: "string", default: "", description: "Error message" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Default", description: "Standard input", props: {} },
      { name: "With Error", description: "Input with error", props: { error: "This field is required" } },
    ],
  },
  {
    name: "Card",
    slug: "card",
    description: "Container component for grouping content.",
    component: Card,
    defaultProps: { title: "Card Title", description: "Card description text goes here.", variant: "default" },
    props: [
      { name: "title", type: "string", default: "Card Title", description: "Card title" },
      { name: "description", type: "string", default: "Card description text goes here.", description: "Card description" },
      { name: "variant", type: "select", default: "default", options: ["default", "elevated", "outlined"], description: "Card style" },
    ],
    variants: [
      { name: "Default", description: "Default card", props: { variant: "default" } },
      { name: "Elevated", description: "Elevated with shadow", props: { variant: "elevated" } },
      { name: "Outlined", description: "Outlined border", props: { variant: "outlined" } },
    ],
  },
  {
    name: "Badge",
    slug: "badge",
    description: "Small status indicator.",
    component: Badge,
    defaultProps: { label: "Badge", variant: "default" },
    props: [
      { name: "label", type: "string", default: "Badge", description: "Badge text" },
      { name: "variant", type: "select", default: "default", options: ["default", "primary", "success", "warning", "error"], description: "Badge variant" },
    ],
    variants: [
      { name: "Primary", description: "Primary badge", props: { variant: "primary", label: "New" } },
      { name: "Success", description: "Success badge", props: { variant: "success", label: "Active" } },
      { name: "Error", description: "Error badge", props: { variant: "error", label: "Failed" } },
    ],
  },
  {
    name: "Avatar",
    slug: "avatar",
    description: "User or entity avatar.",
    component: Avatar,
    defaultProps: { name: "John Doe", size: "md" },
    props: [
      { name: "name", type: "string", default: "John Doe", description: "Name for initials" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg", "xl"], description: "Avatar size" },
    ],
    variants: [
      { name: "Small", description: "Small avatar", props: { size: "sm" } },
      { name: "Large", description: "Large avatar", props: { size: "lg" } },
    ],
  },
  {
    name: "Switch",
    slug: "switch",
    description: "Toggle switch for boolean settings.",
    component: Switch,
    defaultProps: { checked: false, label: "Enable feature" },
    props: [
      { name: "checked", type: "boolean", default: false, description: "Switch state" },
      { name: "label", type: "string", default: "Enable feature", description: "Label text" },
    ],
    variants: [],
  },
  {
    name: "Banner",
    slug: "banner",
    description: "Informational banner with variants.",
    component: Banner,
    defaultProps: { title: "Notice", description: "This is an informational banner.", variant: "info" },
    props: [
      { name: "title", type: "string", default: "Notice", description: "Banner title" },
      { name: "description", type: "string", default: "This is an informational banner.", description: "Banner description" },
      { name: "variant", type: "select", default: "info", options: ["info", "success", "warning", "error"], description: "Banner variant" },
    ],
    variants: [
      { name: "Info", description: "Info banner", props: { variant: "info" } },
      { name: "Success", description: "Success banner", props: { variant: "success", title: "Success!" } },
      { name: "Warning", description: "Warning banner", props: { variant: "warning", title: "Warning" } },
      { name: "Error", description: "Error banner", props: { variant: "error", title: "Error" } },
    ],
  },
  {
    name: "Chip",
    slug: "chip",
    description: "Selectable chip for filters.",
    component: Chip,
    defaultProps: { label: "NFTs", selected: false },
    props: [
      { name: "label", type: "string", default: "NFTs", description: "Chip label" },
      { name: "selected", type: "boolean", default: false, description: "Selected state" },
    ],
    variants: [
      { name: "Selected", description: "Selected chip", props: { selected: true } },
      { name: "Unselected", description: "Unselected chip", props: { selected: false } },
    ],
  },
  {
    name: "Toast",
    slug: "toast",
    description: "Temporary notification message.",
    component: Toast,
    defaultProps: { message: "Action completed", variant: "default" },
    props: [
      { name: "message", type: "string", default: "Action completed", description: "Toast message" },
      { name: "variant", type: "select", default: "default", options: ["default", "success", "error"], description: "Toast variant" },
    ],
    variants: [
      { name: "Success", description: "Success toast", props: { variant: "success", message: "Transaction confirmed!" } },
      { name: "Error", description: "Error toast", props: { variant: "error", message: "Transaction failed" } },
    ],
  },
  {
    name: "Dialog",
    slug: "dialog",
    description: "Modal dialog for confirmations.",
    component: Dialog,
    defaultProps: { title: "Confirm Action", description: "Are you sure you want to proceed?", primaryAction: "Confirm", secondaryAction: "Cancel" },
    props: [
      { name: "title", type: "string", default: "Confirm Action", description: "Dialog title" },
      { name: "description", type: "string", default: "Are you sure you want to proceed?", description: "Dialog description" },
      { name: "primaryAction", type: "string", default: "Confirm", description: "Primary button text" },
      { name: "secondaryAction", type: "string", default: "Cancel", description: "Secondary button text" },
    ],
    variants: [],
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    description: "Loading placeholder animation.",
    component: Skeleton,
    defaultProps: { variant: "text", width: 200, height: 20 },
    props: [
      { name: "variant", type: "select", default: "text", options: ["text", "circular", "rectangular"], description: "Skeleton shape" },
      { name: "width", type: "number", default: 200, description: "Width in pixels" },
      { name: "height", type: "number", default: 20, description: "Height in pixels" },
    ],
    variants: [
      { name: "Text", description: "Text line placeholder", props: { variant: "text", width: 200, height: 16 } },
      { name: "Circular", description: "Avatar placeholder", props: { variant: "circular", width: 48, height: 48 } },
      { name: "Rectangular", description: "Card placeholder", props: { variant: "rectangular", width: 200, height: 100 } },
    ],
  },
  {
    name: "Select",
    slug: "select",
    description: "Dropdown selection component.",
    component: Select,
    defaultProps: { label: "Network", value: "", placeholder: "Select network", options: ["Ethereum", "Polygon", "Arbitrum"], disabled: false },
    props: [
      { name: "label", type: "string", default: "Network", description: "Field label" },
      { name: "placeholder", type: "string", default: "Select network", description: "Placeholder text" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [],
  },
  {
    name: "Progress Bar",
    slug: "progress-bar",
    description: "Progress indicator bar.",
    component: ProgressBar,
    defaultProps: { progress: 65, variant: "primary", showLabel: true },
    props: [
      { name: "progress", type: "number", default: 65, description: "Progress percentage (0-100)" },
      { name: "variant", type: "select", default: "primary", options: ["primary", "success", "warning", "error"], description: "Color variant" },
      { name: "showLabel", type: "boolean", default: true, description: "Show percentage label" },
    ],
    variants: [
      { name: "Success", description: "Completed progress", props: { progress: 100, variant: "success" } },
      { name: "Warning", description: "Partial progress", props: { progress: 45, variant: "warning" } },
    ],
  },
  {
    name: "Divider",
    slug: "divider",
    description: "Visual separator between content.",
    component: Divider,
    defaultProps: { variant: "full" },
    props: [
      { name: "variant", type: "select", default: "full", options: ["full", "inset", "middle"], description: "Divider style" },
    ],
    variants: [
      { name: "Inset", description: "Left inset divider", props: { variant: "inset" } },
      { name: "Middle", description: "Centered divider", props: { variant: "middle" } },
    ],
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    description: "Checkable input for multiple selections.",
    component: Checkbox,
    defaultProps: { checked: false, label: "I agree to the terms", disabled: false },
    props: [
      { name: "checked", type: "boolean", default: false, description: "Checked state" },
      { name: "label", type: "string", default: "I agree to the terms", description: "Label text" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Checked", description: "Checked state", props: { checked: true } },
    ],
  },
  {
    name: "Tabs",
    slug: "tabs",
    description: "Tabbed navigation component.",
    component: Tabs,
    defaultProps: { tabs: ["Tokens", "NFTs", "Activity"], activeIndex: 0, variant: "default" },
    props: [
      { name: "activeIndex", type: "number", default: 0, description: "Active tab index" },
      { name: "variant", type: "select", default: "default", options: ["default", "pills"], description: "Tab style" },
    ],
    variants: [
      { name: "Pills", description: "Pill-style tabs", props: { variant: "pills" } },
    ],
  },
  {
    name: "Text Area",
    slug: "text-area",
    description: "Multi-line text input.",
    component: TextArea,
    defaultProps: { placeholder: "Enter message...", label: "Message", rows: 4, disabled: false },
    props: [
      { name: "placeholder", type: "string", default: "Enter message...", description: "Placeholder text" },
      { name: "label", type: "string", default: "Message", description: "Field label" },
      { name: "rows", type: "number", default: 4, description: "Number of rows" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [],
  },
  {
    name: "Radio",
    slug: "radio",
    description: "Single selection radio button.",
    component: Radio,
    defaultProps: { selected: false, label: "Option A", disabled: false },
    props: [
      { name: "selected", type: "boolean", default: false, description: "Selected state" },
      { name: "label", type: "string", default: "Option A", description: "Label text" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "Selected", description: "Selected state", props: { selected: true } },
    ],
  },
  {
    name: "Spinner",
    slug: "spinner",
    description: "Loading spinner indicator.",
    component: Spinner,
    defaultProps: { size: "md", variant: "primary" },
    props: [
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "Spinner size" },
      { name: "variant", type: "select", default: "primary", options: ["primary", "default"], description: "Color variant" },
    ],
    variants: [
      { name: "Small", description: "Small spinner", props: { size: "sm" } },
      { name: "Large", description: "Large spinner", props: { size: "lg" } },
    ],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    description: "Informational tooltip overlay.",
    component: Tooltip,
    defaultProps: { text: "Helpful information here", position: "top" },
    props: [
      { name: "text", type: "string", default: "Helpful information here", description: "Tooltip text" },
      { name: "position", type: "select", default: "top", options: ["top", "bottom", "left", "right"], description: "Tooltip position" },
    ],
    variants: [],
  },
  {
    name: "Slider",
    slug: "slider",
    description: "Range input slider.",
    component: Slider,
    defaultProps: { value: 50, min: 0, max: 100, showValue: true },
    props: [
      { name: "value", type: "number", default: 50, description: "Current value" },
      { name: "min", type: "number", default: 0, description: "Minimum value" },
      { name: "max", type: "number", default: 100, description: "Maximum value" },
      { name: "showValue", type: "boolean", default: true, description: "Show value label" },
    ],
    variants: [],
  },
  {
    name: "Search Bar",
    slug: "search-bar",
    description: "Search input with clear button.",
    component: SearchBar,
    defaultProps: { placeholder: "Search tokens...", value: "", showClear: true },
    props: [
      { name: "placeholder", type: "string", default: "Search tokens...", description: "Placeholder text" },
      { name: "showClear", type: "boolean", default: true, description: "Show clear button" },
    ],
    variants: [],
  },
  {
    name: "Password Input",
    slug: "password-input",
    description: "Password field with visibility toggle.",
    component: PasswordInput,
    defaultProps: { placeholder: "Enter password", label: "Password", showPassword: false },
    props: [
      { name: "placeholder", type: "string", default: "Enter password", description: "Placeholder text" },
      { name: "label", type: "string", default: "Password", description: "Field label" },
      { name: "showPassword", type: "boolean", default: false, description: "Show password initially" },
    ],
    variants: [],
  },
  {
    name: "Segmented Control",
    slug: "segmented-control",
    description: "Toggle between options.",
    component: SegmentedControl,
    defaultProps: { segments: ["Buy", "Sell"], selected: 0 },
    props: [
      { name: "selected", type: "number", default: 0, description: "Selected segment index" },
    ],
    variants: [],
  },

  // =============================================================================
  // WALLET-SPECIFIC COMPONENTS
  // =============================================================================

  {
    name: "Amount Input",
    slug: "amount-input",
    description: "Crypto amount entry with token selector and fiat conversion.",
    component: AmountInput,
    defaultProps: { value: "0.0", token: "ETH", fiatValue: "$0.00", balance: "0.00", showMax: true, disabled: false },
    props: [
      { name: "value", type: "string", default: "0.0", description: "Amount value" },
      { name: "token", type: "string", default: "ETH", description: "Token symbol" },
      { name: "fiatValue", type: "string", default: "$0.00", description: "Fiat equivalent" },
      { name: "balance", type: "string", default: "0.00", description: "Available balance" },
      { name: "showMax", type: "boolean", default: true, description: "Show max button" },
      { name: "disabled", type: "boolean", default: false, description: "Disabled state" },
    ],
    variants: [
      { name: "With Balance", description: "Amount with balance", props: { value: "1.5", token: "ETH", fiatValue: "$3,000.00", balance: "2.45" } },
      { name: "USDC", description: "USDC token", props: { value: "1000", token: "USDC", fiatValue: "$1,000.00", balance: "5000" } },
    ],
  },
  {
    name: "Confirmation Sheet",
    slug: "confirmation-sheet",
    description: "Transaction confirmation summary with amount, recipient, and fees.",
    component: ConfirmationSheet,
    defaultProps: { title: "Confirm Transaction", amount: "0.5 ETH", recipient: "0x1234...5678", fee: "$2.50", total: "$1,002.50" },
    props: [
      { name: "title", type: "string", default: "Confirm Transaction", description: "Sheet title" },
      { name: "amount", type: "string", default: "0.5 ETH", description: "Transaction amount" },
      { name: "recipient", type: "string", default: "0x1234...5678", description: "Recipient address" },
      { name: "fee", type: "string", default: "$2.50", description: "Network fee" },
      { name: "total", type: "string", default: "$1,002.50", description: "Total cost" },
    ],
    variants: [
      { name: "Send ETH", description: "ETH send confirmation", props: { title: "Send ETH", amount: "1.0 ETH", fee: "$5.00", total: "$2,005.00" } },
    ],
  },
  {
    name: "Gas Fee Selector",
    slug: "gas-fee-selector",
    description: "Gas fee picker with low, medium, and high options.",
    component: GasFeeSelector,
    defaultProps: { selected: "medium", lowFee: "$0.50", mediumFee: "$1.00", highFee: "$2.50", showCustom: false },
    props: [
      { name: "selected", type: "select", default: "medium", options: ["low", "medium", "high", "custom"], description: "Selected gas option" },
      { name: "lowFee", type: "string", default: "$0.50", description: "Low fee amount" },
      { name: "mediumFee", type: "string", default: "$1.00", description: "Medium fee amount" },
      { name: "highFee", type: "string", default: "$2.50", description: "High fee amount" },
      { name: "showCustom", type: "boolean", default: false, description: "Show custom option" },
    ],
    variants: [
      { name: "Low Selected", description: "Low gas selected", props: { selected: "low" } },
      { name: "High Selected", description: "High gas selected", props: { selected: "high" } },
      { name: "With Custom", description: "Show custom option", props: { showCustom: true } },
    ],
  },
  {
    name: "QR Code",
    slug: "qr-code",
    description: "QR code display for wallet addresses.",
    component: QRCodeDisplay,
    defaultProps: { value: "0x1234567890abcdef1234567890abcdef12345678", size: "md", showValue: true },
    props: [
      { name: "value", type: "string", default: "0x1234567890abcdef1234567890abcdef12345678", description: "Address to encode" },
      { name: "size", type: "select", default: "md", options: ["sm", "md", "lg"], description: "QR code size" },
      { name: "showValue", type: "boolean", default: true, description: "Show address below QR" },
    ],
    variants: [
      { name: "Small", description: "Small QR code", props: { size: "sm" } },
      { name: "Large", description: "Large QR code", props: { size: "lg" } },
      { name: "No Value", description: "QR only", props: { showValue: false } },
    ],
  },
  {
    name: "Address Display",
    slug: "address-display",
    description: "Wallet address with copy button.",
    component: AddressDisplay,
    defaultProps: { address: "0x1234567890abcdef1234567890abcdef12345678", truncate: true, showCopy: true, variant: "default" },
    props: [
      { name: "address", type: "string", default: "0x1234567890abcdef1234567890abcdef12345678", description: "Wallet address" },
      { name: "truncate", type: "boolean", default: true, description: "Truncate address" },
      { name: "showCopy", type: "boolean", default: true, description: "Show copy button" },
      { name: "variant", type: "select", default: "default", options: ["default", "compact", "full"], description: "Display variant" },
    ],
    variants: [
      { name: "Compact", description: "Compact inline style", props: { variant: "compact" } },
      { name: "Full Address", description: "Show full address", props: { variant: "full", truncate: false } },
    ],
  },
  {
    name: "Swap Preview",
    slug: "swap-preview",
    description: "Token swap preview with rate and fee information.",
    component: SwapPreview,
    defaultProps: { fromToken: "ETH", fromAmount: "1.0", toToken: "USDC", toAmount: "2,000", rate: "1 ETH = 2,000 USDC", fee: "$5.00" },
    props: [
      { name: "fromToken", type: "string", default: "ETH", description: "Source token" },
      { name: "fromAmount", type: "string", default: "1.0", description: "Source amount" },
      { name: "toToken", type: "string", default: "USDC", description: "Destination token" },
      { name: "toAmount", type: "string", default: "2,000", description: "Destination amount" },
      { name: "rate", type: "string", default: "1 ETH = 2,000 USDC", description: "Exchange rate" },
      { name: "fee", type: "string", default: "$5.00", description: "Network fee" },
    ],
    variants: [
      { name: "ETH to MATIC", description: "ETH to MATIC swap", props: { fromToken: "ETH", toToken: "MATIC", toAmount: "2,500", rate: "1 ETH = 2,500 MATIC" } },
    ],
  },
  {
    name: "Wallet Connect Session",
    slug: "wallet-connect-session",
    description: "Connected dApp display with connection status.",
    component: WalletConnectSession,
    defaultProps: { dappName: "Uniswap", dappUrl: "app.uniswap.org", connected: true, network: "Ethereum" },
    props: [
      { name: "dappName", type: "string", default: "Uniswap", description: "dApp name" },
      { name: "dappUrl", type: "string", default: "app.uniswap.org", description: "dApp URL" },
      { name: "connected", type: "boolean", default: true, description: "Connection status" },
      { name: "network", type: "string", default: "Ethereum", description: "Network name" },
    ],
    variants: [
      { name: "OpenSea", description: "OpenSea connection", props: { dappName: "OpenSea", dappUrl: "opensea.io" } },
      { name: "Disconnected", description: "Disconnected state", props: { connected: false } },
    ],
  },
  {
    name: "NFT Card",
    slug: "nft-card",
    description: "NFT display card with image, name, and price.",
    component: NFTCard,
    defaultProps: { name: "Cool NFT #1234", collection: "Cool Collection", price: "1.5 ETH", showPrice: true },
    props: [
      { name: "name", type: "string", default: "Cool NFT #1234", description: "NFT name" },
      { name: "collection", type: "string", default: "Cool Collection", description: "Collection name" },
      { name: "price", type: "string", default: "1.5 ETH", description: "NFT price" },
      { name: "showPrice", type: "boolean", default: true, description: "Show price" },
    ],
    variants: [
      { name: "BAYC", description: "Bored Ape", props: { name: "Bored Ape #1234", collection: "BAYC", price: "50 ETH" } },
      { name: "No Price", description: "Without price", props: { showPrice: false } },
    ],
  },
  {
    name: "Status Indicator",
    slug: "status-indicator",
    description: "Transaction status indicator with icon and label.",
    component: StatusIndicator,
    defaultProps: { status: "confirmed", label: "Transaction Confirmed", showPulse: false },
    props: [
      { name: "status", type: "select", default: "confirmed", options: ["pending", "confirmed", "failed", "processing"], description: "Status type" },
      { name: "label", type: "string", default: "Transaction Confirmed", description: "Status label" },
      { name: "showPulse", type: "boolean", default: false, description: "Show pulse animation" },
    ],
    variants: [
      { name: "Pending", description: "Pending transaction", props: { status: "pending", label: "Transaction Pending", showPulse: true } },
      { name: "Failed", description: "Failed transaction", props: { status: "failed", label: "Transaction Failed" } },
      { name: "Processing", description: "Processing transaction", props: { status: "processing", label: "Processing...", showPulse: true } },
    ],
  },
  {
    name: "Stepper",
    slug: "stepper",
    description: "Multi-step progress indicator.",
    component: Stepper,
    defaultProps: { steps: "Connect,Approve,Confirm", current: 0, variant: "default" },
    props: [
      { name: "steps", type: "string", default: "Connect,Approve,Confirm", description: "Comma-separated step labels" },
      { name: "current", type: "number", default: 0, description: "Current step index (0-based)" },
      { name: "variant", type: "select", default: "default", options: ["default", "compact"], description: "Stepper style" },
    ],
    variants: [
      { name: "Step 2", description: "Second step active", props: { current: 1 } },
      { name: "Completed", description: "All steps completed", props: { current: 3 } },
      { name: "Compact", description: "Compact bar style", props: { variant: "compact" } },
    ],
  },
  {
    name: "Notification Cell",
    slug: "notification-cell",
    description: "In-app notification row with type and timestamp.",
    component: NotificationCell,
    defaultProps: { title: "Transaction Complete", message: "Your transaction has been confirmed", timestamp: "2m ago", type: "success", unread: true },
    props: [
      { name: "title", type: "string", default: "Transaction Complete", description: "Notification title" },
      { name: "message", type: "string", default: "Your transaction has been confirmed", description: "Notification message" },
      { name: "timestamp", type: "string", default: "2m ago", description: "Time ago" },
      { name: "type", type: "select", default: "success", options: ["info", "success", "warning", "error"], description: "Notification type" },
      { name: "unread", type: "boolean", default: true, description: "Unread indicator" },
    ],
    variants: [
      { name: "Error", description: "Error notification", props: { type: "error", title: "Transaction Failed", message: "Insufficient funds" } },
      { name: "Warning", description: "Warning notification", props: { type: "warning", title: "Price Alert", message: "ETH dropped 5%" } },
      { name: "Read", description: "Read notification", props: { unread: false } },
    ],
  },
  {
    name: "Chain Badge",
    slug: "chain-badge",
    description: "Network indicator badge with chain color.",
    component: ChainBadge,
    defaultProps: { chain: "Ethereum", showName: true },
    props: [
      { name: "chain", type: "select", default: "Ethereum", options: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Avalanche", "BNB", "Base"], description: "Network chain" },
      { name: "showName", type: "boolean", default: true, description: "Show chain name" },
    ],
    variants: [
      { name: "Polygon", description: "Polygon network", props: { chain: "Polygon" } },
      { name: "Arbitrum", description: "Arbitrum network", props: { chain: "Arbitrum" } },
      { name: "Icon Only", description: "Icon without name", props: { showName: false } },
    ],
  },
];

export function getComponentBySlug(slug: string): ComponentEntry | undefined {
  return componentRegistry.find((c) => c.slug === slug);
}

