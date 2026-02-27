/*
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  LinearProgress,
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  InputAdornment
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Add as AddIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";

const AddItemComponent = ({ closeDialog }) => {
  const [name, setName] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [allUnits, setAllUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [itemNameInvalid, setItemNameInvalid] = useState(false);
  const [itemNameHelperText, setItemNameHelperText] = useState("");
  const [cgstInvalid, setCgstInvalid] = useState(false);
  const [sgstInvalid, setSgstInvalid] = useState(false);
  const [igstInvalid, setIgstInvalid] = useState(false);
  const [cgstHelperText, setCgstHelperText] = useState("");
  const [sgstHelperText, setSgstHelperText] = useState("");
  const [igstHelperText, setIgstHelperText] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/getAllUOMs")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setAllUnits(data.data);
        } else {
          console.error("Invalid UOM data", data);
          setAllUnits([]);
        }
      })
      .catch(err => {
        console.error("Error fetching UOMs", err);
        setAllUnits([]);
      });
  }, []);

  const closeSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const itemNameChanged = (ev) => {
    const val = ev.target.value;
    setName(val);

    const isValid = /^[A-Za-z ]+$/.test(val);
    if (val.trim() === "") {
      setItemNameHelperText("");
      setItemNameInvalid(false);
    } else if (val.length > 25) {
      setItemNameHelperText("Name cannot exceed 25 characters");
      setItemNameInvalid(true);
    } else if (!isValid) {
      setItemNameHelperText("Only letters and spaces allowed");
      setItemNameInvalid(true);
    } else {
      setItemNameHelperText("");
      setItemNameInvalid(false);
    }
  };

  const validateTax = (val, setFunc, setErrorFunc, setHelperFunc) => {
    if (val.trim() === "") {
      setHelperFunc("");
      setErrorFunc(false);
    } else if (isNaN(val) || Number(val) < 0 || Number(val) > 100) {
      setHelperFunc("Enter a valid number between 0 and 100");
      setErrorFunc(true);
    } else {
      setHelperFunc("");
      setErrorFunc(false);
    }
    setFunc(val);
  };

  const addItem = async () => {
    if (!name.trim()) {
      setSnackbarMessage("Item name is required!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    if (selectedUnits.length === 0) {
      setSnackbarMessage("Please select at least one Unit of Measurement!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/addItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cgst: parseFloat(cgst) || 0,
          sgst: parseFloat(sgst) || 0,
          igst: parseFloat(igst) || 0,
          hsnCode: hsnCode.trim(),
          unitofMeasurments: selectedUnits.map(uom => ({
            code: uom.code,
            name: uom.name
          }))
        })
      });

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        setSnackbarMessage("✅ Item added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setName("");
        setCgst("");
        setSgst("");
        setIgst("");
        setHsnCode("");
        setSelectedUnits([]);
        setTimeout(() => closeDialog(), 1000);
      } else {
        setSnackbarMessage(data.error || "Failed to add item.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("⚠️ Error adding item!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper elevation={4} style={{ padding: "32px", borderRadius: "16px", maxWidth: 550, margin: "auto" }}>
      {loading && <LinearProgress />}

      <Box mb={2} textAlign="center">
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          Add Item Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fill all necessary fields to register a new item.
        </Typography>
      </Box>

      <TextField
        label="Item Name"
        value={name}
        onChange={itemNameChanged}
        helperText={itemNameHelperText}
        error={itemNameInvalid}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="CGST (%)"
            type="number"
            value={cgst}
            onChange={(e) => validateTax(e.target.value, setCgst, setCgstInvalid, setCgstHelperText)}
            helperText={cgstHelperText}
            error={cgstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="SGST (%)"
            type="number"
            value={sgst}
            onChange={(e) => validateTax(e.target.value, setSgst, setSgstInvalid, setSgstHelperText)}
            helperText={sgstHelperText}
            error={sgstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="IGST (%)"
            type="number"
            value={igst}
            onChange={(e) => validateTax(e.target.value, setIgst, setIgstInvalid, setIgstHelperText)}
            helperText={igstHelperText}
            error={igstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
      </Grid>

      <TextField
        label="HSN Code"
        value={hsnCode}
        onChange={(e) => setHsnCode(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Autocomplete
        multiple
        options={allUnits}
        getOptionLabel={(option) => option.name}
        value={selectedUnits}
        onChange={(e, newVal) => setSelectedUnits(newVal)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Units of Measurement"
            placeholder="Select Units"
            variant="outlined"
            margin="normal"
          />
        )}
      />

      <Divider style={{ margin: "24px 0" }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        style={{ borderRadius: 8, padding: "10px 0", fontWeight: 600 }}
        startIcon={<AddIcon />}
        onClick={addItem}
        disabled={loading}
      >
        Add Item
      </Button>

      <TMAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
        duration={5000}
      />
    </Paper>
  );
};
export default AddItemComponent;
*/
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  LinearProgress,
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  InputAdornment
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Add as AddIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";

const AddItemComponent = ({ closeDialog }) => {
  const [name, setName] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [allUnits, setAllUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [itemNameInvalid, setItemNameInvalid] = useState(false);
  const [itemNameHelperText, setItemNameHelperText] = useState("");
  const [cgstInvalid, setCgstInvalid] = useState(false);
  const [sgstInvalid, setSgstInvalid] = useState(false);
  const [igstInvalid, setIgstInvalid] = useState(false);
  const [cgstHelperText, setCgstHelperText] = useState("");
  const [sgstHelperText, setSgstHelperText] = useState("");
  const [igstHelperText, setIgstHelperText] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/getAllUOMs")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setAllUnits(data.data);
        } else {
          console.error("Invalid UOM data", data);
          setAllUnits([]);
        }
      })
      .catch(err => {
        console.error("Error fetching UOMs", err);
        setAllUnits([]);
      });
  }, []);

  const closeSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const itemNameChanged = (ev) => {
    const val = ev.target.value;
    setName(val);

    const isValid = /^[A-Za-z ]+$/.test(val);
    if (val.trim() === "") {
      setItemNameHelperText("");
      setItemNameInvalid(false);
    } else if (val.length > 25) {
      setItemNameHelperText("Name cannot exceed 25 characters");
      setItemNameInvalid(true);
    } else if (!isValid) {
      setItemNameHelperText("Only letters and spaces allowed");
      setItemNameInvalid(true);
    } else {
      setItemNameHelperText("");
      setItemNameInvalid(false);
    }
  };

  const validateTax = (val, setFunc, setErrorFunc, setHelperFunc) => {
    if (val.trim() === "") {
      setHelperFunc("");
      setErrorFunc(false);
    } else if (isNaN(val) || Number(val) < 0 || Number(val) > 100) {
      setHelperFunc("Enter a valid number between 0 and 100");
      setErrorFunc(true);
    } else {
      setHelperFunc("");
      setErrorFunc(false);
    }
    setFunc(val);
  };

  const addItem = async () => {
    if (!name.trim()) {
      setSnackbarMessage("Item name is required!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    if (selectedUnits.length === 0) {
      setSnackbarMessage("Please select at least one Unit of Measurement!");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: Date.now(), // Unique code
        name,
        cgst: parseFloat(cgst) || 0,
        sgst: parseFloat(sgst) || 0,
        igst: parseFloat(igst) || 0,
        hsnCode: hsnCode.trim(),
        unitofMeasurments: selectedUnits.map(uom => ({
          code: uom.code,
          name: uom.name
        }))
      };

      const response = await fetch("/addItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setSnackbarMessage("✅ Item added successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // reset form
        setName("");
        setCgst("");
        setSgst("");
        setIgst("");
        setHsnCode("");
        setSelectedUnits([]);
        setTimeout(() => closeDialog(), 1000);
      } else {
        setSnackbarMessage(data.error || "Failed to add item.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("⚠️ Error adding item!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper elevation={4} style={{ padding: "32px", borderRadius: "16px", maxWidth: 550, margin: "auto" }}>
      {loading && <LinearProgress />}

      <Box mb={2} textAlign="center">
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          Add Item Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fill all necessary fields to register a new item.
        </Typography>
      </Box>

      <TextField
        label="Item Name"
        value={name}
        onChange={itemNameChanged}
        helperText={itemNameHelperText}
        error={itemNameInvalid}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="CGST (%)"
            type="number"
            value={cgst}
            onChange={(e) => validateTax(e.target.value, setCgst, setCgstInvalid, setCgstHelperText)}
            helperText={cgstHelperText}
            error={cgstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="SGST (%)"
            type="number"
            value={sgst}
            onChange={(e) => validateTax(e.target.value, setSgst, setSgstInvalid, setSgstHelperText)}
            helperText={sgstHelperText}
            error={sgstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="IGST (%)"
            type="number"
            value={igst}
            onChange={(e) => validateTax(e.target.value, setIgst, setIgstInvalid, setIgstHelperText)}
            helperText={igstHelperText}
            error={igstInvalid}
            variant="outlined"
            fullWidth
            InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
          />
        </Grid>
      </Grid>

      <TextField
        label="HSN Code"
        value={hsnCode}
        onChange={(e) => setHsnCode(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Autocomplete
        multiple
        options={allUnits}
        getOptionLabel={(option) => option.name}
        value={selectedUnits}
        onChange={(e, newVal) => setSelectedUnits(newVal)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Units of Measurement"
            placeholder="Select Units"
            variant="outlined"
            margin="normal"
          />
        )}
      />

      <Divider style={{ margin: "24px 0" }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        style={{ borderRadius: 8, padding: "10px 0", fontWeight: 600 }}
        startIcon={<AddIcon />}
        onClick={addItem}
        disabled={loading}
      >
        Add Item
      </Button>

      <TMAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
        duration={5000}
      />
    </Paper>
  );
};

export default AddItemComponent;