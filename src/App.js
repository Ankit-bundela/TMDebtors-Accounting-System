/*import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import {
  withStyles,
  LinearProgress,
  Typography,
  Box,
  Fade
} from "@material-ui/core";
import myStyles from "./styles/styles";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Courses from "./components/course";
import About from "./components/About";
import Items from "./components/TableComponent";
import Detail from "./components/Appsaccordian";
import TraderComponent from "./components/TraderComponent";
import BankDetails from "./components/BankDetails";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetail from "./components/InvoiceDetail";
import AllInvoices from "./components/AllInvoices";
import UserAuthWrapper from "./components/UserAuthWrapper";
import Login from "./components/Login";
import Register from "./components/Register";
import { Navigate } from "react-router-dom";

const ProgressBar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return loading ? (
    <LinearProgress
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1100
      }}
    />
  ) : null;
};

const App = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [serverReady, setServerReady] = useState(false);

  const toggleDrawer = () => setShowDrawer(!showDrawer);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("/server-status");
        const data = await response.json();
        if (data.status === "ready") {
          setServerReady(true);
        }
      } catch (error) {
        console.error("Server not responding:", error);
        setTimeout(checkServer, 3000);
      }
    };
    checkServer();
  }, []);

  return (
    <Router>
      <ProgressBar />
      <div className={props.classes.mainContainer}>
        {serverReady ? (
          <>
            <Navbar openDrawer={toggleDrawer} />
            <Sidebar showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
            <div className={props.classes.appBarSpacer} />
            <div className={props.classes.contentSection}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/about" element={<About />} />
                <Route path="/items" element={<Items />} />
                <Route path="/bankDetails" element={<BankDetails />} />
                <Route path="/details" element={<Detail />} />
                <Route path="/trader" element={<TraderComponent />} />
                <Route path="/create-invoice" element={<InvoiceForm />} />
                <Route path="/invoice/:invoiceCode" element={<InvoiceDetail />} />
                <Route path="/invoices" element={<AllInvoices />} />
                <Route path="/auth" element={<UserAuthWrapper />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </>
        ) : (
          <Fade in={!serverReady}>
            <Box
              className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100"
              style={{ fontFamily: "Roboto, sans-serif", position: "relative" }}
            >
              <LinearProgress style={{ width: "100%", position: "absolute", top: 0 }} />

              <div className="loader-ring mb-8"></div>

              <Typography variant="h3" style={{ color: "#0B3558", fontWeight: 700 }}>
                TMDebtors
              </Typography>

  
              <Typography variant="subtitle1" style={{ color: "#e53935", marginTop: 8 }}>
                Server is not ready. Connecting...
              </Typography>

              <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    width={10}
                    height={10}
                    borderRadius="50%"
                    bgcolor="#1976d2"
                    mx={0.5}
                    style={{
                      animation: "dotFlashing 1s infinite linear",
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </Box>

              <style>{`
                .loader-ring {
                  width: 60px;
                  height: 60px;
                  border: 6px solid #cbd5e0;
                  border-top-color: #1976d2;
                  border-radius: 50%;
                  animation: ringSpin 0.9s linear infinite;
                }

                @keyframes ringSpin {
                  to { transform: rotate(360deg); }
                }

                @keyframes dotFlashing {
                  0% { opacity: 1; }
                  50% { opacity: 0.3; }
                  100% { opacity: 1; }
                }
              `}</style>
            </Box>
          </Fade>
        )}
      </div>
    </Router>
  );
};

export default withStyles(myStyles)(App);
*/
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { withStyles, LinearProgress, Typography, Box, Fade } from "@material-ui/core";
import myStyles from "./styles/styles";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Courses from "./components/course";
import About from "./components/About";
import Items from "./components/TableComponent";
import Detail from "./components/Appsaccordian";
import TraderComponent from "./components/TraderComponent";
import BankDetails from "./components/BankDetails";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetail from "./components/InvoiceDetail";
import AllInvoices from "./components/AllInvoices";
import Login from "./components/Login";
import Register from "./components/Register";

// Progress bar for route changes
const ProgressBar = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return loading ? (
    <LinearProgress style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1100 }} />
  ) : null;
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Logout function for Navbar
export const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const App = (props) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [serverReady, setServerReady] = useState(false);
  const toggleDrawer = () => setShowDrawer(!showDrawer);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/server-status"); // backend URL
        const data = await response.json();
        if (data.status === "ready") setServerReady(true);
      } catch (error) {
        console.error("Server not responding:", error);
        setTimeout(checkServer, 3000);
      }
    };
    checkServer();
  }, []);

  return (
    <Router>
      <ProgressBar />
      <div className={props.classes.mainContainer}>
        {serverReady ? (
          <>
            <Navbar openDrawer={toggleDrawer} />
            <Sidebar showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
            <div className={props.classes.appBarSpacer} />
            <div className={props.classes.contentSection}>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={localStorage.getItem("user") ? <Navigate to="/home" /> : <Login />}
                />
                <Route
                  path="/register"
                  element={localStorage.getItem("user") ? <Navigate to="/home" /> : <Register />}
                />

                {/* Protected Routes */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
                <Route path="/bankDetails" element={<ProtectedRoute><BankDetails /></ProtectedRoute>} />
                <Route path="/details" element={<ProtectedRoute><Detail /></ProtectedRoute>} />
                <Route path="/trader" element={<ProtectedRoute><TraderComponent /></ProtectedRoute>} />
                <Route path="/create-invoice" element={<ProtectedRoute><InvoiceForm /></ProtectedRoute>} />
                <Route path="/invoice/:invoiceCode" element={<ProtectedRoute><InvoiceDetail /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><AllInvoices /></ProtectedRoute>} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>
          </>
        ) : (
          <Fade in={!serverReady}>
            <Box className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
              <LinearProgress style={{ width: "100%", position: "absolute", top: 0 }} />
              <div className="loader-ring mb-8"></div>
              <Typography variant="h3" style={{ color: "#0B3558", fontWeight: 700 }}>TMDebtors</Typography>
              <Typography variant="subtitle1" style={{ color: "#e53935", marginTop: 8 }}>Server is not ready. Connecting...</Typography>
            </Box>
          </Fade>
        )}
      </div>
    </Router>
  );
};

export default withStyles(myStyles)(App);