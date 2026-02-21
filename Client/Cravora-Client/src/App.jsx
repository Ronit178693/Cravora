import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyOutlet from "./pages/outlet/MyOutlet";
import ManageMenu from "./pages/outlet/ManageMenu";
import OutletOrders from "./pages/outlet/OutletOrders";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/outlet-dashboard" element={<MyOutlet />} />
        <Route path="/menu" element={<ManageMenu />} />
        <Route path="/orders" element={<OutletOrders />} />
      </Routes>
    </Router>
  );
}

export default App;

