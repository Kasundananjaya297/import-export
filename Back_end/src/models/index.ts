/** @format */

import User from "./users";
import Product from "./products";
import Order from "./orders";
import Payment from "./payments";
import Complaint from "./complaints";
import Stall from "./stall";

// Define associations
User.hasMany(Product, {
  foreignKey: "userid",
  as: "products",
});

Product.belongsTo(User, {
  foreignKey: "userid",
  as: "user",
});

// Stall associations
User.hasOne(Stall, {
  foreignKey: "userId",
  as: "stall",
});

Stall.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Stall.hasMany(Product, {
  foreignKey: "stallId",
  as: "products",
});

Product.belongsTo(Stall, {
  foreignKey: "stallId",
  as: "stall",
});

// Order associations
User.hasMany(Order, {
  foreignKey: "buyerId",
  as: "buyerOrders",
});

User.hasMany(Order, {
  foreignKey: "sellerId",
  as: "sellerOrders",
});

Product.hasMany(Order, {
  foreignKey: "productId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "buyerId",
  as: "buyer",
});

Order.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

Order.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

// Payment associations
Order.hasOne(Payment, {
  foreignKey: "orderId",
  as: "payment",
});

Payment.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

// Complaint associations
User.hasMany(Complaint, {
  foreignKey: "buyerid",
  as: "buyerComplaints",
});

User.hasMany(Complaint, {
  foreignKey: "sellerid",
  as: "sellerComplaints",
});

Order.hasMany(Complaint, {
  foreignKey: "orderid",
  as: "complaints",
});

Complaint.belongsTo(User, {
  foreignKey: "buyerid",
  as: "buyer",
});

Complaint.belongsTo(User, {
  foreignKey: "sellerid",
  as: "seller",
});

Complaint.belongsTo(Order, {
  foreignKey: "orderid",
  as: "order",
});

export { User, Product, Order, Payment, Complaint, Stall };
