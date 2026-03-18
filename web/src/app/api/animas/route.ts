// ---------------------------------------------------------------------------
// GET /api/animas — List all characters
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";

export async function GET() {
  try {
    const storage = getStorage();
    const animas = await storage.listAnimas();

    // Omit systemPrompt from the public listing
    const publicAnimas = animas.map(({ systemPrompt: _, ...rest }) => rest);

    return NextResponse.json({ animas: publicAnimas });
  } catch (error) {
    console.error("[GET /api/animas]", error);
    return NextResponse.json(
      { error: "Failed to fetch animas" },
      { status: 500 },
    );
  }
}
