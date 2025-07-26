import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DashboardLayout from '../pages/dashboard/DashboardLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CustomerDashboard from '../pages/dashboard/CustomerDashboard';
import VendorDashboard from '../pages/dashboard/VendorDashboard';
import SupplierDashboard from '../pages/dashboard/SupplierDashboard';
import SettingsPage from '../pages/settings/SettingsPage';
import OrdersPage from '../pages/orders/OrdersPage';
import MenuPage from '../pages/menu/MenuPage';
import ProductsPage from '../pages/products/ProductsPage';
import DeliveriesPage from '../pages/deliveries/DeliveriesPage';
import CustomersPage from '../pages/customers/CustomersPage';
import PaymentsPage from '../pages/payments/PaymentsPage';

const ProtectedRoutes: React.FC = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullPage />;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    // Define routes based on user role
    const getRoleSpecificRoutes = () => {
        // Use type assertion to ensure TypeScript knows about the 'admin' role
        const role = currentUser.role as 'customer' | 'vendor' | 'supplier' | 'admin';
        
        switch (role) {
            case 'customer':
                return (
                    <Route path="dashboard" element={<CustomerDashboard />} />
                );
            case 'vendor':
                return (
                    <>
                        <Route path="dashboard" element={<VendorDashboard />} />
                        <Route path="menu" element={<MenuPage />} />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="payments" element={<PaymentsPage />} />
                    </>
                );
            case 'supplier':
                return (
                    <>
                        <Route path="dashboard" element={<SupplierDashboard />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="deliveries" element={<DeliveriesPage />} />
                    </>
                );
            case 'admin':
                return (
                    <>
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="menu" element={<MenuPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="deliveries" element={<DeliveriesPage />} />
                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="payments" element={<PaymentsPage />} />
                    </>
                );
            default:
                return <Navigate to="/unauthorized" replace />;
        }
    };

    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                {/* Role-specific routes */}
                {getRoleSpecificRoutes()}

                {/* Common routes for all roles */}
                <Route path="orders" element={<OrdersPage />} />
                <Route path="settings" element={<SettingsPage />} />

                {/* Redirect to role-specific dashboard */}
                <Route index element={<Navigate to={`/${currentUser.role}/dashboard`} replace />} />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to={`/${currentUser.role}/dashboard`} replace />} />
            </Route>
        </Routes>
    );
};

export default ProtectedRoutes;
