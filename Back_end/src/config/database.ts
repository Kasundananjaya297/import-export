/** @format */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { seedSampleData } from "../seeders/sampleData";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "export_import_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  },
);

// Force sync to recreate tables and seed sample data
sequelize.sync({ force: true }).then(async () => {
  console.log("Database & tables recreated!");
  await seedSampleData();
});

export default sequelize;
