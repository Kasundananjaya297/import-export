/** @format */

import Order from "../models/orders";
import Product from "../models/products";
import User from "../models/users";

export const createOrder = async (orderData: any) => {
  try {
    // Generate unique order number
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const orderNumber = `ORD-${timestamp}-${randomNum}`;

    const order = await Order.create({
      ...orderData,
      orderNumber,
    });

    // [ADDED FOR REQUIREMENT COMPLETION]: fetch order with product details for preview
    const orderWithDetails = await Order.findByPk(order.getDataValue("id"), {
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "category",
            "price",
            "unit",
            "description",
            "images",
          ],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
    });

    return orderWithDetails;
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price", "unit"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (id: number) => {
  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "name",
            "category",
            "price",
            "unit",
            "description",
            "images",
          ],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company", "contact"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company", "contact"],
        },
      ],
    });

    return order;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByBuyerId = async (buyerId: number) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price", "unit", "images"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

export const getOrdersBySellerId = async (sellerId: number) => {
  try {
    const orders = await Order.findAll({
      where: { sellerId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price", "unit", "images"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return orders;
  } catch (error) {
    throw error;
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error("Order not found");
    }

    await order.update({ status });
    
    // Fetch updated order with all associations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price", "unit", "images"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
    });
    
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (
  id: number,
  paymentStatus: string,
) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error("Order not found");
    }

    await order.update({ paymentStatus });
    
    // Fetch updated order with all associations
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "category", "price", "unit", "images"],
        },
        {
          model: User,
          as: "buyer",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
        {
          model: User,
          as: "seller",
          attributes: ["id", "fname", "lname", "email", "company"],
        },
      ],
    });
    
    return updatedOrder;
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (order: Order) => {
  try {
    await order.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};
