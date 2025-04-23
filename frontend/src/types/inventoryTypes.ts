// src/features/inventory/types/inventoryTypes.ts
export interface InventoryItem {
    inventory_id?: number;
    name: string;
    type: string;
    price: number;
    quantity: number;
    reorder_level: number;
    supplier_id: number;
    is_active?: boolean;
    created_at?: Date;
  }
  
  export type InventoryFormValues = Omit<InventoryItem, 'inventory_id' | 'created_at'>;