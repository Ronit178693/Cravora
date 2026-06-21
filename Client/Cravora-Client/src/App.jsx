import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import MyOutlet from "./pages/outlet/MyOutlet/MyOutlet";
import ManageMenu from "./pages/outlet/ManageMenu/ManageMenu";
import OutletOrders from "./pages/outlet/OutletOrders/OutletOrders";
import Dashboard from "./pages/Dashboard/Dashboard";
import OutletDetail from "./pages/OutletDetail/OutletDetail";
import Checkout from "./pages/Checkout/Checkout";
import RunnerDashboard from "./pages/RunnerDashboard/RunnerDashboard";
import OrderParcel from "./pages/OrderParcel/OrderParcel";
import DeliveryHistory from "./pages/DeliveryHistory/DeliveryHistory";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";


import "./App.css";

function App() {
  return (
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
  );
}

export default App;
