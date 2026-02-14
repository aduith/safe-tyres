'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import ProductCarousel from '@/components/ProductCarousel';
import ProductCard from '@/components/ProductCard';
import ProductAdvantages from '@/components/ProductAdvantages';
import UsageInstructions from '@/components/UsageInstructions';
import DosageChart from '@/components/DosageChart';
import ReviewsSection from '@/components/ReviewsSection';
import FeedbackForm from '@/components/FeedbackForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import productService, { Product } from '@/services/productService';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getAllProducts({ popular: true });
                setFeaturedProducts(data.slice(0, 2)); // Get first 2 popular products
            } catch (err) {
                console.error('Error fetching featured products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen">
            <Navbar />

            <Hero />

            {/* Featured Products */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-4xl font-bold mb-4">
                            Featured <span className="text-primary">Products</span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Our most popular sizes for everyday protection
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {featuredProducts.map((product) => (
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
                </div>
            </section>

            <ProductCarousel />

            <ProductAdvantages />

            <UsageInstructions />

            <DosageChart />

            <ReviewsSection />

            <FeedbackForm />

            <Footer />
        </div>
    );
}
