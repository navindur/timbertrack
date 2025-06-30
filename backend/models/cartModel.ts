import db from '../db';

//handdle cart operations with db
export const CartModel = {
  async addToCart(customerId: number, productId: number, quantity: number) {
     // Check if this product already exists in the customer's cart
    const [existing] = await db.execute(
      'SELECT * FROM cart_items WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );

    if ((existing as any[]).length > 0) {
      // If exists, increase the quantity
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?',
        [quantity, customerId, productId]
      );
    } else {
      //if not, insert a new cart item
      await db.execute(
        'INSERT INTO cart_items (customer_id, product_id, quantity) VALUES (?, ?, ?)',
        [customerId, productId, quantity]
      );
    }
  },
//get all cart items 
  async getCartItems(customerId: number) {
    const [rows] = await db.execute(
        `SELECT 
           ci.id, 
           p.name, 
           p.image_url, 
           ci.quantity, 
           p.id as product_id,
           i.price, 
           i.quantity as inventory_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         JOIN inventory i ON p.inventory_id = i.inventory_id  
         WHERE ci.customer_id = ? AND p.is_active = 1
         ORDER BY ci.id DESC`,
        [customerId]
      );
    return rows as any[];
  },
//update specific cart item 
  async updateCartItem(id: number, quantity: number, customerId: number) {
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND customer_id = ?',
      [quantity, id, customerId]
    );
  },

  //delete cart item
  async deleteCartItem(id: number, customerId: number) {
    await db.execute(
      'DELETE FROM cart_items WHERE id = ? AND customer_id = ?',
      [id, customerId]
    );
  }
};
