import { useAuth } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Authenticated fetch helper – injects Clerk bearer token automatically.
 */
export function useApi() {
  const { getToken } = useAuth();

  async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
    let token: string | null = null;
    try {
      token = await getToken();
    } catch {
      // Fallback if no active Clerk session in local/demo mode
    }
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }
    return fetch(`${API_BASE}${path}`, { ...options, headers });
  }

  return { apiFetch };
}

// ——— Incident Types ——————————————————————

export interface IncidentFromApi {
  id: number;
  type: string;
  severity: string;
  roadSegmentId: number | null;
  roadName: string | null;
  districtId: number | null;
  districtName: string | null;
  reportedBy: string;
  reportedAt: string;
  description: string;
  photoUrl: string | null;
  verified: boolean;
  resolutionTime: number | null;
  resolvedAt: string | null;
  geometry: {
    type: string;
    coordinates: [number, number];
  } | null;
}

export interface IncidentListResponse {
  success: boolean;
  count: number;
  data: IncidentFromApi[];
}

export interface IncidentSingleResponse {
  success: boolean;
  data: IncidentFromApi;
}

export interface UploadResponse {
  success: boolean;
  url: string;
}
