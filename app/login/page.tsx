'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/validators/authSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const LoginContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';
    const { login, user: currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            await login(data.email, data.password);

            // Wait a moment for context to update, then check user role
            setTimeout(() => {
                toast.success('Login successful!');

                // Check if admin from localStorage since context might not be updated yet
                const token = localStorage.getItem('authToken');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.role === 'admin') {
                        router.push('/admin');
                    } else {
                        // Redirect to intended page or home
                        router.push(redirectUrl);
                    }
                }
            }, 100);
        } catch (error: any) {
            toast.error('Login failed', {
                description: error.response?.data?.message || 'Invalid email or password',
            });
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="shadow-card">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-center">
                    Login to your SafeTyres account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary hover:underline">
                            Register here
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

const Login = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4 max-w-md">
                    <Suspense fallback={
                        <Card className="shadow-card">
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center py-8">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </CardContent>
                        </Card>
                    }>
                        <LoginContent />
                    </Suspense>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
