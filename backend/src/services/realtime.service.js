/**
 * Real-Time Event Delivery Layer via Server-Sent Events (SSE)
 * Maintains active authenticated connections and streams live alerts.
 */

// Active SSE client connections: Set of { userId, role, districtId, res }
const clients = new Set();

/**
 * Register a new authenticated SSE client connection.
 */
export function registerSSEClient(req, res, user) {
  // Set SSE HTTP response headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "X-Accel-Buffering": "no" // Disable proxy buffering for Nginx/Vercel
  });

  const client = {
    userId: user.id,
    role: user.role || "citizen",
    districtId: req.query.districtId ? parseInt(req.query.districtId, 10) : null,
    res
  };

  clients.add(client);

  // Send initial connection ACK event
  res.write(`event: connected\ndata: ${JSON.stringify({
    status: "connected",
    userId: user.id,
    role: user.role,
    timestamp: new Date().toISOString()
  })}\n\n`);

  // Handle client disconnect
  req.on("close", () => {
    clients.delete(client);
  });
}

/**
 * Broadcast an alert to targeted active SSE clients based on role and location.
 */
export function broadcastRealtimeAlert(alert) {
  const payload = `event: alert\ndata: ${JSON.stringify(alert)}\n\n`;

  for (const client of clients) {
    try {
      // 1. If alert targeted to specific user ID
      if (alert.target_user_id && alert.target_user_id !== client.userId) {
        continue;
      }

      // 2. Role-based targeting check
      if (alert.target_role) {
        const targetRoles = alert.target_role.split(",").map(r => r.trim());
        // Admin receives all alerts; otherwise check matching role
        if (client.role !== "admin" && !targetRoles.includes(client.role)) {
          continue;
        }
      }

      // 3. Location-based targeting check (if alert is scoped to a specific district)
      if (alert.district_id && client.districtId && alert.district_id !== client.districtId) {
        // Admin and Authority bypass district filtering
        if (client.role !== "admin" && client.role !== "authority") {
          continue;
        }
      }

      // Deliver event over SSE stream
      client.res.write(payload);
    } catch {
      // Remove dead connection
      clients.delete(client);
    }
  }
}

// Keep-alive heartbeat every 25 seconds to prevent browser/proxy timeouts
setInterval(() => {
  for (const client of clients) {
    try {
      client.res.write(":ping\n\n");
    } catch {
      clients.delete(client);
    }
  }
}, 25000);

export default {
  registerSSEClient,
  broadcastRealtimeAlert
};
