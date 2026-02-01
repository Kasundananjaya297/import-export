/** @format */

import bcrypt from "bcrypt";
import User from "../models/users";

const DEFAULT_ADMIN = {
    fname: "System",
    lname: "Administrator",
    gender: "other",
    addressLine1: "123 Admin St",
    city: "Colombo",
    state: "Western",
    zipCode: "00100",
    country: "Sri Lanka",
    email: "admin@ceylontrade.com",
    role: "admin",
    contact: "0771234567",
    password: "adminPassword123",
};

export const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ where: { email: DEFAULT_ADMIN.email } });
        if (!existingAdmin) {
            console.log("Seeding admin user...");
            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
            await User.create({
                ...DEFAULT_ADMIN,
                password: hashedPassword,
            });
            console.log("Admin user seeded successfully.");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};
