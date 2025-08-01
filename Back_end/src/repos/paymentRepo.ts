/** @format */

import Payment from "../models/payments";
import Order from "../models/orders";

export const createPayment = async (paymentData: any) => {
  try {
    const payment = await Payment.create(paymentData);
    return payment;
  } catch (error) {
    throw error;
  }
};

export const getPaymentById = async (id: number) => {
  try {
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "orderNumber", "totalAmount", "status"],
        },
      ],
    });
    return payment;
  } catch (error) {
    throw error;
  }
};

export const getPaymentByOrderId = async (orderId: number) => {
  try {
    const payment = await Payment.findOne({
      where: { orderId },
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "orderNumber", "totalAmount", "status"],
        },
      ],
    });
    return payment;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (
  id: number,
  status: string,
  transactionId?: string,
) => {
  try {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const updateData: any = {
      status,
      processedAt: status === "completed" ? new Date() : null,
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    await payment.update(updateData);
    return payment;
  } catch (error) {
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: ["id", "orderNumber", "totalAmount", "status"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return payments;
  } catch (error) {
    throw error;
  }
};
