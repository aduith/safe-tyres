'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
  popular?: boolean;
}

const ProductCard = ({ id, name, size, price, image, popular }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addItem({ id, productId: id, name, size, price, image });
      toast.success('Added to cart!', {
        description: `${name} (${size}) has been added to your cart.`,
        icon: <Check className="h-4 w-4" />,
      });
    } catch (error) {
      toast.error('Failed to add to cart', {
        description: 'Please try again later.',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-scale-in">
      {popular && (
        <Badge className="absolute top-4 right-4 z-10 bg-accent">
          Popular
        </Badge>
      )}

      <CardContent className="p-6">
        <div className="aspect-square relative mb-6 rounded-xl overflow-hidden bg-background">
          <img
            src={image}
            alt={`${name} - ${size}`}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-muted-foreground">{size}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              ₹{price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
