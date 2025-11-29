export interface Product {
  id: string;
  name: string;
  description: string | null;
  unit_price: number; 
  stock: number;
  category_id: string;
  image_url: string | null;
  is_active: boolean;
}

export interface CartItem extends Product {
  qty: number;
}