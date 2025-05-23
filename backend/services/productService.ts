import * as ProductModel from '../models/Product';
import { uploadImageToFirebase } from '../utils/firebase';
import { RowDataPacket } from 'mysql2';

export const addProduct = async (
  body: any,
  imageFile?: Express.Multer.File
) => {
  const inventoryId = parseInt(body.inventory_id);

  const inventoryList: RowDataPacket[] = await ProductModel.getActiveInventoryItems();
  const selectedInventory = inventoryList.find(
    (inv) => inv.inventory_id === inventoryId
  );

  if (!selectedInventory) {
    throw new Error('Selected inventory item not found or inactive.');
  }

  const imageUrl = imageFile ? await uploadImageToFirebase(imageFile) : null;

  const product = {
    name: selectedInventory.name,
    description: body.description || '',
    inventory_id: inventoryId,
    image_url: imageUrl || '',
    is_active: true,
  };

  return await ProductModel.createProduct(product);
};

export const fetchInventoryOptions = async () => {
  return await ProductModel.getActiveInventoryItems();
};

export const softDeleteProduct = async (productId: number) => {
  const deleted = await ProductModel.softDeleteProduct(productId);
  if (!deleted) {
    throw new Error('Product not found or already deleted.');
  }
  return deleted;
};

export const updateProduct = async (
  id: number,
  body: {
    description?: string;
    has_discount?: boolean;
    dummy_price?: number | null;
  },
  imageFile?: Express.Multer.File
) => {
  const existingProduct = await ProductModel.getProductById(id);
  if (!existingProduct) {
    throw new Error('Product not found.');
  }

  // Handle image upload if file exists
  const imageUrl = imageFile
    ? await uploadImageToFirebase(imageFile)
    : existingProduct.image_url;

  // Prepare the updated product data
  const updatedProduct = {
    description: body.description || existingProduct.description,
    image_url: imageUrl || existingProduct.image_url,
    has_discount: body.has_discount ?? existingProduct.has_discount ?? false,
    dummy_price: body.has_discount 
      ? (body.dummy_price ?? existingProduct.dummy_price)
      : null
  };

  // Additional validation
  if (updatedProduct.has_discount && updatedProduct.dummy_price) {
    if (updatedProduct.dummy_price <= existingProduct.price) {
      throw new Error('Original price must be higher than current price');
    }
  }

  return await ProductModel.updateProduct(id, updatedProduct);
};

// productService.ts
export const getAllActiveProducts = async (
  page: number,
  limit: number,
  search?: string,
  category?: string
) => {
  try {
    // Input validation
    if (page < 1 || limit < 1) {
      throw new Error('Invalid pagination parameters');
    }

    const result = await ProductModel.getAllActiveProducts({
      page,
      limit,
      search: search || '',
      category: category || ''
    });

    // Get total count for pagination metadata
    const [total] = await ProductModel.getTotalActiveProducts(search, category);

    return {
      data: result,
      pagination: {
        page,
        limit,
        total: total[0].count,
        totalPages: Math.ceil(total[0].count / limit)
      }
    };
  } catch (error) {
    console.error('Service layer error:', error);
    throw error;
  }
};

// Add to your existing productService.ts
export const getCustomerProducts = async (
  page: number,
  limit: number,
  search?: string,
  category?: string
) => {
  return await ProductModel.getCustomerProducts({
    page,
    limit,
    search,
    category
  });
};

export const getCustomerProductById = async (id: number) => {
  const product = await ProductModel.getCustomerProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};