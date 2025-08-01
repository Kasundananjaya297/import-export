/** @format */

import User from "./users";
import Product from "./products";
import Order from "./orders";
import Payment from "./payments";

// Define associations
User.hasMany(Product, {
  foreignKey: "userId",
  as: "products",
});

Product.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
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

export { User, Product, Order, Payment };
