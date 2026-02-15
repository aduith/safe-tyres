'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, DollarSign, MapPin, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Order Details</DialogTitle>
                                                    <DialogDescription>
                                                        Order #{order._id.slice(-8).toUpperCase()}
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-6 mt-4">
                                                    {/* Order Status */}
                                                    <div className="flex items-center gap-3">
                                                        <Truck className="h-5 w-5 text-primary" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Order Status</p>
                                                            <Badge className={getStatusColor(order.orderStatus)}>
                                                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Order Date & Total */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="h-5 w-5 text-primary" />
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Order Date</p>
                                                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <DollarSign className="h-5 w-5 text-primary" />
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                                                <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Shipping Address */}
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="h-5 w-5 text-primary mt-1" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                                                            <p className="text-sm">{order.shippingAddress.street}</p>
                                                            <p className="text-sm">
                                                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                                            </p>
                                                            <p className="text-sm">{order.shippingAddress.country}</p>
                                                        </div>
                                                    </div>

                                                    {/* Payment Method */}
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="h-5 w-5 text-primary" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Payment Method</p>
                                                            <p className="font-medium capitalize">{order.paymentMethod}</p>
                                                        </div>
                                                    </div>

                                                    {/* Order Items */}
                                                    <div>
                                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                            <Package className="h-5 w-5 text-primary" />
                                                            Order Items
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item, index) => (
                                                                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                                                    <div>
                                                                        <p className="font-medium">{item.name}</p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Size: {item.size} | Quantity: {item.quantity}
                                                                        </p>
                                                                    </div>
                                                                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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
