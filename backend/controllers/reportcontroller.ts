import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import {
  getSalesSummaryService,
  getSalesByProductService,
  getSalesByCategoryService,
  getSalesByPaymentMethodService,
  getLowStockService,
  getInventoryValuationService,
  getTopCustomersService,
  getCustomerOrderHistoryService,
  getOrdersByStatusService,
  getOrderDetailsService
} from '../services/reportservice';
import { getCustomOrdersByStatusService } from '../services/reportservice';
import { generateSalesSummaryPDF, generateGenericReportPDF } from '../utils/pdfGenerator';

interface SalesSummary {
    total_orders: number;
    total_revenue: number;
    total_items_sold: number;
  }

export const getSalesSummary = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const summary = await getSalesSummaryService(start as string, end as string);

    res.status(200).json(summary);
  } catch (err) {
    console.error('Error fetching sales summary:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSalesSummaryPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const summary = await getSalesSummaryService(start as string, end as string);

    
    generateSalesSummaryPDF({
      ...summary,
      start_date: start as string,
      end_date: end as string,
    }, res);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getSalesByProduct = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByProductService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching sales by product:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSalesByProductPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByProductService(start as string, end as string);
    
    generateGenericReportPDF({
      title: 'Sales by Product Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Sales by Product overview',
      columns: ['Product ID', 'Product Name', 'Quantity Sold', 'Revenue'],
      data: (results as any[]).map(item => [
        item.id,
        item.name,
        item.total_quantity,
        `Rs.${Number(item.total_revenue).toFixed(2)}`
      ])
    }, res, 'sales_by_product.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getSalesByCategory = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByCategoryService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching sales by category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSalesByCategoryPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByCategoryService(start as string, end as string);
    
    generateGenericReportPDF({
      title: 'Sales by Category Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Sales by Category overview',
      columns: ['Category', 'Quantity Sold', 'Revenue'],
      data: (results as any[]).map(item => [
        item.category,
        item.total_quantity,
        `Rs.${Number(item.total_revenue).toFixed(2)}`
      ])
    }, res, 'sales_by_category.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getSalesByPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByPaymentMethodService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching sales by payment method:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSalesByPaymentMethodPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getSalesByPaymentMethodService(start as string, end as string);
    
    generateGenericReportPDF({
      title: 'Sales by Payment Method Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Payment MethodS overview',
      columns: ['Payment Method', 'Order Count', 'Revenue'],
      data: (results as any[]).map(item => [
        item.payment_method,
        item.order_count,
        `Rs.${Number(item.revenue).toFixed(2)}`
      ])
    }, res, 'sales_by_payment_method.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getLowStock = async (req: Request, res: Response) => {
  try {
    const results = await getLowStockService();
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching low stock alerts:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLowStockPDF = async (req: Request, res: Response) => {
  try {
    const results = await getLowStockService();
    
    generateGenericReportPDF({
      title: 'Low Stock Alerts Report',
      period: 'Current',
      subtitle: 'Comprehensive Low Stock overview',
      columns: ['Inventory ID', 'Product Name', 'Current Quantity', 'Reorder Level'],
      data: (results as any[]).map(item => [
        item.inventory_id,
        item.name,
        item.quantity,
        item.reorder_level
      ])
    }, res, 'low_stock_alerts.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getInventoryValuation = async (req: Request, res: Response) => {
  try {
    const results = await getInventoryValuationService();
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching inventory valuation:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getInventoryValuationPDF = async (req: Request, res: Response) => {
  try {
    const results = await getInventoryValuationService();
    
    generateGenericReportPDF({
      title: 'Inventory Valuation Report',
      period: 'Current',
      subtitle: 'Comprehensive Inventory Valuation overview',
      columns: ['Inventory ID', 'Name', 'Type', 'Quantity', 'Unit Price', 'Total Value'],
      data: (results as any[]).map(item => [
        item.inventory_id,
        item.name,
        item.type,
        item.quantity,
        `Rs.${Number(item.price).toFixed(2)}`,
        `Rs.${Number(item.total_value).toFixed(2)}`
      ])
    }, res, 'inventory_valuation.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getTopCustomers = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getTopCustomersService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching top customers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopCustomersPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getTopCustomersService(start as string, end as string);
    
    generateGenericReportPDF({
      title: 'Top Customers Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Top Customers overview',
      columns: ['Customer ID', 'Name', 'Email', 'Total Spent', 'Total Orders'],
      data: (results as any[]).map(item => [
        item.customer_id,
        `${item.first_name} ${item.last_name}`,
        item.email,
        `Rs.${Number(item.total_spent).toFixed(2)}`,
        item.total_orders
      ])
    }, res, 'top_customers.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getCustomerOrderHistory = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const results = await getCustomerOrderHistoryService(customerId);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching customer order history:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerOrderHistoryPDF = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const results = await getCustomerOrderHistoryService(customerId);
    
    generateGenericReportPDF({
      title: 'Customer Order History',
      period: `Customer ID: ${customerId}`,
      subtitle: 'Comprehensive Customer Order overview',
      columns: ['Order ID', 'Date', 'Product', 'Quantity', 'Price', 'Status'],
      data: (results as any[]).map(item => [
        item.order_id,
        new Date(item.created_at).toLocaleDateString(),
        item.product_name,
        item.quantity,
        `Rs.${Number(item.price).toFixed(2)}`,
        item.status
      ])
    }, res, `customer_${customerId}_order_history.pdf`);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};


export const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getOrdersByStatusService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching normal orders by status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrdersByStatusPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }
    const results = await getOrdersByStatusService(start as string, end as string);
    
    generateGenericReportPDF({
      title: 'Normal Orders by Status Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Normal Orders by Status overview',
      columns: ['Status', 'Order Count', 'Revenue'],
      data: (results as any[]).map(item => [
        item.status,
        item.count,
        `Rs.${Number(item.revenue).toFixed(2)}`
      ])
    }, res, 'orders_by_status.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

export const getCustomOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const results = await getCustomOrdersByStatusService(start as string, end as string);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching custom orders by status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomOrdersByStatusPDF = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end dates are required' });
    }

    const results = await getCustomOrdersByStatusService(start as string, end as string);

    generateGenericReportPDF({
      title: 'Custom Orders by Status Report',
      period: `${start} to ${end}`,
      subtitle: 'Comprehensive Custom Orders Status Overview',
      columns: ['Status', 'Order Count', 'Total Estimated Price'],
      data: (results as any[]).map(item => [
        item.status,
        item.count,
        `Rs.${Number(item.total_estimated_price).toFixed(2)}`
      ])
    }, res, 'custom_orders_by_status.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const results = await getOrderDetailsService(orderId);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderDetailsPDF = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { order, items } = await getOrderDetailsService(orderId) as any;
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order_${orderId}_details.pdf`);
    doc.pipe(res);

    
    doc.fontSize(20).text(`Order #${orderId} Details`, { align: 'center' });
    doc.moveDown();

    
    doc.fontSize(14).text('Order Summary', { underline: true });
    doc.fontSize(12);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Payment Method: ${order.payment_method}`);
    doc.text(`Total Price: $${Number(order.total_price).toFixed(2)}`);
    doc.moveDown(2);

    
    doc.fontSize(14).text('Order Items', { underline: true });
    doc.moveDown(0.5);
    
    
    doc.font('Helvetica-Bold');
    doc.text('Product', 50, doc.y);
    doc.text('Quantity', 300, doc.y);
    doc.text('Price', 400, doc.y, { width: 100, align: 'right' });
    doc.moveDown(0.5);
    doc.font('Helvetica');
    
    
    items.forEach((item: any) => {
      doc.text(item.product_name, 50, doc.y);
      doc.text(item.quantity.toString(), 300, doc.y);
      doc.text(`$${Number(item.price).toFixed(2)}`, 400, doc.y, { width: 100, align: 'right' });
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};