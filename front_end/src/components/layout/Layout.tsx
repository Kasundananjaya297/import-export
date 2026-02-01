/** @format */

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { getNavItems } from "./navigationItems";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isHomePage = location.pathname === "/";
  const isFishPool = location.pathname === "/fish-pool";
  const hideSidebar = isHomePage || isFishPool;
  const navItems = getNavItems(currentUser?.role || "importer");

  const handleDrawerToggle = () => {
    setOpen(!open);
  };





  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Drawer
        variant={isMobile || hideSidebar ? "temporary" : "persistent"}
        open={isMobile || hideSidebar ? open : true}
        onClose={(isMobile || hideSidebar) ? handleDrawerToggle : undefined}
        sx={{
          display: hideSidebar && !open ? 'none' : 'block', // Hide completely if closed on home/fish-pool
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ p: 2, fontWeight: "bold", color: theme.palette.primary.main }}
          >
            Ceylon Trade
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setOpen(false);
                }}
                sx={{
                  mr: 1,
                  my: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: hideSidebar ? "100%" : `calc(100% - ${drawerWidth}px)` },
          ml: { sm: 0 },
          p: 3,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <div className="h-20" /> {/* Spacer for fixed Navbar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
