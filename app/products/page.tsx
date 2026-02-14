'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import productService, { Product } from '@/services/productService';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-20">
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12 animate-fade-in">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Our <span className="text-primary">Products</span>
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Choose the perfect size for your vehicle. All sizes provide the same premium protection.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                                <p className="mt-4 text-muted-foreground">Loading products...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-destructive text-lg">{error}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        size={product.size}
                                        price={product.price}
                                        image={product.image}
                                        popular={product.popular}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Product Features */}
                        <div className="mt-20 max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8">
                                Why Choose <span className="text-primary">SafeTyres</span>?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: 'Professional Grade',
                                        desc: 'Used by automotive professionals worldwide',
                                    },
                                    {
                                        title: 'Eco-Friendly Formula',
                                        desc: 'Safe for tyres and the environment',
                                    },
                                    {
                                        title: 'Long-Lasting Protection',
                                        desc: 'Lasts for the entire life of your tyre',
                                    },
                                    {
                                        title: 'Universal Compatibility',
                                        desc: 'Works with all tyre types and sizes',
                                    },
                                ].map((feature, index) => (
                                    <div
                                        key={index}
                                        className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
                                    >
                                        <h3 className="text-lg font-semibold mb-2 text-primary">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
