/** @format */

import Complaint from "../models/complaints";
import Order from "../models/orders";
import User from "../models/users";
import Product from "../models/products";

export const createComplaint = async (complaintData: any) => {
  const newComplaint = await Complaint.create(complaintData);
  return newComplaint;
};

export const getAllComplaints = async () => {
  const complaints = await Complaint.findAll({
    include: [
      {
        model: Order,
        as: "order",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
          },
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
    order: [["createdAt", "DESC"]],
  });
  return complaints;
};

export const getComplaintById = async (id: number) => {
  const complaint = await Complaint.findByPk(id, {
    include: [
      {
        model: Order,
        as: "order",
        include: [
          {
            model: Product,
            as: "product",
          },
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
  return complaint;
};

export const getComplaintsByBuyerId = async (buyerId: number) => {
  const complaints = await Complaint.findAll({
    where: { buyerid: buyerId },
    include: [
      {
        model: Order,
        as: "order",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: User,
        as: "seller",
        attributes: ["id", "fname", "lname", "email", "company"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return complaints;
};

export const getComplaintsBySellerId = async (sellerId: number) => {
  const complaints = await Complaint.findAll({
    where: { sellerid: sellerId },
    include: [
      {
        model: Order,
        as: "order",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: User,
        as: "buyer",
        attributes: ["id", "fname", "lname", "email", "company"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
  return complaints;
};

export const updateComplaint = async (id: number, updateData: any) => {
  const complaint = await Complaint.findByPk(id);
  if (!complaint) {
    throw new Error("Complaint not found");
  }
  await complaint.update(updateData);
  return complaint;
};

export const deleteComplaint = async (id: number) => {
  const complaint = await Complaint.findByPk(id);
  if (!complaint) {
    throw new Error("Complaint not found");
  }
  await complaint.destroy();
};
