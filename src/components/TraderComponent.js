
/*import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TMAlert from "./TMAlert";

const TraderComponent = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [traderLoading, setTraderLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [formData, setFormData] = useState({
    code: "",
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
    ifscCode: "",
  });

  useEffect(() => {
    fetch("/getTrader")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const t = data.data;
          setFormData({
            code: t.code || "",
            name: t.name || "",
            address: t.address || "",
            gstNum: t.gstNum || "",
            regTitle1: t.regTitle1 || "",
            regValue1: t.regValue1 || "",
            contact1: t.contact1 || "",
            contact2: t.contact2 || "",
            stateCode: t.stateCode || "",
            bankName: t.bankName || "",
            accountNo: t.accountNo || "",
            branchName: t.branchName || "",
            ifscCode: t.ifscCode || "",
          });
        }
        setTraderLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trader:", err);
        setTraderLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("/getStates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStates(data.data || []);
        } else {
          console.error("Failed to fetch states:", data.error);
          setStates([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching states:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch("/updateTrader", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      const result = await res.json();
      setTimeout(() => {
        setUpdating(false);
        setAlert({
          open: true,
          message: result.success ? "Trader updated successfully!" : result.error,
          severity: result.success ? "success" : "error",
        });
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        setUpdating(false);
        setAlert({ open: true, message: "Something went wrong!", severity: "error" });
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <Typography variant="h5" align="center" className="mb-6 text-indigo-700 font-semibold">
          Trader Details
        </Typography>

        {traderLoading ? (
          <div className="flex justify-center items-center h-48">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="Code" name="code" value={formData.code} onChange={handleChange} required fullWidth />
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
              <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required fullWidth multiline />
              <TextField label="GST Number" name="gstNum" value={formData.gstNum} onChange={handleChange} required fullWidth />
              {loading ? (
                <div className="flex items-center justify-center h-14">
                  <CircularProgress size={20} />
                </div>
              ) : (
                <Autocomplete
                  options={states}
                  getOptionLabel={(state) => state.name}
                  value={states.find((s) => s.code === formData.stateCode) || null}
                  onChange={(e, newValue) => setFormData({ ...formData, stateCode: newValue ? newValue.code : "" })}
                  renderInput={(params) => <TextField {...params} label="State" variant="outlined" required fullWidth />}
                />
              )}
            </div>

            <div>
              <Typography variant="h6" className="text-gray-700 mb-2">Bank Details</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} required fullWidth />
                <TextField label="Account No" name="accountNo" value={formData.accountNo} onChange={handleChange} required fullWidth />
                <TextField label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} required fullWidth />
                <TextField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} required fullWidth />
              </div>
            </div>

            <div>
              <Typography variant="h6" className="text-gray-700 mb-2">Contact Details</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Contact 1" name="contact1" value={formData.contact1} onChange={handleChange} fullWidth />
                <TextField label="Contact 2" name="contact2" value={formData.contact2} onChange={handleChange} fullWidth />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={updating}>
                {updating ? <CircularProgress size={24} /> : <Typography variant="h6">Update Trader</Typography>}
              </Button>
            </div>
          </form>
        )}
      </div>
      <TMAlert open={alert.open} message={alert.message} severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })} />
    </div>
  );
};

export default TraderComponent;
*/
import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TMAlert from "./TMAlert";
import { apiRequest } from "../controler/api"; // 🔥 IMPORTANT

const TraderComponent = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [traderLoading, setTraderLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState({
    code: "",
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
    ifscCode: "",
  });

  // ✅ GET TRADER
  useEffect(() => {
    const loadTrader = async () => {
      try {
        const res = await apiRequest("/getTrader");
        const data = await res.json();

        if (data.success && data.data) {
          setFormData({
            code: data.data.code || "",
            name: data.data.name || "",
            address: data.data.address || "",
            gstNum: data.data.gstNum || "",
            regTitle1: data.data.regTitle1 || "",
            regValue1: data.data.regValue1 || "",
            contact1: data.data.contact1 || "",
            contact2: data.data.contact2 || "",
            stateCode: data.data.stateCode || "",
            bankName: data.data.bankName || "",
            accountNo: data.data.accountNo || "",
            branchName: data.data.branchName || "",
            ifscCode: data.data.ifscCode || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTraderLoading(false);
      }
    };

    loadTrader();
  }, []);

  // ✅ GET STATES
  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await apiRequest("/getStates");
        const data = await res.json();

        if (data.success) {
          setStates(data.data || []);
        } else {
          setStates([]);
        }
      } catch (err) {
        console.error(err);
        setStates([]);
      } finally {
        setLoading(false);
      }
    };

    loadStates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE TRADER (FIXED)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpdating(true);

    try {
      const res = await apiRequest("/updateTrader", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      setAlert({
        open: true,
        message: result.success
          ? "Trader updated successfully!"
          : result.error || "Update failed",
        severity: result.success ? "success" : "error",
      });
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: "Something went wrong!",
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-2xl p-6">
        <Typography variant="h5" align="center">
          Trader Details
        </Typography>

        {traderLoading ? (
          <div className="flex justify-center items-center h-48">
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField name="code" value={formData.code} onChange={handleChange} fullWidth />
              <TextField name="name" value={formData.name} onChange={handleChange} fullWidth />
              <TextField name="address" value={formData.address} onChange={handleChange} fullWidth multiline />
              <TextField name="gstNum" value={formData.gstNum} onChange={handleChange} fullWidth />
            </div>

            {/* STATE */}
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <Autocomplete
                options={states}
                getOptionLabel={(s) => s.name}
                value={states.find((s) => s.code === formData.stateCode) || null}
                onChange={(e, newValue) =>
                  setFormData({
                    ...formData,
                    stateCode: newValue ? newValue.code : "",
                  })
                }
                renderInput={(params) => (
                  <TextField {...params} label="State" variant="outlined" fullWidth />
                )}
              />
            )}

            {/* BANK */}
            <TextField name="bankName" value={formData.bankName} onChange={handleChange} fullWidth />
            <TextField name="accountNo" value={formData.accountNo} onChange={handleChange} fullWidth />
            <TextField name="branchName" value={formData.branchName} onChange={handleChange} fullWidth />
            <TextField name="ifscCode" value={formData.ifscCode} onChange={handleChange} fullWidth />

            {/* CONTACT */}
            <TextField name="contact1" value={formData.contact1} onChange={handleChange} fullWidth />
            <TextField name="contact2" value={formData.contact2} onChange={handleChange} fullWidth />

            <Button type="submit" variant="contained" color="primary" fullWidth disabled={updating}>
              {updating ? <CircularProgress size={24} /> : "Update Trader"}
            </Button>
          </form>
        )}
      </div>

      <TMAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
};

export default TraderComponent;