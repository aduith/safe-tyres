'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Users, DollarSign, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import adminService, { DashboardStats } from '@/services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-3 mb-8">
                        <LayoutDashboard className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats?.stats.totalRevenue.toFixed(2)}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.stats.totalOrders}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.stats.totalUsers}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.stats.totalProducts}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link href="/admin/products">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Manage Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Add, edit, or delete products</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/orders">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Manage Orders
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">View and update order status</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/users">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Manage Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">View users and manage roles</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats?.recentOrders.slice(0, 5).map((order) => (
                                    <div key={order._id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <div>
                                            <p className="font-medium">{order.customerInfo?.name || order.user?.name || 'Customer'}</p>
                                            <p className="text-sm text-muted-foreground">{order.customerInfo?.email || order.user?.email || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                                            <Badge className="mt-1">{order.orderStatus}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminDashboard;
