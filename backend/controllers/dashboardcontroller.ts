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


export const getRecentCustomOrders = async (_: Request, res: Response) => {
  try {
    const customOrders = await DashboardService.getRecentCustomOrders();
    res.json({ customOrders });
  } catch (error) {
    console.error('Error fetching recent custom orders:', error);
    res.status(500).json({ message: 'Failed to fetch recent custom orders' });
  }
};


//new
export const getSalesTrend = async (req: Request, res: Response) => {
  const range = req.query.range as string;
  const trendData = await DashboardService.getSalesTrend(range);
  res.json({ trendData });
};

export const getCustomSalesTrend = async (req: Request, res: Response) => {
  try {
    const range = req.query.range as string;
    const trendData = await DashboardService.getCustomSalesTrend(range);
    res.json({ trendData });
  } catch (error) {
    console.error('Error fetching custom sales trend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};