import { useEffect, useState } from 'react';
import { getAllProducts, deleteProduct } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.data);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6">
      
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onDelete={handleDelete} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
