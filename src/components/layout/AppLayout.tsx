"use client";

import { cn } from "@/lib/utils";
import {
  BookOpenText,
  CalendarDays,
  HelpCircle,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/", label: "Home", icon: <LayoutDashboard className="size-6"/> },
  { href: "/ask-a-mentor", label: "Ask a Mentor", icon: <HelpCircle className="size-6"/> },
  { href: "/support-circles", label: "Support Circles", icon: <Users className="size-6"/> },
  { href: "/your-story", label: "Your Story", icon: <BookOpenText className="size-6"/> },
  { href: "/upcoming-events", label: "Upcoming Events", icon: <CalendarDays className="size-6"/> },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-svh">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
        <h1 className="text-lg font-semibold md:text-xl font-headline">
          {navItems.find(item => item.href === pathname)?.label ?? 'Home'}
        </h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 overflow-auto pb-24 md:pb-28">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-background/80 backdrop-blur-sm border-t border-border z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto h-full flex justify-around items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full text-sm font-medium transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-xs md:text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
