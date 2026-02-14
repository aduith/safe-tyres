import apiClient from '@/lib/apiClient';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    }

    async getProfile(): Promise<User> {
        const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/profile');
        return response.data.data.user;
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.put<{ success: boolean; data: { user: User } }>('/auth/profile', data);
        return response.data.data.user;
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/';
    }

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }
}

export default new AuthService();
