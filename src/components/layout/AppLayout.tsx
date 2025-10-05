"use client";

import { cn } from "@/lib/utils";
import {
  BookOpenText,
  CalendarDays,
  HelpCircle,
  Home,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/", label: "Home", icon: <Home className="size-5" /> },
  { href: "/ask-a-mentor", label: "Ask a Mentor", icon: <HelpCircle className="size-5" /> },
  { href: "/support-circles", label: "Support Circles", icon: <Users className="size-5" /> },
  { href: "/your-story", label: "Your Story", icon: <BookOpenText className="size-5" /> },
  { href: "/upcoming-events", label: "Upcoming Events", icon: <CalendarDays className="size-5" /> },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
       <main className="flex-1 p-4 sm:p-6 pb-24">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-xl border-t border-white/20 z-20">
        <div className="container mx-auto h-full grid grid-cols-5 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-sm font-medium transition-all duration-300 relative h-full",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-primary"
                )}
              >
                <div className={cn(
                  "absolute top-0 h-1 w-10 rounded-b-full bg-accent transition-all duration-300",
                  isActive ? "opacity-100 scale-100 shadow-glowing" : "opacity-0 scale-0"
                )}></div>
                <div className={cn(
                  "p-2 rounded-full transition-all duration-300",
                   isActive ? "bg-accent/10" : "bg-transparent"
                )}>
                  {item.icon}
                </div>
                <span className={cn("text-xs", isActive ? "font-bold" : "font-medium")}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  );
}
