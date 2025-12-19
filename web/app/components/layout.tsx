"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function ComponentsLayout({
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

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="lg:pl-56 min-h-screen transition-all duration-200">
        <div className="px-6 py-12 pt-20 lg:px-8 lg:py-16 lg:pt-16">
          {children}
        </div>
      </main>
    </div>
  );
}
