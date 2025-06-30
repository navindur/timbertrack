import * as ProductModel from '../models/Product';

export const getProductDetails = async (id: number) => {
  try {
    const product = await ProductModel.getProductDetails(id);
    if (!product) return null;
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      image_url: product.image_url,
      inventory_id: product.inventory_id,
      is_active: Boolean(product.is_active),
      created_at: product.created_at,
      updated_at: product.updated_at,
      has_discount: Boolean(product.has_discount), 
      dummy_price: product.dummy_price || null    
    };
  } catch (error) {
    console.error('Service error fetching product details:', error);
    throw error;
  }
};