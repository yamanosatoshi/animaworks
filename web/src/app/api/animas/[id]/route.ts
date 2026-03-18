// ---------------------------------------------------------------------------
// GET /api/animas/[id] — Character detail
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import { getStorage } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const storage = getStorage();
    const anima = await storage.getAnima(id);

    if (!anima) {
      return NextResponse.json(
        { error: "Anima not found" },
        { status: 404 },
      );
    }

    // Omit systemPrompt from the public response
    const { systemPrompt: _, ...publicAnima } = anima;
    return NextResponse.json(publicAnima);
  } catch (error) {
    console.error("[GET /api/animas/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch anima" },
      { status: 500 },
    );
  }
}
