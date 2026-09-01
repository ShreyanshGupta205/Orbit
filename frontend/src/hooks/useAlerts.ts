import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface AlertFromApi {
  id: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  channel: string;
  global_status: string;
  created_at: string;
  sent_at: string;
  road_segment_id: number | null;
  road_name: string | null;
  facility_id: number | null;
  facility_name: string | null;
  district_id: number | null;
  district_name: string | null;
  target_role: string | null;
  target_user_id: string | null;
  is_read: boolean;
  read_at: string | null;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
}

export type ConnectionState = "connected" | "reconnecting" | "disconnected" | "failed";

export function useAlerts() {
  const { getToken } = useAuth();
  const [alerts, setAlerts] = useState<AlertFromApi[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [toastAlert, setToastAlert] = useState<AlertFromApi | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Authenticated fetch helper
  const apiFetch = useCallback(async (path: string, options: RequestInit = {}) => {
    let token: string | null = null;
    try {
      token = await getToken();
    } catch {
      // Fallback if no active Clerk session
    }
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
      "Content-Type": "application/json"
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE}${path}`, { ...options, headers });
  }, [getToken]);

  // Fetch alert list from REST API
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await apiFetch("/api/alerts?limit=30");
      if (res.ok) {
        const json = await res.json();
        setAlerts(json.data || []);
        const unread = (json.data || []).filter((a: AlertFromApi) => !a.is_read).length;
        setUnreadCount(unread);
      }
    } catch {
      // Keep existing list on transient fetch failure
    }
  }, [apiFetch]);

  // Mark alert as read
  const markAsRead = useCallback(async (alertId: number) => {
    try {
      const res = await apiFetch(`/api/alerts/${alertId}/read`, { method: "POST" });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch { /* silent */ }
  }, [apiFetch]);

  // Acknowledge alert
  const acknowledgeAlert = useCallback(async (alertId: number) => {
    try {
      const res = await apiFetch(`/api/alerts/${alertId}/acknowledge`, { method: "POST" });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_acknowledged: true, is_read: true } : a));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch { /* silent */ }
  }, [apiFetch]);

  // Resolve alert (Authority / Admin)
  const resolveAlert = useCallback(async (alertId: number) => {
    try {
      const res = await apiFetch(`/api/alerts/${alertId}/resolve`, { method: "PATCH" });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, global_status: "acknowledged" } : a));
      }
    } catch { /* silent */ }
  }, [apiFetch]);

  // Establish SSE Realtime Connection
  useEffect(() => {
    let active = true;

    async function initRealtime() {
      let token: string | null = null;
      try {
        token = await getToken();
      } catch {
        // No active token
      }
      if (!token || !active) return;

      // Close previous connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setConnectionState("reconnecting");
      const es = new EventSource(`${API_BASE}/api/alerts/stream?token=${encodeURIComponent(token)}`);
      eventSourceRef.current = es;

      es.addEventListener("connected", () => {
        if (active) setConnectionState("connected");
      });

      es.addEventListener("alert", (event: MessageEvent) => {
        try {
          const newAlert: AlertFromApi = JSON.parse(event.data);
          if (active) {
            setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
            setUnreadCount(prev => prev + 1);
            // Trigger toast for high or critical alerts
            if (newAlert.severity === "high" || newAlert.severity === "critical") {
              setToastAlert(newAlert);
            }
          }
        } catch { /* ignore parse error */ }
      });

      es.onerror = () => {
        if (active) {
          setConnectionState("disconnected");
          es.close();
        }
      };
    }

    initRealtime();
    fetchAlerts();

    // Fallback polling interval (every 12s) to guarantee UI consistency
    const pollInterval = setInterval(() => {
      if (active) fetchAlerts();
    }, 12000);

    return () => {
      active = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [getToken, fetchAlerts]);

  return {
    alerts,
    unreadCount,
    connectionState,
    toastAlert,
    dismissToast: () => setToastAlert(null),
    fetchAlerts,
    markAsRead,
    acknowledgeAlert,
    resolveAlert
  };
}
