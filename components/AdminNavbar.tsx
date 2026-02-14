'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

import Image from 'next/image';

const AdminNavbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/reviews', label: 'Reviews', icon: Star },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <Image
                            src="/assets/logo3.png"
                            alt="SafeTyres Admin"
                            width={40}
                            height={40}
                            className="transition-transform group-hover:scale-110"
                        />
                        <div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                SafeTyres
                            </span>
                            <span className="block text-xs text-muted-foreground">Admin Panel</span>
                        </div>
                    </Link>

                    {/* Admin Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {adminLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors whitespace-nowrap"
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
