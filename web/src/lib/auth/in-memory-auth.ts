// ---------------------------------------------------------------------------
// InMemoryAuth — Stub AuthProvider for local / prototype development
// ---------------------------------------------------------------------------

import type {
  AuthProvider,
  AuthSession,
  LoginRequest,
  RegisterRequest,
  StoredUser,
} from "./types";

/** Simple email-format validator */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Password must be ≥ 8 chars with at least one letter and one digit */
function isStrongPassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);
}

/** Generate a pseudo-random token (NOT cryptographic — fine for dev stub) */
function generateToken(): string {
  const seg = () =>
    Math.random().toString(36).substring(2, 10);
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class InMemoryAuth implements AuthProvider {
  private users: StoredUser[] = [];
  /** email → hashed password (plain text in stub — never do this in prod) */
  private passwords = new Map<string, string>();
  private sessions: AuthSession[] = [];
  private nextId = 1;

  // -----------------------------------------------------------------------
  // register
  // -----------------------------------------------------------------------
  async register(req: RegisterRequest): Promise<{ user: StoredUser; token: string }> {
    // --- validation --------------------------------------------------------
    if (!req.email || !isValidEmail(req.email)) {
      throw new AuthError("Invalid email format", 400);
    }
    if (!req.password || !isStrongPassword(req.password)) {
      throw new AuthError(
        "Password must be at least 8 characters with letters and numbers",
        400,
      );
    }
    if (!req.name || req.name.trim().length === 0) {
      throw new AuthError("Name is required", 400);
    }

    // --- duplicate check ---------------------------------------------------
    if (this.users.some((u) => u.email === req.email)) {
      throw new AuthError("Email already registered", 409);
    }

    // --- create user -------------------------------------------------------
    const user: StoredUser = {
      id: `user_${this.nextId++}`,
      email: req.email,
      name: req.name.trim(),
      plan: req.plan ?? "team",
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.passwords.set(req.email, req.password);

    // --- create session ----------------------------------------------------
    const token = generateToken();
    this.sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return { user, token };
  }

  // -----------------------------------------------------------------------
  // login
  // -----------------------------------------------------------------------
  async login(req: LoginRequest): Promise<{ user: StoredUser; token: string }> {
    if (!req.email || !req.password) {
      throw new AuthError("Email and password are required", 400);
    }

    const stored = this.passwords.get(req.email);
    if (!stored || stored !== req.password) {
      throw new AuthError("Invalid email or password", 401);
    }

    const user = this.users.find((u) => u.email === req.email);
    if (!user) {
      throw new AuthError("Invalid email or password", 401);
    }

    const token = generateToken();
    this.sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return { user, token };
  }

  // -----------------------------------------------------------------------
  // getUserByToken
  // -----------------------------------------------------------------------
  async getUserByToken(token: string): Promise<StoredUser | null> {
    const session = this.sessions.find(
      (s) => s.token === token && new Date(s.expiresAt) > new Date(),
    );
    if (!session) return null;
    return this.users.find((u) => u.id === session.userId) ?? null;
  }
}

// ---------------------------------------------------------------------------
// AuthError — carries HTTP status code
// ---------------------------------------------------------------------------

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
