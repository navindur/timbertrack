// src/types/product.ts
export interface Product {
    id?: number;
    name: string;
    description?: string;
    inventory_id: number;
    image_url?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
    price?: number;
    quantity?: number;
    category?: string;
  }
  
  export interface InventoryOption {
    inventory_id: number;
    name: string;
    price: number;
    quantity: number;
    type: string;
    is_active?: boolean;
  }
  
  export interface ProductFilters {
    page: number;
    limit: number;
    search?: string;
    category?: string;
  }