import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { apiRequest } from "../controler/api";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const InvoiceForm = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [trader, setTrader] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [isInterstate, setIsInterstate] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res1 = await apiRequest("/getCustomers");
        const data1 = await res1.json();
        setCustomers(data1.data || []);

        const res2 = await apiRequest("/getItems");
        const data2 = await res2.json();
        setItems(data2.data || []);

        const res3 = await apiRequest("/getTrader");
        const data3 = await res3.json();
        setTrader(data3.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);

  const handleCustomerChange = (e) => {
    const code = parseInt(e.target.value);
    const customer = customers.find((c) => c.code === code);
    setSelectedCustomer(customer);

    if (customer && trader) {
      setIsInterstate(customer.stateCode !== trader.stateCode);
    }
  };

  const addItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { itemCode: "", quantity: 1, rate: 0, sgst: 0, cgst: 0, igst: 0 },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;

    if (field === "itemCode") {
      const selected = items.find((i) => i.code === parseInt(value));
      if (selected) {
        updated[index].rate = selected.rate || 0;
        updated[index].sgst = selected.sgst || 0;
        updated[index].cgst = selected.cgst || 0;
        updated[index].igst = selected.igst || 0;
      }
    }

    setInvoiceItems(updated);
  };

  const calculateRow = (item) => {
    const taxable = item.quantity * item.rate;

    const sgst = isInterstate ? 0 : (taxable * item.sgst) / 100;
    const cgst = isInterstate ? 0 : (taxable * item.cgst) / 100;
    const igst = isInterstate ? (taxable * item.igst) / 100 : 0;

    const total = taxable + sgst + cgst + igst;

    return { taxable, sgst, cgst, igst, total };
  };

  const totalSummary = () => {
    let subtotal = 0,
      sgstTotal = 0,
      cgstTotal = 0,
      igstTotal = 0;

    invoiceItems.forEach((item) => {
      const row = calculateRow(item);
      subtotal += row.taxable;
      sgstTotal += row.sgst;
      cgstTotal += row.cgst;
      igstTotal += row.igst;
    });

    const totalTax = sgstTotal + cgstTotal + igstTotal;

    return {
      subtotal,
      sgstTotal,
      cgstTotal,
      igstTotal,
      totalTax,
      grandTotal: subtotal + totalTax,
    };
  };

  const handleSubmit = async () => {
    if (!selectedCustomer || !invoiceDate || invoiceItems.length === 0) {
      return setSnackbar({
        open: true,
        message: "Fill all fields",
        severity: "error",
      });
    }

    try {
      const res = await apiRequest("/addInvoice", {
        method: "POST",
        body: JSON.stringify({
          customerCode: selectedCustomer.code,
          invoiceDate,
        }),
      });

      const data = await res.json();
      const invoiceCode = data.invoiceCode;

      for (let i of invoiceItems) {
        await apiRequest("/addInvoiceItem", {
          method: "POST",
          body: JSON.stringify({
            invoiceCode,
            itemCode: i.itemCode,
            quantity: i.quantity,
            rate: i.rate,
            sgst: isInterstate ? 0 : i.sgst,
            cgst: isInterstate ? 0 : i.cgst,
            igst: isInterstate ? i.igst : 0,
          }),
        });
      }

      setSnackbar({
        open: true,
        message: "Invoice Created",
        severity: "success",
      });

      setInvoiceItems([]);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error",
        severity: "error",
      });
    }
  };

  const summary = totalSummary();
  return (
  <Box p={4} bgcolor="#f5f6fa" minHeight="100vh">
    <Paper elevation={4} style={{ padding: 24, borderRadius: 12 }}>
      
      <Typography variant="h4" gutterBottom>
        🧾 Create Invoice
      </Typography>

      {/* Customer + Date */}
      <Box display="flex" gap={3} mb={3}>
        <TextField
          fullWidth
          select
          label="Select Customer"
          variant="outlined"
          value={selectedCustomer ? selectedCustomer.code : ""}
          onChange={handleCustomerChange}
        >
          {customers.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Invoice Date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
        />
      </Box>

      {/* Add Item Button */}
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={addItem}
        >
          + Add Item
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={2} style={{ borderRadius: 10 }}>
        <Table>
          <TableHead style={{ background: "#1976d2" }}>
            <TableRow>
              {["Item", "Qty", "Rate", "Taxable", "SGST", "CGST", "IGST", "Total"].map((h) => (
                <TableCell key={h} style={{ color: "#fff", fontWeight: "bold" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {invoiceItems.map((item, i) => {
              const row = calculateRow(item);

              return (
                <TableRow key={i}>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={item.itemCode}
                      onChange={(e) =>
                        handleItemChange(i, "itemCode", e.target.value)
                      }
                    >
                      {items.map((it) => (
                        <MenuItem key={it.code} value={it.code}>
                          {it.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(i, "quantity", +e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(i, "rate", +e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>{row.taxable.toFixed(2)}</TableCell>
                  <TableCell>{row.sgst.toFixed(2)}</TableCell>
                  <TableCell>{row.cgst.toFixed(2)}</TableCell>
                  <TableCell>{row.igst.toFixed(2)}</TableCell>

                  <TableCell style={{ fontWeight: "bold" }}>
                    ₹{row.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* Summary */}
      <Box
        mt={3}
        p={2}
        bgcolor="#e3f2fd"
        borderRadius={10}
      >
        <Typography>Subtotal: ₹{summary.subtotal.toFixed(2)}</Typography>
        <Typography>SGST: ₹{summary.sgstTotal.toFixed(2)}</Typography>
        <Typography>CGST: ₹{summary.cgstTotal.toFixed(2)}</Typography>
        <Typography>IGST: ₹{summary.igstTotal.toFixed(2)}</Typography>
        <Typography>Total Tax: ₹{summary.totalTax.toFixed(2)}</Typography>

        <Typography variant="h6" style={{ marginTop: 10 }}>
          Grand Total: ₹{summary.grandTotal.toFixed(2)}
        </Typography>
      </Box>

      {/* Submit */}
      <Box mt={3}>
        <Button
          fullWidth
          size="large"
          variant="contained"
          style={{ background: "#2e7d32", color: "#fff" }}
          onClick={handleSubmit}
        >
          🚀 Create Invoice
        </Button>
      </Box>

    </Paper>

    {/* Snackbar */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </Box>
);
  };

export default InvoiceForm;