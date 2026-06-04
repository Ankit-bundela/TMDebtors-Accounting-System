/*import { apiRequest } from "../controler/api";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import dayjs from "dayjs";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({});

  useEffect(() => {
    fetch("/getAllInvoices")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvoices(data.data);
        } else {
          alert("Error fetching invoices.");
        }
      });
  }, []);

  const handleChange = (code) => async (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(code);
      if (!invoiceDetails[code]) {
        setLoading(true);
        const res = await fetch(`/getInvoiceDetails?invoiceCode=${code}`);
        const data = await res.json();
        if (data.success) {
          setInvoiceDetails((prev) => ({
            ...prev,
            [code]: data.data,
          }));
        } else {
          alert("Error loading invoice details.");
        }
        setLoading(false);
      }
    } else {
      setExpanded(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-[Roboto]">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-4">
        All Invoices
      </h1>

      {invoices.length === 0 && (
        <p className="text-gray-500 text-sm">No invoices found.</p>
      )}

      {invoices.map((inv) => (
        <Accordion
          key={inv.code}
          expanded={expanded === inv.code}
          onChange={handleChange(inv.code)}
          className={`mb-4 rounded-xl shadow-sm transition-all duration-300 ${
            expanded === inv.code ? "bg-white" : "bg-gray-100"
          }`}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="flex justify-between items-center w-full px-2">
              <p className="text-gray-800 font-medium">
                #{inv.code} • {inv.customerName || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                ₹{inv.totalAmount} • {dayjs(inv.invoiceDate).format("DD MMM YYYY")}
              </p>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {loading && expanded === inv.code ? (
              <div className="flex justify-center w-full py-4">
                <CircularProgress />
              </div>
            ) : (
              <>
                {invoiceDetails[inv.code] ? (
                  <div className="w-full">
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Invoice Date:</span>{" "}
                      {dayjs(invoiceDetails[inv.code].invoiceDate).format("DD MMM YYYY")}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Created On:</span>{" "}
                      {invoiceDetails[inv.code].createdOn
                        ? dayjs(invoiceDetails[inv.code].createdOn).format("DD MMM YYYY")
                        : "N/A"}
                    </p>
                    <p className="text-lg font-bold text-green-600 mb-3">
                      Grand Total: ₹{invoiceDetails[inv.code].totalAmount}
                    </p>

                    <Divider className="my-4" />

                    <div className="overflow-x-auto">
                      <Table size="small">
                        <TableHead className="bg-gray-100">
                          <TableRow>
                            {[
                              "Item",
                              "Qty",
                              "Rate",
                              "SGST%",
                              "CGST%",
                              "IGST%",
                              "Taxable",
                              "Total",
                            ].map((head, i) => (
                              <TableCell
                                key={i}
                                className="text-sm font-semibold text-gray-700"
                              >
                                {head}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoiceDetails[inv.code].items.map((item, idx) => (
                            <TableRow
                              key={idx}
                              className="border-b border-gray-200"
                            >
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.rate}</TableCell>
                              <TableCell>{item.sgst}</TableCell>
                              <TableCell>{item.cgst}</TableCell>
                              <TableCell>{item.igst}</TableCell>
                              <TableCell>{item.taxableAmount.toFixed(2)}</TableCell>
                              <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No details found.</p>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AllInvoices;
*/
import { apiRequest } from "../controler/api";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import dayjs from "dayjs";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({});

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await apiRequest("/getAllInvoices");
        const data = await res.json();

        if (data.success) {
          setInvoices(data.data);
        } else {
          alert("Error fetching invoices.");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Server error");
      }
    };

    loadInvoices();
  }, []);

  const handleChange = (code) => async (event, isExpanded) => {
    if (isExpanded) {
      setExpanded(code);

      if (!invoiceDetails[code]) {
        setLoading(true);

        try {
          const res = await apiRequest(`/getInvoiceDetails?invoiceCode=${code}`);
          const data = await res.json();

          if (data.success) {
            setInvoiceDetails((prev) => ({
              ...prev,
              [code]: data.data,
            }));
          } else {
            alert("Error loading invoice details.");
          }
        } catch (error) {
          console.error("API Error:", error);
          alert("Server error");
        }

        setLoading(false);
      }
    } else {
      setExpanded(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-[Roboto]">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-4">
        All Invoices
      </h1>

      {invoices.length === 0 && (
        <p className="text-gray-500 text-sm">No invoices found.</p>
      )}

      {invoices.map((inv) => (
        <Accordion
          key={inv.code}
          expanded={expanded === inv.code}
          onChange={handleChange(inv.code)}
          className={`mb-4 rounded-xl shadow-sm transition-all duration-300 ${
            expanded === inv.code ? "bg-white" : "bg-gray-100"
          }`}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="flex justify-between items-center w-full px-2">
              <p className="text-gray-800 font-medium">
                #{inv.code} • {inv.customerName || "N/A"}
              </p>
              <p className="text-gray-600 font-medium">
                ₹{inv.totalAmount} • {dayjs(inv.invoiceDate).format("DD MMM YYYY")}
              </p>
            </div>
          </AccordionSummary>

          <AccordionDetails>
            {loading && expanded === inv.code ? (
              <div className="flex justify-center w-full py-4">
                <CircularProgress />
              </div>
            ) : (
              <>
                {invoiceDetails[inv.code] ? (
                  <div className="w-full">
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Invoice Date:</span>{" "}
                      {dayjs(invoiceDetails[inv.code].invoiceDate).format("DD MMM YYYY")}
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Created On:</span>{" "}
                      {invoiceDetails[inv.code].createdOn
                        ? dayjs(invoiceDetails[inv.code].createdOn).format("DD MMM YYYY")
                        : "N/A"}
                    </p>
                    <p className="text-lg font-bold text-green-600 mb-3">
                      Grand Total: ₹{invoiceDetails[inv.code].totalAmount}
                    </p>

                    <Divider className="my-4" />

                    <div className="overflow-x-auto">
                      <Table size="small">
                        <TableHead className="bg-gray-100">
                          <TableRow>
                            {[
                              "Item",
                              "Qty",
                              "Rate",
                              "SGST%",
                              "CGST%",
                              "IGST%",
                              "Taxable",
                              "Total",
                            ].map((head, i) => (
                              <TableCell
                                key={i}
                                className="text-sm font-semibold text-gray-700"
                              >
                                {head}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {invoiceDetails[inv.code].items.map((item, idx) => (
                            <TableRow key={idx} className="border-b border-gray-200">
                              <TableCell>{item.itemName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.rate}</TableCell>
                              <TableCell>{item.sgst}</TableCell>
                              <TableCell>{item.cgst}</TableCell>
                              <TableCell>{item.igst}</TableCell>
                              <TableCell>{item.taxableAmount.toFixed(2)}</TableCell>
                              <TableCell>{item.totalAmount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No details found.</p>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AllInvoices;