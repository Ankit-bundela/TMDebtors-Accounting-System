import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Switch,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import {
  Home as HomeIcon,
  ListAlt as ListAltIcon,
  Info as InfoIcon,
  PersonAdd as PersonAddIcon,
  School as SchoolIcon,
  ContactMail as ContactMailIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  ExitToApp as LoginIcon,
  PersonAdd as RegisterIcon,
} from "@material-ui/icons";

const Sidebar = ({ showDrawer, toggleDrawer }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Items", icon: <ListAltIcon />, path: "/items" },
    { text: "Customer Details", icon: <InfoIcon />, path: "/details" },
    { text: "Bank Details", icon: <PersonAddIcon />, path: "/bankDetails" },
    { text: "Create Invoice", icon: <ReceiptIcon />, path: "/create-invoice" },
    { text: "View Invoices", icon: <DescriptionIcon />, path: "/invoices" },
    { text: "Courses", icon: <SchoolIcon />, path: "/courses" },
    { text: "About Us", icon: <ContactMailIcon />, path: "/about" },
    { text: "Login", icon: <LoginIcon />, path: "/login" },
    { text: "Register", icon: <RegisterIcon />, path: "/register" },
  ];

  const drawerStyle = {
    width: 220,
    background: darkMode ? "#1e1e1e" : "#fff",
    color: darkMode ? "#f5f5f5" : "#333",
    borderRight: darkMode ? "1px solid #333" : "1px solid #ddd",
  };

  return (
    <Drawer
      open={showDrawer}
      onClose={toggleDrawer}
      PaperProps={{ style: drawerStyle }}
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 600,
            color: darkMode ? "#90caf9" : "#1976d2",
          }}
        >
          TMDebtors
        </Typography>

        <CloseIcon
          onClick={toggleDrawer}
          style={{ cursor: "pointer" }}
        />
      </Toolbar>

      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={Link}
            to={item.path}
            onClick={toggleDrawer}
            style={{
              margin: "4px 10px",
              borderRadius: 8,
              transition: "0.2s",
            }}
          >
            <ListItemIcon
              style={{ color: darkMode ? "#90caf9" : "#1976d2" }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                style: {
                  color: darkMode ? "#ddd" : "#333",
                  fontWeight: 500,
                },
              }}
            />
          </ListItem>
        ))}

        <Divider style={{ margin: "10px 0" }} />

        <ListItem>
          <ListItemIcon>
            {darkMode ? <DarkIcon /> : <LightIcon />}
          </ListItemIcon>

          <ListItemText
            primary={darkMode ? "Dark Mode" : "Light Mode"}
          />

          <Switch checked={darkMode} onChange={toggleTheme} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;