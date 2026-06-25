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
  Grid
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Save as SaveIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";

const EditItemComponent = ({ closeDialog, selectedItem }) => {
  const [name, setName] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [allUnits, setAllUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  useEffect(() => {
    fetch("/getAllUOMs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllUnits(data.data);
          if (selectedItem) {
            const matchedUnits = data.data.filter((uom) =>
              selectedItem.unitofMeasurments.some((s) => s.code === uom.code)
            );
            setSelectedUnits(matchedUnits);
          }
        } else {
          setAllUnits([]);
        }
      })
      .catch(() => setAllUnits([]));
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
      setCgst(selectedItem.cgst);
      setSgst(selectedItem.sgst);
      setIgst(selectedItem.igst);
      setHsnCode(selectedItem.hsnCode || "");
    }
  }, [selectedItem]);

  const closeAlert = () => setAlertOpen(false);

  const updateItem = async () => {
    if (!name.trim()) {
      setAlertMessage("Item name is required!");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }
    if (selectedUnits.length === 0) {
      setAlertMessage("Please select at least one Unit of Measurement!");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/updateItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: selectedItem.code,
          name,
          cgst: parseFloat(cgst) || 0,
          sgst: parseFloat(sgst) || 0,
          igst: parseFloat(igst) || 0,
          hsnCode: hsnCode || "",
          unitofMeasurments: selectedUnits.map((uom) => ({
            code: uom.code,
            name: uom.name
          }))
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setAlertMessage("✅ Item updated successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);
        setTimeout(() => closeDialog(), 1000);
      } else {
        setAlertMessage(data.error || "Failed to update item.");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (error) {
      setLoading(false);
      setAlertMessage("⚠️ Error updating item!");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  return (
    <Paper
      elevation={4}
      style={{
        padding: "30px",
        maxWidth: "600px",
        borderRadius: "16px",
        margin: "20px auto",
        backgroundColor: "#fafafa"
      }}
    >
      {loading && <LinearProgress color="primary" />}

      <Box mb={3} textAlign="center">
        <Typography variant="h5" style={{ fontWeight: 600 }}>
           Edit Item Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Make changes and click Update.
        </Typography>
      </Box>&nbsp;

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Item Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="CGST (%)"
            type="number"
            value={cgst}
            onChange={(ev) => setCgst(ev.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="SGST (%)"
            type="number"
            value={sgst}
            onChange={(ev) => setSgst(ev.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="IGST (%)"
            type="number"
            value={igst}
            onChange={(ev) => setIgst(ev.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="HSN Code"
            value={hsnCode}
            onChange={(ev) => setHsnCode(ev.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={allUnits}
            getOptionLabel={(option) => option.name}
            value={selectedUnits}
            onChange={(event, newValue) => setSelectedUnits(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Unit of Measurements"
                placeholder="Select Units"
              />
            )}
          />
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        startIcon={<SaveIcon />}
        onClick={updateItem}
        disabled={loading}
        style={{ fontWeight: 600 }}
      >
        Update Item
      </Button>

      <TMAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={closeAlert}
        duration={5000}
      />
    </Paper>
  );
};

export default EditItemComponent;
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
  Grid
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Save as SaveIcon } from "@material-ui/icons";
import TMAlert from "../components/TMAlert";
import { apiRequest } from "../controler/api"; //  IMPORTANT

const EditItemComponent = ({ closeDialog, selectedItem }) => {
  const [name, setName] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [hsnCode, setHsnCode] = useState("");

  const [allUnits, setAllUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  // ✅ Load Units
  useEffect(() => {
    const loadUnits = async () => {
      try {
        const res = await apiRequest("/getAllUOMs");
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setAllUnits(data.data);

          if (selectedItem?.unitofMeasurments) {
            const matched = data.data.filter((uom) =>
              selectedItem.unitofMeasurments.some(
                (s) => s.code === uom.code
              )
            );
            setSelectedUnits(matched);
          }
        }
      } catch (err) {
        setAllUnits([]);
      }
    };

    loadUnits();
  }, [selectedItem]);

  // ✅ Set existing data
  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name || "");
      setCgst(selectedItem.cgst || 0);
      setSgst(selectedItem.sgst || 0);
      setIgst(selectedItem.igst || 0);
      setHsnCode(selectedItem.hsnCode || "");
    }
  }, [selectedItem]);

  const updateItem = async () => {
    if (!name.trim()) {
      setAlertMessage("Item name is required!");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    if (selectedUnits.length === 0) {
      setAlertMessage("Select at least one unit!");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    setLoading(true);

    try {
      const res = await apiRequest("/updateItem", {
        method: "POST",
        body: JSON.stringify({
          code: selectedItem.code,
          name,
          cgst: Number(cgst),
          sgst: Number(sgst),
          igst: Number(igst),
          hsnCode,
          unitofMeasurments: selectedUnits.map((u) => ({
            code: u.code,
            name: u.name
          }))
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setAlertMessage("Item updated successfully!");
        setAlertSeverity("success");
        setAlertOpen(true);

        setTimeout(() => closeDialog?.(), 1000);
      } else {
        setAlertMessage(data.error || "Update failed!");
        setAlertSeverity("error");
        setAlertOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setAlertMessage("Server error while updating item!");
      setAlertSeverity("error");
      setAlertOpen(true);
    }
  };

  return (
    <Paper
      elevation={4}
      style={{
        padding: "30px",
        maxWidth: "600px",
        borderRadius: "16px",
        margin: "20px auto",
        backgroundColor: "#fafafa"
      }}
    >
      {loading && <LinearProgress />}

      <Box mb={3} textAlign="center">
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          Edit Item Details
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Update and save changes
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="CGST"
            value={cgst}
            type="number"
            onChange={(e) => setCgst(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="SGST"
            value={sgst}
            type="number"
            onChange={(e) => setSgst(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="IGST"
            value={igst}
            type="number"
            onChange={(e) => setIgst(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="HSN Code"
            value={hsnCode}
            onChange={(e) => setHsnCode(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            options={allUnits}
            getOptionLabel={(option) => option.name}
            value={selectedUnits}
            onChange={(e, newValue) => setSelectedUnits(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Units"
                variant="outlined"
              />
            )}
          />
        </Grid>
      </Grid>

      <Divider style={{ margin: "20px 0" }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<SaveIcon />}
        onClick={updateItem}
        disabled={loading}
      >
        Update Item
      </Button>

      <TMAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
        duration={4000}
      />
    </Paper>
  );
};

export default EditItemComponent;