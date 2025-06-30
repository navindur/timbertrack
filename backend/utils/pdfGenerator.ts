//pdf generation utility
import PDFDocument from 'pdfkit';
import { Response } from 'express';

//special sales summary pdf generation function
export const generateSalesSummaryPDF = (
  data: {
    total_orders: number;
    total_revenue: number;
    total_items_sold: number;
    regular_orders: number;
    regular_revenue: number;
    custom_orders: number;
    custom_revenue: number;
    regular_percentage: number;
    custom_percentage: number;
    start_date: string;
    end_date: string;
  },
  res: Response
) => {
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    bufferPages: true 
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=sales_summary.pdf');
  doc.pipe(res);

  const headerColor = '#2c3e50';
  const evenRowColor = '#f8f9fa';
  const oddRowColor = '#ffffff';

  doc.rect(0, 0, doc.page.width, 80)
     .fill(headerColor);

  doc.fillColor('#ffffff')
     .fontSize(20)
     .text('Sales Summary Report', 50, 30)
     .fontSize(12)
     .text('Comprehensive sales performance overview', 50, 55)
     .fontSize(10)
     .text(`Generated on: ${new Date().toLocaleDateString()} by TimberTrack`, { align: 'right' });

  doc.fillColor('#000000').font('Helvetica');

  doc.fontSize(12)
     .text(`Period: ${data.start_date} to ${data.end_date}`, 50, 100)
     .moveDown(1.5);

  doc.fontSize(16)
     .fillColor(headerColor)
     .text('Key Metrics', 50, doc.y)
     .moveDown(0.5);

  const summaryTable = {
    headers: ['Metric', 'Value'],
    rows: [
      ['Total Orders', data.total_orders.toString()],
      ['Total Revenue', `${Number(data.total_revenue).toFixed(2)}`],
      ['Total Items from Inventory Sold', data.total_items_sold.toString()]
    ]
  };
  drawEnhancedTable(doc, summaryTable, 50, doc.y, {
    columnWidths: [250, 150],
    headerColor,
    evenRowColor,
    oddRowColor
  });

  doc.moveDown(1.5)
     .fontSize(16)
     .fillColor(headerColor)
     .text('Sales Breakdown', 50, doc.y)
     .moveDown(0.5);

  const breakdownTable = {
    headers: ['Type', 'Orders', 'Revenue (Rs.)', 'Percentage'],
    rows: [
      ['Regular Orders', data.regular_orders.toString(), `${Number(data.regular_revenue).toFixed(2)}`, `${data.regular_percentage}%`],
      ['Custom Orders', data.custom_orders.toString(), `${Number(data.custom_revenue).toFixed(2)}`, `${data.custom_percentage}%`]
    ]
  };
  drawEnhancedTable(doc, breakdownTable, 50, doc.y, {
    columnWidths: [150, 80, 150, 120],
    headerColor,
    evenRowColor,
    oddRowColor
  });

  doc.moveDown(1.5)
     .fillColor('#100c08')
     .fontSize(12)
     .text('Performance Insights:', 50, doc.y)
     .moveDown(0.3);

  const insights = [
    `• ${data.regular_percentage}% of revenue came from regular orders`,
    `• ${data.custom_percentage}% of revenue came from custom orders`,
    `• Average order value: Rs. ${(data.total_revenue / data.total_orders).toFixed(2)}`
  ];

  insights.forEach(insight => {
    doc.text(insight, 60, doc.y);
    doc.moveDown(0.5);
  });

  addmainFooter(doc, '© Jayarani Furniture');

  doc.end();
};

const drawEnhancedTable = (
  doc: PDFKit.PDFDocument,
  table: { headers: string[]; rows: any[][] },
  x: number,
  y: number,
  options: {
    columnWidths: number[];
    headerColor: string;
    evenRowColor: string;
    oddRowColor: string;
  }
) => {
  const { columnWidths, headerColor, evenRowColor, oddRowColor } = options;
  const headerHeight = 25;
  const rowHeight = 25;

  const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

  doc.save();
  doc.rect(x, y, tableWidth, headerHeight)
     .fill(headerColor);
  doc.restore();

  doc.font('Helvetica-Bold')
     .fillColor('#ffffff');

  let currentX = x;
  table.headers.forEach((header, i) => {
    doc.text(header, currentX + 5, y + (headerHeight - doc.currentLineHeight()) / 2, {
      width: columnWidths[i] - 10,
      align: 'left'
    });
    currentX += columnWidths[i];
  });

  doc.font('Helvetica')
     .fillColor('#333333');
  
  table.rows.forEach((row, rowIndex) => {
    const rowY = y + headerHeight + (rowIndex * rowHeight);
    const rowColor = rowIndex % 2 === 0 ? evenRowColor : oddRowColor;

    doc.save();
    doc.rect(x, rowY, tableWidth, rowHeight)
       .fill(rowColor);
    doc.restore();

    currentX = x;
    row.forEach((cell, cellIndex) => {
      const align = typeof cell === 'number' || cell.includes('Rs.') ? 'right' : 'left';
      
      doc.text(cell.toString(), 
        currentX + (align === 'right' ? columnWidths[cellIndex] - 5 : 5), 
        rowY + (rowHeight - doc.currentLineHeight()) / 2,
        { 
          width: columnWidths[cellIndex] - 10,
          align
        }
      );
      currentX += columnWidths[cellIndex];
    });
  });

  doc.rect(x, y, tableWidth, headerHeight + (table.rows.length * rowHeight))
     .stroke('#dddddd');

  doc.y = y + headerHeight + (table.rows.length * rowHeight) + 15;
};

const addmainFooter = (doc: PDFKit.PDFDocument, text: string) => {
  const pageCount = doc.bufferedPageRange().count;

  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    
    doc.fillColor('#666666')
       .fontSize(10)
       .text(text, 50, doc.page.height - 80, {
         align: 'left',
         width: doc.page.width - 100
       })
       .text(`Page ${i + 1} of ${pageCount}`, {
         align: 'right',
         width: doc.page.width - 100
       });
  }
};

interface ReportOptions {
  title: string;
  subtitle?: string;
  period: string;
  columns: string[];
  data: any[][];
  footerText?: string;
  headerColor?: string;
  rowColors?: {
    even?: string;
    odd?: string;
  };
  columnWidths?: number[];
}

//function for generate other generic reports 
export const generateGenericReportPDF = (
  options: ReportOptions,
  res: Response,
  filename: string
) => {
  const doc = new PDFDocument({ 
    margin: 50,
    size: 'A4',
    bufferPages: true 
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  doc.pipe(res);

  const headerColor = options.headerColor || '#2c3e50';
  const evenRowColor = options.rowColors?.even || '#f8f9fa';
  const oddRowColor = options.rowColors?.odd || '#ffffff';

  addReportHeader(doc, options.title, options.subtitle, headerColor);

  doc.fillColor('#333333')
     .fontSize(10)
     .text(`Report Period: ${options.period}`, 50, 120, { align: 'left' })
     .text(`Generated on: ${new Date().toLocaleDateString()} by TimberTrack`, { align: 'right' })
     .moveDown(2);

  const columnWidths = options.columnWidths || 
    Array(options.columns.length).fill((doc.page.width - 100) / options.columns.length);
  
  const columnPositions = columnWidths.reduce((acc, width, i) => {
    acc.push(i === 0 ? 50 : acc[i-1] + columnWidths[i-1]);
    return acc;
  }, [] as number[]);

  drawTableHeader(doc, options.columns, columnPositions, columnWidths, headerColor);

  let isEvenRow = false;
  options.data.forEach((row, rowIndex) => {

    if (doc.y + 30 > doc.page.height - 50) {
      addNewPage(doc, options.title, headerColor);
      drawTableHeader(doc, options.columns, columnPositions, columnWidths, headerColor);
      isEvenRow = false; 
    }

    const rowColor = isEvenRow ? evenRowColor : oddRowColor;
    drawTableRow(doc, row, columnPositions, columnWidths, rowColor);
    isEvenRow = !isEvenRow;
  });

  addFooter(doc, options.footerText);

  doc.end();
};

function addReportHeader(doc: PDFKit.PDFDocument, title: string, subtitle?: string, headerColor?: string) {
  
  doc.rect(0, 0, doc.page.width, 80)
     .fill(headerColor || '#2c3e50');

  doc.fillColor('#ffffff')
     .fontSize(18)
     .text(title, 50, 30, { align: 'left' });

  if (subtitle) {
    doc.fillColor('#ffffff')
       .fontSize(12)
       .text(subtitle, 50, 55, { align: 'left' });
  }

  doc.fillColor('#000000').font('Helvetica');
}

function drawTableHeader(
  doc: PDFKit.PDFDocument, 
  columns: string[], 
  positions: number[], 
  widths: number[],
  fillColor: string
) {
  const headerHeight = 20;
  const startY = doc.y;
  
  doc.rect(positions[0], startY, positions[positions.length-1] + widths[widths.length-1] - positions[0], headerHeight)
     .fill(fillColor);

  doc.fillColor('#ffffff')
     .font('Helvetica-Bold');
  
  columns.forEach((column, i) => {
    doc.text(column, positions[i], startY + 5, {
      width: widths[i],
      align: 'left'
    });
  });

  doc.fillColor('#000000')
     .font('Helvetica')
     .moveDown(0.5);
}

function drawTableRow(
  doc: PDFKit.PDFDocument,
  row: any[],
  positions: number[],
  widths: number[],
  rowColor: string
) {
  const startY = doc.y;
  const rowHeight = calculateRowHeight(doc, row, widths) + 10;

  doc.rect(positions[0], startY, positions[positions.length-1] + widths[widths.length-1] - positions[0], rowHeight)
     .fill(rowColor);

  row.forEach((cell, i) => {
    doc.fillColor('#333333')
       .text(cell.toString(), positions[i], startY + 5, {
         width: widths[i],
         align: 'left'
       });
  });

  doc.y = startY + rowHeight;
}

function calculateRowHeight(doc: PDFKit.PDFDocument, row: any[], widths: number[]) {
  return row.reduce((maxHeight, cell, i) => {
    const height = doc.heightOfString(cell.toString(), { width: widths[i] });
    return Math.max(maxHeight, height);
  }, 0);
}

function addNewPage(doc: PDFKit.PDFDocument, title: string, headerColor: string) {
  doc.addPage();
  addReportHeader(doc, title, undefined, headerColor);
  doc.y = 130; 
}

function addFooter(doc: PDFKit.PDFDocument, customText?: string) {
  const footerText = customText || '© Jayarani Furniture';
  const pageCount = doc.bufferedPageRange().count;

  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    
    doc.fillColor('#666666')
       .fontSize(10)
       .text(footerText, 50, doc.page.height - 80, {
         align: 'left',
         width: doc.page.width - 100
       });
    
    doc.text(`Page ${i + 1} of ${pageCount}`, {
      align: 'right',
      width: doc.page.width - 100
    });
  }
}