import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyOutlet from "./pages/outlet/MyOutlet";
import ManageMenu from "./pages/outlet/ManageMenu";
import OutletOrders from "./pages/outlet/OutletOrders";
import Dashboard from "./pages/Dashboard";
import OutletDetail from "./pages/OutletDetail";
import Checkout from "./pages/Checkout";
import RunnerDashboard from "./pages/RunnerDashboard";
import OrderParcel from "./pages/OrderParcel";
import DeliveryHistory from "./pages/DeliveryHistory";
import ProtectedRoute from "./components/ProtectedRoute";


import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        {/* Outlet owner routes */}
        <Route path="/outlet-dashboard" element={<ProtectedRoute roles={["Outlet"]}><MyOutlet /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute roles={["Outlet"]}><ManageMenu /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={["Outlet"]}><OutletOrders /></ProtectedRoute>} />
        {/* Student routes */}
        <Route path="/student-dashboard" element={<ProtectedRoute roles={["Student"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/outlet/:id" element={<ProtectedRoute roles={["Student"]}><OutletDetail /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute roles={["Student"]}><Checkout /></ProtectedRoute>} />
        {/* Runner & Parcel routes */}
        <Route path="/runner-dashboard" element={<ProtectedRoute roles={["Student"]}><RunnerDashboard /></ProtectedRoute>} />
        <Route path="/order-parcel" element={<ProtectedRoute roles={["Student"]}><OrderParcel /></ProtectedRoute>} />
        <Route path="/delivery-history" element={<ProtectedRoute roles={["Student"]}><DeliveryHistory /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
