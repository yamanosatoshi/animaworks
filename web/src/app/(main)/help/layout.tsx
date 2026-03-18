import React from "react";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a14" }}>
      {children}
    </div>
  );
}
