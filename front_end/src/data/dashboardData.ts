export const statisticsData = {
  totalUsers: 1284,
  activeUsers: 948,
  totalTransactions: 3567,
  totalRevenue: 2845670,
  userGrowth: 12.5,
  revenueGrowth: 15.8
};

export const monthlyRevenue = [
  { month: 'Jan', amount: 180000 },
  { month: 'Feb', amount: 220000 },
  { month: 'Mar', amount: 260000 },
  { month: 'Apr', amount: 245000 },
  { month: 'May', amount: 290000 },
  { month: 'Jun', amount: 285000 },
  { month: 'Jul', amount: 310000 },
  { month: 'Aug', amount: 340000 },
  { month: 'Sep', amount: 325000 },
  { month: 'Oct', amount: 360000 },
  { month: 'Nov', amount: 375000 },
  { month: 'Dec', amount: 390000 }
];

export const userDistribution = [
  { role: 'Importers', count: 456 },
  { role: 'Exporters', count: 378 },
  { role: 'Admins', count: 12 }
];

export const recentTransactions = [
  {
    id: 'TRX001',
    date: '2024-03-15',
    amount: 45000,
    status: 'completed',
    type: 'Import',
    company: 'Ceylon Imports Ltd'
  },
  {
    id: 'TRX002',
    date: '2024-03-15',
    amount: 32000,
    status: 'pending',
    type: 'Export',
    company: 'Sri Lanka Exports'
  },
  {
    id: 'TRX003',
    date: '2024-03-14',
    amount: 28500,
    status: 'completed',
    type: 'Import',
    company: 'Colombo Traders'
  },
  {
    id: 'TRX004',
    date: '2024-03-14',
    amount: 56000,
    status: 'failed',
    type: 'Export',
    company: 'Kandy Export Company'
  }
];

export const activeComplaints = [
  {
    id: 'CMP001',
    title: 'System Performance Issue',
    priority: 'High',
    status: 'Open',
    submittedDate: '2024-03-15'
  },
  {
    id: 'CMP002',
    title: 'Payment Processing Delay',
    priority: 'Critical',
    status: 'In Progress',
    submittedDate: '2024-03-14'
  },
  {
    id: 'CMP003',
    title: 'Document Upload Error',
    priority: 'Medium',
    status: 'Open',
    submittedDate: '2024-03-13'
  }
];

export const systemHealth = {
  uptime: '99.98%',
  responseTime: '245ms',
  errorRate: '0.02%',
  serverLoad: '42%',
  memoryUsage: '68%',
  diskSpace: '45%'
}; 