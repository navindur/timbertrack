# TimberTrack Frontend

## Overview

The TimberTrack frontend is a modern React application built with TypeScript, providing a comprehensive user interface for both customers and shop owners in the timber and furniture e-commerce platform.

## Technology Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type safety and enhanced development experience
- **Material-UI (MUI)** - Comprehensive React component library
- **React Router DOM** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Chart.js & React-Chartjs-2** - Data visualization for analytics
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Firebase** - Authentication and additional services

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── auth/           # Authentication-related components
│   │   ├── AddProductDialog.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/              # Page components (route handlers)
│   │   ├── Dashboard.tsx   # Shop owner dashboard
│   │   ├── Home.tsx        # Customer home page
│   │   ├── ProductList.tsx # Product management
│   │   └── ...
│   ├── services/           # API service functions
│   │   ├── cartService.ts
│   │   ├── productService.ts
│   │   └── ...
│   ├── context/            # React context providers
│   │   └── AuthContext.tsx
│   ├── types/              # TypeScript type definitions
│   │   ├── Product.ts
│   │   ├── supplier.ts
│   │   └── ...
│   ├── api/                # API configuration
│   │   └── axiosInstance.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
│   ├── images/             # Product and UI images
│   └── logo.png
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Features

### Customer Interface

- **Home Page**: Hero section, product showcase, company information
- **Product Browsing**: Search, filter, and browse products by category
- **Product Details**: Detailed product view with image, description, pricing
- **Shopping Cart**: Add/remove items, quantity management, inventory validation
- **Checkout Process**: Customer information, payment processing, order confirmation
- **Custom Orders**: Request custom furniture with specifications and images
- **Order Tracking**: View order history and status updates
- **User Profile**: Manage personal information and preferences

### Shop Owner Interface

- **Dashboard**: Business analytics, sales charts, key metrics
- **Product Management**: Add/edit/delete products, manage inventory
- **Order Management**: Process orders, update status, generate receipts
- **Inventory Management**: Track stock levels, manage suppliers
- **Customer Management**: View customer details and order history
- **Reports**: Sales reports, inventory reports, analytics
- **Walk-in Orders**: Process in-store purchases
- **Custom Order Management**: Handle custom requests, set pricing

## Key Components

### Authentication System

- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Role-based route protection
- **SignIn/SignUp**: User authentication forms with validation

### Navigation

- **Navbar**: Main navigation with role-based menu items
- **Adminnavbar**: Shop owner sidebar navigation
- **Footer**: Site footer with links and information

### Product Components

- **ProductCard**: Reusable product display component
- **ProductList**: Admin product management interface
- **CustomerProductList**: Customer product browsing interface
- **AddProductDialog**: Modal for adding/editing products

### Order Components

- **CartPage**: Shopping cart management
- **CheckoutPage**: Order placement and payment
- **OrderList**: Order management for shop owners
- **OrderConfirmation**: Order success page

## Routing Structure

### Public Routes

- `/` - Home page
- `/products` - Product browsing
- `/categories/:category` - Category-specific products
- `/productsview/:id` - Product details
- `/about-us` - About page
- `/signin` - User login
- `/signup` - User registration

### Customer Protected Routes

- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/customerprofile` - User profile
- `/allorderview` - Order history
- `/custom-order` - Custom order request
- `/my-custom-orders` - Custom order tracking

### Shop Owner Protected Routes

- `/dashboard` - Admin dashboard
- `/productlist` - Product management
- `/inventorylist` - Inventory management
- `/supplierlist` - Supplier management
- `/ownerorders` - Order management
- `/customerinfo` - Customer management
- `/reports` - Business reports
- `/walkin-order` - Walk-in order processing

## State Management

### Context Providers

- **AuthContext**: Manages user authentication state, login/logout functionality
- Global state for user information, authentication tokens, and role-based access

### Local State Management

- Component-level state using React hooks (useState, useEffect)
- Form state management with controlled components
- Loading states and error handling

## API Integration

### Service Layer

All API calls are abstracted into service functions:

- **cartService.ts**: Shopping cart operations
- **productService.ts**: Product CRUD operations
- **orderService.ts**: Order management
- **authService.ts**: Authentication operations
- **inventoryService.ts**: Inventory management
- **supplierService.ts**: Supplier operations

### HTTP Client Configuration

- **axiosInstance.ts**: Configured Axios instance with:
  - Base URL configuration
  - Request/response interceptors
  - Authentication token handling
  - Error handling

## Styling

### CSS Framework Integration

- **Tailwind CSS**: Utility-first styling for rapid development
- **Material-UI**: Pre-built components with consistent design
- **Custom CSS**: Additional styling in index.css

### Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interfaces

## Form Validation

### Client-Side Validation

- Real-time form validation
- Custom validation functions
- Error message display
- Input sanitization

### Validation Rules

- Email format validation
- Password strength requirements
- Phone number format (Sri Lankan format)
- Required field validation
- Custom business logic validation

## Development

### Environment Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Component Structure**: Consistent component organization
- **Error Boundaries**: Error handling for React components

## Authentication Flow

### User Registration

1. User fills registration form
2. Client-side validation
3. API call to backend
4. JWT token received and stored
5. User redirected based on role

### User Login

1. User enters credentials
2. Form validation
3. Authentication API call
4. Token storage in localStorage
5. Context state update
6. Role-based redirection

### Protected Routes

1. Route access check
2. Token validation
3. Role verification
4. Redirect to login if unauthorized
5. Render component if authorized

## Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Dynamic imports for large components
- **Image Optimization**: Proper image sizing and formats
- **API Caching**: Efficient data fetching strategies
- **Bundle Optimization**: Vite's built-in optimizations

## Error Handling

### Global Error Handling

- API error interceptors
- User-friendly error messages
- Fallback UI components
- Error logging

### Form Error Handling

- Field-level validation
- Form submission errors
- Network error handling
- User feedback mechanisms

## Testing Strategy

### Component Testing

- Unit tests for utility functions
- Component rendering tests
- User interaction testing
- API integration testing

### E2E Testing

- User flow testing
- Cross-browser compatibility
- Mobile responsiveness testing

## Deployment

### Build Configuration

- Production environment variables
- Asset optimization
- Bundle analysis
- Performance monitoring

### Deployment Steps

1. Build production bundle
2. Configure environment variables
3. Deploy to hosting platform
4. Configure routing for SPA
5. Set up SSL certificates

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach
- Graceful degradation for older browsers

## Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Future Enhancements

- Progressive Web App (PWA) features
- Offline functionality
- Push notifications
- Advanced search capabilities
- Multi-language support
- Enhanced mobile experience
