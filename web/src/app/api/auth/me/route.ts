// ---------------------------------------------------------------------------
// GET /api/auth/me — Return authenticated user info
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import type { PublicUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.slice("Bearer ".length);
  const auth = getAuth();
  const user = await auth.getUserByToken(token);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const publicUser: PublicUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  return NextResponse.json({ user: publicUser });
}
