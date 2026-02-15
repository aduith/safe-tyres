'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import productService, { Product } from '@/services/productService';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Droplet } from 'lucide-react';

// Bottle size categories
const bottleSizes = {
    small: [250, 300, 350, 400, 450, 500, 550, 600, 650],
    medium: [700, 750, 800, 850, 900, 950, 1000],
    large: [1200, 1400, 1500, 1700, 1800, 2000, 2100],
    industrial: [2800, 3500, 3800, 4800, 5400, 6600, 7800, 9400, 11500],
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [customProduct, setCustomProduct] = useState<any>(null);

    // Calculate price: ₹75 per 50ml
    const calculatePrice = (sizeInMl: number): number => {
        return (sizeInMl / 50) * 75;
    };

    // Format size display
    const formatSize = (sizeInMl: number): string => {
        if (sizeInMl >= 1000) {
            const litres = sizeInMl / 1000;
            return litres % 1 === 0 ? `${litres} Litre` : `${litres} Litre`;
        }
        return `${sizeInMl} ml`;
    };

    // Handle size selection
    const handleSizeChange = async (value: string) => {
        setSelectedSize(value);
        const sizeInMl = parseInt(value);
        const price = calculatePrice(sizeInMl);
        const formattedSize = formatSize(sizeInMl);
        const productName = `SafeTyres Anti-Puncture Liquid (${formattedSize})`;

        try {
            // Create custom product in database
            const response = await fetch('/api/products/custom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productName,
                    size: formattedSize,
                    price: price,
                    image: products[0]?.image || '/product-image.jpg',
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Generate custom product with real database ID
                setCustomProduct({
                    _id: data.data.product._id,
                    name: productName,
                    size: formattedSize,
                    price: price,
                    image: data.data.product.image,
                    popular: false,
                });
            }
        } catch (error) {
            console.error('Error creating custom product:', error);
        }
    };

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
                                {products
                                    .filter(product =>
                                        ['200ml', '300ml', '500ml', '1L'].includes(product.size)
                                    )
                                    .map((product) => (
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

                        {/* Custom Bottle Size Selector */}
                        {!isLoading && !error && (
                            <div className="mt-20 max-w-7xl mx-auto">
                                <div className="text-center mb-8 animate-fade-in">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                        Custom <span className="text-primary">Bottle Size</span>
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                        Need a different size? Select from our complete range of bottle sizes for any vehicle type.
                                    </p>
                                </div>

                                <div className="max-w-md mx-auto mb-8">
                                    <Select value={selectedSize} onValueChange={handleSizeChange}>
                                        <SelectTrigger className="w-full h-14 text-lg border-2 hover:border-primary transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Droplet className="h-5 w-5 text-primary" />
                                                <SelectValue placeholder="Select bottle size..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel className="text-base font-semibold text-primary">
                                                    Small Bottles (Two-Wheelers)
                                                </SelectLabel>
                                                {bottleSizes.small.map((size) => (
                                                    <SelectItem key={size} value={size.toString()}>
                                                        {formatSize(size)} - ₹{calculatePrice(size).toFixed(2)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>

                                            <SelectGroup>
                                                <SelectLabel className="text-base font-semibold text-primary">
                                                    Medium Bottles (Cars / SUVs)
                                                </SelectLabel>
                                                {bottleSizes.medium.map((size) => (
                                                    <SelectItem key={size} value={size.toString()}>
                                                        {formatSize(size)} - ₹{calculatePrice(size).toFixed(2)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>

                                            <SelectGroup>
                                                <SelectLabel className="text-base font-semibold text-primary">
                                                    Large Commercial Packs (Heavy Vehicles)
                                                </SelectLabel>
                                                {bottleSizes.large.map((size) => (
                                                    <SelectItem key={size} value={size.toString()}>
                                                        {formatSize(size)} - ₹{calculatePrice(size).toFixed(2)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>

                                            <SelectGroup>
                                                <SelectLabel className="text-base font-semibold text-primary">
                                                    Industrial / Special Purpose Packs
                                                </SelectLabel>
                                                {bottleSizes.industrial.map((size) => (
                                                    <SelectItem key={size} value={size.toString()}>
                                                        {formatSize(size)} - ₹{calculatePrice(size).toFixed(2)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Display custom product card when size is selected */}
                                {customProduct && (
                                    <div className="max-w-sm mx-auto animate-scale-in">
                                        <ProductCard
                                            id={customProduct._id}
                                            name={customProduct.name}
                                            size={customProduct.size}
                                            price={customProduct.price}
                                            image={customProduct.image}
                                            popular={customProduct.popular}
                                        />
                                    </div>
                                )}
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
