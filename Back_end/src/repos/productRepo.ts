/** @format */

import Product from "../models/products";
import User from "../models/users";
import { IProduct } from "../interfaces";

export const createProduct = async (product: Omit<IProduct, "id">) => {
  const newProduct = await Product.create(product);
  return newProduct;
};

export const getAllProducts = async () => {
  const products = await Product.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fname", "lname", "company"],
      },
    ],
  });
  console.log(products);
  return products;
};

export const getProductById = async (id: number) => {
  const product = await Product.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fname", "lname", "company"],
      },
    ],
  });
  return product;
};

export const findOneProduct = async (where: any) => {
  const product = await Product.findOne({
    where,
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "fname", "lname", "company"],
      },
    ],
  });
  return product;
};

export const getProductByUserId = async (id: number) => {
  console.log("Repository received userId:", id, "Type:", typeof id);
  const products = await Product.findAll({
    where: { userId: id },
  });
  console.log("Query executed with userId:", id);
  return products;
};

export const deleteProduct = async (product: any) => {
  await product.destroy();
};
