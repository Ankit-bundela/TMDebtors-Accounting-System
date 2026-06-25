import { useEffect, useState } from "react";
import TMAlert from "../components/TMAlert";

const API = "http://localhost:8000";
const getToken = () => localStorage.getItem("token");

export default function Trader() {

  const [traders, setTraders] = useState([]);
  const [states, setStates] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [form, setForm] = useState({
    code: null,
    name: "",
    address: "",
    gstNum: "",
    regTitle1: "",
    regValue1: "",
    contact1: "",
    contact2: "",
    stateCode: "",
    bankName: "",
    accountNo: "",
    branchName: "",
    ifscCode: ""
  });

  // ---------------- FETCH TRADERS ----------------
  const fetchTraders = async () => {
    try {
      const res = await fetch(`${API}/getTraders`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setTraders(data.data || []);
    } catch (err) {
      showAlert("Error fetching traders", "error");
    }
  };

  // ---------------- FETCH STATES ----------------
  const fetchStates = async () => {
    try {
      const res = await fetch(`${API}/getStates`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await res.json();
      setStates(data.data || []);
    } catch (err) {
      showAlert("Error fetching states", "error");
    }
  };

  useEffect(() => {
    fetchTraders();
    fetchStates();
  }, []);

  // ---------------- ALERT ----------------
  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert({ open: false, message: "", severity: "info" });
  };

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- ADD ----------------
  const handleAdd = async () => {
    try {
      const res = await fetch(`${API}/addTrader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Trader Added Successfully", "success");
        fetchTraders();
        resetForm();
      } else {
        showAlert(data.error || "Add Failed", "error");
      }
    } catch (err) {
      showAlert("Server Error", "error");
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setForm(item);
    setIsEdit(true);
    setShowForm(true);
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/updateTrader`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
         },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Trader Updated Successfully", "success");
        fetchTraders();
        resetForm();
      } else {
        showAlert(data.error || "Update Failed", "error");
      }
    } catch (err) {
      showAlert("Server Error", "error");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (code) => {
    try {
      const res = await fetch(`${API}/removeTrader/${code}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Trader Deleted", "success");
        fetchTraders();
      } else {
        showAlert(data.error || "Delete Failed", "error");
      }
    } catch (err) {
      showAlert("Server Error", "error");
    }
  };

  // ---------------- RESET ----------------
  const resetForm = () => {
    setForm({
      code: null,
      name: "",
      address: "",
      gstNum: "",
      regTitle1: "",
      regValue1: "",
      contact1: "",
      contact2: "",
      stateCode: "",
      bankName: "",
      accountNo: "",
      branchName: "",
      ifscCode: ""
    });
    setIsEdit(false);
    setShowForm(false);
  };

  // ---------------- STATE NAME HELPER ----------------
  const getStateName = (code) => {
    const state = states.find(s => s.code === code);
    return state ? state.name : code;
  };

  return (
    <div className="p-6 bg-white rounded shadow">

      {/* ALERT */}
      <TMAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={closeAlert}
      />

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Trader Master</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Trader
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">GST</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">Bank</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {traders.map((t) => (
            <tr key={t.code} className="hover:bg-gray-50">

              <td className="border p-2">{t.code}</td>
              <td className="border p-2">{t.name}</td>
              <td className="border p-2">{t.gstNum}</td>
              <td className="border p-2">{getStateName(t.stateCode)}</td>
              <td className="border p-2">{t.bankName}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-yellow-400 px-2 py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t.code)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 w-[650px] max-h-[90vh] overflow-auto">

            <h2 className="text-lg font-bold mb-3">
              {isEdit ? "Update Trader" : "Add Trader"}
            </h2>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 mb-2" />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 mb-2" />
            <input name="gstNum" value={form.gstNum} onChange={handleChange} placeholder="GST Number" className="w-full border p-2 mb-2" />

            {/* STATE */}
            <select
              name="stateCode"
              value={form.stateCode}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* BANK */}
            <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" className="w-full border p-2 mb-2" />
            <input name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Account No" className="w-full border p-2 mb-2" />
            <input name="branchName" value={form.branchName} onChange={handleChange} placeholder="Branch Name" className="w-full border p-2 mb-2" />
            <input name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="IFSC Code" className="w-full border p-2 mb-2" />

            {/* CONTACT */}
            <input name="contact1" value={form.contact1} onChange={handleChange} placeholder="Contact 1" className="w-full border p-2 mb-2" />
            <input name="contact2" value={form.contact2} onChange={handleChange} placeholder="Contact 2" className="w-full border p-2 mb-2" />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={resetForm} className="border px-3 py-1">
                Cancel
              </button>

              <button
                onClick={isEdit ? handleUpdate : handleAdd}
                className="bg-green-500 text-white px-3 py-1"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}