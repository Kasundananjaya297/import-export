/** @format */

import bcrypt from "bcrypt";
import { User } from "../models/user";
import { Product } from "../models/products";

export const seedSampleData = async () => {
  try {
    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = [
      {
        fname: "John",
        lname: "Doe",
        gender: "male",
        addressLine1: "123 Main St",
        addressLine2: "Apt 4B",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        email: "john.doe@example.com",
        role: "exporter",
        contact: "1234567890",
        company: "Global Exports Inc",
        password: hashedPassword,
      },
      {
        fname: "Jane",
        lname: "Smith",
        gender: "female",
        addressLine1: "456 Market St",
        addressLine2: "Suite 200",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        email: "jane.smith@example.com",
        role: "importer",
        contact: "9876543210",
        company: "Import Solutions Ltd",
        password: hashedPassword,
      },
    ];

    // Create sample products
    const products = [
      {
        name: "Organic Coffee Beans",
        description: "Premium organic coffee beans from Colombia",
        category: "Beverages",
        price: 29.99,
        stock: 1000,
        unit: "kg",
        exporterId: 1,
        imageUrl: "https://example.com/coffee.jpg",
      },
      {
        name: "Handmade Ceramic Vase",
        description: "Beautiful handcrafted ceramic vase",
        category: "Home Decor",
        price: 49.99,
        stock: 50,
        unit: "piece",
        exporterId: 1,
        imageUrl: "https://example.com/vase.jpg",
      },
      {
        name: "Organic Cotton T-Shirt",
        description: "100% organic cotton t-shirt",
        category: "Clothing",
        price: 24.99,
        stock: 200,
        unit: "piece",
        exporterId: 1,
        imageUrl: "https://example.com/tshirt.jpg",
      },
    ];

    // Insert users
    for (const user of users) {
      await User.create(user);
    }

    // Insert products
    for (const product of products) {
      await Product.create(product);
    }

    console.log("Sample data seeded successfully!");
  } catch (error) {
    console.error("Error seeding sample data:", error);
  }
};
