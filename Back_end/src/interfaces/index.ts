/** @format */

export interface IUser {
  id?: number;
  fname: string;
  lname: string;
  gender: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  contact: string;
  company?: string;
  password: string;
  role: string;
}

export interface IProduct {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  minOrderQuantity: number;
  specifications: string;
  origin: string;
  certification: string;
  images: string[]; // Array of image URLs
  userid: number;
}
