'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import orderService, { Order } from '@/services/orderService';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error fetching orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-500';
            case 'shipped':
                return 'bg-blue-500';
            case 'processing':
                return 'bg-yellow-500';
            case 'cancelled':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Order History</h1>
                        <p className="text-muted-foreground">View and manage your orders</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                            <p className="mt-4 text-muted-foreground">Loading orders...</p>
                        </div>
                    ) : error ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-destructive">{error}</p>
                            </CardContent>
                        </Card>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                                <Link href="/products">
                                    <Button>Browse Products</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order._id} className="hover:shadow-card transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </CardTitle>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        ₹{order.totalAmount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 mb-4">
                                            {order.items.slice(0, 2).map((item, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-muted-foreground"> ({item.size}) × {item.quantity}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-muted-foreground">
                                                    +{order.items.length - 2} more item(s)
                                                </p>
                                            )}
                                        </div>
                                        <Link href={`/orders/${order._id}`}>
                                            <Button variant="outline" className="w-full">
                                                View Details
                                            </Button>
                                        </Link>
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

export default Orders;
