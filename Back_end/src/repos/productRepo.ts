/** @format */

import Product from "../models/products";
import { IProduct } from "../interfaces";

export const createProduct = async (product: Omit<IProduct, "id">) => {
  const newProduct = await Product.create(product);
  return newProduct;
};

export const getAllProducts = async () => {
  const products = await Product.findAll();
  console.log(products);
  return products;
};

export const getProductById = async (id: number) => {
  const product = await Product.findByPk(id);
  return product;
};

export const findOneProduct = async (where: any) => {
  const product = await Product.findOne({ where });
  return product;
};

export const deleteProduct = async (product: any) => {
  await product.destroy();
};
