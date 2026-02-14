'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllOrders(filter === 'all' ? undefined : filter);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-500';
            case 'shipped': return 'bg-blue-500';
            case 'processing': return 'bg-yellow-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Order Management</h1>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Orders</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">No orders found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order._id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Customer</p>
                                                <p className="font-medium">{order.customerInfo?.name || order.user?.name || 'Customer'}</p>
                                                <p className="text-sm">{order.customerInfo?.email || order.user?.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                                <p className="text-xl font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Items</p>
                                                <p className="font-medium">{order.items.length} item(s)</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Select
                                                value={order.orderStatus}
                                                onValueChange={(value) => handleStatusUpdate(order._id, value)}
                                            >
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderManagement;
