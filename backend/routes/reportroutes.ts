import express from 'express';
import {
  getSalesSummary,
  getSalesSummaryPDF,
  getSalesByProduct,
  getSalesByProductPDF,
  getSalesByCategory,
  getSalesByCategoryPDF,
  getSalesByPaymentMethod,
  getSalesByPaymentMethodPDF,
  getLowStock,
  getLowStockPDF,
  getInventoryValuation,
  getInventoryValuationPDF,
  getTopCustomers,
  getTopCustomersPDF,
  getCustomerOrderHistory,
  getCustomerOrderHistoryPDF,
  getOrdersByStatus,
  getOrdersByStatusPDF,
  getOrderDetails,
  getOrderDetailsPDF,
  getCustomOrdersByStatusPDF,
  getCustomOrdersByStatus
} from '../controllers/reportcontroller';

const router = express.Router();

router.get('/sales-summary', getSalesSummary); 
router.get('/sales-summary/pdf', getSalesSummaryPDF);
router.get('/sales-by-product', getSalesByProduct);
router.get('/sales-by-product/pdf', getSalesByProductPDF);
router.get('/sales-by-category', getSalesByCategory);
router.get('/sales-by-category/pdf', getSalesByCategoryPDF);
router.get('/sales-by-payment', getSalesByPaymentMethod);
router.get('/sales-by-payment/pdf', getSalesByPaymentMethodPDF);

router.get('/inventory/low-stock', getLowStock);
router.get('/inventory/low-stock/pdf', getLowStockPDF);
router.get('/inventory/valuation', getInventoryValuation);
router.get('/inventory/valuation/pdf', getInventoryValuationPDF);

router.get('/customers/top', getTopCustomers);
router.get('/customers/top/pdf', getTopCustomersPDF);
router.get('/customers/:customerId/orders', getCustomerOrderHistory);
router.get('/customers/:customerId/orders/pdf', getCustomerOrderHistoryPDF);

router.get('/orders/status', getOrdersByStatus);
router.get('/orders/status/pdf', getOrdersByStatusPDF);
router.get('/orders/:orderId', getOrderDetails);
router.get('/orders/:orderId/pdf', getOrderDetailsPDF);

router.get('/customorders/status', getCustomOrdersByStatus);

router.get('/customorders/status/pdf', getCustomOrdersByStatusPDF);


export default router;