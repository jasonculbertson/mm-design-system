import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MetaMask DS",
  description: "MetaMask Design System - Component library and design reference for building MetaMask interfaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storageKey = 'metamask-ds-theme';
                const root = document.documentElement;
                const theme = localStorage.getItem(storageKey) || 'dark';
                root.classList.remove('light', 'dark');
                root.classList.add(theme);
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased surface-default text-default">
        <ThemeProvider defaultTheme="dark" storageKey="metamask-ds-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
