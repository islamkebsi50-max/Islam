import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { InsertOrder } from '@shared/schema';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const createOrderMutation = useMutation({
    mutationFn: async (order: InsertOrder) => {
      return apiRequest('POST', '/api/orders', order);
    },
    onSuccess: () => {
      toast({
        title: 'تم إرسال الطلب بنجاح',
        description: 'سيتم التواصل معك قريباً',
      });
      clearCart();
      onOpenChange(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    const orderData: InsertOrder = {
      customerName,
      customerPhone,
      customerAddress,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
        name: product.name,
        price: product.price,
      })),
      totalAmount: totalPrice,
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-checkout">
        <DialogHeader>
          <DialogTitle>إتمام الطلب</DialogTitle>
          <DialogDescription>
            أدخل معلوماتك لإكمال الطلب
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              required
              data-testid="input-customer-name"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              required
              data-testid="input-customer-phone"
            />
          </div>
          
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Textarea
              id="address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="أدخل عنوانك الكامل"
              required
              rows={3}
              data-testid="input-customer-address"
            />
          </div>

          <div className="flex justify-between items-center py-2 border-t">
            <span className="font-bold">المجموع:</span>
            <span className="text-xl font-bold">{(totalPrice / 100).toFixed(2)} د.ج</span>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={createOrderMutation.isPending}
            data-testid="button-submit-order"
          >
            {createOrderMutation.isPending ? 'جاري الإرسال...' : 'تأكيد الطلب'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
