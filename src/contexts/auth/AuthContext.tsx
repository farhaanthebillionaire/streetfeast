import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    signOut as firebaseSignOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile as firebaseUpdateProfile,
    type User as FirebaseUser,
    type UserCredential
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, GeoPoint } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export type UserRole = 'customer' | 'vendor' | 'supplier' | 'admin';

// Base user fields that all users will have
export interface BaseUserFields {
    role: UserRole;
    phoneNumber?: string | null;
    firstName?: string;
    lastName?: string;
    email: string;
    // Add common fields here that all user types share
}

// Role-specific fields
interface SupplierFields {
    role: 'supplier';
    companyName: string;
    description?: string;
}

interface VendorFields {
    role: 'vendor';
    businessName: string;
    cuisineType?: string;
}

interface CustomerFields {
    role: 'customer';
    addresses?: any[];
    preferences?: any[];
}

// Combine base fields with role-specific fields
type UserWithRole<T> = BaseUserFields & T;

type UserType = 
    | UserWithRole<SupplierFields>
    | UserWithRole<VendorFields>
    | UserWithRole<CustomerFields>;

// Extend Firebase User with our custom fields
export type User = Omit<FirebaseUser, 'phoneNumber' | 'email'> & {
    email: string; // Make email required
} & UserType;

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    signUp: (email: string, password: string, phoneNumber: string, role: UserRole, additionalData?: any) => Promise<UserCredential>;
    signOut: () => Promise<void>;
    updateUserPhone: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = (props) => {
    const { children } = props;
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Fetch user data from Firestore
    const fetchUserData = useCallback(async (user: FirebaseUser): Promise<User> => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
                ...user,
                role: userData.role,
                phoneNumber: userData.phoneNumber || null,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
            };
        }
        return user as User;
    }, []);
    
    const signIn = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = await fetchUserData(userCredential.user);
            setCurrentUser(user);
            return userCredential;
        } finally {
            setLoading(false);
        }
    }, [fetchUserData]);
    
    const signUp = useCallback(async (
        email: string, 
        password: string, 
        phoneNumber: string, 
        role: UserRole,
        additionalData: any = {}
    ) => {
        setLoading(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;
            
            // Prepare user data with type assertion
            const userData = {
                ...user,
                role,
                phoneNumber,
                firstName: additionalData?.firstName || '',
                lastName: additionalData?.lastName || '',
                email: user.email || '', // Ensure email is not null
                // Add role-specific fields
                ...(role === 'supplier' && {
                    companyName: additionalData?.companyName || '',
                    description: additionalData?.description || ''
                }),
                ...(role === 'vendor' && {
                    businessName: additionalData?.businessName || '',
                    cuisineType: additionalData?.cuisineType || ''
                })
            } as User; // Type assertion here
            
            // Prepare role-specific data
            const roleSpecificData: any = {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };
            
            // Add role-specific fields
            switch (role) {
                case 'customer':
                    roleSpecificData.addresses = [];
                    roleSpecificData.favorites = [];
                    roleSpecificData.loyaltyPoints = 0;
                    break;
                    
                case 'vendor':
                    roleSpecificData.businessName = additionalData?.businessName || '';
                    roleSpecificData.cuisineType = additionalData?.cuisineType || '';
                    roleSpecificData.description = '';
                    roleSpecificData.menu = [];
                    roleSpecificData.location = new GeoPoint(0, 0);
                    roleSpecificData.rating = {
                        average: 0,
                        count: 0
                    };
                    roleSpecificData.businessHours = '';
                    roleSpecificData.isOpen = false;
                    break;
                    
                case 'supplier':
                    roleSpecificData.companyName = additionalData?.companyName || '';
                    roleSpecificData.description = '';
                    roleSpecificData.products = [];
                    roleSpecificData.location = {
                        address: '',
                        city: '',
                        state: '',
                        zipCode: ''
                    };
                    roleSpecificData.rating = {
                        average: 0,
                        count: 0
                    };
                    roleSpecificData.businessHours = '';
                    roleSpecificData.isVerified = false;
                    break;
            }
            
            // Save to users collection
            await setDoc(doc(db, 'users', user.uid), userData);
            
            // Save to role-specific collection
            await setDoc(doc(db, `${role}s`, user.uid), roleSpecificData);
            
            // Update current user state
            setCurrentUser(userData);
            
            return userCredential;
        } catch (error) {
            console.error('Error during sign up:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);
    
    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            await firebaseSignOut(auth);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const updateUserPhone = useCallback(async (phoneNumber: string) => {
        if (!currentUser) {
            throw new Error('No user is currently signed in');
        }
        
        setLoading(true);
        try {
            // Update in Firestore
            await setDoc(doc(db, 'users', currentUser.uid), {
                phoneNumber,
                updatedAt: serverTimestamp()
            }, { merge: true });
            
            // Update in current user state
            setCurrentUser(prev => prev ? { ...prev, phoneNumber } : null);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    // Set up auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userWithData = await fetchUserData(user);
                    setCurrentUser(userWithData);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setCurrentUser(user as User);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [fetchUserData]);

    const value = {
        currentUser,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserPhone
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
