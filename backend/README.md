# NERA Backend REST API Service

Welcome to the backend service for **NERA (North East Resilience Assistant)**. This server handles authentication (Sign In, Create Account, OTP Verification, SSO), user management, live logistics vehicle tracking APIs, and incident alerts.

---

## 📁 Directory Structure

```
backend/
├── package.json         # Node.js dependencies & scripts
├── .env                 # Environment variables (PORT, JWT_SECRET, CORS_ORIGIN)
├── .env.example         # Template environment config
└── src/
    ├── index.js         # Express app initialization & server entry point
    ├── middleware/
    │   └── auth.middleware.js # JWT authentication guard middleware
    ├── controllers/
    │   ├── auth.controller.js # Auth handlers (Register, Login, OTP, SSO)
    │   └── logistics.controller.js # Vehicles & Incident alerts handlers
    └── routes/
        ├── auth.routes.js     # Auth API routes (/api/auth)
        └── logistics.routes.js# Logistics API routes (/api/logistics)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The backend API server will start on **`http://localhost:5000`**.

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health Check Endpoint | No |
| `POST` | `/api/auth/register` | Create Account (Role, Details, Verification) | No |
| `POST` | `/api/auth/login` | User Sign In (Email/Username, Password, Role) | No |
| `POST` | `/api/auth/send-otp` | Request NIC Government SMS OTP | No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP passcode | No |
| `POST` | `/api/auth/sso` | SSO Authentication (Google / Microsoft Entra) | No |
| `GET` | `/api/logistics/vehicles` | Fetch live tracked vehicles | Yes (Bearer Token) |
| `GET` | `/api/logistics/incidents` | Fetch active incident alerts | Yes (Bearer Token) |
