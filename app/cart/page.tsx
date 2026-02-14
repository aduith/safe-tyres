'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center space-y-6 animate-fade-in">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto" />
            <h2 className="text-3xl font-bold">Your Cart is Empty</h2>
            <p className="text-muted-foreground">
              Add some products to get started!
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">
            Shopping <span className="text-primary">Cart</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <Card
                  key={item.id}
                  className="animate-scale-in hover:shadow-glow transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="w-32 h-32 bg-background rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                          sizes="128px"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{item.name}</h3>
                          <p className="text-muted-foreground">{item.size}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-primary">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-fade-in shadow-glow">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({totalItems})</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-accent font-semibold">FREE</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
