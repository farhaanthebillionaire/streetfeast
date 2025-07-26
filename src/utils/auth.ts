import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile, Customer, Vendor, Supplier } from '../types/firestore';

export type UserRole = 'customer' | 'vendor' | 'supplier' | 'admin';

export const getUserRole = async (user: FirebaseUser): Promise<UserRole | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const createUserProfile = async (
  user: FirebaseUser,
  role: UserRole,
  additionalData: Partial<Customer | Vendor | Supplier> = {}
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userData: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || additionalData.displayName || '',
      photoURL: user.photoURL || '',
      role,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    // Create role-specific profile in the appropriate collection
    const roleCollection = role === 'customer' ? 'customers' : role === 'vendor' ? 'vendors' : 'suppliers';
    const roleRef = doc(db, roleCollection, user.uid);
    
    const roleData = {
      ...userData,
      ...additionalData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Use batch to ensure both writes succeed or fail together
    const { writeBatch } = await import('firebase/firestore');
    const batch = writeBatch(db);
    
    batch.set(userRef, userData);
    batch.set(roleRef, roleData);
    
    await batch.commit();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const checkUserExists = async (uid: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile | Customer | Vendor | Supplier>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userProfile = await getUserProfile(uid);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Update the user's document
    await setDoc(
      userRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // Update the role-specific document
    const roleCollection = userProfile.role === 'customer' ? 'customers' : 
                         userProfile.role === 'vendor' ? 'vendors' : 'suppliers';
    const roleRef = doc(db, roleCollection, uid);
    
    await setDoc(
      roleRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
