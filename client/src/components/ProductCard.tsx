import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@shared/schema';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isInCart = items.some(item => item.product.id === product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      data-testid={`card-product-${product.id}`}
    >
      <Card className="group overflow-hidden hover-elevate h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
        </div>
        
        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          {product.weight && (
            <p className="text-sm text-muted-foreground mb-2">{product.weight}</p>
          )}
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-auto">
            <p className="text-xl font-bold" data-testid={`text-product-price-${product.id}`}>
              {(product.price / 100).toFixed(2)} د.ج
            </p>
            {product.stock > 0 && product.stock < 10 && (
              <Badge variant="secondary" className="text-xs">
                {product.stock} متوفر
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {product.stock > 0 ? (
            <Button
              className="w-full transition-all"
              onClick={handleAddToCart}
              disabled={isAdding}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {isAdding ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  تمت الإضافة
                </motion.div>
              ) : (
                <>
                  <Plus className="h-4 w-4 ml-2" />
                  {isInCart ? 'إضافة المزيد' : 'أضف للسلة'}
                </>
              )}
            </Button>
          ) : (
            <Button className="w-full" disabled>
              غير متوفر
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
