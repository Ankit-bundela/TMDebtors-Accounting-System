/*import React, { useState } from "react";
import {
  AppBar,
  IconButton,
  Tabs,
  Tab,
  Toolbar,
  Menu,
  MenuItem,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from "react-router-dom";
import {
  AccountCircleSharp,
  Settings
} from "@material-ui/icons";
import myStyles from "../styles/styles";

const Navbar = ({ openDrawer }) => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 0) navigate("/");
    else if (newValue === 1) navigate("/courses");
    else if (newValue === 2) navigate("/contact");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToTraderComponent = () => {
    navigate("/trader");
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={2}
      style={{
        backgroundColor: "#283593", // Indigo dark
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 16px"
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={openDrawer}
        >
          <MenuIcon />
        </IconButton>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          style={{
            flexGrow: 1,
            marginLeft: 24
          }}
        >
          <Tab
            label="Home"
            style={{ minWidth: 80 }}
          />
          <Tab
            label="Item"
            style={{ minWidth: 80 }}
          />
          <Tab
            label="Invoice"
            style={{ minWidth: 80 }}
          />
        </Tabs>

        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          style={{
            marginLeft: "auto",
            transition: "background 0.3s",
          }}
        >
          <AccountCircleSharp />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
        >
          <MenuItem
            onClick={goToTraderComponent}
            style={{ gap: 8 }}
          >
            <Settings fontSize="small" />
            Settings
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(myStyles)(Navbar);

*/
import React, { useState, useEffect } from "react";
import {
  AppBar,
  IconButton,
  Tabs,
  Tab,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useNavigate } from "react-router-dom";
import { AccountCircleSharp, Settings } from "@material-ui/icons";

import Logout from "@material-ui/icons/ExitToApp";
import myStyles from "../styles/styles";

const Navbar = ({ openDrawer }) => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    if (newValue === 0) navigate("/home");
    else if (newValue === 1) navigate("/items");
    else if (newValue === 2) navigate("/invoices");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={2}
      style={{ backgroundColor: "#283593" }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 16px"
        }}
      >
        {/* Menu Icon */}
        <IconButton edge="start" color="inherit" onClick={openDrawer}>
          <MenuIcon />
        </IconButton>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          style={{ flexGrow: 1, marginLeft: 24 }}
        >
          <Tab label="Home" style={{ minWidth: 80 }} />
          <Tab label="Item" style={{ minWidth: 80 }} />
          <Tab label="Invoice" style={{ minWidth: 80 }} />
        </Tabs>

        {/* Account Icon */}
        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          style={{ marginLeft: "auto" }}
        >
          <AccountCircleSharp />
        </IconButton>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {user && (
            <div style={{ padding: "8px 16px" }}>
              <Typography variant="subtitle1">{user.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                Created On: {user.createdAt}
              </Typography>
            </div>
          )}

          <MenuItem
            onClick={handleMenuClose}
            style={{ gap: 8 }}
          >
            <Settings fontSize="small" />
            Settings
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            style={{ gap: 8 }}
          >
            <Logout fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(myStyles)(Navbar);