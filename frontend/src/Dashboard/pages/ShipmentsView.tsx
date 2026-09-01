import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  X,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MapPin
} from "lucide-react";

export interface ShipmentItem {
  id: string;
  type: string;
  origin: string;
  destination: string;
  quantity: string;
  status: "In Transit" | "Delivered" | "Pending" | "Delayed";
  eta: string;
  carrier?: string;
  contact?: string;
}

const initialShipments: ShipmentItem[] = [
  {
    id: "SHP-2026-1145",
    type: "Food Supplies",
    origin: "Guwahati",
    destination: "NH-15, Dima Hasao",
    quantity: "1,200 kg",
    status: "In Transit",
    eta: "12 min ago",
    carrier: "Assam Logistics Fleet #4",
    contact: "+91 94350-18293"
  },
  {
    id: "SHP-2026-1146",
    type: "Medicines",
    origin: "Silchar",
    destination: "NH-27, Kamrup",
    quantity: "500 boxes",
    status: "Delivered",
    eta: "1 hr ago",
    carrier: "Health Relief Express",
    contact: "+91 94350-29381"
  },
  {
    id: "SHP-2026-1147",
    type: "Relief Materials",
    origin: "Tezpur",
    destination: "NH-37, Golaghat",
    quantity: "2,000 kg",
    status: "Pending",
    eta: "3 hrs ago",
    carrier: "State Disaster Management",
    contact: "+91 94350-48201"
  },
  {
    id: "SHP-2026-1148",
    type: "Water Packets",
    origin: "Dibrugarh",
    destination: "NH-29, Cachar",
    quantity: "3,000 pcs",
    status: "Delayed",
    eta: "2 hrs ago",
    carrier: "Emergency Relief Unit",
    contact: "+91 94350-93019"
  },
  {
    id: "SHP-2026-1149",
    type: "Dry Ration",
    origin: "North Lakhimpur",
    destination: "NH-15, Karbi Anglong",
    quantity: "1,500 kg",
    status: "In Transit",
    eta: "45 min ago",
    carrier: "North-East Supply Line",
    contact: "+91 94350-71938"
  },
  {
    id: "SHP-2026-1150",
    type: "Medical Equipment",
    origin: "Guwahati",
    destination: "Haflong Civil Hospital",
    quantity: "12 units",
    status: "In Transit",
    eta: "1.5 hrs",
    carrier: "Rapid Care Courier",
    contact: "+91 94350-84029"
  }
];

interface ShipmentsViewProps {
  selectedDistrict?: string;
}

export default function ShipmentsView({ selectedDistrict = "All" }: ShipmentsViewProps) {
  const [shipments, setShipments] = useState<ShipmentItem[]>(initialShipments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState(
    selectedDistrict !== "All" ? selectedDistrict : "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<ShipmentItem | null>(null);

  // Sync with navbar
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "All") {
      setSelectedRegion(selectedDistrict);
    }
  }, [selectedDistrict]);

  // New shipment form state
  const [newType, setNewType] = useState("Food Supplies");
  const [newOrigin, setNewOrigin] = useState("Guwahati");
  const [newDestination, setNewDestination] = useState(
    selectedDistrict !== "All" ? `NH-15, ${selectedDistrict}` : "NH-15, Dima Hasao"
  );
  const [newQuantity, setNewQuantity] = useState("");

  const counts = useMemo(() => {
    return {
      inTransit: shipments.filter((s) => s.status === "In Transit").length + 16,
      delivered: shipments.filter((s) => s.status === "Delivered").length + 11,
      pending: shipments.filter((s) => s.status === "Pending").length + 3,
      delayed: shipments.filter((s) => s.status === "Delayed").length + 1
    };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      if (selectedStatus !== "All" && s.status !== selectedStatus) return false;
      if (selectedType !== "All" && s.type !== selectedType) return false;
      if (selectedRegion !== "All" && !s.destination.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          s.id.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [shipments, selectedStatus, selectedType, selectedRegion, searchQuery]);

  const handleCreateShipment = (e: FormEvent) => {
    e.preventDefault();
    if (!newDestination.trim() || !newQuantity.trim()) return;

    const created: ShipmentItem = {
      id: `SHP-2026-${Math.floor(1151 + Math.random() * 850)}`,
      type: newType,
      origin: newOrigin,
      destination: newDestination,
      quantity: newQuantity,
      status: "In Transit",
      eta: "Just dispatched",
      carrier: "Assam Disaster Fleet #1",
      contact: "+91 94350-00000"
    };

    setShipments([created, ...shipments]);
    setNewModalOpen(false);
    setNewDestination("");
    setNewQuantity("");
  };

  return (
    <div className="view-container">
      {/* Header */}
      <div className="view-header">
        <div>
          <h1>Shipments</h1>
          <p>Track and manage relief and supply shipments</p>
        </div>
        <button className="primary-action-btn" onClick={() => setNewModalOpen(true)}>
          <Plus size={16} />
          <span>New Shipment</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="shipment-stats-grid">
        <div className="shipment-stat-card">
          <div className="shipment-stat-icon green">
            <Package size={22} />
          </div>
          <div>
            <strong>{counts.inTransit}</strong>
            <span>In Transit</span>
          </div>
        </div>

        <div className="shipment-stat-card">
          <div className="shipment-stat-icon green-subtle">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <strong>{counts.delivered}</strong>
            <span>Delivered</span>
          </div>
        </div>

        <div className="shipment-stat-card">
          <div className="shipment-stat-icon yellow">
            <Clock size={22} />
          </div>
          <div>
            <strong>{counts.pending}</strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="shipment-stat-card">
          <div className="shipment-stat-icon red">
            <AlertTriangle size={22} />
          </div>
          <div>
            <strong>{counts.delayed}</strong>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      {/* Toolbar Filter Card */}
      <div className="view-toolbar-card">
        <div className="toolbar-grid-4">
          <div className="toolbar-search">
            <div className="input-search-inner standalone">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar-field">
            <label>Status</label>
            <div className="custom-select-wrap">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Type</label>
            <div className="custom-select-wrap">
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Food Supplies">Food Supplies</option>
                <option value="Medicines">Medicines</option>
                <option value="Relief Materials">Relief Materials</option>
                <option value="Water Packets">Water Packets</option>
                <option value="Dry Ration">Dry Ration</option>
              </select>
            </div>
          </div>

          <div className="toolbar-field">
            <label>Region</label>
            <div className="toolbar-field-row">
              <div className="custom-select-wrap" style={{ flex: 1 }}>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="All">All Districts</option>
                  <option value="Dima Hasao">Dima Hasao</option>
                  <option value="Kamrup">Kamrup</option>
                  <option value="Golaghat">Golaghat</option>
                  <option value="Cachar">Cachar</option>
                  <option value="Karbi Anglong">Karbi Anglong</option>
                </select>
              </div>
              <button
                className="filter-pill-btn"
                onClick={() => {
                  setSelectedStatus("All");
                  setSelectedType("All");
                  setSelectedRegion("All");
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

      {/* Shipments Table Card */}
      <div className="table-card-full">
        <div className="custom-table-wrap">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Type</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>ETA</th>
                <th style={{ textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length ? (
                filteredShipments.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="id-badge bold">{item.id}</span>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.origin}</td>
                    <td>
                      <div className="loc-cell">
                        <MapPin size={13} className="loc-pin" />
                        <span>{item.destination}</span>
                      </div>
                    </td>
                    <td>
                      <strong>{item.quantity}</strong>
                    </td>
                    <td>
                      <span className={`pill-badge shipment-${item.status.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="time-text">{item.eta}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="action-icon-btn"
                        onClick={() => setDetailModalItem(item)}
                        title="View details"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="empty-table-row">
                    No shipments found matching filters.
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
          NEW SHIPMENT MODAL
      ========================================= */}
      {newModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Create Relief Shipment</h3>
              <button onClick={() => setNewModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateShipment} className="modal-body-form">
              <div className="form-field">
                <label>Cargo / Commodity Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Food Supplies">Food Supplies</option>
                  <option value="Medicines">Medicines</option>
                  <option value="Relief Materials">Relief Materials</option>
                  <option value="Water Packets">Water Packets</option>
                  <option value="Dry Ration">Dry Ration</option>
                </select>
              </div>

              <div className="form-field">
                <label>Dispatch Origin Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Guwahati Central Depot"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Destination Location</label>
                <input
                  type="text"
                  placeholder="e.g. NH-15, Dima Hasao Relief Base"
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Quantity & Units</label>
                <input
                  type="text"
                  placeholder="e.g. 1,200 kg or 500 boxes"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="modal-foot-actions">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setNewModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  Dispatch Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          SHIPMENT DETAIL MODAL
      ========================================= */}
      {detailModalItem && (
        <div className="modal-backdrop" onClick={() => setDetailModalItem(null)}>
          <div className="modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="id-badge">{detailModalItem.id}</span>
                <h3 style={{ marginTop: "4px" }}>Waybill & Cargo Details</h3>
              </div>
              <button onClick={() => setDetailModalItem(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="detail-modal-body">
              <div className="detail-grid">
                <div>
                  <span className="detail-label">Cargo Type</span>
                  <strong>{detailModalItem.type}</strong>
                </div>
                <div>
                  <span className="detail-label">Quantity</span>
                  <strong>{detailModalItem.quantity}</strong>
                </div>
                <div>
                  <span className="detail-label">Origin</span>
                  <strong>{detailModalItem.origin}</strong>
                </div>
                <div>
                  <span className="detail-label">Destination</span>
                  <strong>{detailModalItem.destination}</strong>
                </div>
                <div>
                  <span className="detail-label">Status</span>
                  <span className={`pill-badge shipment-${detailModalItem.status.toLowerCase().replace(" ", "-")}`}>
                    {detailModalItem.status}
                  </span>
                </div>
                <div>
                  <span className="detail-label">ETA / Elapsed</span>
                  <strong>{detailModalItem.eta}</strong>
                </div>
                <div>
                  <span className="detail-label">Assigned Carrier</span>
                  <strong>{detailModalItem.carrier}</strong>
                </div>
                <div>
                  <span className="detail-label">Emergency Contact</span>
                  <strong>{detailModalItem.contact}</strong>
                </div>
              </div>

              <div className="modal-foot-actions">
                <button
                  className="modal-submit-btn"
                  onClick={() => setDetailModalItem(null)}
                >
                  Close Waybill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
