export type UserRole = 'ADMIN' | 'VISITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBlocked?: boolean;
}

const STORAGE_KEY = 'pagevoyage_auth';

export const mockLogin = (email: string): User | null => {
  if (!email.endsWith('@neu.edu.ph')) {
    return null;
  }

  // RBAC logic: Specific email is ADMIN, others are VISITOR
  const role: UserRole = email === 'jcesperanza@neu.edu.ph' ? 'ADMIN' : 'VISITOR';
  
  const user: User = {
    id: Math.random().toString(36).substring(7),
    name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    email,
    role,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const mockLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};
