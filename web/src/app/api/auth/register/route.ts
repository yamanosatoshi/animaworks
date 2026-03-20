// ---------------------------------------------------------------------------
// POST /api/auth/register — Create a new user account
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { getAuth, AuthError } from "@/lib/auth";
import type { RegisterRequest, AuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<RegisterRequest>;

    const auth = getAuth();
    const { user, token } = await auth.register({
      email: body.email ?? "",
      password: body.password ?? "",
      name: body.name ?? "",
      plan: body.plan,
    });

    const res: AuthResponse = {
      user: { id: user.id, email: user.email, name: user.name },
      token,
    };

    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
