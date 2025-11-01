"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthLayout>
            <AppLayout>{children}</AppLayout>
        </AuthLayout>
    );
}
