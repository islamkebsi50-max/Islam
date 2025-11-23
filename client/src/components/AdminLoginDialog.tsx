import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const { user, loading, signIn } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && open) {
      onOpenChange(false);
      setLocation('/admin');
    }
  }, [user, open, onOpenChange, setLocation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-admin-login">
        <DialogHeader>
          <DialogTitle className="text-2xl">تسجيل دخول الإدارة</DialogTitle>
          <DialogDescription>
            قم بتسجيل الدخول باستخدام حساب Google للوصول إلى لوحة الإدارة
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={signIn}
            disabled={loading}
            size="lg"
            className="w-full"
            data-testid="button-google-signin"
          >
            {loading ? 'جاري التحميل...' : 'تسجيل الدخول باستخدام Google'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
