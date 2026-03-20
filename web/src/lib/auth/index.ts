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

export { InMemoryAuth, AuthError } from "./in-memory-auth";

import { InMemoryAuth } from "./in-memory-auth";
import type { AuthProvider } from "./types";

// ---------------------------------------------------------------------------
// Singleton — swap to SupabaseAuth when ready
// ---------------------------------------------------------------------------

let _instance: AuthProvider | null = null;

export function getAuth(): AuthProvider {
  if (!_instance) {
    _instance = new InMemoryAuth();
  }
  return _instance;
}
