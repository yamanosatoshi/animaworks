"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistrationState {
  // Step 1: Basic info
  email: string;
  password: string;
  username: string;
  orgName: string;
  googleConnected: boolean;
  microsoftConnected: boolean;
  // Step 2: Plan selection
  selectedPlan: string;
  // Step 3: Member / team
  teamName: string;
  teamSlug: string;
  teamSize: string;
  invitedEmails: string[];
  // Step 4: Robot
  robotName: string;
  personality: string;
  specializations: string[];
  instructions: string;
}

type Action =
  | { type: "SET"; field: keyof RegistrationState; value: RegistrationState[keyof RegistrationState] }
  | { type: "RESET" };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "hicrew_registration";

const initial: RegistrationState = {
  email: "",
  password: "",
  username: "",
  orgName: "",
  googleConnected: false,
  microsoftConnected: false,
  selectedPlan: "team",
  teamName: "",
  teamSlug: "",
  teamSize: "1-5",
  invitedEmails: [],
  robotName: "",
  personality: "professional",
  specializations: [],
  instructions: "",
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: RegistrationState, action: Action): RegistrationState {
  if (action.type === "SET") return { ...state, [action.field]: action.value };
  if (action.type === "RESET") return initial;
  return state;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface RegistrationContextValue {
  state: RegistrationState;
  set: (field: keyof RegistrationState, value: RegistrationState[keyof RegistrationState]) => void;
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial, (init) => {
    if (typeof window === "undefined") return init;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...init, ...JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const set = (
    field: keyof RegistrationState,
    value: RegistrationState[keyof RegistrationState],
  ) => {
    dispatch({ type: "SET", field, value });
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  };

  return (
    <RegistrationContext.Provider value={{ state, set, reset }}>
      {children}
    </RegistrationContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRegistration(): RegistrationContextValue {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Plan metadata helper
// ---------------------------------------------------------------------------

export const PLAN_META: Record<string, { name: string; price: string; credit: string }> = {
  starter: { name: "Starter", price: "¥9,800", credit: "5,000" },
  team:    { name: "Team",    price: "¥29,800", credit: "20,000" },
  enterprise: { name: "Enterprise", price: "¥98,000", credit: "50,000" },
};
