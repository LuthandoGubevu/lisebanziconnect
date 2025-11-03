
"use client";

import { useState } from "react";
import Image from "next/image";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative hidden bg-gray-100 lg:flex flex-col items-center justify-center p-12 text-white text-center">
         <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541976844346-f18aeac57b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjb21tdW5pdHklMjBzdXBwb3J0fGVufDB8fHx8MTc1OTY4MDYwNXww&ixlib=rb-4.1.0&q=80&w=1080')" }}
          data-ai-hint="community support"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight">
            A Safe Space to Heal and Grow
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto">
            Join Lisebanzi Connect, a supportive community dedicated to empowering survivors, fostering connection, and inspiring hope.
          </p>
          <div className="mt-12 border-t border-white/20 pt-8">
             <h2 className="text-2xl font-semibold">Who We Are</h2>
             <p className="mt-2 text-base max-w-2xl mx-auto text-gray-200">
                Located in the heart of East London, Lisebanzi Foundation is a non-profit organization dedicated to providing comprehensive support services to individuals and communities affected by Gender-Based Violence (GBV), substance abuse, and other social and economic challenges.
             </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <Card className="z-10 w-full max-w-md shadow-xl bg-white/90 backdrop-blur-lg border-gray-200">
            <div className="flex justify-center pt-8">
              <Image
                src="/LF Logo.jpg"
                alt="Lisebanzi Foundation Logo"
                width={100}
                height={100}
                className="rounded-full shadow-md"
              />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold" style={{ color: '#682d91' }}>
                {isSigningUp ? "Create an Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {isSigningUp ? "Join our community to connect, share, and grow." : "Sign in to access your dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSigningUp ? <SignUpForm /> : <SignInForm />}
              <div className="mt-6 text-center text-sm">
                {isSigningUp ? (
                  <>
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-blue-600"
                      onClick={() => setIsSigningUp(false)}
                    >
                      Sign In
                    </Button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-blue-600"
                      onClick={() => setIsSigningUp(true)}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
