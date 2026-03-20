// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

/** Stored user record */
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  createdAt: string; // ISO 8601
}

/** Session token record */
export interface AuthSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

/** Public user info returned by API (no sensitive fields) */
export interface PublicUser {
  id: string;
  email: string;
  name: string;
}

/** Register request body */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  plan?: string;
}

/** Login request body */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Auth response (register / login) */
export interface AuthResponse {
  user: PublicUser;
  token: string;
}

// ---------------------------------------------------------------------------
// Abstract interface — swap in Supabase Auth later
// ---------------------------------------------------------------------------

export interface AuthProvider {
  /** Create a new user account */
  register(req: RegisterRequest): Promise<{ user: StoredUser; token: string }>;

  /** Authenticate with email + password */
  login(req: LoginRequest): Promise<{ user: StoredUser; token: string }>;

  /** Resolve a bearer token to the owning user (null = invalid) */
  getUserByToken(token: string): Promise<StoredUser | null>;
}
