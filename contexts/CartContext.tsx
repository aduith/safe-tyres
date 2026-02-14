'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import cartService, { Cart, CartItem as APICartItem } from '@/services/cartService';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  productId: string; // Add separate product ID field
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart on mount and when auth status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cart = await cartService.getCart();
      setItems(transformCartItems(cart));
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform API cart items to local cart item format
  const transformCartItems = (cart: Cart): CartItem[] => {
    return cart.items.map((item: APICartItem) => ({
      id: item._id || item.product._id, // Cart item ID for removal
      productId: item.product._id, // Product ID for orders
      name: item.product.name,
      size: item.product.size,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));
  };

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const cart = await cartService.addToCart(item.id, 1);
      setItems(transformCartItems(cart));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const cart = await cartService.removeFromCart(itemId);
      setItems(transformCartItems(cart));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove item');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const cart = await cartService.updateCartItem(itemId, quantity);
      setItems(transformCartItems(cart));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await cartService.clearCart();
      setItems([]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
