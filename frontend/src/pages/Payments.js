import { useEffect, useState } from "react";
import TMAlert from "../components/TMAlert";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
const getToken = () => localStorage.getItem("token");

const API = "http://localhost:8000";

export default function Payments() {
  const [invoices, setInvoices] = useState([]);
  const [order, setOrder] = useState("asc");

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ---------------- ALERT ----------------
  const showAlert = (msg, type = "info") => {
    setAlert({ open: true, message: msg, severity: type });
  };

  const closeAlert = () => {
    setAlert({ open: false, message: "", severity: "info" });
  };

  // ---------------- FETCH INVOICES ----------------
  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API}/getAllInvoices`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setInvoices(data.data || []);
    } catch (e) {
      showAlert("Error loading invoices", "error");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ---------------- DELETE INVOICE ----------------
  const deleteInvoice = async (code) => {
    try {
      const res = await fetch(`${API}/deleteInvoice`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert(data.message || "Invoice Deleted", "success");

        // refresh list
        fetchInvoices();
      } else {
        showAlert("Delete failed", "error");
      }
    } catch (err) {
      showAlert("Server error", "error");
    }
  };

  // ---------------- SORT ----------------
  const sortByAmount = () => {
    const sorted = [...invoices].sort((a, b) => {
      const aAmt = a.total_amount || a.TOTAL_AMOUNT || 0;
      const bAmt = b.total_amount || b.TOTAL_AMOUNT || 0;

      return order === "asc" ? aAmt - bAmt : bAmt - aAmt;
    });

    setInvoices(sorted);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  return (
    <div className="p-6">

      {/* ALERT */}
      <TMAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeAlert}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Invoice Master</h1>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Trader</th>
              <th className="p-3 text-left">Date</th>

              <th
                className="p-3 text-left cursor-pointer"
                onClick={sortByAmount}
              >
                Amount ⬍
              </th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-5">
                  No Data Found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const code = inv.invoice_code || inv.INVOICE_CODE;
                const customer = inv.customer_name;
                const trader = inv.trader_name;
                const date = inv.invoice_date || inv.INVOICE_DATE;
                const amount = inv.total_amount || inv.TOTAL_AMOUNT;

                return (
                  <tr key={code} className="border-b hover:bg-gray-50">

                    <td className="p-3">{code}</td>
                    <td className="p-3">{customer}</td>
                    <td className="p-3">{trader}</td>
                    <td className="p-3">{date}</td>

                    <td className="p-3 font-semibold">
                      ₹ {amount || 0}
                    </td>

                    <td className="p-3 flex gap-3">

                      {/* VIEW */}
                      <button className="text-blue-600 hover:scale-110 transition">
                        <VisibilityIcon />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteInvoice(code)}
                        className="text-red-600 hover:scale-110 transition"
                      >
                        <DeleteIcon />
                      </button>

                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}