"use client";

import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Lisebanzi Connect Logo"
            width={160}
            height={40}
            priority
            className="h-8 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
