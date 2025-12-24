/**
 * Wallet Home Screen Pattern
 * 
 * This is the main wallet screen pattern showing:
 * - Balance header with actions
 * - Token list with values
 * - Bottom navigation
 * 
 * Use this as a reference for building wallet screens.
 */

import {
  HubHeader,
  SectionHeader,
  TokenCell,
  FooterNav,
  useColors,
} from "@/lib/components";
import { spacing } from "@/lib/tokens";

export function WalletHomeScreen() {
  const c = useColors();

  return (
    <div
      style={{
        backgroundColor: c.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main scrollable content */}
      <div style={{ flex: 1, padding: spacing[4] }}>
        {/* Balance Header */}
        <HubHeader
          balance="$12,450.00"
          label="Total Balance"
          primaryAction="Add funds"
          secondaryAction="Withdraw"
        />

        {/* Token Section */}
        <div style={{ marginTop: spacing[6] }}>
          <SectionHeader title="Tokens" action="See all" />
          
          <div style={{ marginTop: spacing[2], display: "flex", flexDirection: "column", gap: spacing[1] }}>
            <TokenCell
              symbol="ETH"
              name="Ethereum"
              balance="2.45"
              value="$4,890.00"
              change="+5.2%"
              changePositive
            />
            <TokenCell
              symbol="USDC"
              name="USD Coin"
              balance="5,000"
              value="$5,000.00"
              change="+0.01%"
              changePositive
            />
            <TokenCell
              symbol="MATIC"
              name="Polygon"
              balance="1,250"
              value="$1,125.00"
              change="-2.3%"
              changePositive={false}
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer Navigation */}
      <FooterNav activeTab="wallet" />
    </div>
  );
}

/**
 * Usage in Canvas:
 * 
 * 1. Add HubHeader with balance props
 * 2. Add SectionHeader with title "Tokens"
 * 3. Add multiple TokenCell components
 * 4. Add FooterNav at bottom
 * 
 * Key patterns:
 * - Use spacing[4] for main padding
 * - Use spacing[6] between sections
 * - Use spacing[1] between list items
 * - FooterNav should be fixed at bottom
 */

