import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/contexts/CartContext';
import { CheckoutDialog } from './CheckoutDialog';
import { useState } from 'react';

export function CartDrawer() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12" data-testid="cart-empty">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-muted-foreground text-center">السلة فارغة</p>
        <p className="text-sm text-muted-foreground mt-2">أضف منتجات لبدء التسوق</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-4 py-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4" data-testid={`cart-item-${product.id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-1" data-testid={`text-product-name-${product.id}`}>
                  {product.name}
                </h4>
                <p className="text-sm text-muted-foreground">{product.weight}</p>
                <p className="font-bold mt-1" data-testid={`text-product-price-${product.id}`}>
                  {(product.price / 100).toFixed(2)} د.ج
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    data-testid={`button-decrease-${product.id}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium" data-testid={`text-quantity-${product.id}`}>
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    data-testid={`button-increase-${product.id}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7"
                  onClick={() => removeFromCart(product.id)}
                  data-testid={`button-remove-${product.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between text-lg font-bold">
          <span>المجموع:</span>
          <span data-testid="text-total-price">{(totalPrice / 100).toFixed(2)} د.ج</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={() => setShowCheckout(true)}
          data-testid="button-checkout"
        >
          إتمام الطلب ({totalItems} منتج)
        </Button>
      </div>

      <CheckoutDialog open={showCheckout} onOpenChange={setShowCheckout} />
    </div>
  );
}
