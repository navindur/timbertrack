import * as orderModel from '../models/ownerorderModel';

export const fetchAllOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string
) => {
  return orderModel.getAllOrders(page, limit, status);
};

export const fetchOrderDetails = async (orderId: number) => {
  return orderModel.getOrderById(orderId);
};

export const changeOrderStatus = async (
  orderId: number,
  newStatus: string
) => {
  return orderModel.updateOrderStatus(orderId, newStatus);
};