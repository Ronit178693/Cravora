/**
 * Master Router Component (App.jsx)
 * Declares all application routes and configures authentication/authorization filters
 * using the ProtectedRoute component.
 */
import { Routes, Route } from "react-router-dom";

// --- Page Imports ---
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

// --- Outlet Owner Pages ---
import MyOutlet from "./pages/outlet/MyOutlet/MyOutlet";
import ManageMenu from "./pages/outlet/ManageMenu/ManageMenu";
import OutletOrders from "./pages/outlet/OutletOrders/OutletOrders";

// --- Student Customer Pages ---
import Dashboard from "./pages/Dashboard/Dashboard";
import OutletDetail from "./pages/OutletDetail/OutletDetail";
import Checkout from "./pages/Checkout/Checkout";

// --- Student Runner & Parcel Pages ---
import RunnerDashboard from "./pages/RunnerDashboard/RunnerDashboard";
import OrderParcel from "./pages/OrderParcel/OrderParcel";
import DeliveryHistory from "./pages/DeliveryHistory/DeliveryHistory";

// --- Route Filters ---
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// --- Core Stylesheet ---
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />

      {/* Outlet Owner Dashboard Routes (Requires "Outlet" role authorization) */}
      <Route path="/outlet-dashboard" element={<ProtectedRoute roles={["Outlet"]}><MyOutlet /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute roles={["Outlet"]}><ManageMenu /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={["Outlet"]}><OutletOrders /></ProtectedRoute>} />

      {/* Student Customer Routes (Requires authenticated "Student" role access) */}
      <Route path="/student-dashboard" element={<ProtectedRoute roles={["Student"]}><Dashboard /></ProtectedRoute>} />
      <Route path="/outlet/:id" element={<ProtectedRoute roles={["Student"]}><OutletDetail /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute roles={["Student"]}><Checkout /></ProtectedRoute>} />

      {/* Student Runner Delivery & Peer-to-Peer Parcel Routes (Requires authenticated "Student" role access) */}
      <Route path="/runner-dashboard" element={<ProtectedRoute roles={["Student"]}><RunnerDashboard /></ProtectedRoute>} />
      <Route path="/order-parcel" element={<ProtectedRoute roles={["Student"]}><OrderParcel /></ProtectedRoute>} />
      <Route path="/delivery-history" element={<ProtectedRoute roles={["Student"]}><DeliveryHistory /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
