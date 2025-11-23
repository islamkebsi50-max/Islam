import { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { isAuthorizedAdmin } from '@/config/admins';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedAdmin(user.email)) {
        setUser(user);
      } else if (user) {
        setUser(null);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result?.user) {
        if (isAuthorizedAdmin(result.user.email)) {
          setUser(result.user);
          toast({
            title: 'تم تسجيل الدخول بنجاح',
            description: `مرحباً ${result.user.displayName}`,
          });
        } else {
          await firebaseSignOut(auth);
          setUser(null);
          toast({
            title: 'وصول مرفوض',
            description: 'عذراً، بريدك الإلكتروني غير مصرح له بالدخول',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      console.error('Error with sign in:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.message || 'حدث خطأ أثناء محاولة تسجيل الدخول',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({
        title: 'تم تسجيل الخروج',
      });
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
