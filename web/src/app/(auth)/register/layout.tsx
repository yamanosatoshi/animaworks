"use client";

import React from "react";
import { RegistrationProvider } from "@/context/RegistrationContext";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
