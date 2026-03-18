// ---------------------------------------------------------------------------
// GET /api/rooms/[id]/stream — SSE endpoint for real-time message updates
// ---------------------------------------------------------------------------
//
// This endpoint provides a persistent SSE connection that pushes new messages
// to connected clients. In production this would be backed by Supabase
// Realtime or a pub/sub system. The stub implementation sends a heartbeat
// every 15 seconds to keep the connection alive and demonstrates the SSE
// format the frontend should expect.
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: roomId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send an initial "connected" event
      const connectData = JSON.stringify({
        type: "connected",
        roomId,
        timestamp: new Date().toISOString(),
      });
      controller.enqueue(encoder.encode(`data: ${connectData}\n\n`));

      // Heartbeat every 15 seconds to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = JSON.stringify({
            type: "heartbeat",
            timestamp: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${heartbeat}\n\n`));
        } catch {
          // Controller closed — clean up
          clearInterval(heartbeatInterval);
        }
      }, 15_000);

      // Clean up when the client disconnects
      // In Next.js App Router, we detect this via the request signal
      // or simply let the heartbeat error out
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
