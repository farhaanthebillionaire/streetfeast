import { Timestamp } from 'firebase/firestore';

export type UserRole = 'customer' | 'vendor' | 'supplier' | 'admin';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'customer' | 'vendor' | 'supplier' | 'admin';
    phoneNumber?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Vendor extends UserProfile {
    businessName: string;
    description: string;
    menuItems: string[]; // Array of menu item IDs
    hygieneBadge: {
        rating: 'pass' | 'improvement-required' | 'excellent';
        lastInspection: Timestamp;
        nextInspection: Timestamp;
    };
    loyaltyPoints: number;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    cuisineType: string[];
    openingHours: {
        [key: string]: { // Day of week (e.g., 'monday')
            open: string; // '09:00'
            close: string; // '22:00'
            isOpen: boolean;
        };
    };
    isActive: boolean;
}

export interface Customer extends UserProfile {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    preferences: string[]; // e.g., ['vegetarian', 'spicy']
    savedAddresses: Array<{
        id: string;
        name: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        isDefault: boolean;
    }>;
    loyaltyStatus: {
        points: number;
        tier: 'bronze' | 'silver' | 'gold' | 'platinum';
        nextTierPoints: number;
    };
}

export interface Supplier extends UserProfile {
    companyName: string;
    description: string;
    location: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
    };
    products: string[]; // Array of product IDs
    rating: {
        average: number;
        count: number;
    };
    businessHours: string;
    isVerified: boolean;
}

export interface MenuItem {
    id: string;
    vendorId: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    ingredients: string[];
    dietaryRestrictions: string[]; // e.g., ['vegetarian', 'gluten-free']
    isAvailable: boolean;
    preparationTime: number; // in minutes
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Order {
    id: string;
    customerId: string;
    vendorId: string;
    items: Array<{
        menuItemId: string;
        name: string;
        quantity: number;
        price: number;
        specialInstructions?: string;
    }>;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    totalPrice: number;
    deliveryAddress: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        instructions?: string;
    };
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
    paymentMethod: 'card' | 'cash' | 'online';
    orderPlacedAt: Timestamp;
    estimatedDeliveryTime?: Timestamp;
    deliveredAt?: Timestamp;
    customerNotes?: string;
}

export interface Invoice {
    id: string;
    supplierId: string;
    vendorId: string;
    orderId: string;
    amount: number;
    dueDate: Timestamp;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    items: Array<{
        productId: string;
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    paymentDate?: Timestamp;
    paymentMethod?: string;
    notes?: string;
}

export interface Review {
    id: string;
    customerId: string;
    customerName: string;
    vendorId: string;
    orderId: string;
    rating: number; // 1-5
    comment: string;
    images?: string[];
    isAnonymous: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    vendorReply?: {
        comment: string;
        repliedAt: Timestamp;
    };
}
