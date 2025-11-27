import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Product, CartItem } from '../types';
import clsx from 'clsx';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 1. Fetch Menu dari Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/v1/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Gagal ambil menu:", err);
        logout(); 
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Logic Cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const subTotal = cart.reduce((acc, item) => acc + (item.unit_price * item.qty), 0);
  const tax = subTotal * 0.15; 
  const grandTotal = subTotal + tax;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-serif text-xl">Loading Menu...</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* KIRI: MENU */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-6 flex justify-between items-center bg-white shadow-sm z-10">
          <div>
            <h1 className="text-3xl tracking-wide">Hari-Hari</h1>
            <p className="text-secondary text-sm font-serif italic">Kasir Active</p>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
            LOGOUT
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-primary hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <span className="font-serif text-primary font-bold">{formatRupiah(product.unit_price)}</span>
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 min-h-[2.5em]">{product.description || "Tidak ada deskripsi"}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className={clsx("text-xs font-bold px-2 py-1 rounded-full", product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                    Stok: {product.stock}
                  </span>
                  <button className="text-xs bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded transition-colors uppercase font-bold tracking-wider">
                    Add +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* KANAN: CART */}
      <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-xl z-20">
        <div className="p-6 bg-primary text-white">
          <h2 className="text-white text-xl">Current Order</h2>
          <p className="text-red-100 text-sm font-sans">Table 10 (Manual sementara)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <span className="text-4xl mb-2">🍜</span>
              <p>Belum ada item</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-4 last:border-0">
                <div className="flex-1">
                  <h4 className="text-dark text-sm mb-1">{item.name}</h4>
                  <p className="text-gray-500 text-xs">{item.qty} x {formatRupiah(item.unit_price)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm mb-1">{formatRupiah(item.unit_price * item.qty)}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 font-bold">HAPUS</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatRupiah(subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax & Service (15%)</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between text-xl font-serif font-bold text-dark pt-3 border-t border-gray-300">
            <span>Total</span>
            <span>{formatRupiah(grandTotal)}</span>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full mt-4 bg-primary hover:bg-primary-hover text-white py-4 rounded-DEFAULT font-serif font-bold uppercase tracking-widest text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Process Payment
          </button>
        </div>
      </div>

    </div>
  );
}