import { useEffect, useState } from "react";

import Navbar from "../components/NavBar";
import Card from "../components/Card";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API = "http://127.0.0.1:8000/getDashboard";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    customers: 0,
    invoices: 0,
    totalAmount: 0,
    payments: 0,
    outstanding: 0,
  });

  const [loading, setLoading] = useState(true);
  const fetchDashboard = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await fetch(API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (json.success) {
      setDashboard(json.data);
    }

  } catch (error) {
    console.error("Dashboard API Error:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDashboard();
  }, []);

  // 🔥 PIE CHART DATA
  const pieData = [
    {
      name: "Total Amount",
      value: dashboard.totalAmount,
    },
    {
      name: "Outstanding",
      value: dashboard.outstanding,
    },
    {
      name: "Invoices (scaled)",
      value: dashboard.invoices * 100,
    },
  ];

  const COLORS = ["#4F46E5", "#F59E0B", "#10B981"];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* CARDS */}
          <div className="grid grid-cols-4 gap-6">
            <Card
              title="Total Customers"
              value={loading ? "Loading..." : dashboard.customers}
              growth="+12 this month"
            />

            <Card
              title="Total Invoices"
              value={loading ? "Loading..." : dashboard.invoices}
              growth="+8 this month"
            />

            <Card
              title="Total Amount"
              value={loading ? "Loading..." : `₹${dashboard.totalAmount}`}
              growth="+5%"
            />

            <Card
              title="Outstanding"
              value={loading ? "Loading..." : `₹${dashboard.outstanding}`}
              growth="+18%"
            />
          </div>

          {/* CHART + LIST */}
          <div className="grid grid-cols-3 gap-6 mt-6">

            {/* PIE CHART */}
            <div className="col-span-2 bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Revenue Overview</h2>

              {loading ? (
                <div className="h-72 flex items-center justify-center text-gray-400">
                  Loading chart...
                </div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        dataKey="value"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* RECENT INVOICES */}
            <div className="bg-white p-5 rounded-xl shadow">
              <h2 className="font-semibold mb-3">Recent Invoices</h2>

              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span>ABC Corp</span>
                  <span className="text-green-500">Paid</span>
                </li>

                <li className="flex justify-between">
                  <span>Widget Ltd</span>
                  <span className="text-yellow-500">Pending</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}