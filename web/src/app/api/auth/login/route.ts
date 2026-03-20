// ---------------------------------------------------------------------------
// POST /api/auth/login — Authenticate user
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { getAuth, AuthError } from "@/lib/auth";
import type { LoginRequest, AuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LoginRequest>;

    const auth = getAuth();
    const { user, token } = await auth.login({
      email: body.email ?? "",
      password: body.password ?? "",
    });

    const res: AuthResponse = {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
