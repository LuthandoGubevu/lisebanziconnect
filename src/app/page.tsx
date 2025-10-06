"use client";

import { useState } from "react";
import Image from "next/image";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <Card className="z-10 w-full max-w-md shadow-lg">
        <div className="flex justify-center pt-6">
          <Image
            src="/Lisebanzi Foundation .jpg"
            alt="Lisebanzi Foundation Logo"
            width={200}
            height={200}
            className="rounded-full"
          />
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isSigningUp ? "Create an Account" : "Lisebanzi Connect"}
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
