export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  productCategories: {
    category: string;
    count: number;
  }[];
  topSellingProducts: {
    id: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  recentComplaints: number;
  resolvedComplaints: number;
  customerSatisfaction: number;
}

export const importerStats: DashboardStats = {
  totalOrders: 12,
  pendingOrders: 2,
  processingOrders: 3,
  shippedOrders: 1,
  deliveredOrders: 5,
  cancelledOrders: 1,
  totalRevenue: 0, // Importers don't have revenue
  monthlyRevenue: [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 }
  ],
  productCategories: [
    { category: 'Food & Beverages', count: 5 },
    { category: 'Textiles', count: 3 },
    { category: 'Jewelry & Gems', count: 2 },
    { category: 'Handicrafts', count: 2 }
  ],
  topSellingProducts: [], // Importers don't have selling products
  recentComplaints: 2,
  resolvedComplaints: 1,
  customerSatisfaction: 0 // Not applicable for importers
};

export const exporterStats: DashboardStats = {
  totalOrders: 18,
  pendingOrders: 3,
  processingOrders: 2,
  shippedOrders: 4,
  deliveredOrders: 8,
  cancelledOrders: 1,
  totalRevenue: 25840.50,
  monthlyRevenue: [
    { month: 'Jan', revenue: 3250.75 },
    { month: 'Feb', revenue: 4120.25 },
    { month: 'Mar', revenue: 3875.50 },
    { month: 'Apr', revenue: 4580.00 },
    { month: 'May', revenue: 5214.00 },
    { month: 'Jun', revenue: 4800.00 }
  ],
  productCategories: [
    { category: 'Food & Beverages', count: 8 },
    { category: 'Textiles', count: 5 },
    { category: 'Jewelry & Gems', count: 3 },
    { category: 'Handicrafts', count: 4 }
  ],
  topSellingProducts: [
    { id: '1', name: 'Ceylon Premium Tea', quantity: 750, revenue: 9375.00 },
    { id: '3', name: 'Handloom Batik Fabric', quantity: 120, revenue: 2700.00 },
    { id: '2', name: 'Ceylon Cinnamon Sticks', quantity: 250, revenue: 2187.50 },
    { id: '5', name: 'Coconut Shell Handicrafts Set', quantity: 85, revenue: 2975.00 }
  ],
  recentComplaints: 3,
  resolvedComplaints: 2,
  customerSatisfaction: 4.7
};

export const adminStats: DashboardStats = {
  totalOrders: 32,
  pendingOrders: 6,
  processingOrders: 5,
  shippedOrders: 7,
  deliveredOrders: 12,
  cancelledOrders: 2,
  totalRevenue: 42580.75,
  monthlyRevenue: [
    { month: 'Jan', revenue: 5840.25 },
    { month: 'Feb', revenue: 6320.50 },
    { month: 'Mar', revenue: 7125.75 },
    { month: 'Apr', revenue: 7580.25 },
    { month: 'May', revenue: 8214.00 },
    { month: 'Jun', revenue: 7500.00 }
  ],
  productCategories: [
    { category: 'Food & Beverages', count: 12 },
    { category: 'Textiles', count: 8 },
    { category: 'Jewelry & Gems', count: 5 },
    { category: 'Handicrafts', count: 7 }
  ],
  topSellingProducts: [
    { id: '1', name: 'Ceylon Premium Tea', quantity: 950, revenue: 11875.00 },
    { id: '4', name: 'Natural Sri Lankan Sapphire', quantity: 15, revenue: 12750.00 },
    { id: '3', name: 'Handloom Batik Fabric', quantity: 180, revenue: 4050.00 },
    { id: '2', name: 'Ceylon Cinnamon Sticks', quantity: 450, revenue: 3937.50 }
  ],
  recentComplaints: 8,
  resolvedComplaints: 5,
  customerSatisfaction: 4.5
};