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
  body: any,
  imageFile?: Express.Multer.File
) => {
  const existingProduct = await ProductModel.getProductById(id);
  if (!existingProduct) {
    throw new Error('Product not found.');
  }

  const imageUrl = imageFile
    ? await uploadImageToFirebase(imageFile)
    : existingProduct.image_url;

  const updatedProduct = {
    description: body.description || existingProduct.description,
    image_url: imageUrl || existingProduct.image_url,
  };

  return await ProductModel.updateProduct(id, updatedProduct);
};

export const getAllActiveProducts = async (
  page: number,
  limit: number,
  search?: string,
  category?: string
) => {
  const offset = (page - 1) * limit;
  const filters = {
    page,
    search,
    category,
    limit,
    offset,
  };

  return await ProductModel.getAllActiveProducts(filters);
};
