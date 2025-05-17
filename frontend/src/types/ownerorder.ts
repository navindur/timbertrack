export interface Order {
    id: number;
    customer_id: number;
    created_at: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total_price: number;
    payment_method: 'cash' | 'cash_on_delivery' | 'credit_card';
    updated_at: string;
    customer_name?: string;
    customer_email?: string;
  }
  
  export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product_name: string;
    product_image?: string;
  }
  
  export interface OrderWithDetails extends Order {
    items: OrderItem[];
    customer_phone?: string;
    customer_address?: string;
    customer_city?: string;
    customer_postal_code?: string;
  }
  
  export interface OrdersResponse {
    orders: Order[];
    total: number;
  }