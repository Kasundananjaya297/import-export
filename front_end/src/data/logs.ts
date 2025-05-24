export interface SystemLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  module: string;
}

export const logs: SystemLog[] = [
  {
    id: '1',
    action: 'User Login',
    userId: '1',
    userName: 'Arjun Perera',
    userRole: 'importer',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.105',
    timestamp: '2023-06-20T09:15:30.000Z',
    status: 'success',
    module: 'Authentication'
  },
  {
    id: '2',
    action: 'Order Created',
    userId: '1',
    userName: 'Arjun Perera',
    userRole: 'importer',
    details: 'New order ORD-2023-0006 created',
    ipAddress: '192.168.1.105',
    timestamp: '2023-06-20T09:25:45.000Z',
    status: 'success',
    module: 'Orders'
  },
  {
    id: '3',
    action: 'Payment Processing',
    userId: '1',
    userName: 'Arjun Perera',
    userRole: 'importer',
    details: 'Payment initiated for order ORD-2023-0006',
    ipAddress: '192.168.1.105',
    timestamp: '2023-06-20T09:30:12.000Z',
    status: 'success',
    module: 'Payments'
  },
  {
    id: '4',
    action: 'Order Status Update',
    userId: '2',
    userName: 'Kumari Silva',
    userRole: 'exporter',
    details: 'Order ORD-2023-0003 status updated to shipped',
    ipAddress: '192.168.1.110',
    timestamp: '2023-06-20T10:15:20.000Z',
    status: 'success',
    module: 'Orders'
  },
  {
    id: '5',
    action: 'User Login Attempt',
    userId: 'unknown',
    userName: 'unknown',
    userRole: 'unknown',
    details: 'Failed login attempt for email: test@example.com',
    ipAddress: '203.45.78.92',
    timestamp: '2023-06-20T11:05:40.000Z',
    status: 'error',
    module: 'Authentication'
  },
  {
    id: '6',
    action: 'Product Created',
    userId: '5',
    userName: 'Mahesh Fernando',
    userRole: 'exporter',
    details: 'New product "Sri Lankan Wooden Masks" created',
    ipAddress: '192.168.1.115',
    timestamp: '2023-06-20T11:30:22.000Z',
    status: 'success',
    module: 'Products'
  },
  {
    id: '7',
    action: 'Complaint Resolved',
    userId: '3',
    userName: 'Ravi Jayawardena',
    userRole: 'admin',
    details: 'Complaint ID #2 marked as resolved',
    ipAddress: '192.168.1.120',
    timestamp: '2023-06-20T12:10:05.000Z',
    status: 'success',
    module: 'Complaints'
  },
  {
    id: '8',
    action: 'User Account Updated',
    userId: '4',
    userName: 'Sarah Williams',
    userRole: 'importer',
    details: 'User updated their profile information',
    ipAddress: '192.168.1.125',
    timestamp: '2023-06-20T13:45:30.000Z',
    status: 'success',
    module: 'User Management'
  },
  {
    id: '9',
    action: 'API Rate Limit Exceeded',
    userId: '1',
    userName: 'Arjun Perera',
    userRole: 'importer',
    details: 'Rate limit exceeded for Product API',
    ipAddress: '192.168.1.105',
    timestamp: '2023-06-20T14:20:15.000Z',
    status: 'warning',
    module: 'API'
  },
  {
    id: '10',
    action: 'System Backup',
    userId: '3',
    userName: 'Ravi Jayawardena',
    userRole: 'admin',
    details: 'Daily system backup completed',
    ipAddress: '192.168.1.120',
    timestamp: '2023-06-20T15:00:00.000Z',
    status: 'success',
    module: 'System'
  }
];