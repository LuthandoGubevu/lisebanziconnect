
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

// This component is for development-time debugging of Firestore security rules.
// It should not be included in a production build.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error(
        'Firestore Permission Error caught by listener:',
        error.toString()
      );

      // In a development environment, we can throw the error to leverage
      // the Next.js error overlay for a better debugging experience.
      if (process.env.NODE_ENV === 'development') {
        // This will be caught by Next.js's error boundary and displayed in the overlay.
        throw new Error(error.toString());
      } else {
        // In production, you might want to show a generic toast notification
        // and log the detailed error to a monitoring service.
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description:
            'You do not have permission to perform this action. Please contact support if you believe this is an error.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
