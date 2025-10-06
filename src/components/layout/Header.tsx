
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:px-6">
       <SidebarTrigger className="md:hidden"/>
        <div className="flex-1">
            {/* Can add search or other header elements here */}
        </div>
      {/* User profile button can go here */}
    </header>
  );
}
