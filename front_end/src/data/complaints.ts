export interface Complaint {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  subject: string;
  description: string;
  status: 'open' | 'under-review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  attachments?: string[];
  responses?: {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export const complaints: Complaint[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-0001',
    buyerId: '1',
    buyerName: 'Ceylon Imports Ltd',
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    subject: 'Damaged Tea Packages',
    description: 'Several boxes of tea were found damaged upon delivery. The packaging was torn and some tea was spilled inside the shipping box.',
    status: 'resolved',
    priority: 'medium',
    category: 'Product Damage',
    attachments: ['https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600'],
    responses: [
      {
        id: 'r1',
        userId: '2',
        userName: 'Sri Lanka Exports',
        userRole: 'exporter',
        message: 'We apologize for the inconvenience. We will send replacement packages immediately.',
        createdAt: '2023-03-27T10:15:00.000Z'
      },
      {
        id: 'r2',
        userId: '1',
        userName: 'Ceylon Imports Ltd',
        userRole: 'importer',
        message: 'Thank you for the quick response. Looking forward to receiving the replacements.',
        createdAt: '2023-03-27T14:30:00.000Z'
      }
    ],
    createdAt: '2023-03-26T09:30:00.000Z',
    updatedAt: '2023-04-02T11:45:00.000Z',
    resolvedAt: '2023-04-02T11:45:00.000Z',
    resolvedBy: '2'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-0002',
    buyerId: '4',
    buyerName: 'Colombo Importers',
    sellerId: '5',
    sellerName: 'Kandy Export Company',
    subject: 'Shipment Delay',
    description: 'The order was expected on May 30th but still hasn\'t arrived. Please provide an update on the shipping status.',
    status: 'open',
    priority: 'high',
    category: 'Shipping Issue',
    responses: [
      {
        id: 'r3',
        userId: '5',
        userName: 'Kandy Export Company',
        userRole: 'exporter',
        message: 'We apologize for the delay. The shipment was held at customs. We are working to resolve this and will provide an update soon.',
        createdAt: '2023-06-02T15:20:00.000Z'
      }
    ],
    createdAt: '2023-06-01T13:45:00.000Z',
    updatedAt: '2023-06-02T15:20:00.000Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-0005',
    buyerId: '1',
    buyerName: 'Ceylon Imports Ltd',
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    subject: 'Refund Processing Delay',
    description: 'The order was cancelled on May 4th, but the refund hasn\'t been processed yet. Please expedite the refund process.',
    status: 'under-review',
    priority: 'medium',
    category: 'Payment Issue',
    responses: [
      {
        id: 'r4',
        userId: '2',
        userName: 'Sri Lanka Exports',
        userRole: 'exporter',
        message: 'We have initiated the refund process. Due to bank processing times, it may take 5-7 business days to reflect in your account.',
        createdAt: '2023-05-10T09:20:00.000Z'
      },
      {
        id: 'r5',
        userId: '3',
        userName: 'Ceylon Trade Authority',
        userRole: 'admin',
        message: 'We are following up with the bank to expedite this refund. Thank you for your patience.',
        createdAt: '2023-05-12T14:15:00.000Z'
      }
    ],
    createdAt: '2023-05-09T11:30:00.000Z',
    updatedAt: '2023-05-12T14:15:00.000Z'
  }
];