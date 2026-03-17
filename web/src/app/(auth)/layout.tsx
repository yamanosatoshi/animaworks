import React from "react";
import { AuthHeader } from "@/components/layout/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-purple-100">
      <AuthHeader />
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        {children}
      </main>
    </div>
  );
}
