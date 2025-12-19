"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TokensLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="chrome-bg chrome-text min-h-screen">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[var(--chrome-bg)] border border-[var(--chrome-border)] p-2 text-[var(--chrome-text)] lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Theme toggle - top right */}
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="lg:pl-56 min-h-screen transition-all duration-200">
        <div className="mx-auto max-w-3xl px-6 py-12 pt-20 lg:px-8 lg:py-16 lg:pt-16">
          {children}
        </div>
      </main>
    </div>
  );
}
