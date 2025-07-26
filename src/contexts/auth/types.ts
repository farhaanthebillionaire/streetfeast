import type { User as FirebaseUser, UserCredential } from 'firebase/auth';

export interface User extends FirebaseUser {
  role?: 'customer' | 'vendor' | 'supplier';
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  // Phone Authentication
  signInWithPhoneNumber: (phoneNumber: string) => Promise<void>;
  verifyOtp: (verificationCode: string) => Promise<void>;
  // Email/Password Authentication
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  // Common
  signOut: () => Promise<void>;
}
