export interface Product {
  id: string;
  name: string;
  description: string | null;
  unit_price: number;
  stock: number;
  category_id: string;
  is_active: boolean;
  image_url: string | null;
}

export interface CartItem extends Product {
  qty: number;
}

// --- TAMBAHAN BUAT KITCHEN ---
export type OrderStatus = 'PENDING' | 'COOKING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItemDetail {
  name: string;
  qty: number;
}

export interface KitchenOrder {
  order_id: string;
  bill_name: string;
  status: OrderStatus;
  items: OrderItemDetail[];
  created_at: string;
}