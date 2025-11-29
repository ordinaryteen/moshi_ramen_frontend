import { useEffect, useState } from 'react';
import api from '../lib/api';
import type { KitchenOrder, OrderStatus } from '../types';
import clsx from 'clsx';

export default function Kitchen() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  // 1. WebSocket Logic (Auto Detect Prod/Local)
  useEffect(() => {
    // LOGIC PINTAR:
    // Kalau di Vercel (PROD) -> Pake WSS (Secure) ke Render.
    // Kalau di Laptop (DEV) -> Pake WS biasa ke Localhost.
    const WS_URL = import.meta.env.PROD
      ? 'wss://moshi-ramen-backend-a4w6.onrender.com/ws/kitchen' 
      : 'ws://127.0.0.1:8000/ws/kitchen';

    console.log("Connecting to WS:", WS_URL); // Debugging

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setConnectionStatus('🟢 Connected');
    ws.onclose = () => setConnectionStatus('🔴 Disconnected');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Msg:", data);

      if (data.event === 'NEW_ORDER') {
        // Format data dari WS ke format State kita
        const newOrder: KitchenOrder = {
          order_id: data.order_id,
          bill_name: data.bill_name,
          status: 'PENDING',
          items: data.items, // Backend lo udah ngirim detail items kan?
          created_at: new Date().toISOString()
        };
        // Tambah ke paling depan (LIFO - Last In First Out)
        setOrders((prev) => [newOrder, ...prev]);
      } 
      else if (data.event === 'STATUS_UPDATE') {
        // Update status di kartu yang ada tanpa refresh
        setOrders((prev) => prev.map(o => 
          o.order_id === data.order_id ? { ...o, status: data.new_status } : o
        ));
      }
    };

    // Cleanup pas halaman ditutup
    return () => ws.close();
  }, []);

  // 2. Update Status Logic (Nembak API Patch)
  const updateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await api.patch(`/api/v1/orders/${orderId}/status`, { status: nextStatus });
      // Gak perlu update state manual, tunggu broadcast balik dari WebSocket biar sinkron
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal update status (Cek Console)");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-wide">KITCHEN MONITOR</h1>
          <p className="text-gray-400 text-sm font-mono">Live Order Feed</p>
        </div>
        <div className="text-xs font-mono bg-black px-3 py-1 rounded border border-gray-700 text-green-400">
          WS: {connectionStatus}
        </div>
      </header>

      {/* KANBAN BOARD STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-600">
            <span className="text-6xl block mb-4">👨‍🍳</span>
            <p className="text-2xl font-serif">Menunggu Pesanan...</p>
            <p className="text-sm">Pastikan Kasir melakukan Checkout.</p>
          </div>
        )}

        {orders.map((order) => (
          <div key={order.order_id} className={clsx(
            "bg-gray-800 rounded-xl p-4 border-l-4 shadow-lg flex flex-col transition-all",
            order.status === 'PENDING' ? "border-red-500 animate-pulse" : // Ada efek kedip dikit kalau baru
            order.status === 'COOKING' ? "border-yellow-500" : "border-green-500 opacity-75"
          )}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-white">{order.bill_name}</h3>
              <span className={clsx(
                "text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider",
                order.status === 'PENDING' ? "bg-red-900 text-red-200" :
                order.status === 'COOKING' ? "bg-yellow-900 text-yellow-200" : "bg-green-900 text-green-200"
              )}>
                {order.status}
              </span>
            </div>

            {/* List Item */}
            <div className="flex-1 space-y-2 mb-4 bg-gray-900/50 p-3 rounded border border-gray-700">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="font-bold text-primary text-lg">x{item.qty}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {order.status === 'PENDING' && (
                <button 
                  onClick={() => updateStatus(order.order_id, 'COOKING')}
                  className="col-span-2 bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded font-bold text-sm transition-colors uppercase tracking-widest"
                >
                  Start Cooking
                </button>
              )}
              {order.status === 'COOKING' && (
                <>
                  <button 
                     onClick={() => updateStatus(order.order_id, 'READY')}
                     className="bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold text-sm transition-colors"
                  >
                    READY
                  </button>
                  <button 
                     onClick={() => updateStatus(order.order_id, 'CANCELLED')}
                     className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded font-bold text-sm transition-colors"
                  >
                    CANCEL
                  </button>
                </>
              )}
              {(order.status === 'READY' || order.status === 'COMPLETED') && (
                 <div className="col-span-2 text-center text-green-400 font-bold text-sm py-2">
                    DONE ✅
                 </div>
              )}
            </div>
            
            <p className="text-[10px] text-gray-500 mt-3 text-right font-mono">
              {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}