// src/components/InvoiceDetail.js
/*import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { useParams } from "react-router-dom";

const InvoiceDetail = () => {
  const { invoiceCode } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const res = await fetch(`/getInvoiceDetails?invoiceCode=${invoiceCode}`);
      const data = await res.json();
      if (data.success) {
        setInvoice(data.data);
      } else {
        alert("Invoice not found!");
      }
    };
    fetchInvoice();
  }, [invoiceCode]);

  if (!invoice) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5">Invoice #{invoice.code}</Typography>
      <Typography variant="subtitle1">Date: {invoice.invoiceDate}</Typography>
      <Typography variant="subtitle2">Customer: {invoice.customerName}</Typography>

      <Paper style={{ marginTop: 16, padding: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>SGST%</TableCell>
              <TableCell>CGST%</TableCell>
              <TableCell>IGST%</TableCell>
              <TableCell>Taxable</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items.map((i, idx) => (
              <TableRow key={idx}>
                <TableCell>{i.itemName}</TableCell>
                <TableCell>{i.quantity}</TableCell>
                <TableCell>{i.rate}</TableCell>
                <TableCell>{i.sgst}</TableCell>
                <TableCell>{i.cgst}</TableCell>
                <TableCell>{i.igst}</TableCell>
                <TableCell>{i.taxableAmount.toFixed(2)}</TableCell>
                <TableCell>{i.totalAmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box mt={2}>
        <Typography>Grand Total: ₹{invoice.totalAmount}</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceDetail;
*/
// src/components/InvoiceDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const InvoiceDetail = () => {
  const { invoiceCode } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const res = await fetch(`/getInvoiceDetails?invoiceCode=${invoiceCode}`);
      const data = await res.json();
      if (data.success) {
        setInvoice(data.data);
      } else {
        alert("Invoice not found!");
      }
    };
    fetchInvoice();
  }, [invoiceCode]);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl font-semibold text-gray-500">Loading invoice...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.code}</h1>
        <p className="text-gray-600 mt-1">Date: {invoice.invoiceDate}</p>
        <p className="text-gray-600">Customer: {invoice.customerName}</p>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Item</th>
              <th className="px-4 py-2 text-center text-sm font-medium">Qty</th>
              <th className="px-4 py-2 text-center text-sm font-medium">Rate</th>
              <th className="px-4 py-2 text-center text-sm font-medium">SGST%</th>
              <th className="px-4 py-2 text-center text-sm font-medium">CGST%</th>
              <th className="px-4 py-2 text-center text-sm font-medium">IGST%</th>
              <th className="px-4 py-2 text-center text-sm font-medium">Taxable</th>
              <th className="px-4 py-2 text-center text-sm font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoice.items.map((i, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{i.itemName}</td>
                <td className="px-4 py-2 text-center">{i.quantity}</td>
                <td className="px-4 py-2 text-center">₹{i.rate}</td>
                <td className="px-4 py-2 text-center">{i.sgst}%</td>
                <td className="px-4 py-2 text-center">{i.cgst}%</td>
                <td className="px-4 py-2 text-center">{i.igst}%</td>
                <td className="px-4 py-2 text-center">₹{i.taxableAmount.toFixed(2)}</td>
                <td className="px-4 py-2 text-center font-semibold">₹{i.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold text-gray-800">Grand Total: ₹{invoice.totalAmount}</h3>
      </div>
    </div>
  );
};

export default InvoiceDetail;
