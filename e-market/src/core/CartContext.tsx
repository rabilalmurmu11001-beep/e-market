import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartStore {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number, color?: string, size?: string) => void;
  updateQuantity: (id: number, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
}

// Global Zustand Store with Local Storage Persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartItems: [],
      
      addToCart: (item, quantity = 1) =>
        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (i) => i.id === item.id && i.color === item.color && i.size === item.size
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.cartItems];
            newItems[existingItemIndex].quantity += quantity;
            return { cartItems: newItems };
          }

          return { cartItems: [...state.cartItems, { ...item, quantity }] };
        }),
        
      removeFromCart: (id, color, size) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (i) => !(i.id === id && i.color === color && i.size === size)
          ),
        })),
        
      updateQuantity: (id, quantity, color, size) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              cartItems: state.cartItems.filter(
                (i) => !(i.id === id && i.color === color && i.size === size)
              ),
            };
          }
          return {
            cartItems: state.cartItems.map((i) =>
              i.id === id && i.color === color && i.size === size
                ? { ...i, quantity }
                : i
            ),
          };
        }),
        
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "e_market_cart", // Keeps compatibility with existing local storage key
    }
  )
);

// Backward-compatible hook and Mock Provider to prevent breaking existing routes
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useCart = () => {
  const store = useCartStore();
  const cartCount = store.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = store.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return {
    cartItems: store.cartItems,
    addToCart: store.addToCart,
    removeFromCart: store.removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    cartCount,
    cartSubtotal,
  };
};
