export interface Review {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  likes: number;
  sellerResponse?: {
    comment: string;
    createdAt: string;
  };
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Ceylon Premium Tea',
    orderId: '1',
    userId: '1',
    userName: 'Ceylon Imports Ltd',
    rating: 5,
    title: 'Excellent Quality Tea',
    comment: 'The quality of the tea is exceptional. Our customers are very satisfied with the aroma and taste. Will definitely order again.',
    images: [
      'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    likes: 12,
    sellerResponse: {
      comment: 'Thank you for your kind words! We take pride in our tea quality and are happy to hear your customers enjoy it.',
      createdAt: '2023-04-05T14:30:00.000Z'
    },
    status: 'approved',
    createdAt: '2023-04-02T10:15:00.000Z',
    updatedAt: '2023-04-05T14:30:00.000Z'
  },
  {
    id: '2',
    productId: '3',
    productName: 'Handloom Batik Fabric',
    orderId: '1',
    userId: '1',
    userName: 'Ceylon Imports Ltd',
    rating: 4,
    title: 'Beautiful Batik Patterns',
    comment: 'The batik fabrics have beautiful, unique patterns. The quality is good overall, though there were minor color variations from the photos.',
    likes: 8,
    status: 'approved',
    createdAt: '2023-04-03T11:45:00.000Z',
    updatedAt: '2023-04-03T11:45:00.000Z'
  },
  {
    id: '3',
    productId: '2',
    productName: 'Ceylon Cinnamon Sticks',
    orderId: '2',
    userId: '4',
    userName: 'Colombo Importers',
    rating: 5,
    title: 'Authentic and Fresh Cinnamon',
    comment: 'These cinnamon sticks are of the highest quality. The aroma is incredibly fresh, and our customers can tell the difference between these authentic Ceylon cinnamon sticks and others on the market.',
    images: [
      'https://images.pexels.com/photos/47046/cinnamon-stick-cinnamon-powder-spice-47046.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    likes: 15,
    sellerResponse: {
      comment: 'We appreciate your review! Our cinnamon is harvested and processed using traditional methods to preserve its quality and distinctive aroma.',
      createdAt: '2023-05-28T09:20:00.000Z'
    },
    status: 'approved',
    createdAt: '2023-05-25T16:30:00.000Z',
    updatedAt: '2023-05-28T09:20:00.000Z'
  },
  {
    id: '4',
    productId: '4',
    productName: 'Natural Sri Lankan Sapphire',
    orderId: '3',
    userId: '1',
    userName: 'Ceylon Imports Ltd',
    rating: 5,
    title: 'Stunning Gemstones',
    comment: 'The sapphires are absolutely stunning. The color is vibrant and the clarity is excellent. Our jewelry designers are thrilled with the quality.',
    likes: 6,
    status: 'pending',
    createdAt: '2023-06-18T13:10:00.000Z',
    updatedAt: '2023-06-18T13:10:00.000Z'
  }
];