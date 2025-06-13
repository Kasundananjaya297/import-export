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
  company: string;
  password: string;
}
