/** @format */

import User from "../models/users";
import { IUser } from "../interfaces";

export const createUser = async (user: IUser) => {
  try {
    const newUser = await User.create({ ...user });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
export const getUserById = async (id: number) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    throw error;
  }
};
export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found by email:", user);
    return user;
  } catch (error) {
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
};
export const updateUser = async (id: number, user: IUser) => {
  try {
    const updatedUser = await User.update({ ...user }, { where: { id } });
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
