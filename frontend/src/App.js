import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Items from "./pages/Items";
import Customers from "./pages/Customers";
import Trader from "./pages/Trader";
import Invoice from "./pages/Invoice";
import Payments from "./pages/Payments";
import Login from "./components/Login";
import Register from "./components/Register";
import Reports from "./pages/Reports";


function App() {
  const isAuth = localStorage.getItem("token");

  return (
    <div className="font-sans">
      <Routes>

        {/* 🔐 PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 🔥 ROOT REDIRECT */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} />}
        />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/"
          element={isAuth ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="items" element={<Items />} />
          <Route path="settings" element={<Settings />} />
          <Route path="customers" element={<Customers />} />
          <Route path="trader" element={<Trader />} />
          <Route path="invoice" element={<Invoice />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;