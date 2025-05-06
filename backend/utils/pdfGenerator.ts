// src/utils/pdfGenerator.ts

import PDFDocument from 'pdfkit';
import { Response } from 'express';

// Existing sales summary PDF generator
export const generateSalesSummaryPDF = (
  data: {
    total_orders: number;
    total_revenue: number;
    total_items_sold: number;
    start_date: string;
    end_date: string;
  },
  res: Response
) => {
  // ... (keep your existing implementation)
};

// New generic PDF generator for tabular data
export const generateGenericReportPDF = (
  options: {
    title: string;
    period: string;
    columns: string[];
    data: any[][];
  },
  res: Response,
  filename: string
) => {
  const doc = new PDFDocument({ margin: 50 });

  // Set headers to download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Title
  doc.fontSize(20).text(options.title, { align: 'center' });
  doc.moveDown();

  // Period
  doc.fontSize(12).text(`Report Period: ${options.period}`);
  doc.moveDown(2);

  // Calculate column positions
  const columnWidth = (doc.page.width - 100) / options.columns.length;
  const columnPositions = options.columns.map((_, i) => 50 + (i * columnWidth));

  // Table header
  doc.font('Helvetica-Bold');
  options.columns.forEach((column, i) => {
    doc.text(column, columnPositions[i], doc.y, { width: columnWidth, align: 'left' });
  });
  doc.moveDown();
  doc.font('Helvetica');

  // Table rows
  options.data.forEach(row => {
    const startY = doc.y;
    let maxHeight = 0;

    // Draw each cell and track the maximum height
    row.forEach((cell, i) => {
      const height = doc.heightOfString(cell.toString(), { width: columnWidth });
      doc.text(cell.toString(), columnPositions[i], doc.y, { width: columnWidth, align: 'left' });
      if (height > maxHeight) maxHeight = height;
    });

    // Move to the next row based on the tallest cell
    doc.y = startY + maxHeight + 5;
  });

  doc.end();
};