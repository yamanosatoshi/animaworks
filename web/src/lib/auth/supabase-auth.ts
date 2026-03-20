// ---------------------------------------------------------------------------
// SupabaseAuth — AuthProvider backed by Supabase Auth
// ---------------------------------------------------------------------------

import { getSupabaseClient } from "../supabase";
import { AuthError } from "./in-memory-auth";
import type {
  AuthProvider,
  LoginRequest,
  RegisterRequest,
  StoredUser,
} from "./types";

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class SupabaseAuth implements AuthProvider {
  // -----------------------------------------------------------------------
  // register
  // -----------------------------------------------------------------------
  async register(
    req: RegisterRequest,
  ): Promise<{ user: StoredUser; token: string }> {
    // --- basic validation (fast-fail before hitting Supabase) -------------
    if (!req.email || !req.password) {
      throw new AuthError("Email and password are required", 400);
    }
    if (!req.name || req.name.trim().length === 0) {
      throw new AuthError("Name is required", 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email: req.email,
      password: req.password,
      options: {
        data: {
          name: req.name.trim(),
          plan: req.plan ?? "team",
        },
      },
    });

    if (error) {
      // Map common Supabase errors to appropriate status codes
      const status = error.status ?? 400;
      throw new AuthError(error.message, status);
    }

    if (!data.user || !data.session) {
      throw new AuthError(
        "Registration succeeded but no session returned (email confirmation may be required)",
        400,
      );
    }

    const user: StoredUser = {
      id: data.user.id,
      email: data.user.email ?? req.email,
      name: (data.user.user_metadata?.name as string) ?? req.name.trim(),
      plan: (data.user.user_metadata?.plan as string) ?? req.plan ?? "team",
      createdAt: data.user.created_at,
    };

    return { user, token: data.session.access_token };
  }

  // -----------------------------------------------------------------------
  // login
  // -----------------------------------------------------------------------
  async login(
    req: LoginRequest,
  ): Promise<{ user: StoredUser; token: string }> {
    if (!req.email || !req.password) {
      throw new AuthError("Email and password are required", 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: req.email,
      password: req.password,
    });

    if (error) {
      // 400 from Supabase usually means "Invalid login credentials"
      const status = error.status ?? 401;
      throw new AuthError(error.message, status);
    }

    if (!data.user || !data.session) {
      throw new AuthError("Login failed: no session returned", 401);
    }

    const user: StoredUser = {
      id: data.user.id,
      email: data.user.email ?? req.email,
      name: (data.user.user_metadata?.name as string) ?? "",
      plan: (data.user.user_metadata?.plan as string) ?? "team",
      createdAt: data.user.created_at,
    };

    return { user, token: data.session.access_token };
  }

  // -----------------------------------------------------------------------
  // getUserByToken
  // -----------------------------------------------------------------------
  async getUserByToken(token: string): Promise<StoredUser | null> {
    if (!token) return null;

    const supabase = getSupabaseClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? "",
      name: (user.user_metadata?.name as string) ?? "",
      plan: (user.user_metadata?.plan as string) ?? "team",
      createdAt: user.created_at,
    };
  }
}
