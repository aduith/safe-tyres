'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function NotFound() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 animate-fade-in px-4">
                <h1 className="text-9xl font-bold text-primary">404</h1>
                <h2 className="text-4xl font-bold">Page Not Found</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Go Home
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/products"
                            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                        >
                            Browse Products
                        </Link>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Redirecting to home in 5 seconds...
                </p>
            </div>
        </div>
    );
}
