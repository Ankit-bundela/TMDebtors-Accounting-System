import { useEffect, useState } from "react";
import TMAlert from "../components/TMAlert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = "http://localhost:8000";
const getToken = () => localStorage.getItem("token");

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (msg, type = "info") =>
    setAlert({ open: true, message: msg, severity: type });

  const closeAlert = () =>
    setAlert({ open: false, message: "", severity: "info" });

  // ---------------- FETCH INVOICES ----------------
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API}/getAllInvoices`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        showAlert("Failed to load reports", "error");
        return;
      }

      setReports(data.data || []);
    } catch (err) {
      console.error(err);
      showAlert("Server Error", "error");
    }
  };

  // ---------------- GRAPH DATA ----------------
  const chartData = reports.map((inv) => ({
    name: inv.invoice_code || inv.INVOICE_CODE,
    amount: Number(inv.total_amount || inv.TOTAL_AMOUNT || 0),
  }));

  const totalSales = chartData.reduce((acc, i) => acc + i.amount, 0);

  const pieData = [
    { name: "Sales", value: totalSales },
    { name: "Remaining", value: 1000 }, // demo fallback (optional)
  ];

  const COLORS = ["#16a34a", "#e5e7eb"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <TMAlert {...alert} onClose={closeAlert} />

      <h1 className="text-3xl font-bold mb-6">
        📊 Reports Dashboard
      </h1>

      {/* ---------------- TOP CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Invoices</p>
          <h2 className="text-2xl font-bold">{reports.length}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Sales</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹ {totalSales.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Average Invoice</p>
          <h2 className="text-2xl font-bold text-blue-600">
            ₹ {(totalSales / (reports.length || 1)).toFixed(2)}
          </h2>
        </div>

      </div>

      {/* ---------------- BAR GRAPH ---------------- */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-4">Invoice Wise Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ---------------- PIE GRAPH ---------------- */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">Sales Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={120}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}