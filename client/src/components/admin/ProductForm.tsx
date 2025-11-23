import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { uploadImageToImgBB } from '@/lib/imgbb';
import { insertProductSchema, type InsertProduct, type Product } from '@shared/schema';
import { z } from 'zod';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

const formSchema = insertProductSchema.extend({
  price: z.number().min(1, 'السعر مطلوب'),
  stock: z.number().min(0, 'المخزون يجب أن يكون صفر أو أكثر'),
});

type FormData = z.infer<typeof formSchema>;

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || '');
  const [uploadingImage, setUploadingImage] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product ? product.price / 100 : 0,
      category: product?.category || '',
      imageUrl: product?.imageUrl || '',
      stock: product?.stock || 0,
      weight: product?.weight || '',
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      if (product) {
        return apiRequest('PUT', `/api/products/${product.id}`, data);
      }
      return apiRequest('POST', '/api/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: product ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = data.imageUrl;

      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImageToImgBB(imageFile);
        setUploadingImage(false);
      }

      if (!imageUrl) {
        toast({
          title: 'خطأ',
          description: 'الرجاء اختيار صورة للمنتج',
          variant: 'destructive',
        });
        return;
      }

      const productData: InsertProduct = {
        ...data,
        price: Math.round(data.price * 100),
        imageUrl,
      };

      saveMutation.mutate(productData);
    } catch (error: any) {
      setUploadingImage(false);
      toast({
        title: 'خطأ في رفع الصورة',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel>صورة المنتج</FormLabel>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-md overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    form.setValue('imageUrl', '');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover-elevate">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">انقر لرفع صورة</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  data-testid="input-product-image"
                />
              </label>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المنتج</FormLabel>
              <FormControl>
                <Input {...field} placeholder="مثال: حليب طازج" data-testid="input-product-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف (اختياري)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="وصف المنتج..." rows={3} data-testid="input-product-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر (دينار)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    data-testid="input-product-price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المخزون</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    data-testid="input-product-stock"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: ألبان" data-testid="input-product-category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوزن (اختياري)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="مثال: 1 كغ" data-testid="input-product-weight" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={saveMutation.isPending || uploadingImage}
          data-testid="button-save-product"
        >
          {uploadingImage ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري رفع الصورة...
            </>
          ) : saveMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            product ? 'تحديث المنتج' : 'إضافة المنتج'
          )}
        </Button>
      </form>
    </Form>
  );
}
