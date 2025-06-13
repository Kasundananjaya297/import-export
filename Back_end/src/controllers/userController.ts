/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const userController = {
  async create(req: Request, res: Response) {
    try {
      const {
        fname,
        lname,
        gender,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        email,
        contact,
        password,
        role,
        company,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await User.create({
        fname,
        lname,
        gender,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        country,
        email,
        contact,
        password: hashedPassword,
        role,
        company,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.getDataValue("id"),
          email: user.getDataValue("email"),
          role: user.getDataValue("role"),
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Remove password from response
      const userResponse = {
        id: user.getDataValue("id"),
        fname: user.getDataValue("fname"),
        lname: user.getDataValue("lname"),
        gender: user.getDataValue("gender"),
        addressLine1: user.getDataValue("addressLine1"),
        addressLine2: user.getDataValue("addressLine2"),
        city: user.getDataValue("city"),
        state: user.getDataValue("state"),
        zipCode: user.getDataValue("zipCode"),
        country: user.getDataValue("country"),
        email: user.getDataValue("email"),
        contact: user.getDataValue("contact"),
        role: user.getDataValue("role"),
        company: user.getDataValue("company"),
      };

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: userResponse,
        jwt: token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Error registering user",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(
        password,
        user.getDataValue("password"),
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.getDataValue("id"),
          email: user.getDataValue("email"),
          role: user.getDataValue("role"),
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      // Remove password from response
      const userResponse = {
        id: user.getDataValue("id"),
        fname: user.getDataValue("fname"),
        lname: user.getDataValue("lname"),
        gender: user.getDataValue("gender"),
        addressLine1: user.getDataValue("addressLine1"),
        addressLine2: user.getDataValue("addressLine2"),
        city: user.getDataValue("city"),
        state: user.getDataValue("state"),
        zipCode: user.getDataValue("zipCode"),
        country: user.getDataValue("country"),
        email: user.getDataValue("email"),
        contact: user.getDataValue("contact"),
        role: user.getDataValue("role"),
        company: user.getDataValue("company"),
      };

      res.json({
        success: true,
        message: "Login successful",
        data: userResponse,
        jwt: token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Error logging in",
      });
    }
  },

  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove password from response
      const userResponse = {
        id: user.getDataValue("id"),
        fname: user.getDataValue("fname"),
        lname: user.getDataValue("lname"),
        gender: user.getDataValue("gender"),
        addressLine1: user.getDataValue("addressLine1"),
        addressLine2: user.getDataValue("addressLine2"),
        city: user.getDataValue("city"),
        state: user.getDataValue("state"),
        zipCode: user.getDataValue("zipCode"),
        country: user.getDataValue("country"),
        email: user.getDataValue("email"),
        contact: user.getDataValue("contact"),
        role: user.getDataValue("role"),
        company: user.getDataValue("company"),
      };

      res.json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching user data",
      });
    }
  },
};
