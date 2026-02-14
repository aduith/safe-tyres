'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { useState } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <html lang="en">
            <body>
                <QueryClientProvider client={queryClient}>
                    <TooltipProvider>
                        <AuthProvider>
                            <CartProvider>
                                <Toaster />
                                <Sonner />
                                {children}
                            </CartProvider>
                        </AuthProvider>
                    </TooltipProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
