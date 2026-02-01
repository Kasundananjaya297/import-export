/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Product extends Model { }

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minOrderQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, // Store image URLs as JSON array
      allowNull: false,
    },
    // New fields for Fish Listing
    species: {
      type: DataTypes.STRING,
      allowNull: true, // Optional for now to avoid breaking existing data immediately, or should be false per req
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    wholesalePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    // 'price' reused as retailPrice
    sizeValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sizeUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ageValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ageUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'mixed'),
      defaultValue: 'mixed',
    },
    breedingStatus: {
      type: DataTypes.ENUM('not_paired', 'paired_out', 'confirmed_pair'),
      defaultValue: 'not_paired',
    },
    // Flattened feedingDetails
    feedingFoodType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feedingFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video: {
      type: DataTypes.STRING, // URL
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'sold', 'out_of_stock'),
      defaultValue: 'available',
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userid', // Explicitly map to lowercase column name
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    stallId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allow null temporarily to avoid breaking existing data, but will be enforced in controller
      references: {
        model: "Stall",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  },
);

export default Product;
