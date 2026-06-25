import { useEffect, useState } from "react";
import TMAlert from "../components/TMAlert";
const getToken = () => localStorage.getItem("token");

const API = "http://localhost:8000";

export default function Invoice() {

  // ---------------- MASTER DATA ----------------
  const [customers, setCustomers] = useState([]);
  const [traders, setTraders] = useState([]);
  const [items, setItems] = useState([]);

  // ---------------- FORM ----------------
  const [customer, setCustomer] = useState("");
  const [trader, setTrader] = useState("");

  const [rows, setRows] = useState([
    {
      itemCode: "",
      rate: 0,
      qty: 1,
      sgst: 0,
      cgst: 0,
      igst: 0,
      taxable: 0,
      total: 0,
    },
  ]);

  // ---------------- ALERT ----------------
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (msg, type = "info") => {
    setAlert({ open: true, message: msg, severity: type });
  };

  const closeAlert = () => {
    setAlert({ open: false, message: "", severity: "info" });
  };

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchCustomers();
    fetchTraders();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/getCustomers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setCustomers(data.data || []);
    } catch {
      showAlert("Customer load failed", "error");
    }
  };

  const fetchTraders = async () => {
    try {
      const res = await fetch(`${API}/getTraders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setTraders(data.data || []);
    } catch {
      showAlert("Trader load failed", "error");
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API}/getItems`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setItems(data.data || []);
    } catch {
      showAlert("Items load failed", "error");
    }
  };

  // ---------------- ITEM SELECT ----------------
  const handleItemChange = (index, itemCode) => {
    const selected = items.find((i) => i.code == itemCode);

    const updated = [...rows];
    updated[index].itemCode = itemCode;

    updated[index].sgst = selected?.sgst || 0;
    updated[index].cgst = selected?.cgst || 0;
    updated[index].igst = selected?.igst || 0;

    setRows(updated);
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (index, field, value) => {
  const updated = [...rows];

  updated[index][field] = value;

  const rate = Number(updated[index].rate || 0);
  const qty = Number(updated[index].qty || 0);

  const sgst = Number(updated[index].sgst || 0);
  const cgst = Number(updated[index].cgst || 0);
  const igst = Number(updated[index].igst || 0);

  const taxable = rate * qty;

  // ✅ GST calculation (same as backend logic)
  const sgstAmt = taxable * (sgst / 100);
  const cgstAmt = taxable * (cgst / 100);
  const igstAmt = taxable * (igst / 100);

  const totalGST = sgstAmt + cgstAmt + igstAmt;

  updated[index].taxable = taxable.toFixed(2);
  updated[index].total = (taxable + totalGST).toFixed(2);

  setRows(updated);
};

  // ---------------- ADD ROW ----------------
  const addRow = () => {
    setRows([
      ...rows,
      {
        itemCode: "",
        rate: 0,
        qty: 1,
        sgst: 0,
        cgst: 0,
        igst: 0,
        taxable: 0,
        total: 0,
      },
    ]);
  };

  // ---------------- REMOVE ROW ----------------
  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  // ---------------- GRAND TOTAL ----------------
  const grandTotal = rows.reduce(
    (acc, r) => acc + Number(r.total || 0),
    0
  );

  // ---------------- SAVE ----------------
  const saveInvoice = async () => {
    try {
      if (!customer || !trader) {
        showAlert("Select Customer & Trader", "warning");
        return;
      }

      const payload = {
        customerCode: Number(customer),
        traderCode: Number(trader),
        invoiceDate: new Date().toISOString().slice(0, 10),
        createdOn: new Date().toISOString(),
        totalAmount: grandTotal,
        items: rows.map((r) => ({
          itemCode: Number(r.itemCode),
          rate: Number(r.rate),
          quantity: Number(r.qty),
          sgst: Number(r.sgst),
          cgst: Number(r.cgst),
          igst: Number(r.igst),
        })),
      };

      const res = await fetch(`${API}/addInvoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        showAlert(data.detail || "Invoice Failed", "error");
        return;
      }

      showAlert("Invoice Created Successfully 🚀", "success");

      // RESET
      setCustomer("");
      setTrader("");
      setRows([
        {
          itemCode: "",
          rate: 0,
          qty: 1,
          sgst: 0,
          cgst: 0,
          igst: 0,
          taxable: 0,
          total: 0,
        },
      ]);
    } catch (err) {
      console.error(err);
      showAlert("Server Error", "error");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <TMAlert {...alert} onClose={closeAlert} />

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create Invoice
      </h1>

      {/* CUSTOMER + TRADER */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-2 gap-4">

        <select
          className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2 focus:ring-2 focus:ring-blue-400"
          value={trader}
          onChange={(e) => setTrader(e.target.value)}
        >
          <option value="">Select Trader</option>
          {traders.map((t) => (
            <option key={t.code} value={t.code}>
              {t.name}
            </option>
          ))}
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Rate</th>
              <th className="p-3">Qty</th>
              <th className="p-3">SGST</th>
              <th className="p-3">CGST</th>
              <th className="p-3">IGST</th>
              <th className="p-3">Taxable</th>
              <th className="p-3">Total</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="p-2">
                  <select
                    className="border rounded p-1 w-full"
                    value={row.itemCode}
                    onChange={(e) =>
                      handleItemChange(i, e.target.value)
                    }
                  >
                    <option value="">Select Item</option>
                    {items.map((it) => (
                      <option key={it.code} value={it.code}>
                        {it.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    className="border rounded p-1 w-full"
                    value={row.rate}
                    onChange={(e) =>
                      handleChange(i, "rate", e.target.value)
                    }
                  />
                </td>

                <td className="p-2">
                  <input
                    type="number"
                    className="border rounded p-1 w-full"
                    value={row.qty}
                    onChange={(e) =>
                      handleChange(i, "qty", e.target.value)
                    }
                  />
                </td>

                <td className="p-2">{row.sgst}%</td>
                <td className="p-2">{row.cgst}%</td>
                <td className="p-2">{row.igst}%</td>

                <td className="p-2">₹ {row.taxable}</td>
                <td className="p-2 font-bold text-green-600">
                  ₹ {row.total}
                </td>

                <td className="p-2">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-600"
                  >
                    ❌
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-6 items-center">

        <button
          onClick={addRow}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          + Add Row
        </button>

        <div className="flex items-center gap-4">
          <span className="text-lg font-bold">
            Total: ₹ {grandTotal.toFixed(2)}
          </span>

          <button
            onClick={saveInvoice}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Save Invoice
          </button>
        </div>

      </div>

    </div>
  );
}