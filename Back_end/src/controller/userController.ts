/** @format */

import { Request, Response, NextFunction } from "express";
import { responseDTO } from "../responseDTO/responseDTO";
import * as userService from "../services/userServices";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userData = req.body;
  let response;
  try {
    if (userData) {
      const newUser = await userService.createUser(userData);
      response = responseDTO("success", newUser, "User created successfully");
      res.status(201).json(response);
    } else {
      response = responseDTO("error", null, "User data is required");
      res.status(400).json(response);
    }
  } catch {
    response = responseDTO("error", null, "Error creating user");
    res.status(500).json(response);
  }
};
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    const userData = req.body;
    let response;
    try {
        if (userData) {
        const user = await userService.loginUser(userData);
        response = responseDTO("success", user, "User logged in successfully");
        res.status(200).json(response);
        } else {
        response = responseDTO("error", null, "User data is required");
        res.status(400).json(response);
        }
    } catch (error) {
        response = responseDTO("error", null, "Error logging in user");
        res.status(500).json(response);
    }
};
