import apiClient from '@/lib/apiClient';
import { Product } from './productService';

export interface CartItem {
    _id?: string;
    product: Product;
    quantity: number;
}

export interface Cart {
    _id: string;
    items: CartItem[];
    user?: string;
    sessionId?: string;
}

export interface CartResponse {
    success: boolean;
    data: {
        cart: Cart;
    };
}

class CartService {
    async getCart(): Promise<Cart> {
        const response = await apiClient.get<CartResponse>('/cart');
        return response.data.data.cart;
    }

    async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
        const response = await apiClient.post<CartResponse>('/cart', {
            productId,
            quantity,
        });
        return response.data.data.cart;
    }

    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        const response = await apiClient.put<CartResponse>(`/cart/${itemId}`, {
            quantity,
        });
        return response.data.data.cart;
    }

    async removeFromCart(itemId: string): Promise<Cart> {
        const response = await apiClient.delete<CartResponse>(`/cart/${itemId}`);
        return response.data.data.cart;
    }

    async clearCart(): Promise<Cart> {
        const response = await apiClient.delete<CartResponse>('/cart');
        return response.data.data.cart;
    }

    // Helper to calculate totals
    calculateTotals(cart: Cart) {
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        return { totalItems, totalPrice };
    }
}

export default new CartService();
