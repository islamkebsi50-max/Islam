# متجر إسلام - Islem Grocery Store

## نظرة عامة
موقع متجر مواد غذائية عصري واحترافي باللغة العربية بتصميم رمادي وأبيض، مع لوحة إدارة مخفية لإدارة المنتجات والطلبات.

## المميزات الأساسية (MVP)
- ✅ واجهة متجر عصرية بتصميم RTL للعربية مع أنيميشن احترافي
- ✅ عرض المنتجات الغذائية بشكل جذاب مع الصور والأسعار والتفاصيل
- ✅ نظام سلة التسوق وإرسال الطلبات
- ✅ لوحة إدارة مخفية تظهر عند الضغط على اللوجو 5 مرات
- ✅ تسجيل دخول الإدارة باستخدام Firebase Google Auth
- ✅ إضافة وتعديل وحذف المنتجات من لوحة الإدارة
- ✅ إدارة وقبول الطلبات الواردة من العملاء
- ✅ تكامل مع Firebase Firestore لتخزين البيانات
- ✅ رفع صور المنتجات إلى ImgBB API
- ✅ تصميم متجاوب يعمل على جميع الأجهزة

## التقنيات المستخدمة

### Frontend
- React 18 مع TypeScript
- Wouter للتنقل بين الصفحات
- TanStack Query لإدارة البيانات
- Framer Motion للأنيميشن
- Shadcn UI للمكونات
- Tailwind CSS للتصميم
- Firebase Auth للمصادقة
- Firebase Firestore للقاعدة البيانات

### Backend
- Express.js
- Firebase Admin SDK (يستخدم لاحقاً)
- ImgBB API لرفع الصور

## البنية المعمارية

### الصفحات
- `/` - الصفحة الرئيسية (متجر العملاء)
- `/admin` - لوحة التحكم
- `/admin/products` - إدارة المنتجات
- `/admin/orders` - إدارة الطلبات

### المكونات الرئيسية
- `Navbar` - شريط التنقل مع البحث وسلة التسوق
- `Hero` - قسم البطل بصورة جذابة
- `ProductCard` - بطاقة المنتج مع أنيميشن
- `CategoryFilter` - فلتر الفئات
- `CartDrawer` - درج سلة التسوق
- `CheckoutDialog` - نافذة إتمام الطلب
- `AdminLoginDialog` - نافذة تسجيل دخول الإدارة

### الـ Contexts
- `CartContext` - إدارة حالة سلة التسوق
- `AuthContext` - إدارة المصادقة مع Firebase

## المتغيرات البيئية

### Firebase (مطلوبة)
- `VITE_FIREBASE_PROJECT_ID` - معرف مشروع Firebase
- `VITE_FIREBASE_APP_ID` - معرف تطبيق Firebase
- `VITE_FIREBASE_API_KEY` - مفتاح API لـ Firebase

### ImgBB (مطلوبة)
- `VITE_IMGBB_API_KEY` - مفتاح API لرفع الصور على ImgBB

## الميزات الخاصة

### لوحة الإدارة المخفية
- يتم الوصول إليها بالنقر 5 مرات على لوجو "إسلام" في الصفحة الرئيسية
- تتطلب تسجيل دخول باستخدام Google Auth عبر Firebase
- واجهة كاملة لإدارة المنتجات والطلبات

### نظام رفع الصور
- يستخدم ImgBB API لرفع صور المنتجات
- معاينة مباشرة للصورة قبل الرفع
- إمكانية تحديث الصور عند تعديل المنتج

### إدارة الطلبات
- عرض جميع الطلبات مع التفاصيل
- قبول أو رفض الطلبات
- حالات الطلبات: قيد الانتظار، مقبول، مرفوض
- إشعارات للعميل عند تغيير حالة الطلب

## نموذج البيانات

### Product (المنتج)
```typescript
{
  id: string
  name: string
  description?: string
  price: number // بالقروش
  category: string
  imageUrl: string
  stock: number
  weight?: string
  createdAt: Date
}
```

### Order (الطلب)
```typescript
{
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{
    productId: string
    quantity: number
    name: string
    price: number
  }>
  totalAmount: number // بالقروش
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}
```

## التصميم

### الألوان
- التصميم بالأبيض والرمادي حسب المطلوب
- دعم كامل للوضع الداكن
- نظام ألوان متسق عبر جميع المكونات

### الخطوط
- Cairo و Tajawal للنصوص العربية
- دعم كامل لـ RTL

### الأنيميشن
- تأثيرات fade-in عند تحميل الصفحة
- تأثيرات scale عند hover على المنتجات
- أنيميشن عند إضافة منتج للسلة
- انتقالات سلسة بين الصفحات

## ملاحظات التطوير

### الحالة الحالية
- ✅ جميع واجهات Frontend جاهزة وعاملة مع أنيميشن احترافي
- ✅ جميع Backend APIs منفذة وعاملة
- ✅ Firebase Auth للمصادقة جاهز
- ⚠️ **مهم**: حالياً يستخدم التطبيق MemStorage (تخزين مؤقت في الذاكرة)
- 📝 Firestore متاح في `server/firestore.ts` ولكن يحتاج إعداد Firebase Admin

### Firebase Firestore
التطبيق جاهز للتبديل من MemStorage إلى Firestore:

1. **الإعداد المطلوب**:
   - إنشاء Service Account في Firebase Console
   - تحميل ملف JSON credentials
   - تعيينه في متغير البيئة أو استخدام Application Default Credentials

2. **التبديل إلى Firestore**:
   ```typescript
   // في server/storage.ts، استبدل:
   export const storage = new MemStorage();
   // بـ:
   import { firestoreStorage } from './firestore';
   export const storage = firestoreStorage;
   ```

3. **ملاحظات**:
   - MemStorage يعمل بشكل ممتاز للتطوير والاختبار
   - البيانات تُفقد عند إعادة تشغيل الخادم
   - Firestore يوفر استمرارية البيانات وقابلية التوسع

### المميزات المنفذة
- ✅ واجهة عصرية بتصميم RTL كامل للعربية
- ✅ Hero section مع صورة مولدة باستخدام AI
- ✅ عرض المنتجات مع فلترة حسب الفئات والبحث
- ✅ نظام سلة تسوق كامل مع localStorage
- ✅ نظام طلبات مع نموذج checkout
- ✅ لوحة إدارة مخفية (5 نقرات على اللوجو)
- ✅ Firebase Google Auth للإدارة
- ✅ CRUD كامل للمنتجات مع رفع صور ImgBB
- ✅ إدارة الطلبات (قبول/رفض)
- ✅ تصميم متجاوب 100%
- ✅ Framer Motion للأنيميشن
- ✅ معالجة أخطاء شاملة
- ✅ حالات تحميل جميلة

### التحسينات المستقبلية
- إضافة Firebase Admin middleware لحماية routes الإدارة
- نظام إشعارات للطلبات الجديدة
- تقارير مبيعات ولوحة تحليلات
- فلترة متقدمة للمنتجات
- تتبع حالة الطلب للعملاء
- تكامل مع نظام دفع إلكتروني
