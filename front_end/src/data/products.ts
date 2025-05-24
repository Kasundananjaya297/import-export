export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  minimumOrder: number;
  image: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  origin: string;
  weight: number;
  weightUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  dimensionUnit: string;
  status: 'active' | 'inactive' | 'out-of-stock';
  createdAt: string;
  updatedAt: string;
  hsCode?: string;
  certifications?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Ceylon Premium Tea',
    category: 'Food & Beverages',
    subCategory: 'Tea',
    description: 'Premium Ceylon black tea from the highlands of Sri Lanka. Known for its rich aroma and distinctive taste.',
    price: 12.5,
    currency: 'USD',
    stock: 500,
    minimumOrder: 100,
    image: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/257337/pexels-photo-257337.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1493080/pexels-photo-1493080.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    rating: 4.8,
    reviewCount: 128,
    origin: 'Nuwara Eliya, Sri Lanka',
    weight: 500,
    weightUnit: 'g',
    dimensions: {
      length: 15,
      width: 8,
      height: 5
    },
    dimensionUnit: 'cm',
    status: 'active',
    createdAt: '2023-01-15T08:30:00.000Z',
    updatedAt: '2023-05-20T14:45:00.000Z',
    hsCode: '0902.10',
    certifications: ['Organic', 'Fair Trade']
  },
  {
    id: '2',
    name: 'Ceylon Cinnamon Sticks',
    category: 'Food & Beverages',
    subCategory: 'Spices',
    description: 'Authentic Ceylon cinnamon sticks, known for their delicate flavor and health benefits.',
    price: 8.75,
    currency: 'USD',
    stock: 300,
    minimumOrder: 50,
    image: 'https://images.pexels.com/photos/47046/cinnamon-stick-cinnamon-powder-spice-47046.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/47046/cinnamon-stick-cinnamon-powder-spice-47046.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sellerId: '5',
    sellerName: 'Kandy Export Company',
    rating: 4.9,
    reviewCount: 97,
    origin: 'Kandy, Sri Lanka',
    weight: 250,
    weightUnit: 'g',
    dimensions: {
      length: 20,
      width: 10,
      height: 5
    },
    dimensionUnit: 'cm',
    status: 'active',
    createdAt: '2023-02-10T10:15:00.000Z',
    updatedAt: '2023-06-15T09:30:00.000Z',
    hsCode: '0906.11',
    certifications: ['Organic', 'Non-GMO']
  },
  {
    id: '3',
    name: 'Handloom Batik Fabric',
    category: 'Textiles',
    subCategory: 'Fabrics',
    description: 'Handcrafted batik fabric made using traditional Sri Lankan techniques. Perfect for garments and home decor.',
    price: 22.50,
    currency: 'USD',
    stock: 150,
    minimumOrder: 10,
    image: 'https://images.pexels.com/photos/5706208/pexels-photo-5706208.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/5706208/pexels-photo-5706208.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6195084/pexels-photo-6195084.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    rating: 4.7,
    reviewCount: 64,
    origin: 'Galle, Sri Lanka',
    weight: 1000,
    weightUnit: 'g',
    dimensions: {
      length: 300,
      width: 110,
      height: 1
    },
    dimensionUnit: 'cm',
    status: 'active',
    createdAt: '2023-03-05T14:20:00.000Z',
    updatedAt: '2023-07-10T16:15:00.000Z',
    hsCode: '5208.51',
    certifications: ['Handmade', 'Eco-friendly']
  },
  {
    id: '4',
    name: 'Natural Sri Lankan Sapphire',
    category: 'Jewelry & Gems',
    subCategory: 'Gemstones',
    description: 'Natural blue sapphire from the gem mines of Ratnapura. Each stone is certified and ethically sourced.',
    price: 850.00,
    currency: 'USD',
    stock: 25,
    minimumOrder: 1,
    image: 'https://images.pexels.com/photos/68740/gemstone-gem-blue-purple-68740.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/68740/gemstone-gem-blue-purple-68740.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4937217/pexels-photo-4937217.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sellerId: '5',
    sellerName: 'Kandy Export Company',
    rating: 4.9,
    reviewCount: 38,
    origin: 'Ratnapura, Sri Lanka',
    weight: 1.5,
    weightUnit: 'ct',
    dimensions: {
      length: 0.6,
      width: 0.6,
      height: 0.4
    },
    dimensionUnit: 'cm',
    status: 'active',
    createdAt: '2023-01-28T09:45:00.000Z',
    updatedAt: '2023-05-18T11:30:00.000Z',
    hsCode: '7103.91',
    certifications: ['GIA Certified', 'Conflict-Free']
  },
  {
    id: '5',
    name: 'Coconut Shell Handicrafts Set',
    category: 'Handicrafts',
    subCategory: 'Home Decor',
    description: 'Handcrafted decorative items made from coconut shells. Eco-friendly and artistically designed.',
    price: 35.00,
    currency: 'USD',
    stock: 100,
    minimumOrder: 5,
    image: 'https://images.pexels.com/photos/12814967/pexels-photo-12814967.jpeg?auto=compress&cs=tinysrgb&w=600',
    images: [
      'https://images.pexels.com/photos/12814967/pexels-photo-12814967.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/12567322/pexels-photo-12567322.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    sellerId: '2',
    sellerName: 'Sri Lanka Exports',
    rating: 4.6,
    reviewCount: 52,
    origin: 'Southern Province, Sri Lanka',
    weight: 800,
    weightUnit: 'g',
    dimensions: {
      length: 25,
      width: 20,
      height: 10
    },
    dimensionUnit: 'cm',
    status: 'active',
    createdAt: '2023-04-12T16:20:00.000Z',
    updatedAt: '2023-08-05T13:10:00.000Z',
    hsCode: '4602.19',
    certifications: ['Handmade', 'Eco-friendly']
  }
];