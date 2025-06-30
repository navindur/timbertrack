import * as ProductModel from '../models/Product';

export const getCategoryProducts = async (
    category: string,
    page: number,
    limit: number
  ) => {
    console.log(`[SERVICE] Fetching ${category} products (page ${page}, limit ${limit})`);
    
    const [products, total] = await Promise.all([
      //db operations in product model
      ProductModel.getProductsByCategory(category, page, limit), 
      ProductModel.getCategoryProductCount(category)
    ]);
    
    console.log(`[SERVICE] Results:`, {
      productsCount: products.length,
      totalItems: total
    });
    
    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  };

export const getAvailableCategories = async () => {
  return await ProductModel.getAvailableCategories();
};