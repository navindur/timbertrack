# TimberTrack - E-Commerce Platform for Timber & Furniture

## Overview

TimberTrack is a comprehensive e-commerce platform designed specifically for timber and furniture businesses. It provides a complete solution for managing inventory, processing orders, handling customer relationships, and generating business reports.

## Features

### Customer Features

- **Product Browsing**: Browse products by categories with search and filtering
- **Shopping Cart**: Add/remove items with inventory validation
- **Custom Orders**: Request custom furniture with image uploads
- **Order Tracking**: Track order status and history
- **User Authentication**: Secure signup/signin with profile management
- **Responsive Design**: Mobile-friendly interface

### Shop Owner Features

- **Dashboard**: Comprehensive business analytics and metrics
- **Inventory Management**: Track stock levels, reorder points, and suppliers
- **Product Management**: Add/edit products with image uploads and discount management
- **Order Management**: Process orders, update status, generate receipts
- **Customer Management**: View customer details and order history
- **Supplier Management**: Manage supplier information and relationships
- **Reports**: Sales reports, inventory reports, and business analytics
- **Walk-in Orders**: Process in-store purchases
- **Custom Order Management**: Handle custom furniture requests and pricing

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API communication
- **Chart.js** for data visualization
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MySQL** database with mysql2 driver
- **JWT** for authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email services
- **PDFKit** for receipt generation
- **Firebase** for additional services

## Project Structure

```
TimberTrack/
├── backend/                 # Node.js/Express API server
│   ├── controllers/         # Request handlers and business logic
│   ├── services/           # Business logic and data processing
│   ├── models/             # Data models and database queries
│   ├── routes/             # API route definitions
│   ├── middleware/         # Authentication and validation middleware
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── context/        # React context providers
│   │   ├── types/          # TypeScript interfaces
│   │   └── api/            # API configuration
│   └── public/             # Static assets
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TimberTrack
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Database Setup**

   - Create a MySQL database
   - Configure database connection in `backend/.env`
   - Run database migrations/setup scripts

4. **Environment Configuration**

   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Configure all required environment variables

5. **Start Development Servers**

   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm run dev
   ```

## API Documentation

The backend provides RESTful APIs for:

- Authentication (`/api/auth/*`)
- Products (`/api/products/*`)
- Orders (`/api/orders/*`)
- Cart (`/api/cart/*`)
- Customers (`/api/customers/*`)
- Inventory (`/api/inventory/*`)
- Suppliers (`/api/suppliers/*`)
- Reports (`/api/reports/*`)
- Custom Orders (`/api/custom-orders/*`)

Detailed API documentation is available in `backend/README.md`.

## User Roles

### Customer

- Browse and purchase products
- Manage shopping cart
- Place custom orders
- Track order status
- Manage profile

### Shop Owner

- Full administrative access
- Manage inventory and products
- Process orders
- View analytics and reports
- Manage customers and suppliers

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected routes and API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper comments
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team.
