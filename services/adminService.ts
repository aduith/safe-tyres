import apiClient from '@/lib/apiClient';

// Product Management
export interface Product {
    _id: string;
    name: string;
    size: string;
    price: number;
    description?: string;
    image: string;
    stock: number;
    popular: boolean;
}

export interface CreateProductData {
    name: string;
    size: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    popular?: boolean;
}

// User Management
export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin';
    createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
    stats: {
        totalOrders: number;
        totalRevenue: number;
        totalUsers: number;
        totalProducts: number;
    };
    ordersByStatus: Array<{
        _id: string;
        count: number;
    }>;
    recentOrders: Array<{
        _id: string;
        customerInfo?: {
            name: string;
            email: string;
        };
        user?: {
            name: string;
            email: string;
        };
        totalAmount: number;
        orderStatus: string;
        createdAt: string;
    }>;
}

class AdminService {
    // Dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get('/analytics/dashboard');
        return response.data.data;
    }

    // Products
    async createProduct(data: CreateProductData): Promise<Product> {
        const response = await apiClient.post('/products', data);
        return response.data.data.product;
    }

    async updateProduct(id: string, data: Partial<CreateProductData>): Promise<Product> {
        const response = await apiClient.put(`/products/${id}`, data);
        return response.data.data.product;
    }

    async deleteProduct(id: string): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    }

    // Orders
    async getAllOrders(status?: string): Promise<any[]> {
        const params = status ? { status } : {};
        const response = await apiClient.get('/orders/all', { params });
        return response.data.data.orders;
    }

    async updateOrderStatus(orderId: string, orderStatus: string, paymentStatus?: string): Promise<any> {
        const response = await apiClient.put(`/orders/${orderId}`, {
            orderStatus,
            paymentStatus,
        });
        return response.data.data.order;
    }

    // Users
    async getAllUsers(): Promise<User[]> {
        const response = await apiClient.get('/users');
        return response.data.data.users;
    }

    async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
        const response = await apiClient.patch(`/users/${userId}/role`, { role });
        return response.data.data.user;
    }

    // Reviews
    async getAllReviews(status?: string): Promise<any[]> {
        const params = status ? { status } : {};
        const response = await apiClient.get('/reviews/all', { params });
        return response.data.data.reviews;
    }

    async updateReviewStatus(reviewId: string, status: 'pending' | 'approved' | 'rejected'): Promise<any> {
        const response = await apiClient.patch(`/reviews/${reviewId}/status`, { status });
        return response.data.data.review;
    }

    async deleteReview(reviewId: string): Promise<void> {
        await apiClient.delete(`/reviews/${reviewId}`);
    }
}

export default new AdminService();
