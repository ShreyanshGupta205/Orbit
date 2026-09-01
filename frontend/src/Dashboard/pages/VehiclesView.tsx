import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin
} from "lucide-react";

export interface VehicleItem {
  id: string;
  type: "Truck" | "Pickup" | "Van" | "Patrol";
  location: string;
  lat: number;
  lng: number;
  status: "Active" | "Idle" | "Offline";
  lastUpdated: string;
  driver?: string;
  speed?: string;
  fuel?: string;
}

const initialVehicles: VehicleItem[] = [
  {
    id: "AS-01-AC-1123",
    type: "Truck",
    location: "NH-15, Dima Hasao",
    lat: 25.5124,
    lng: 93.1245,
    status: "Active",
    lastUpdated: "10 min ago",
    driver: "Ramen Bora",
    speed: "42 km/h",
    fuel: "78%"
  },
  {
    id: "AS-01-AC-1134",
    type: "Truck",
    location: "NH-27, Kamrup",
    lat: 26.1784,
    lng: 91.7362,
    status: "Active",
    lastUpdated: "12 min ago",
    driver: "Bikash Kalita",
    speed: "55 km/h",
    fuel: "65%"
  },
  {
    id: "AS-01-AC-1145",
    type: "Pickup",
    location: "NH-37, Golaghat",
    lat: 26.5421,
    lng: 93.9876,
    status: "Idle",
    lastUpdated: "18 min ago",
    driver: "Dhruba Sarma",
    speed: "0 km/h",
    fuel: "82%"
  },
  {
    id: "AS-01-AC-1156",
    type: "Van",
    location: "NH-15, Lakhimpur",
    lat: 27.0012,
    lng: 94.2245,
    status: "Active",
    lastUpdated: "22 min ago",
    driver: "Pranab Gogoi",
    speed: "48 km/h",
    fuel: "54%"
  },
  {
    id: "AS-01-AC-1167",
    type: "Truck",
    location: "NH-29, West Karbi Anglong",
    lat: 25.8923,
    lng: 93.5412,
    status: "Offline",
    lastUpdated: "1 hr ago",
    driver: "Sanjay Teron",
    speed: "0 km/h",
    fuel: "30%"
  },
  {
    id: "AS-01-AC-1178",
    type: "Pickup",
    location: "NH-27, Nagaon",
    lat: 26.3201,
    lng: 92.9843,
    status: "Active",
    lastUpdated: "1 hr ago",
    driver: "Suraj Nath",
    speed: "62 km/h",
    fuel: "91%"
  }
];

interface VehiclesViewProps {
  selectedDistrict?: string;
}

export default function VehiclesView({ selectedDistrict = "All" }: VehiclesViewProps) {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState(
    selectedDistrict !== "All" ? selectedDistrict : "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<VehicleItem | null>(null);

  // New vehicle form state
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState<"Truck" | "Pickup" | "Van" | "Patrol">("Truck");
  const [newLocation, setNewLocation] = useState(
    selectedDistrict !== "All" ? `NH-15, ${selectedDistrict}` : "NH-15, Dima Hasao"
  );
  const [newDriver, setNewDriver] = useState("");

  // Sync with navbar
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "All") {
      setSelectedLocation(selectedDistrict);
      setNewLocation(`NH-15, ${selectedDistrict}`);
    }
  }, [selectedDistrict]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (selectedType !== "All" && v.type !== selectedType) return false;
      if (selectedStatus !== "All" && v.status !== selectedStatus) return false;
      if (selectedLocation !== "All" && !v.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          v.id.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          (v.driver && v.driver.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [vehicles, selectedType, selectedStatus, selectedLocation, searchQuery]);

  const handleAddVehicle = (e: FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const created: VehicleItem = {
      id: newPlate.toUpperCase(),
      type: newType,
      location: newLocation,
      lat: +(25.5 + Math.random() * 1.2).toFixed(4),
      lng: +(92.5 + Math.random() * 2.0).toFixed(4),
      status: "Active",
      lastUpdated: "Just now",
      driver: newDriver || "Designated Driver",
      speed: "35 km/h",
      fuel: "95%"
    };

    setVehicles([created, ...vehicles]);
    setAddModalOpen(false);
    setNewPlate("");
    setNewDriver("");
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1>Vehicles</h1>
          <p>Manage and track all registered monitoring vehicles</p>
        </div>
        <button className="primary-action-btn" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Filter Toolbar Card */}
      <div className="view-toolbar-card">
        <div className="toolbar-grid-4">
          <div className="toolbar-search">
            <label>Vehicle ID</label>
            <div className="input-search-inner">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search vehicle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-field">
            <label>Type</label>
            <div className="custom-select-wrap">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Truck">Truck</option>
                <option value="Pickup">Pickup</option>
                <option value="Van">Van</option>
                <option value="Patrol">Patrol</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Status</label>
            <div className="custom-select-wrap">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Location</label>
            <div className="toolbar-field-row">
              <div className="custom-select-wrap" style={{ flex: 1 }}>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="All">All Districts</option>
                  <option value="Dima Hasao">Dima Hasao</option>
                  <option value="Kamrup">Kamrup</option>
                  <option value="Golaghat">Golaghat</option>
                  <option value="Lakhimpur">Lakhimpur</option>
                  <option value="West Karbi Anglong">West Karbi Anglong</option>
                  <option value="Nagaon">Nagaon</option>
                </select>
              </div>
              <button
                className="filter-pill-btn"
                onClick={() => {
                  setSelectedType("All");
                  setSelectedStatus("All");
                  setSelectedLocation("All");
                  setSearchQuery("");
                }}
                title="Reset filters"
              >
                <Filter size={15} />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table Card */}
      <div className="table-card-full">
        <div className="custom-table-wrap">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length ? (
                filteredVehicles.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="id-badge bold">{item.id}</span>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <div className="loc-cell">
                        <MapPin size={13} className="loc-pin" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="mono-num">{item.lat.toFixed(4)}</td>
                    <td className="mono-num">{item.lng.toFixed(4)}</td>
                    <td>
                      <span className={`pill-badge status-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="time-text">{item.lastUpdated}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="action-icon-btn"
                        onClick={() => setDetailModalItem(item)}
                        title="View telemetry"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-row">
                    No vehicles found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pagination-bar">
          <button
            className="page-btn-arrow"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {[1, 2, 3, 4, 5].map((pageNum) => (
            <button
              key={pageNum}
              className={`page-num-btn ${currentPage === pageNum ? "active" : ""}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className="page-btn-arrow"
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
            disabled={currentPage === 5}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================
          ADD VEHICLE MODAL
      ========================================= */}
      {addModalOpen && (
        <div className="modal-backdrop" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Register New Vehicle</h3>
              <button onClick={() => setAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="modal-body-form">
              <div className="form-field">
                <label>Registration / Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. AS-01-AC-2490"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Vehicle Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                >
                  <option value="Truck">Truck</option>
                  <option value="Pickup">Pickup</option>
                  <option value="Van">Van</option>
                  <option value="Patrol">Patrol</option>
                </select>
              </div>

              <div className="form-field">
                <label>Assigned District / Corridor</label>
                <input
                  type="text"
                  placeholder="e.g. NH-15, Dima Hasao"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Assigned Driver Name</label>
                <input
                  type="text"
                  placeholder="Driver full name"
                  value={newDriver}
                  onChange={(e) => setNewDriver(e.target.value)}
                />
              </div>

              <div className="modal-foot-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          VEHICLE TELEMETRY MODAL
      ========================================= */}
      {detailModalItem && (
        <div className="modal-backdrop" onClick={() => setDetailModalItem(null)}>
          <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="id-badge">{detailModalItem.id}</span>
                <h3 style={{ marginTop: "4px" }}>Telemetry & Status</h3>
              </div>
              <button onClick={() => setDetailModalItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="detail-modal-body">
              <div className="detail-grid">
                <div>
                  <span className="detail-label">Vehicle Type</span>
                  <strong>{detailModalItem.type}</strong>
                </div>
                <div>
                  <span className="detail-label">Current Status</span>
                  <span className={`pill-badge status-${detailModalItem.status.toLowerCase()}`}>
                    {detailModalItem.status}
                  </span>
                </div>
                <div>
                  <span className="detail-label">Assigned Driver</span>
                  <strong>{detailModalItem.driver || "Unassigned"}</strong>
                </div>
                <div>
                  <span className="detail-label">Current Speed</span>
                  <strong>{detailModalItem.speed || "0 km/h"}</strong>
                </div>
                <div>
                  <span className="detail-label">Fuel Level</span>
                  <strong>{detailModalItem.fuel || "80%"}</strong>
                </div>
                <div>
                  <span className="detail-label">GPS Coordinates</span>
                  <strong className="mono-num">
                    {detailModalItem.lat}, {detailModalItem.lng}
                  </strong>
                </div>
              </div>

              <div className="modal-foot-actions">
                <button
                  className="modal-submit-btn"
                  onClick={() => setDetailModalItem(null)}
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
