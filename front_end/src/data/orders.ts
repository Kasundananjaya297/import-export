export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  expectedDelivery?: string;
}

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-0001',
    buyerId: '1',
    buyerName: 'Ceylon Imports Ltd',
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    products: [
      {
        productId: '1',
        name: 'Ceylon Premium Tea',
        quantity: 200,
        price: 12.5,
        total: 2500
      },
      {
        productId: '3',
        name: 'Handloom Batik Fabric',
        quantity: 15,
        price: 22.50,
        total: 337.5
      }
    ],
    totalAmount: 2837.5,
    currency: 'USD',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    billingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    trackingNumber: 'TRK12345678SL',
    notes: 'Please deliver to warehouse entrance',
    createdAt: '2023-03-10T09:15:00.000Z',
    updatedAt: '2023-03-25T14:30:00.000Z',
    expectedDelivery: '2023-03-20T00:00:00.000Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-0002',
    buyerId: '4',
    buyerName: 'Colombo Importers',
    sellerId: '5',
    sellerName: 'Kandy Export Company',
    products: [
      {
        productId: '2',
        name: 'Ceylon Cinnamon Sticks',
        quantity: 100,
        price: 8.75,
        total: 875
      }
    ],
    totalAmount: 875,
    currency: 'USD',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      line1: '78 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00300'
    },
    billingAddress: {
      line1: '78 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00300'
    },
    trackingNumber: 'TRK87654321SL',
    createdAt: '2023-05-15T11:20:00.000Z',
    updatedAt: '2023-05-20T16:45:00.000Z',
    expectedDelivery: '2023-05-30T00:00:00.000Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2023-0003',
    buyerId: '1',
    buyerName: 'Ceylon Imports Ltd',
    sellerId: '5',
    sellerName: 'Kandy Export Company',
    products: [
      {
        productId: '4',
        name: 'Natural Sri Lankan Sapphire',
        quantity: 5,
        price: 850,
        total: 4250
      }
    ],
    totalAmount: 4250,
    currency: 'USD',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Wire Transfer',
    shippingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    billingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    notes: 'Insurance required for shipping',
    createdAt: '2023-06-05T10:30:00.000Z',
    updatedAt: '2023-06-07T14:15:00.000Z',
    expectedDelivery: '2023-06-15T00:00:00.000Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2023-0004',
    buyerId: '4',
    buyerName: 'Colombo Importers',
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    products: [
      {
        productId: '5',
        name: 'Coconut Shell Handicrafts Set',
        quantity: 20,
        price: 35,
        total: 700
      },
      {
        productId: '1',
        name: 'Ceylon Premium Tea',
        quantity: 150,
        price: 12.5,
        total: 1875
      }
    ],
    totalAmount: 2575,
    currency: 'USD',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Bank Transfer',
    shippingAddress: {
      line1: '78 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00300'
    },
    billingAddress: {
      line1: '78 Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00300'
    },
    notes: 'Please confirm receipt of payment before shipping',
    createdAt: '2023-06-20T09:45:00.000Z',
    updatedAt: '2023-06-20T09:45:00.000Z',
    expectedDelivery: '2023-07-05T00:00:00.000Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-0005',
    buyerId: '1',
    buyerName: 'Ceylon Imports Ltd',
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    products: [
      {
        productId: '3',
        name: 'Handloom Batik Fabric',
        quantity: 30,
        price: 22.50,
        total: 675
      }
    ],
    totalAmount: 675,
    currency: 'USD',
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Credit Card',
    shippingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    billingAddress: {
      line1: '45 Temple Road',
      line2: 'Business District',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00100'
    },
    notes: 'Order cancelled due to product unavailability',
    createdAt: '2023-05-02T14:10:00.000Z',
    updatedAt: '2023-05-04T11:30:00.000Z'
  }
];