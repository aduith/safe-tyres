'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminNavbar from '@/components/AdminNavbar';
import Footer from '@/components/Footer';
import adminService, { Product, CreateProductData } from '@/services/adminService';
import productService from '@/services/productService';
import { toast } from 'sonner';

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<CreateProductData>({
        name: '',
        size: '',
        price: 0,
        description: '',
        image: '',
        stock: 0,
        popular: false,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productService.getAllProducts({});
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                // For now, editing only supports JSON updates (no image changes)
                await adminService.updateProduct(editingProduct._id, formData);
                toast.success('Product updated successfully');
            } else {
                if (!file) {
                    toast.error('Please select an image');
                    return;
                }
                const data = new FormData();
                data.append('name', formData.name);
                data.append('size', formData.size);
                data.append('price', formData.price.toString());
                data.append('description', formData.description || '');
                data.append('stock', formData.stock.toString());
                data.append('popular', String(formData.popular));
                data.append('image', file);

                await adminService.createProduct(data);
                toast.success('Product created successfully');
            }
            setIsDialogOpen(false);
            resetForm();
            fetchProducts();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminService.deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            size: product.size,
            price: product.price,
            description: product.description || '',
            image: product.image,
            stock: product.stock,
            popular: product.popular,
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            size: '',
            price: 0,
            description: '',
            image: '',
            stock: 0,
            popular: false,
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />

            <main className="flex-1 pt-20 pb-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">Product Management</h1>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Product Name</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="size">Size (e.g., 200ml, 1L)</Label>
                                            <Input
                                                id="size"
                                                value={formData.size}
                                                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                                required
                                                placeholder="e.g. 500ml"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="price">Price (₹)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="stock">Stock</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description (Optional)</Label>
                                        <Input
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="image">Product Image</Label>
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setFile(file);
                                                }
                                            }}
                                            required={!editingProduct} // Required only for new products
                                        />
                                        {formData.image && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Current image: {formData.image.split('/').pop()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="popular"
                                            checked={formData.popular}
                                            onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                        />
                                        <Label htmlFor="popular">Mark as Popular</Label>
                                    </div>
                                    <Button type="submit" className="w-full">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Card key={product._id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
                                        <p className="text-sm text-muted-foreground mb-2">{product.size}</p>
                                        <p className="text-xl font-bold text-primary mb-2">₹{product.price.toFixed(2)}</p>
                                        <p className="text-sm mb-4">Stock: {product.stock}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(product._id)}>
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
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

export default ProductManagement;
