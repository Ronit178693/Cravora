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
// The Order tracking feature should be implimented on the checkout page itself
// import OrderTracking from "./pages/OrderTracking";

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
        <Route path="/outlet-dashboard" element={<MyOutlet />} />
        <Route path="/menu" element={<ManageMenu />} />
        <Route path="/orders" element={<OutletOrders />} />
        {/* Student routes */}
        <Route path="/student-dashboard" element={<Dashboard />} />
        <Route path="/outlet/:id" element={<OutletDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="/order/:id" element={<OrderTracking />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

