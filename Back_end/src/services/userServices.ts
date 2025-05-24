/** @format */

import { IUser } from "../interfaces/index";
import * as userRepo from "../repos/userRepo";
import bcrypt from "bcrypt";
const soltRounds = 10;

export const createUser = async (user: IUser) => {
  try {
    if (
      !user.fname ||
      !user.lname ||
      !user.email ||
      !user.password ||
      !user.contact
    ) {
      throw new Error("First name, last name, and email are required");
    }
    console.log("User data:", user);
    const hashPassword = await bcrypt.hash(user.password, soltRounds);
    user.password = hashPassword;
    const existingUser = await userRepo.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const newUser = await userRepo.createUser(user);
    return newUser;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (user: IUser) => {
  try {
    if (!user.email || !user.password) {
      throw new Error("Email and password are required");
    }
    const existingUser = await userRepo.findUserByEmail(user.email);
    if (!existingUser) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.getDataValue("password"),
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return {
      id: existingUser.getDataValue("id"),
      fname: existingUser.getDataValue("fname"),
      lname: existingUser.getDataValue("lname"),
      email: existingUser.getDataValue("email"),
      contact: existingUser.getDataValue("contact"),
    };
  } catch (error) {
    throw error;
  }
};
