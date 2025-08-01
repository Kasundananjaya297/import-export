/** @format */

export interface User {
  id: string;
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
  company: string;
  role: string;
  token?: string;
}
