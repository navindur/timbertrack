// src/features/inventory/services/inventoryService.ts
import { InventoryItem } from '../types/inventoryTypes';
import { useState } from 'react';


export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      setError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const addInventory = async (item: Omit<InventoryItem, 'inventory_id'>) => {
    // API call implementation
  };

  // Other CRUD operations...

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    addInventory,
    // ... other methods
  };
};

// In your inventoryService.ts
export const getAvailableInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response = await fetch('/api/inventory'); // Or your actual endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch available inventory');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching available inventory:', error);
    throw error;
  }
};