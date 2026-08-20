'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export type CartItem = {
  id: string;          // product._id (or composite for variants)
  productId: string;   // always the real product._id
  title: string;
  price: number;
  image: string;
  quantity: number;
  tenantId: string;
  variantName?: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('electronics_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart data', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('electronics_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCartItems(prev => {
      // Match by composite key: productId + variantName (so each variant is a separate row)
      const existingItem = prev.find(i =>
        i.id === item.id && i.variantName === item.variantName
      );
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id && i.variantName === item.variantName
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    toast.success('Added to cart!');
  };

  const removeFromCart = (cartKey: string) => {
    // cartKey is item.id (which is composite for variants: productId__variantName)
    setCartItems(prev => prev.filter(item => item.id !== cartKey));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (cartKey: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === cartKey ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
