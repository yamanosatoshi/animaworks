import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-page-bg">
      {/* Sidebar: 64px fixed width, dark background */}
      <Sidebar />
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto bg-page-bg">
        {children}
      </main>
    </div>
  );
}
