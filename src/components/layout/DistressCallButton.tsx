
"use client";

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
import { Siren } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFirebase } from "@/firebase/provider";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";

export function DistressCallButton() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { db } = useFirebase();

  const handleDistressCall = async () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'This feature is not yet configured. You will be notified when it is available.',
    });
  };

  return (
    <AlertDialog>
      <SidebarMenuItem>
         <AlertDialogTrigger asChild>
            <SidebarMenuButton
              variant="destructive"
              className="justify-start bg-red-600/15 text-red-600 hover:bg-red-600/25 hover:text-red-700"
              tooltip={{ children: "Distress Call" }}
            >
                <Siren className="size-5" />
                <span className="group-data-[collapsible=icon]:hidden">Distress Call</span>
            </SidebarMenuButton>
          </AlertDialogTrigger>
      </SidebarMenuItem>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Distress Call</AlertDialogTitle>
          <AlertDialogDescription>
            This feature is intended to notify our support team that you are in need of
            urgent assistance. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDistressCall} className="bg-red-600 hover:bg-red-700">
            Yes, Send Signal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
