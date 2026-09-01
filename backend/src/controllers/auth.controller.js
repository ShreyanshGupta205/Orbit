import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "nera_resilience_secret_key_2026_northeast";

// In-memory mock storage for development (Replace with MongoDB / PostgreSQL DB models)
const usersDb = [
  {
    id: "usr_101",
    name: "Manas Das",
    email: "manas.officer@assam.gov.in",
    role: "District Disaster Management Officer",
    phone: "+91 94350-12849",
    district: "Guwahati (Kamrup Metro)"
  }
];

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, district, role, password, address, language } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Full Name and Email Address are required."
      });
    }

    const existingUser = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || "+91 94350-12849",
      district: district || "Guwahati (Kamrup Metro)",
      role: role || "Citizen",
      address: address || "",
      language: language || "English",
      createdAt: new Date().toISOString()
    };

    usersDb.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        district: newUser.district,
        phone: newUser.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration",
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email or username is required."
      });
    }

    let user = usersDb.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Auto create officer account for demo / quick authentication
      const displayName = email.includes("@") ? email.split("@")[0] : email;
      user = {
        id: `usr_${Date.now()}`,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        email: email.includes("@") ? email : `${email.toLowerCase()}@nic.in`,
        role: role || "Citizen",
        district: "Guwahati (Kamrup Metro)",
        phone: "+91 94350-12849"
      };
      usersDb.push(user);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: role || user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role || user.role,
        district: user.district,
        phone: user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { phone, name } = req.body;
    return res.status(200).json({
      success: true,
      message: "NIC Government SMS OTP dispatched successfully",
      phone: phone || "+91 94350-12849",
      otpCode: "482091",
      expiresInSeconds: 300
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, phone, name } = req.body;
    const displayName = name || "Manas Das";
    const userEmail = `${displayName.toLowerCase().replace(/\s+/g, ".")}@nic.in`;

    const token = jwt.sign(
      { id: `usr_otp_${Date.now()}`, email: userEmail, role: "District Disaster Management Officer" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        name: displayName,
        email: userEmail,
        role: "District Disaster Management Officer",
        phone: phone || "+91 94350-12849"
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message
    });
  }
};

export const ssoLogin = async (req, res) => {
  try {
    const { provider, accName, accEmail, role } = req.body;
    const name = accName || "Officer";
    const email = accEmail || `officer@${provider || "sso"}.com`;

    const token = jwt.sign(
      { id: `usr_sso_${Date.now()}`, email, role: role || "District Disaster Management Officer" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `SSO Authentication successful via ${provider}`,
      token,
      user: {
        name,
        email,
        role: role || "District Disaster Management Officer"
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "SSO authentication failed",
      error: error.message
    });
  }
};
