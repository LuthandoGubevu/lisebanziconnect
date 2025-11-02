"use client";

import { useState } from "react";
import Image from "next/image";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  // This page does not need to check auth status.
  // The protected routes will handle redirection if the user is already logged in.

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="z-10 w-full max-w-md shadow-lg bg-white">
        <div className="flex justify-center pt-6">
          <Image
            src="/LF Logo.jpg"
            alt="Lisebanzi Foundation Logo"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold" style={{ color: '#682d91' }}>
            {isSigningUp ? "Create an Account" : "Welcome to Lisebanzi Connect"}
          </CardTitle>
          <CardDescription>
            {isSigningUp ? "Join our community to connect, share, and grow." : "Sign in to access your dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSigningUp ? <SignUpForm /> : <SignInForm />}
          <div className="mt-4 text-center text-sm">
            {isSigningUp ? (
              <>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-bold"
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
                  className="p-0 h-auto font-bold"
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
  );
}
