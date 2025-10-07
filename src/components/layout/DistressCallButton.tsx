
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
import { Button } from "../ui/button";
import { Siren } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useFirebase } from "@/firebase/provider";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export function DistressCallButton() {
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

    const distressData = {
      userId: user.uid,
      timestamp: serverTimestamp(),
      location: 'Mock Location', // In a real app, you'd get this with user permission
    };

    const distressCollectionRef = collection(db, 'distressCalls');

    addDoc(distressCollectionRef, distressData).then(() => {
       toast({
        title: 'Distress Signal Sent',
        description: 'Help is on the way. A support member has been notified.',
      });
    }).catch((error) => {
        const permissionError = new FirestorePermissionError({
          path: distressCollectionRef.path,
          operation: 'create',
          requestResourceData: distressData,
        });
        errorEmitter.emit('permission-error', permissionError);
         toast({
            variant: 'destructive',
            title: 'Failed to Send Signal',
            description: 'Could not send distress signal. Please try again.',
        });
    });
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
