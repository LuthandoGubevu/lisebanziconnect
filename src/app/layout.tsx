
"use client";

import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { Inter } from 'next/font/google';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


// export const metadata: Metadata = {
//   title: 'LisebanziConnect',
//   description: 'A supportive community for connection and growth.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/';

  if (loading) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
                <div className="flex items-center justify-center h-screen">
                    <Skeleton className="h-20 w-20 rounded-full" />
                </div>
            </body>
        </html>
    )
  }

  return (
    <html lang="en">
      <head>
         <title>LisebanziConnect</title>
         <meta name="description" content="A supportive community for connection and growth." />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        {user && !isAuthPage ? (
          <AppLayout>
            {children}
          </AppLayout>
        ) : (
          children
        )}
        <Toaster />
      </body>
    </html>
  );
}
