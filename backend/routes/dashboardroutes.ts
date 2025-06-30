import { Router } from 'express';
import {
  getTotalOrders,
  getTotalProducts,
  getTotalCustomers,
  getLowInventory,
  getSalesRevenue,
  getRecentOrders,
  getSalesTrend, 
  getRecentCustomOrders,
  getCustomSalesTrend
} from '../controllers/dashboardcontroller';

const router = Router();

router.get('/total-orders', getTotalOrders);
router.get('/total-products', getTotalProducts);
router.get('/total-customers', getTotalCustomers);
router.get('/low-inventory', getLowInventory);
router.get('/sales-revenue', getSalesRevenue);
router.get('/recent-orders', getRecentOrders);
router.get('/recent-customorders', getRecentCustomOrders);
router.get('/sales-trend', getSalesTrend); 
router.get('/custom-sales-trend', getCustomSalesTrend);

export default router;
