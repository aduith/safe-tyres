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
        user?: User;
        token?: string;
        email?: string;
        otpSent?: boolean;
    };
}

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        if (response.data.success && response.data.data.token && response.data.data.user) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        // Don't set user yet, wait for verification
        return response.data;
    }

    async verifyOTP(email: string, otp: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/verify-otp', { email, otp });

        if (response.data.success && response.data.data.token && response.data.data.user) {
            localStorage.setItem('authToken', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }

        return response.data;
    }

    async resendOTP(email: string): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/resend-otp', { email });
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
