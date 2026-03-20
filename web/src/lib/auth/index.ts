// ---------------------------------------------------------------------------
// Auth — re-exports & singleton
// ---------------------------------------------------------------------------

export type {
  AuthProvider,
  AuthResponse,
  LoginRequest,
  PublicUser,
  RegisterRequest,
  StoredUser,
} from "./types";

export { AuthError } from "./in-memory-auth";
export { SupabaseAuth } from "./supabase-auth";

import { SupabaseAuth } from "./supabase-auth";
import type { AuthProvider } from "./types";

// ---------------------------------------------------------------------------
// Singleton — Supabase Auth (production)
// ---------------------------------------------------------------------------

let _instance: AuthProvider | null = null;

export function getAuth(): AuthProvider {
  if (!_instance) {
    _instance = new SupabaseAuth();
  }
  return _instance;
}
