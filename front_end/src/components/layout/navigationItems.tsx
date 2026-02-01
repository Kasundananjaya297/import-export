import React from 'react';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  Support as SupportIcon,
  LocalShipping as LocalShippingIcon,
  Receipt as ReceiptIcon,
  PeopleAlt as PeopleAltIcon,
  BarChart as BarChartIcon,
  Article as ArticleIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  FactCheck as FactCheckIcon
} from '@mui/icons-material';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'importer':
    case 'buyer':
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
          label: 'My Orders',
          path: '/importer/orders',
          icon: <ListAltIcon />
        },
        {
          label: 'Submit Complaint',
          path: '/importer/complaint',
          icon: <SupportIcon />
        },
        {
          label: 'My Profile',
          path: '/profile',
          icon: <PersonIcon />
        }
      ];
    case 'exporter':
    case 'seller':
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
        },
        {
          label: 'Stall Management',
          path: '/exporter/stall-management',
          icon: <StoreIcon />
        },
        {
          label: 'My Profile',
          path: '/profile',
          icon: <PersonIcon />
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
          label: 'User Approvals',
          path: '/admin/user-approvals',
          icon: <FactCheckIcon />
        },
        {
          label: 'Complaints',
          path: '/admin/complaints',
          icon: <SupportIcon />
        },
        {
          label: 'Stall Management',
          path: '/admin/stalls',
          icon: <StoreIcon />
        },
        {
          label: 'Product Management',
          path: '/admin/products',
          icon: <InventoryIcon />
        },
        {
          label: 'Product Approvals',
          path: '/admin/product-approvals',
          icon: <FactCheckIcon />
        },
        {
          label: 'Fish Metadata',
          path: '/admin/fish-metadata',
          icon: <ListAltIcon />
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
        },
        {
          label: 'My Profile',
          path: '/profile',
          icon: <PersonIcon />
        }
      ];
    default:
      return [];
  }
};