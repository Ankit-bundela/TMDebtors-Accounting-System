
import React, { useEffect, useState } from "react";
import TMAlert from "./TMAlert";
import { Person, Email, VerifiedUser, CalendarToday, Money } from "@material-ui/icons";

const Home = () => {
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: "" });

  // Fetch data
  const getCustomers = async () => {
    try {
      const res = await fetch("/getCustomers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      setAlert({ open: true, message: "Failed to fetch customers" });
      return [];
    }
  };

  const getAllInvoices = async () => {
    try {
      const res = await fetch("/getAllInvoices");
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      setAlert({ open: true, message: "Failed to fetch invoices" });
      return [];
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await fetch("/getAllUsers");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data.success ? data.data : [];
    } catch {
      setAlert({ open: true, message: "Failed to fetch users" });
      return [];
    }
  };

  const getLastInvoiceDate = () => {
    if (!invoices.length) return "N/A";
    const dates = invoices.map((inv) => new Date(inv.date || inv.invoiceDate));
    const lastDate = new Date(Math.max(...dates));
    return lastDate.toLocaleDateString();
  };

  const getPendingDues = () => {
    return invoices.reduce((total, invoice) => {
      const paid = invoice.paidAmount || 0;
      const totalAmount = invoice.totalAmount || 0;
      return total + (totalAmount - paid);
    }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const cust = await getCustomers();
      const inv = await getAllInvoices();
      const usersList = await getAllUsers();
      setCustomers(cust);
      setInvoices(inv);
      setUsers(usersList);
      setLoading(false);
    };
    fetchData();
  }, []);

  const loadingSkeleton = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-gray-200 p-6 animate-pulse flex flex-col justify-between"
        >
          <div className="h-4 w-20 bg-gray-300 rounded mb-3"></div>
          <div className="h-10 w-32 bg-gray-400 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#edf4fc]">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">📊 Dashboard</h1>

      {alert.open && (
        <TMAlert
          message={alert.message}
          onClose={() => setAlert({ open: false, message: "" })}
        />
      )}

      {loading ? (
        loadingSkeleton
      ) : (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Customers"
              value={customers.length}
              icon={<Person className="text-blue-500" />}
              bgGradient="from-blue-100 to-blue-200"
            />
            <StatCard
              title="Total Invoices"
              value={invoices.length}
              icon={<VerifiedUser className="text-green-500" />}
              bgGradient="from-green-100 to-green-200"
            />
            <StatCard
              title="Last Invoice Date"
              value={getLastInvoiceDate()}
              icon={<CalendarToday className="text-purple-500" />}
              bgGradient="from-purple-100 to-purple-200"
            />
            <StatCard
              title="Pending Dues"
              value={`₹${getPendingDues()}`}
              icon={<Money className="text-red-500" />}
              bgGradient="from-red-100 to-red-200"
            />
          </div>

          {/* Users Table */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Registered Users</h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow p-4">
            <table className="min-w-full text-gray-700 table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left flex items-center gap-1">
                    <Person fontSize="small" /> Name
                  </th>
                  <th className="px-4 py-2 text-left flex items-center gap-1">
                    <Email fontSize="small" /> Email
                  </th>
                  <th className="px-4 py-2 text-left flex items-center gap-1">
                    <VerifiedUser fontSize="small" /> Role
                  </th>
                  <th className="px-4 py-2 text-left flex items-center gap-1">
                    <CalendarToday fontSize="small" /> Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b hover:bg-gray-50 transition-all ${
                      user.role === "admin" ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.name?.trim()}</td>
                    <td className="px-4 py-2">{user.email?.trim()}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Reusable Dashboard Card
const StatCard = ({ title, value, icon, bgGradient }) => (
  <div
    className={`rounded-2xl shadow-lg p-6 border border-transparent hover:border-gray-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-r ${bgGradient} flex flex-col justify-between`}
  >
    <div className="flex items-center gap-2 mb-2">
      {icon} <span className="text-sm text-gray-600">{title}</span>
    </div>
    <div className="text-3xl font-bold text-gray-800">{value}</div>
  </div>
);

export default Home;