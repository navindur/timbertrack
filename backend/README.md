# TimberTrack Backend API

## Overview

The TimberTrack backend is a RESTful API built with Node.js, Express.js, and TypeScript. It provides comprehensive endpoints for managing an e-commerce platform specializing in timber and furniture products.

## Architecture

### Tech Stack

- **Node.js** with Express.js framework
- **TypeScript** for type safety and better development experience
- **MySQL** database with mysql2 driver
- **JWT** for authentication and authorization
- **bcrypt** for secure password hashing
- **Multer** for file upload handling
- **Nodemailer** for email services
- **PDFKit** for receipt and document generation

### Project Structure

```
backend/
├── controllers/         # Request handlers and business logic
├── services/           # Business logic and data processing
├── models/             # Data models and database queries
├── routes/             # API route definitions
├── middleware/         # Authentication and validation middleware
├── config/             # Configuration files (Firebase, etc.)
├── utils/              # Utility functions (PDF generation, etc.)
├── types/              # TypeScript type definitions
├── public/             # Static files (logos, uploads)
├── server.ts           # Main application entry point
├── db.ts               # Database connection configuration
└── package.json        # Dependencies and scripts
```

## Environment Setup

### Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=timbertrack_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Firebase Configuration (if using Firebase services)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

## API Endpoints

### Authentication (`/api/auth/`)

#### POST `/api/signup`

Register a new user account.

**Request Body:**

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone_num": "0771234567",
  "address_line1": "123 Main Street",
  "address_line2": "Apt 4B",
  "city": "Colombo",
  "postal_code": "10100"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

#### POST `/api/signin`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "role": "customer"
  },
  "token": "jwt_token_here"
}
```

### Products (`/api/products/`)

#### GET `/api/products`

Get all active products with pagination and filtering.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search term for product name
- `category` (string): Filter by category

**Response:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Oak Dining Table",
      "description": "Beautiful handcrafted oak dining table",
      "price": 25000.0,
      "category": "Tables",
      "image_url": "/uploads/oak-table.jpg",
      "quantity": 5,
      "has_discount": true,
      "dummy_price": 30000.0
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalProducts": 50
}
```

#### POST `/api/products`

Add a new product (Shop Owner only).

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Form Data:**

- `inventory_id` (number): Associated inventory item ID
- `description` (string): Product description
- `image` (file): Product image file

### Orders (`/api/orders/`)

#### GET `/api/orders`

Get user's orders (Customer) or all orders (Shop Owner).

#### POST `/api/orders`

Create a new order.

**Request Body:**

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 25000.0
    }
  ],
  "customer_details": {
    "first_name": "John",
    "last_name": "Doe",
    "phone_num": "0771234567",
    "address_line1": "123 Main Street",
    "city": "Colombo",
    "postal_code": "10100"
  },
  "payment_method": "card"
}
```

### Cart (`/api/cart/`)

#### GET `/api/cart`

Get current user's cart items.

#### POST `/api/cart`

Add item to cart.

**Request Body:**

```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### PUT `/api/cart/:id`

Update cart item quantity.

#### DELETE `/api/cart/:id`

Remove item from cart.

### Inventory (`/api/inventory/`)

#### GET `/api/inventory`

Get all inventory items (Shop Owner only).

#### POST `/api/inventory`

Add new inventory item.

#### PUT `/api/inventory/:id`

Update inventory item.

#### DELETE `/api/inventory/:id`

Soft delete inventory item.

### Suppliers (`/api/suppliers/`)

#### GET `/api/suppliers`

Get all suppliers.

#### POST `/api/suppliers`

Add new supplier.

#### PUT `/api/suppliers/:id`

Update supplier information.

#### DELETE `/api/suppliers/:id`

Delete supplier.

### Custom Orders (`/api/custom-orders/`)

#### GET `/api/custom-orders`

Get custom orders (filtered by user role).

#### POST `/api/custom-orders`

Create a new custom order request.

**Request Body:**

```json
{
  "description": "Custom oak bookshelf with 5 shelves",
  "dimensions": "200cm x 80cm x 30cm",
  "wood_type": "Oak",
  "finish": "Natural",
  "additional_notes": "Need it delivered by next month"
}
```

### Reports (`/api/reports/`)

#### GET `/api/reports/sales`

Get sales reports with date filtering.

#### GET `/api/reports/inventory`

Get inventory reports.

#### GET `/api/reports/low-stock`

Get low stock items report.

## Authentication & Authorization

### JWT Token Structure

```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "customer|shopowner",
  "iat": 1640995200,
  "exp": 1641081600
}
```

### Protected Routes

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

### Role-Based Access

- **Customer**: Can access their own data, place orders, manage cart
- **Shop Owner**: Full administrative access to all resources

## Database Schema

### Key Tables

- `users` - User accounts and authentication
- `customers` - Customer profile information
- `inventory` - Product inventory management
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Individual items in orders
- `cart` - Shopping cart items
- `suppliers` - Supplier information
- `custom_orders` - Custom order requests

## Error Handling

### Standard Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## File Upload

### Supported File Types

- Images: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB

### Upload Endpoints

- Product images: `POST /api/products` (with multipart/form-data)
- Custom order images: `POST /api/custom-orders` (with multipart/form-data)

## Development

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Database Connection

The application uses MySQL with connection pooling for optimal performance. Database configuration is handled in `db.ts`.

### Logging

The application logs important events and errors. In development mode, detailed error information is provided in API responses.

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request data validation and sanitization
- **CORS Configuration**: Cross-origin request handling
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Security**: File type and size validation

## Testing

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test authentication
curl -X POST http://localhost:5000/api/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer your_jwt_token"
```

## Deployment

### Production Considerations

1. Set `NODE_ENV=production`
2. Use environment variables for all sensitive configuration
3. Set up proper database connection pooling
4. Configure reverse proxy (nginx) for static file serving
5. Set up SSL/TLS certificates
6. Configure proper logging and monitoring

### Environment Variables for Production

Ensure all required environment variables are set in your production environment, especially database credentials and JWT secrets.
