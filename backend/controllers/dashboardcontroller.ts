import { Request, Response } from 'express';
import * as DashboardService from '../services/dashboardservice';

export const getTotalOrders = async (req: Request, res: Response) => {
  const range = req.query.range as string;
  const total = await DashboardService.getTotalOrders(range);
  res.json({ total });
};

export const getTotalProducts = async (_: Request, res: Response) => {
  const total = await DashboardService.getTotalProducts();
  res.json({ total });
};

export const getTotalCustomers = async (req: Request, res: Response) => {
  const range = req.query.range as string;
  const total = await DashboardService.getTotalCustomers(range);
  res.json({ total });
};

export const getLowInventory = async (_: Request, res: Response) => {
  const items = await DashboardService.getLowInventory();
  res.json({ items });
};

export const getSalesRevenue = async (req: Request, res: Response) => {
  const range = req.query.range as string;
  const total = await DashboardService.getSalesRevenue(range);
  res.json({ total });
};

export const getRecentOrders = async (_: Request, res: Response) => {
  const orders = await DashboardService.getRecentOrders();
  res.json({ orders });
};

//new
export const getSalesTrend = async (req: Request, res: Response) => {
  const range = req.query.range as string;
  const trendData = await DashboardService.getSalesTrend(range);
  res.json({ trendData });
};