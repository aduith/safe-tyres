import apiClient from '@/lib/apiClient';

export interface OrderItem {
    productId: string;
    quantity: number;
}

export interface ShippingAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface CreateOrderData {
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod?: string;
}

export interface Order {
    _id: string;
    user: string;
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
    };
    items: Array<{
        product: string;
        name: string;
        size: string;
        quantity: number;
        price: number;
    }>;
    totalAmount: number;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    success: boolean;
    data: {
        order: Order;
    };
}

export interface OrdersResponse {
    success: boolean;
    count: number;
    data: {
        orders: Order[];
    };
}

class OrderService {
    async createOrder(orderData: CreateOrderData): Promise<Order> {
        const response = await apiClient.post<OrderResponse>('/orders', orderData);
        return response.data.data.order;
    }

    async getOrders(): Promise<Order[]> {
        const response = await apiClient.get<OrdersResponse>('/orders');
        return response.data.data.orders;
    }

    async getOrderById(id: string): Promise<Order> {
        const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
        return response.data.data.order;
    }

    async cancelOrder(id: string): Promise<Order> {
        const response = await apiClient.delete<OrderResponse>(`/orders/${id}`);
        return response.data.data.order;
    }
}

export default new OrderService();
