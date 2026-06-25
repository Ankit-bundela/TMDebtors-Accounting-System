import { useEffect, useState } from "react";
import TMAlert from "../components/TMAlert";
const getToken = () => localStorage.getItem("token");

const API = "http://localhost:8000";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [states, setStates] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [selected, setSelected] = useState(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [form, setForm] = useState({
    code: null,
    name: "",
    address: "",
    stateCode: "",
    regTitle1: "",
    regValue1: "",
    regTitle2: "",
    regValue2: "",
    regTitle3: "",
    regValue3: "",
    contact1: "",
    contact2: "",
    contact3: "",
  });

  // ---------------- FETCH CUSTOMERS ----------------
  const fetchCustomers = async () => {
  try {
    const res = await fetch(`${API}/getCustomers`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
     if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await res.json();
    setCustomers(data.data || []);
  } catch (err) {
    showAlert("Error fetching customers", "error");
  }
};

  // ---------------- FETCH STATES ----------------
  const fetchStates = async () => {
  try {
    const res = await fetch(`${API}/getStates`, {
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
    fetchCustomers();
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
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await fetch(`${API}/addCustomer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Customer Added Successfully", "success");
        fetchCustomers();
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
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await fetch(`${API}/updateCustomer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Customer Updated Successfully", "success");
        fetchCustomers();
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
      const formData = new FormData();
      formData.append("code", code);

      const res = await fetch(`${API}/removeCustomer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Customer Deleted", "success");
        fetchCustomers();
      } else {
        showAlert(data.detail || "Delete Failed", "error");
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
      stateCode: "",
      regTitle1: "",
      regValue1: "",
      regTitle2: "",
      regValue2: "",
      regTitle3: "",
      regValue3: "",
      contact1: "",
      contact2: "",
      contact3: "",
    });
    setIsEdit(false);
    setShowForm(false);
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
        <h1 className="text-xl font-bold">Customer Master</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Customer
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.code} className="hover:bg-gray-50">
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.address}</td>
              <td className="border p-2">{c.stateName || c.stateCode}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-400 px-2 py-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(c.code)}
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
          <div className="bg-white p-6 rounded w-[600px]">

            <h2 className="text-lg font-bold mb-3">
              {isEdit ? "Update Customer" : "Add Customer"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 mb-2"
            />

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border p-2 mb-2"
            />

            {/* STATE DROPDOWN */}
            <select
              name="stateCode"
              value={form.stateCode}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.alphaCode})
                </option>
              ))}
            </select>

            {/* CONTACT */}
            <input name="contact1" onChange={handleChange} placeholder="Contact 1" className="w-full border p-2 mb-2" />
            <input name="contact2" onChange={handleChange} placeholder="Contact 2" className="w-full border p-2 mb-2" />
            <input name="contact3" onChange={handleChange} placeholder="Contact 3" className="w-full border p-2 mb-2" />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="px-3 py-1 border">
                Cancel
              </button>

              <button
                onClick={isEdit ? handleUpdate : handleAdd}
                className="px-3 py-1 bg-green-500 text-white"
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