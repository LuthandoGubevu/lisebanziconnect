
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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";


const navItems = [
  { href: "/ask-a-mentor", label: "Ask a Mentor", icon: <HelpCircle className="size-5" /> },
  { href: "/support-circles", label: "Support Circles", icon: <HeartHandshake className="size-5" /> },
  { href: "/my-story", label: "My Story", icon: <BookUser className="size-5" /> },
  { href: "/community-stories", label: "Community Stories", icon: <Users className="size-5" /> },
  { href: "/upcoming-events", label: "Upcoming Events", icon: <CalendarDays className="size-5" /> },
  { href: "/education-hub", label: "Education Hub", icon: <GraduationCap className="size-5" /> },
  { href: "/leadership-path", label: "Leadership Path", icon: <TrendingUp className="size-5" /> },
  { href: "/insights", label: "Insights", icon: <BarChart3 className="size-5" /> },
  { href: "/policy-feedback", label: "Policy Feedback", icon: <MessageSquareQuote className="size-5" /> },
];

function DistressCallButton() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { db } = useFirebase();

  const handleDistressCall = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to send a distress call.',
      });
      return;
    }
    try {
      // Mock notification: save to a 'distressCalls' collection
      await addDoc(collection(db, 'distressCalls'), {
        userId: user.uid,
        timestamp: serverTimestamp(),
        location: 'Mock Location', // In a real app, you'd get this with user permission
      });
      toast({
        title: 'Distress Signal Sent',
        description: 'Help is on the way. A support member has been notified.',
      });
    } catch (error) {
      console.error('Error sending distress call:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Send Signal',
        description: 'Could not send distress signal. Please try again.',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="fixed bottom-6 right-6 z-20 h-16 w-16 rounded-full shadow-2xl animate-pulse"
        >
          <Siren className="h-8 w-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Distress Call</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately notify our support team that you are in need of
            urgent assistance. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDistressCall}>
            Yes, Send Signal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  
  return (
    <>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader className="flex items-center justify-between">
            <Link href="/ask-a-mentor" className="flex items-center gap-2 font-bold text-xl">
            <Siren className="size-6 text-blue-600" />
            <span>Lisebanzi</span>
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
                        tooltip={{ children: item.label }}
                        className="justify-start"
                    >
                        <Link href={item.href} onClick={() => { if (isMobile) setOpenMobile(false)}}>
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                );
                })}
            </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 pb-24">{children}</main>
        <DistressCallButton />
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
