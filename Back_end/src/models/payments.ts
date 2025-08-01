import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "Payments",
    timestamps: true,
  }
);

export default Payment; 