import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Product, CartItem } from '../types'; // Pake 'type' biar aman
import clsx from 'clsx';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false); // Mobile state

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/v1/products');
      const sortedProducts = res.data.sort((a: Product, b: Product) => 
        a.name.localeCompare(b.name)
      );
      setProducts(sortedProducts);
    } catch (err) {
      console.error(err);
      logout(); navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const subTotal = cart.reduce((acc, item) => acc + (item.unit_price * item.qty), 0);
  const tax = subTotal * 0.15;
  const grandTotal = subTotal + tax;
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      await api.post('/api/v1/orders', {
        bill_name: "Table 10 (Demo)", 
        items: cart.map(item => ({ product_id: item.id, quantity: item.qty }))
      });
      await fetchProducts();
      setCart([]); 
      setShowSuccessToast(true);
      setShowMobileCart(false);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err) {
      alert("❌ Gagal memproses order.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-serif">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden relative">
      <div className={clsx("absolute top-6 left-1/2 -translate-x-1/2 z-[60] transition-all duration-300", showSuccessToast ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0")}>
        <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3"><span>✅</span><span className="font-bold">Order Masuk Dapur!</span></div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm z-10 shrink-0">
          <div><h1 className="text-2xl md:text-3xl tracking-wide">Hari-Hari</h1><p className="text-secondary text-xs md:text-sm font-serif italic">Mobile POS</p></div>
          <button onClick={handleLogout} className="text-xs font-bold text-gray-400 hover:text-primary">LOGOUT</button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} onClick={() => addToCart(product)} className="bg-white rounded-xl shadow-sm overflow-hidden border border-transparent hover:border-primary transition-all cursor-pointer group flex flex-row md:flex-col h-28 md:h-auto">
                <div className="w-28 md:w-full md:h-48 bg-gray-200 shrink-0">
                   <img src={product.image_url || "https://placehold.co/400x300?text=No+Image"} alt={product.name} className="w-full h-full object-cover"/>
                </div>
                <div className="p-3 md:p-4 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm md:text-lg group-hover:text-primary line-clamp-1">{product.name}</h3>
                      <span className="font-serif text-primary font-bold text-sm md:text-base">{formatRupiah(product.unit_price)}</span>
                    </div>
                    <p className="hidden md:block text-gray-500 text-xs line-clamp-2 mt-1">{product.description}</p>
                  </div>
                  <div className="flex justify-between items-end mt-1 md:mt-4">
                     <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full", product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>Stok: {product.stock}</span>
                     <button className="text-[10px] md:text-xs bg-gray-100 px-2 py-1 rounded hover:bg-primary hover:text-white uppercase font-bold">Add +</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <button onClick={() => setShowMobileCart(true)} className="w-full bg-primary text-white py-3 rounded-DEFAULT flex justify-between px-6 font-bold shadow-lg items-center">
            <div className="flex items-center gap-2"><span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs">{totalQty}</span><span>View Order</span></div>
            <span>{formatRupiah(grandTotal)}</span>
          </button>
        </div>
      )}

      <div className={clsx("fixed inset-0 z-50 bg-black/50 md:bg-transparent md:static md:z-auto md:w-[400px] md:flex flex-col transition-all", showMobileCart ? "flex" : "hidden")}>
        <div className="bg-white w-full h-full md:border-l border-gray-200 flex flex-col md:shadow-xl mt-20 md:mt-0 rounded-t-xl md:rounded-none overflow-hidden">
          <div className="md:hidden p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Keranjang Belanja</h2>
            <button onClick={() => setShowMobileCart(false)} className="text-gray-400 text-2xl">&times;</button>
          </div>
          <div className="p-6 bg-primary text-white hidden md:block">
            <h2 className="text-white text-xl">Current Order</h2>
            <p className="text-red-100 text-sm">Table 10</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50"><span className="text-4xl mb-2">🛒</span><p>Belum ada item</p></div> : 
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-dashed border-gray-100 pb-4">
                   <img src={item.image_url || ""} className="w-12 h-12 rounded object-cover bg-gray-100" />
                   <div className="flex-1">
                      <div className="flex justify-between"><h4 className="text-dark text-sm font-bold line-clamp-1">{item.name}</h4><p className="font-bold text-sm">{formatRupiah(item.unit_price * item.qty)}</p></div>
                      <div className="flex justify-between items-center mt-1"><p className="text-gray-500 text-xs">{item.qty} x {formatRupiah(item.unit_price)}</p><button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 font-bold">HAPUS</button></div>
                   </div>
                </div>
              ))
            }
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-3 pb-safe">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatRupiah(subTotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax (15%)</span><span>{formatRupiah(tax)}</span></div>
            <div className="flex justify-between text-xl font-bold pt-3 border-t"><span>Total</span><span>{formatRupiah(grandTotal)}</span></div>
            <div className="flex justify-center">
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isProcessing}
                // Hapus mx-auto karena sekarang Flexbox yang mengaturnya
                // Tombol tidak perlu w-full lagi, hanya lebar yang diinginkan
                className="w-[260px] mt-4 bg-primary hover:bg-primary-hover text-white py-4 rounded-full font-sans font-bold uppercase tracking-widest text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}