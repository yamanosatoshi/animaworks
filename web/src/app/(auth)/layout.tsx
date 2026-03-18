import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #E8EEFF 0%, #F5E8FF 50%, #FFE8F5 100%)" }}
    >
      {children}
    </div>
  );
}
