'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import orderService, { Order } from '@/services/orderService';

function OrderConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        } else {
            router.push('/');
        }
    }, [orderId, router]);

    const fetchOrder = async (id: string) => {
        try {
            setIsLoading(true);
            const data = await orderService.getOrderById(id);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            router.push('/');
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

    if (!order) return null;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4 max-w-3xl">
                    <Card className="shadow-card">
                        <CardHeader className="text-center space-y-4 pb-8">
                            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
                            <p className="text-muted-foreground">
                                Thank you for your purchase. Your order has been received and is being processed.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Order Info */}
                            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order Number</span>
                                    <span className="font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order Date</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="font-bold text-primary text-xl">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.size} × {item.quantity}
                                                </p>
                                            </div>
                                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Shipping Address
                                </h3>
                                <div className="p-4 bg-muted/30 rounded-lg">
                                    <p>{order.shippingAddress.street}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p>{order.shippingAddress.country}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <Button onClick={() => router.push('/orders')} variant="outline" className="flex-1">
                                    View Order History
                                </Button>
                                <Button onClick={() => router.push('/')} className="flex-1">
                                    Continue Shopping
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}

