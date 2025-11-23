// قائمة رسائل البريد الإلكتروني المصرح لها بالدخول كمسؤولين
export const AUTHORIZED_ADMINS = [
  'isslamkebsi34@gmail.com',
];

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return AUTHORIZED_ADMINS.includes(email.toLowerCase());
}
