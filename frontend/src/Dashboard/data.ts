export interface Road {
  road: string;
  district: string;
  status: "High Risk" | "Moderate" | "Normal";
  updated: string;
  lat: number;
  lng: number;
  statusText?: string;
}

export interface LiveUpdate {
  time: string;
  road: string;
  title: string;
  detail: string;
  type: "danger" | "warning" | "success";
  titleText?: string;
  detailText?: string;
}

export interface AlertItem {
  title: string;
  location: string;
  age: string;
  type: "danger" | "warning" | "success";
}

export interface MapMarkerItem {
  id: number;
  lat: number;
  lng: number;
  type: "danger" | "warning" | "success" | "vehicle";
  layer: "incidents" | "roads" | "weather" | "vehicles";
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: "road" | "incident" | "vehicle" | "shipment";
  tone: "green" | "yellow";
}

export interface DistrictData {
  center: [number, number];
  zoom: number;
  stats: StatItem[];
  roads: Road[];
  liveUpdates: LiveUpdate[];
  alerts: AlertItem[];
  markers: MapMarkerItem[];
}

export const districtDataMap: Record<string, DistrictData> = {
  "Dima Hasao": {
    center: [25.18, 93.02],
    zoom: 9,
    stats: [
      { value: "08", label: "Critical Roads", icon: "road", tone: "yellow" },
      { value: "14", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "27", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "42", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-15", district: "Dima Hasao", status: "High Risk", updated: "2 min ago", lat: 25.53, lng: 93.05 },
      { road: "NH-37", district: "Dima Hasao", status: "Normal", updated: "12 min ago", lat: 25.68, lng: 93.05 },
      { road: "SH-12", district: "Dima Hasao", status: "Moderate", updated: "15 min ago", lat: 25.19, lng: 93.02 },
      { road: "NH-54", district: "Dima Hasao", status: "High Risk", updated: "22 min ago", lat: 25.32, lng: 92.95 },
      { road: "Haflong Bypass", district: "Dima Hasao", status: "Moderate", updated: "30 min ago", lat: 25.16, lng: 93.04 }
    ],
    liveUpdates: [
      { time: "09:21", road: "NH-15", title: "Incident reported", detail: "Near Maibong Km 12+400", type: "danger" },
      { time: "09:05", road: "SH-12", title: "Traffic disruption", detail: "Heavy vehicle breakdown", type: "warning" },
      { time: "08:42", road: "NH-54", title: "High risk", detail: "Landslide probability high", type: "danger" },
      { time: "08:15", road: "NH-37", title: "Road clear", detail: "Normal relief transit restored", type: "success" },
    ],
    alerts: [
      { title: "Critical road blockage on NH-15", location: "Dima Hasao", age: "10 min ago", type: "danger" },
      { title: "Heavy rainfall warning on Hill Passes", location: "Dima Hasao", age: "28 min ago", type: "warning" },
      { title: "Vehicle movement restored on NH-37", location: "Haflong", age: "41 min ago", type: "success" },
    ],
    markers: [
      { id: 101, lat: 25.53, lng: 93.05, type: "danger", layer: "incidents", label: "NH-15 — Landslide Blockage" },
      { id: 102, lat: 25.19, lng: 93.02, type: "warning", layer: "incidents", label: "SH-12 — Mud Erosion" },
      { id: 103, lat: 25.68, lng: 93.05, type: "success", layer: "roads", label: "NH-37 — Corridor Clear" },
      { id: 104, lat: 25.32, lng: 92.95, type: "danger", layer: "roads", label: "NH-54 — Slope Instability" },
      { id: 105, lat: 25.22, lng: 93.12, type: "vehicle", layer: "vehicles", label: "Patrol Unit AS-01-AC-1123" },
      { id: 106, lat: 25.14, lng: 92.98, type: "vehicle", layer: "vehicles", label: "Supply Truck SHP-2026-1145" }
    ]
  },
  "Kamrup": {
    center: [26.18, 91.73],
    zoom: 9,
    stats: [
      { value: "02", label: "Critical Roads", icon: "road", tone: "green" },
      { value: "06", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "54", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "112", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-27", district: "Kamrup", status: "Normal", updated: "3 min ago", lat: 26.18, lng: 91.75 },
      { road: "AH-2", district: "Kamrup", status: "Normal", updated: "6 min ago", lat: 26.14, lng: 91.78 },
      { road: "NH-127", district: "Kamrup", status: "Moderate", updated: "14 min ago", lat: 26.25, lng: 91.62 },
      { road: "Jalukbari Bypass", district: "Kamrup", status: "Normal", updated: "25 min ago", lat: 26.15, lng: 91.68 }
    ],
    liveUpdates: [
      { time: "09:40", road: "NH-127", title: "Traffic disruption", detail: "Waterlogging near underpass", type: "warning" },
      { time: "09:12", road: "NH-27", title: "Road clear", detail: "Heavy logistics transit moving freely", type: "success" },
      { time: "08:50", road: "AH-2", title: "Road clear", detail: "Patrol unit verified smooth flow", type: "success" }
    ],
    alerts: [
      { title: "Urban flash rain waterlogging", location: "Kamrup Metropolitan", age: "15 min ago", type: "warning" },
      { title: "Medicines consignment dispatched", location: "Kamrup Hub", age: "45 min ago", type: "success" }
    ],
    markers: [
      { id: 201, lat: 26.18, lng: 91.75, type: "success", layer: "roads", label: "NH-27 — Fully Accessible" },
      { id: 202, lat: 26.25, lng: 91.62, type: "warning", layer: "incidents", label: "NH-127 — Flash Waterlogging" },
      { id: 203, lat: 26.14, lng: 91.78, type: "vehicle", layer: "vehicles", label: "Patrol AS-01-AC-1134 Active" },
      { id: 204, lat: 26.19, lng: 91.71, type: "vehicle", layer: "vehicles", label: "Medicines Truck SHP-2026-1146" }
    ]
  },
  "Golaghat": {
    center: [26.52, 93.97],
    zoom: 9,
    stats: [
      { value: "05", label: "Critical Roads", icon: "road", tone: "yellow" },
      { road: "NH-37", value: "09", label: "Open Incidents", icon: "incident", tone: "yellow" } as any,
      { value: "22", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "38", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-37", district: "Golaghat", status: "Moderate", updated: "4 min ago", lat: 26.54, lng: 93.98 },
      { road: "NH-129", district: "Golaghat", status: "High Risk", updated: "9 min ago", lat: 26.45, lng: 93.88 },
      { road: "SH-3", district: "Golaghat", status: "Normal", updated: "18 min ago", lat: 26.58, lng: 94.02 }
    ],
    liveUpdates: [
      { time: "09:30", road: "NH-129", title: "High risk", detail: "River Dhansiri bank spill warning", type: "danger" },
      { time: "09:02", road: "NH-37", title: "Incident reported", detail: "Stalled grain cargo trailer", type: "warning" },
      { time: "08:35", road: "SH-3", title: "Road clear", detail: "Bridge inspection completed", type: "success" }
    ],
    alerts: [
      { title: "River Dhansiri flood spill warning", location: "Golaghat Lowlands", age: "22 min ago", type: "danger" },
      { title: "Bridge inspection completed", location: "Golaghat Bridge #4", age: "3 hrs ago", type: "success" }
    ],
    markers: [
      { id: 301, lat: 26.54, lng: 93.98, type: "warning", layer: "roads", label: "NH-37 — Stalled Cargo" },
      { id: 302, lat: 26.45, lng: 93.88, type: "danger", layer: "incidents", label: "NH-129 — Flood Spill Risk" },
      { id: 303, lat: 26.52, lng: 93.95, type: "vehicle", layer: "vehicles", label: "Pickup AS-01-AC-1145" }
    ]
  },
  "West Karbi Anglong": {
    center: [25.85, 92.65],
    zoom: 9,
    stats: [
      { value: "06", label: "Critical Roads", icon: "road", tone: "yellow" },
      { value: "11", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "19", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "29", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "SH-29", district: "West Karbi Anglong", status: "High Risk", updated: "5 min ago", lat: 25.89, lng: 92.68 },
      { road: "SH-22", district: "West Karbi Anglong", status: "Moderate", updated: "11 min ago", lat: 25.79, lng: 92.58 },
      { road: "NH-27 Link", district: "West Karbi Anglong", status: "Normal", updated: "20 min ago", lat: 25.92, lng: 92.74 }
    ],
    liveUpdates: [
      { time: "09:28", road: "SH-29", title: "High risk", detail: "Severe road damage from monsoon runoff", type: "danger" },
      { time: "08:55", road: "SH-22", title: "Traffic disruption", detail: "Shoulder erosion on hairpin bend", type: "warning" }
    ],
    alerts: [
      { title: "Severe road damage on SH-29", location: "West Karbi Anglong", age: "28 min ago", type: "danger" },
      { title: "Single lane open on SH-22", location: "West Karbi Anglong", age: "1 hr ago", type: "warning" }
    ],
    markers: [
      { id: 401, lat: 25.89, lng: 92.68, type: "danger", layer: "incidents", label: "SH-29 — Asphalt Erosion" },
      { id: 402, lat: 25.79, lng: 92.58, type: "warning", layer: "roads", label: "SH-22 — Shoulder Warning" },
      { id: 403, lat: 25.86, lng: 92.62, type: "vehicle", layer: "vehicles", label: "Patrol Truck AS-01-AC-1167" }
    ]
  },
  "Karbi Anglong": {
    center: [26.05, 93.45],
    zoom: 9,
    stats: [
      { value: "07", label: "Critical Roads", icon: "road", tone: "yellow" },
      { value: "12", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "24", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "31", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-52", district: "Karbi Anglong", status: "High Risk", updated: "8 min ago", lat: 26.08, lng: 93.48 },
      { road: "SH-18", district: "Karbi Anglong", status: "Moderate", updated: "16 min ago", lat: 25.98, lng: 93.38 },
      { road: "NH-36", district: "Karbi Anglong", status: "Normal", updated: "28 min ago", lat: 26.15, lng: 93.55 }
    ],
    liveUpdates: [
      { time: "09:18", road: "NH-52", title: "High risk", detail: "Hill rockfall on outer shoulder", type: "danger" },
      { time: "08:44", road: "SH-18", title: "Incident reported", detail: "Culvert water level elevated", type: "warning" }
    ],
    alerts: [
      { title: "Heavy rainfall warning in Diphu hills", location: "Karbi Anglong", age: "28 min ago", type: "warning" },
      { title: "Dry ration shipment enroute", location: "Karbi Anglong Depot", age: "45 min ago", type: "success" }
    ],
    markers: [
      { id: 501, lat: 26.08, lng: 93.48, type: "danger", layer: "incidents", label: "NH-52 — Rockfall Danger" },
      { id: 502, lat: 25.98, lng: 93.38, type: "warning", layer: "weather", label: "Diphu Rainfall Alert" }
    ]
  },
  "Haflong": {
    center: [25.17, 93.02],
    zoom: 10,
    stats: [
      { value: "04", label: "Critical Roads", icon: "road", tone: "green" },
      { value: "07", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "18", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "25", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-15 Haflong Pass", district: "Haflong", status: "High Risk", updated: "2 min ago", lat: 25.18, lng: 93.03 },
      { road: "Haflong Main Arterial", district: "Haflong", status: "Normal", updated: "10 min ago", lat: 25.16, lng: 93.01 },
      { road: "Mahur-Haflong Ridge Road", district: "Haflong", status: "Moderate", updated: "19 min ago", lat: 25.21, lng: 93.06 }
    ],
    liveUpdates: [
      { time: "09:35", road: "NH-15 Haflong Pass", title: "High risk", detail: "Debris clearance in progress", type: "danger" },
      { time: "08:50", road: "Haflong Main Arterial", title: "Road clear", detail: "Movement restored for ambulances", type: "success" }
    ],
    alerts: [
      { title: "Vehicle movement restored on Main Arterial", location: "Haflong", age: "41 min ago", type: "success" }
    ],
    markers: [
      { id: 601, lat: 25.18, lng: 93.03, type: "danger", layer: "incidents", label: "Haflong Pass Landslide" },
      { id: 602, lat: 25.16, lng: 93.01, type: "success", layer: "roads", label: "Main Arterial Open" }
    ]
  },
  "Maibong": {
    center: [25.30, 93.16],
    zoom: 10,
    stats: [
      { value: "03", label: "Critical Roads", icon: "road", tone: "yellow" },
      { value: "05", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "14", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "18", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "SH-22 Maibong Section", district: "Maibong", status: "High Risk", updated: "7 min ago", lat: 25.32, lng: 93.18 },
      { road: "Mahur River Road", district: "Maibong", status: "Moderate", updated: "14 min ago", lat: 25.28, lng: 93.14 }
    ],
    liveUpdates: [
      { time: "09:21", road: "SH-22 Maibong Section", title: "Incident reported", detail: "Near Maibong Railway crossing", type: "danger" }
    ],
    alerts: [
      { title: "Mud inundation near Maibong crossing", location: "Maibong", age: "12 min ago", type: "danger" }
    ],
    markers: [
      { id: 701, lat: 25.32, lng: 93.18, type: "danger", layer: "incidents", label: "SH-22 — Rail Crossing Mud" }
    ]
  },
  "Lumding": {
    center: [25.75, 93.17],
    zoom: 10,
    stats: [
      { value: "02", label: "Critical Roads", icon: "road", tone: "green" },
      { value: "04", label: "Open Incidents", icon: "incident", tone: "yellow" },
      { value: "35", label: "Vehicles Active", icon: "vehicle", tone: "green" },
      { value: "62", label: "Shipments Today", icon: "shipment", tone: "green" },
    ],
    roads: [
      { road: "NH-27 Lumding Junction", district: "Lumding", status: "Normal", updated: "4 min ago", lat: 25.76, lng: 93.18 },
      { road: "Lumding-Haflong Connector", district: "Lumding", status: "Moderate", updated: "12 min ago", lat: 25.71, lng: 93.12 }
    ],
    liveUpdates: [
      { time: "09:15", road: "NH-27 Lumding Junction", title: "Road clear", detail: "Heavy logistics staging moving", type: "success" }
    ],
    alerts: [
      { title: "Staging depot cargo cleared", location: "Lumding Logistics Yard", age: "35 min ago", type: "success" }
    ],
    markers: [
      { id: 801, lat: 25.76, lng: 93.18, type: "success", layer: "roads", label: "Lumding Junction Open" }
    ]
  }
};

// Default fallback datasets
export const roads: Road[] = districtDataMap["Dima Hasao"].roads;
export const liveUpdates: LiveUpdate[] = districtDataMap["Dima Hasao"].liveUpdates;
export const alerts: AlertItem[] = districtDataMap["Dima Hasao"].alerts;
export const mapMarkers: MapMarkerItem[] = districtDataMap["Dima Hasao"].markers;
export const stats: StatItem[] = districtDataMap["Dima Hasao"].stats;

