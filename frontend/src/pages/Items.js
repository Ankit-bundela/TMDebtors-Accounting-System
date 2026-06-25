import { useEffect, useState } from "react";
const getToken = () => localStorage.getItem("token");

const API = "http://localhost:8000";

export default function Items() {

  const [items, setItems] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [selectedUoms, setSelectedUoms] = useState([]);

  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    code: null,
    name: "",
    hsnCode: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
  });

  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // ---------------- FETCH ITEMS ----------------
  const fetchItems = async () => {
    const res = await fetch(`${API}/getItems`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setItems(data.data || []);
  };

  // ---------------- FETCH UOMS ----------------
  const fetchUoms = async () => {
    const res = await fetch(`${API}/getAllUOMs`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    setUoms(data.data || []);
  };

  useEffect(() => {
    fetchItems();
    fetchUoms();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // ---------------- INPUT ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------- ADD ----------------
  const handleAdd = async () => {
    const payload = {
      ...form,
      unitofMeasurments: selectedUoms
    };

    await fetch(`${API}/addItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    fetchItems();
    resetForm();
  };

  // ---------------- EDIT ----------------
  const handleEdit = (item) => {
    setForm(item);
    setSelectedUoms(item.unitofMeasurments || []);
    setIsEdit(true);
    setShowForm(true);
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    const payload = {
      ...form,
      unitofMeasurments: selectedUoms
    };

    await fetch(`${API}/updateItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    fetchItems();
    resetForm();
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (code) => {
    await fetch(`${API}/deleteItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ code }),
    });

    fetchItems();
    if (selected?.code === code) setSelected(null);
  };

  // ---------------- RESET ----------------
  const resetForm = () => {
    setForm({
      code: null,
      name: "",
      hsnCode: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
    });

    setSelectedUoms([]);
    setIsEdit(false);
    setShowForm(false);
  };

  // ---------------- PAGINATION ----------------
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Item Master</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">CODE</th>
            <th className="border p-2">NAME</th>
            <th className="border p-2">HSN</th>
            <th className="border p-2">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.map((item) => (
            <tr
              key={item.code}
              onClick={() => setSelected(item)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="border p-2">{item.code}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.hsnCode}</td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
                  }}
                  className="bg-yellow-400 px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.code);
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">

        <div className="text-sm text-gray-600">
          Showing {start + 1} to {Math.min(start + pageSize, items.length)} of {items.length}
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: Math.ceil(items.length / pageSize) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.min(p + 1, Math.ceil(items.length / pageSize))
              )
            }
            disabled={currentPage === Math.ceil(items.length / pageSize)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>

      {/* DETAILS */}
      <div className="border-t pt-4 mt-4">

        {!selected ? (
          <div className="text-center text-gray-500 py-6">
            <p className="text-lg font-medium">No Item Selected</p>
            <p className="text-sm">Please select an item from the table</p>
          </div>
        ) : (
          <div className="space-y-2">

            <h2 className="text-lg font-semibold">Item Details</h2>

            <p><b>Name:</b> {selected.name}</p>
            <p><b>HSN:</b> {selected.hsnCode}</p>

            <p>
              <b>Tax:</b> CGST {selected.cgst}% | SGST {selected.sgst}% | IGST {selected.igst}%
            </p>

            <p>
              <b>UOM:</b>{" "}
              {selected.unitofMeasurments?.length
                ? selected.unitofMeasurments.map(u => u.name).join(", ")
                : "Not Assigned"}
            </p>

          </div>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">

            <h2 className="text-lg font-bold mb-3">
              {isEdit ? "Update Item" : "Add Item"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border p-2 mb-2"
            />

            <input
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              placeholder="HSN Code"
              className="w-full border p-2 mb-2"
            />

            {/* TAX */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <input name="cgst" value={form.cgst} onChange={handleChange} placeholder="CGST" className="border p-2" />
              <input name="sgst" value={form.sgst} onChange={handleChange} placeholder="SGST" className="border p-2" />
              <input name="igst" value={form.igst} onChange={handleChange} placeholder="IGST" className="border p-2" />
            </div>

            {/* UOM */}
            <select
              multiple
              className="w-full border p-2 mb-3"
              value={selectedUoms.map(u => u.code)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(opt => ({
                  code: parseInt(opt.value),
                  name: opt.text
                }));
                setSelectedUoms(selected);
              }}
            >
              {uoms.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="border px-3 py-1">
                Cancel
              </button>

              <button
                onClick={isEdit ? handleUpdate : handleAdd}
                className="bg-green-500 text-white px-3 py-1 rounded"
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