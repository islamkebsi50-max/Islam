import { useState, useRef } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { CartDrawer } from './CartDrawer';
import { AdminLoginDialog } from './AdminLoginDialog';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export function Navbar({ onSearch }: NavbarProps) {
  const { totalItems } = useCart();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoMouseDown = () => {
    longPressTimeoutRef.current = setTimeout(() => {
      setShowAdminLogin(true);
    }, 5000);
  };

  const handleLogoMouseUp = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  const handleLogoMouseLeave = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <button
              onMouseDown={handleLogoMouseDown}
              onMouseUp={handleLogoMouseUp}
              onMouseLeave={handleLogoMouseLeave}
              className="text-2xl md:text-3xl font-bold text-foreground hover-elevate active-elevate-2 px-3 py-1 rounded-md transition-transform select-none"
              data-testid="button-logo"
            >
              إسلام
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="ابحث عن المنتجات..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
            </form>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      data-testid="badge-cart-count"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>سلة التسوق</SheetTitle>
                </SheetHeader>
                <CartDrawer />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن المنتجات..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-mobile"
              />
            </div>
          </form>
        </div>
      </nav>

      <AdminLoginDialog open={showAdminLogin} onOpenChange={setShowAdminLogin} />
    </>
  );
}
