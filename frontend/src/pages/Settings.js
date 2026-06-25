import { useState } from "react";
import { Link } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

export default function Settings() {
  const [creditSales, setCreditSales] = useState(true);
  const [blockLimit, setBlockLimit] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <div className="bg-white shadow-md px-6 py-3 flex items-center justify-between border-b">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <HomeIcon className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Debtors</h1>
            <p className="text-xs text-gray-500">Smart Accounting</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-5 text-gray-700">

          <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
            <HomeIcon fontSize="small" /> Home
          </Link>

          <Link to="/customers" className="flex items-center gap-1 hover:text-blue-600">
            <PeopleIcon fontSize="small" /> Customers
          </Link>

          <Link to="/invoice" className="flex items-center gap-1 hover:text-blue-600">
            <ReceiptIcon fontSize="small" /> Invoices
          </Link>

          <Link to="/payments" className="flex items-center gap-1 hover:text-blue-600">
            <PaymentIcon fontSize="small" /> Payments
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-1 border px-3 py-1 rounded" to="/login">
            <LoginIcon fontSize="small" /> Login
          </Link>

          <Link className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded" to="/register">
            <PersonAddIcon fontSize="small" /> Register
          </Link>
        </div>
      </div>

      {/* ================= SETTINGS UI ================= */}
      <div className="p-6">

        {/* HEADER (NO BUTTON NOW) */}
        <div className="bg-white shadow rounded-xl p-4 flex items-center gap-3 mb-6">
          <SettingsIcon className="text-blue-600" />
          <div>
            <h1 className="font-semibold text-lg">Debtors Settings</h1>
            <p className="text-sm text-gray-500">
              Manage system configuration
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CREDIT SETTINGS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <PaymentIcon /> Credit Settings
            </h2>

            <input className="w-full border p-2 rounded mb-3" placeholder="Credit Period" />
            <input className="w-full border p-2 rounded mb-3" placeholder="Credit Limit" />

            <div className="flex justify-between items-center mb-2">
              <span>Allow Credit Sales</span>
              <button
                onClick={() => setCreditSales(!creditSales)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  creditSales ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform ${
                  creditSales ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span>Block if Limit Exceeded</span>
              <button
                onClick={() => setBlockLimit(!blockLimit)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  blockLimit ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full transform ${
                  blockLimit ? "translate-x-6" : ""
                }`} />
              </button>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <NotificationsIcon /> Follow Up
            </h2>

            <input className="w-full border p-2 rounded mb-3" placeholder="First Reminder" />
            <input className="w-full border p-2 rounded mb-3" placeholder="Second Reminder" />
            <input className="w-full border p-2 rounded" placeholder="Final Reminder" />
          </div>

          {/* SECURITY */}
          <div className="bg-white p-5 rounded-xl shadow lg:col-span-2">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <SecurityIcon /> Terms & Security
            </h2>

            <textarea className="w-full border p-3 rounded h-32" />

            <div className="flex items-center gap-2 mt-3">
              <input type="checkbox" />
              <span className="text-sm text-gray-600">
                Show terms on invoice
              </span>
            </div>
          </div>

        </div>

        {/* ================= SAVE BUTTON SECTION (MOVED DOWN) ================= */}
        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}