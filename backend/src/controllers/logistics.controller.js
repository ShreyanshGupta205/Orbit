export const getVehicles = async (req, res) => {
  try {
    const mockVehicles = [
      { id: "VEH-101", plateNumber: "AS-01-DD-4820", type: "Medical Relief Truck", driver: "Rajesh Das", status: "Active", location: "Guwahati-Shillong Highway", speed: "54 km/h" },
      { id: "VEH-102", plateNumber: "AS-25-CC-1904", type: "Emergency Boat Carrier", driver: "Bikash Gogoi", status: "In Transit", location: "Silchar Bypass", speed: "42 km/h" },
      { id: "VEH-103", plateNumber: "ML-05-AA-7781", type: "Ration Fleet Tanker", driver: "Animesh Sarma", status: "Stationed", location: "Jorhat Relief Depot", speed: "0 km/h" }
    ];

    return res.status(200).json({
      success: true,
      count: mockVehicles.length,
      vehicles: mockVehicles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch logistics vehicles",
      error: error.message
    });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const mockIncidents = [
      { id: "INC-2026-089", title: "National Highway 37 Landslide Blockade", district: "Kamrup Metropolitan", severity: "HIGH", status: "ACTIVE", reportedAt: "2026-08-30T00:15:00Z" },
      { id: "INC-2026-090", title: "Brahmaputra River Embankment Water Rise", district: "Dibrugarh", severity: "CRITICAL", status: "MONITORING", reportedAt: "2026-08-30T00:30:00Z" }
    ];

    return res.status(200).json({
      success: true,
      count: mockIncidents.length,
      incidents: mockIncidents
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch incident alerts",
      error: error.message
    });
  }
};
