
"use client";

import { useState } from "react";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg bg-white/80 backdrop-blur-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSigningUp ? "Create an Account" : "Welcome Back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSigningUp ? <SignUpForm /> : <SignInForm />}
          <div className="mt-4 text-center text-sm">
            {isSigningUp ? (
              <>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
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
                  className="p-0 h-auto"
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
