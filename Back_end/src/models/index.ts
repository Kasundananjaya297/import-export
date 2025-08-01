/** @format */

import User from "./users";
import Product from "./products";

// Define associations
User.hasMany(Product, {
  foreignKey: "userId",
  as: "products",
});

Product.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { User, Product };
