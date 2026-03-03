"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Solution Intelligence Platform
        </Link>
      </div>
    </header>
  );
}
