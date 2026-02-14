import apiClient from '@/lib/apiClient';

export interface Product {
    _id: string;
    name: string;
    description?: string;
    size: string;
    price: number;
    image: string;
    stock: number;
    popular: boolean;
    features: string[];
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    data: {
        products: Product[];
    };
}

class ProductService {
    async getAllProducts(filters?: { popular?: boolean; size?: string }): Promise<Product[]> {
        const params = new URLSearchParams();
        if (filters?.popular) params.append('popular', 'true');
        if (filters?.size) params.append('size', filters.size);

        const response = await apiClient.get<ProductsResponse>(`/products?${params.toString()}`);
        return response.data.data.products;
    }

    async getProductById(id: string): Promise<Product> {
        const response = await apiClient.get<{ success: boolean; data: { product: Product } }>(`/products/${id}`);
        return response.data.data.product;
    }

    async createProduct(productData: Partial<Product>): Promise<Product> {
        const response = await apiClient.post<{ success: boolean; data: { product: Product } }>('/products', productData);
        return response.data.data.product;
    }

    async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
        const response = await apiClient.put<{ success: boolean; data: { product: Product } }>(`/products/${id}`, productData);
        return response.data.data.product;
    }

    async deleteProduct(id: string): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    }
}

export default new ProductService();
