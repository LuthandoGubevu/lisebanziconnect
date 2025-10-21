
"use client";

import { cn } from "@/lib/utils";
import {
  BookOpenText,
  CalendarDays,
  HelpCircle,
  Users,
  LayoutDashboard,
  BookUser,
  HeartHandshake,
  GraduationCap,
  TrendingUp,
  BarChart3,
  MessageSquareQuote,
  PanelLeft,
  Siren,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Header } from "./Header";
import { useAuth } from "@/hooks/useAuth";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DistressCallButton } from "./DistressCallButton";
import { useFirebase } from "@/firebase/provider";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";


const navItems = [
  { href: "/support-circles", label: "Support Circles", icon: <HeartHandshake className="size-5" /> },
  { href: "/my-story", label: "My Story", icon: <BookUser className="size-5" /> },
  { href: "/community-stories", label: "Community Stories", icon: <Users className="size-5" /> },
  { href: "/upcoming-events", label: "Upcoming Events", icon: <CalendarDays className="size-5" /> },
  { href: "/education-hub", label: "Education Hub", icon: <GraduationCap className="size-5" /> },
  { href: "/leadership-path", label: "Leadership Path", icon: <TrendingUp className="size-5" /> },
  { href: "/insights", label: "Insights", icon: <BarChart3 className="size-5" /> },
  { href: "/policy-feedback", label: "Policy Feedback", icon: <MessageSquareQuote className="size-5" /> },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { auth } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed out successfully." });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to sign out.",
        description: "An error occurred while signing out. Please try again.",
      });
    }
  };
  
  return (
    <>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span className="group-data-[collapsible=icon]:hidden">Lisebanzi</span>
            </Link>
            {isMobile && <SidebarTrigger />}
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={{ children: item.label, side: "right" }}
                        className="justify-start"
                        onClick={() => { if (isMobile) setOpenMobile(false)}}
                    >
                        <Link href={item.href}>
                          {item.icon}
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                );
                })}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <DistressCallButton />
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} tooltip={{ children: "Log Out", side: "right" }} className="justify-start">
                <LogOut className="size-5" />
                <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 pb-24">{children}</main>
      </SidebarInset>
    </>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
