import React from 'react';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  ListAlt as ListAltIcon,
  Payment as PaymentIcon,
  Support as SupportIcon,
  LocalShipping as LocalShippingIcon,
  Receipt as ReceiptIcon,
  PeopleAlt as PeopleAltIcon,
  BarChart as BarChartIcon,
  Article as ArticleIcon
} from '@mui/icons-material';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'importer':
      return [
        {
          label: 'Dashboard',
          path: '/importer/dashboard',
          icon: <DashboardIcon />
        },
        {
          label: 'Product Catalog',
          path: '/importer/catalog',
          icon: <InventoryIcon />
        },
        {
          label: 'Place Order',
          path: '/importer/place-order',
          icon: <ShoppingCartIcon />
        },
        {
          label: 'My Orders',
          path: '/importer/orders',
          icon: <ListAltIcon />
        },
        {
          label: 'Submit Complaint',
          path: '/importer/complaint',
          icon: <SupportIcon />
        }
      ];
    case 'exporter':
      return [
        {
          label: 'Dashboard',
          path: '/exporter/dashboard',
          icon: <DashboardIcon />
        },
        {
          label: 'Products',
          path: '/exporter/products',
          icon: <InventoryIcon />
        },
        {
          label: 'Orders',
          path: '/exporter/orders',
          icon: <LocalShippingIcon />
        },
        {
          label: 'Transactions',
          path: '/exporter/transactions',
          icon: <ReceiptIcon />
        },
        {
          label: 'Complaints',
          path: '/exporter/complaints',
          icon: <SupportIcon />
        }
      ];
    case 'admin':
      return [
        {
          label: 'Dashboard',
          path: '/admin/dashboard',
          icon: <DashboardIcon />
        },
        {
          label: 'Users',
          path: '/admin/users',
          icon: <PeopleAltIcon />
        },
        {
          label: 'Complaints',
          path: '/admin/complaints',
          icon: <SupportIcon />
        },
        {
          label: 'Reports',
          path: '/admin/reports',
          icon: <BarChartIcon />
        },
        {
          label: 'System Logs',
          path: '/admin/logs',
          icon: <ArticleIcon />
        }
      ];
    default:
      return [];
  }
};