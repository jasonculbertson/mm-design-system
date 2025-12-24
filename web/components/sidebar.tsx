"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wallet } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const tokenPages = [
  { name: "Colors", slug: "colors" },
  { name: "Typography", slug: "typography" },
  { name: "Spacing", slug: "spacing" },
  { name: "Radius", slug: "radius" },
  { name: "Shadows", slug: "shadows" },
];

const baseComponents = [
  { name: "Header", slug: "base-header" },
  { name: "Button", slug: "button" },
  { name: "Badge Status", slug: "base-badge-status" },
  { name: "Checkbox", slug: "base-checkbox" },
  { name: "Tabs", slug: "base-tabs" },
  { name: "Sheet", slug: "base-sheet" },
  { name: "Toast", slug: "base-toast" },
  { name: "Avatar", slug: "base-avatar" },
  { name: "Toggle", slug: "base-toggle" },
];

const components = [
  { name: "Hub Header", slug: "hub-header" },
  { name: "Tab Header", slug: "tab-header" },
  { name: "Footer Nav", slug: "footer-nav" },
  { name: "Pay With", slug: "pay-with" },
  { name: "Search", slug: "search" },
  { name: "Announcement", slug: "announcement" },
  { name: "Token Cell", slug: "token-cell" },
  { name: "Token List", slug: "token-list" },
  { name: "Sorting", slug: "sorting" },
  { name: "Account Picker", slug: "account-picker" },
  { name: "Empty State", slug: "empty-state" },
  { name: "Page Header", slug: "page-header" },
  { name: "Section Header", slug: "section-header" },
  { name: "List Item", slug: "list-item" },
  { name: "Transaction Cell", slug: "transaction-cell" },
  // Wallet-specific components
  { name: "Amount Input", slug: "amount-input" },
  { name: "Address Display", slug: "address-display" },
  { name: "QR Code", slug: "qr-code" },
  { name: "Gas Fee Selector", slug: "gas-fee-selector" },
  { name: "Confirmation Sheet", slug: "confirmation-sheet" },
  { name: "Swap Preview", slug: "swap-preview" },
  { name: "Wallet Connect", slug: "wallet-connect-session" },
  { name: "NFT Card", slug: "nft-card" },
  { name: "Status Indicator", slug: "status-indicator" },
  { name: "Stepper", slug: "stepper" },
  { name: "Notification Cell", slug: "notification-cell" },
  { name: "Chain Badge", slug: "chain-badge" },
];

const primitives = [
  { name: "Button", slug: "button" },
  { name: "Input", slug: "input" },
  { name: "Card", slug: "card" },
  { name: "Badge", slug: "badge" },
  { name: "Avatar", slug: "avatar" },
  { name: "Switch", slug: "switch" },
  { name: "Banner", slug: "banner" },
  { name: "Chip", slug: "chip" },
  { name: "Toast", slug: "toast" },
  { name: "Dialog", slug: "dialog" },
  { name: "Skeleton", slug: "skeleton" },
  { name: "Select", slug: "select" },
  { name: "Progress Bar", slug: "progress-bar" },
  { name: "Divider", slug: "divider" },
  { name: "Checkbox", slug: "checkbox" },
  { name: "Tabs", slug: "tabs" },
  { name: "Text Area", slug: "text-area" },
  { name: "Radio", slug: "radio" },
  { name: "Spinner", slug: "spinner" },
  { name: "Tooltip", slug: "tooltip" },
  { name: "Slider", slug: "slider" },
  { name: "Search Bar", slug: "search-bar" },
  { name: "Password Input", slug: "password-input" },
  { name: "Segmented Control", slug: "segmented-control" },
];

const toolsPages = [
  { name: "Screens Gallery", slug: "screens" },
  { name: "User Flows", slug: "flows" },
  { name: "AI Prompts", slug: "prompts" },
  { name: "Playground", slug: "playground" },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [foundationsOpen, setFoundationsOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(true);
  const [baseOpen, setBaseOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);
  const [primitivesOpen, setPrimitivesOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 transform border-r border-[var(--chrome-border)] bg-[var(--chrome-bg)] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-[var(--chrome-border)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-default)] flex items-center justify-center">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="text-body-sm weight-medium text-[var(--chrome-text)]">MetaMask DS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-2">
            {/* Foundations Section */}
            <div>
              <button
                onClick={() => setFoundationsOpen(!foundationsOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-[var(--chrome-text)] hover:text-[var(--chrome-text)] transition-colors"
              >
                <span className="text-[var(--chrome-text)]">●</span>
                <span className="weight-medium">Foundations</span>
              </button>
              
              {foundationsOpen && (
                <div className="mt-1 ml-3">
                  {/* Token Pages */}
                  {tokenPages.map((item) => {
                    const active = isActive(`/tokens/${item.slug}`);
                    return (
                      <Link
                        key={item.slug}
                        href={`/tokens/${item.slug}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                          active 
                            ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                            : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                        }`}
                      >
                        <span className="text-[var(--chrome-text-muted)]">→</span>
                        {item.name}
                      </Link>
                    );
                  })}

                  {/* Icons */}
                  <Link
                    href="/icons"
                    onClick={onClose}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                      isActive("/icons")
                        ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                        : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                    }`}
                  >
                    <span className="text-[var(--chrome-text-muted)]">→</span>
                    Icons
                  </Link>

                  {/* Canvas */}
                  <Link
                    href="/canvas"
                    onClick={onClose}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                      isActive("/canvas")
                        ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                        : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                    }`}
                  >
                    <span className="text-[var(--chrome-text-muted)]">→</span>
                    Canvas
                  </Link>
                </div>
              )}
            </div>

            {/* Tools Section */}
            <div className="mt-4">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-[var(--chrome-text)] hover:text-[var(--chrome-text)] transition-colors"
              >
                <span className="text-[var(--color-primary-default)]">★</span>
                <span className="weight-medium">Tools</span>
              </button>
              
              {toolsOpen && (
                <div className="mt-1 ml-3">
                  {toolsPages.map((item) => {
                    const active = isActive(`/${item.slug}`);
                    return (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                          active 
                            ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                            : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                        }`}
                      >
                        <span className="text-[var(--chrome-text-muted)]">→</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Base Components Section */}
            <div className="mt-4">
              <button
                onClick={() => setBaseOpen(!baseOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-[var(--chrome-text)] hover:text-[var(--chrome-text)] transition-colors"
              >
                <span className="text-[var(--chrome-text)]">●</span>
                <span className="weight-medium">Base components</span>
              </button>
              
              {baseOpen && (
                <div className="mt-1 ml-3">
                  {baseComponents.map((item) => {
                    const active = isActive(`/components/${item.slug}`);
                    return (
                      <Link
                        key={item.slug}
                        href={`/components/${item.slug}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                          active 
                            ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                            : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                        }`}
                      >
                        <span className="text-[var(--chrome-text-muted)]">→</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Components Section */}
            <div className="mt-4">
              <button
                onClick={() => setComponentsOpen(!componentsOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-[var(--chrome-text)] hover:text-[var(--chrome-text)] transition-colors"
              >
                <span className="text-[var(--chrome-text)]">●</span>
                <span className="weight-medium">Components</span>
              </button>
              
              {componentsOpen && (
                <div className="mt-1 ml-3">
                  {components.map((item) => {
                    const active = isActive(`/components/${item.slug}`);
                    return (
                      <Link
                        key={item.slug}
                        href={`/components/${item.slug}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                          active 
                            ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                            : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                        }`}
                      >
                        <span className="text-[var(--chrome-text-muted)]">→</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Primitives Section */}
            <div className="mt-4">
              <button
                onClick={() => setPrimitivesOpen(!primitivesOpen)}
                className="flex items-center gap-2 w-full px-3 py-2 text-body-sm text-[var(--chrome-text)] hover:text-[var(--chrome-text)] transition-colors"
              >
                <span className="text-[var(--chrome-text)]">●</span>
                <span className="weight-medium">Primitives</span>
              </button>
              
              {primitivesOpen && (
                <div className="mt-1 ml-3">
                  {primitives.map((item) => {
                    const active = isActive(`/components/${item.slug}`);
                    return (
                      <Link
                        key={item.slug}
                        href={`/components/${item.slug}`}
                        onClick={onClose}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                          active 
                            ? "bg-[var(--chrome-bg-subtle)] text-[var(--chrome-text)] weight-medium" 
                            : "text-[var(--chrome-text-muted)] hover:bg-[var(--chrome-bg-subtle)] hover:text-[var(--chrome-text)]"
                        }`}
                      >
                        <span className="text-[var(--chrome-text-muted)]">→</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--chrome-border)]">
            <div className="flex items-center justify-between">
              <span className="text-body-xs text-[var(--chrome-text-muted)]">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
