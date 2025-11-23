import { useQuery, useMutation } from '@tanstack/react-query';
import { Check, X, Phone, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Order } from '@shared/schema';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function AdminOrders() {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });
  const { toast } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest('PATCH', `/api/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: 'تم تحديث حالة الطلب',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">إدارة الطلبات</h2>
        <p className="text-muted-foreground">راجع وأدر طلبات العملاء</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center" data-testid="no-orders-admin">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-muted-foreground">لا توجد طلبات بعد</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id} data-testid={`card-order-${order.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{order.customerName}</CardTitle>
                      <Badge
                        variant={
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'accepted' ? 'default' : 'destructive'
                        }
                        data-testid={`badge-status-${order.id}`}
                      >
                        {order.status === 'pending' ? 'قيد الانتظار' :
                         order.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.customerAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>
                          {format(new Date(order.createdAt), 'dd MMMM yyyy - HH:mm', { locale: ar })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold" data-testid={`text-order-total-${order.id}`}>
                      {(order.totalAmount / 100).toFixed(2)} د.ج
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">المنتجات:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {((item.price * item.quantity) / 100).toFixed(2)} د.ج
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'pending' && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'accepted' })}
                        disabled={updateStatusMutation.isPending}
                        data-testid={`button-accept-${order.id}`}
                      >
                        <Check className="h-4 w-4 ml-2" />
                        قبول الطلب
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'rejected' })}
                        disabled={updateStatusMutation.isPending}
                        data-testid={`button-reject-${order.id}`}
                      >
                        <X className="h-4 w-4 ml-2" />
                        رفض الطلب
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
