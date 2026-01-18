/** @format */
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Complaint extends Model {}

Complaint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'orderid',
      references: {
        model: "Orders",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    buyerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'buyerid',
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    sellerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'sellerid',
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        'Product Quality',
        'Shipping Delay',
        'Damaged Product',
        'Wrong Product',
        'Payment Issue',
        'Other'
      ),
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'Medium',
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
      defaultValue: 'open',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Complaint",
    tableName: "complaints",
    timestamps: true,
  }
);

export default Complaint;
