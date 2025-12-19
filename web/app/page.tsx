import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="chrome-bg chrome-text relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      {/* Theme toggle */}
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/metamask-fox.svg"
          alt="MetaMask"
          width={80}
          height={80}
          priority
        />

        <h1 className="mt-10 text-display-md weight-medium text-[var(--chrome-text)] tracking-tight">
          MetaMask Design System
        </h1>

        <p className="mt-4 max-w-md text-body-lg text-[var(--chrome-text-muted)]">
          Component library and design reference for building MetaMask interfaces.
        </p>

        <Link
          href="/components/token-cell"
          className="group mt-12 inline-flex items-center gap-2 text-body-md text-[var(--chrome-accent)] hover:opacity-80 transition-opacity"
        >
          Explore Components
          <ArrowRight
            size={18}
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
