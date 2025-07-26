import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './components/theme/theme-provider';
import { AuthProvider, useAuth } from './contexts/auth/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Test Components
import FirebaseTest from './components/test/FirebaseTest';

// Auth Pages
import LoginPage from './pages/shared/LoginPage';
import RegisterPage from './pages/shared/RegisterPage';
import LandingPage from './pages/shared/LandingPage';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorMenu from './pages/vendor/Menu';
import VendorOrders from './pages/vendor/Orders';
import VendorReviews from './pages/vendor/Reviews';
import VendorHygiene from './pages/vendor/Hygiene';

// Customer Pages
import CustomerHome from './pages/customer/Home';
import CustomerOrders from './pages/customer/Orders';
import CustomerRewards from './pages/customer/Rewards';
import VendorDetail from './pages/customer/VendorDetail';

// Supplier Pages
import SupplierDashboard from './pages/supplier/Dashboard';
import SupplierProducts from './pages/supplier/Products';
import SupplierInvoices from './pages/supplier/Invoices';
import SupplierClients from './pages/supplier/Clients';

// Role-based route component
const RoleRoute: React.FC<{ 
  element: React.ReactElement;
  allowedRoles: string[];
  redirectTo?: string;
}> = ({ element, allowedRoles, redirectTo = '/' }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const userRole = currentUser.role || 'customer'; // Default to customer if role not set
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} />;
  }
  
  return element;
};

// Public route component
const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/" /> : element;
};

// Load fonts
const loadFonts = () => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

function App() {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ThemeProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6366F1" />
        <meta name="description" content="StreetFeast - Your Ultimate Food Experience" />
        <title>StreetFeast</title>
      </Helmet>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            padding: '0.75rem 1rem',
            borderRadius: 'calc(var(--radius) - 2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
      <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute element={<LoginPage />} />
          } />
          <Route path="/register" element={
            <PublicRoute element={<RegisterPage />} />
          } />
          <Route path="/firebase-test" element={
            <FirebaseTest />
          } />
          
          <Route path="/" element={<AppLayout />}>
            {/* Shared Routes */}
            <Route index element={<LandingPage />} />
            
            {/* Vendor Routes */}
            <Route path="vendor">
              <Route path="dashboard" element={
                <RoleRoute element={<VendorDashboard />} allowedRoles={['vendor']} />
              } />
              <Route path="menu" element={
                <RoleRoute element={<VendorMenu />} allowedRoles={['vendor']} />
              } />
              <Route path="orders" element={
                <RoleRoute element={<VendorOrders />} allowedRoles={['vendor']} />
              } />
              <Route path="reviews" element={
                <RoleRoute element={<VendorReviews />} allowedRoles={['vendor']} />
              } />
              <Route path="hygiene" element={
                <RoleRoute element={<VendorHygiene />} allowedRoles={['vendor']} />
              } />
            </Route>
            
            {/* Customer Routes */}
            <Route path="customer">
              <Route path="home" element={
                <RoleRoute element={<CustomerHome />} allowedRoles={['customer']} />
              } />
              <Route path="vendor/:id" element={
                <RoleRoute element={<VendorDetail />} allowedRoles={['customer']} />
              } />
              <Route path="orders" element={
                <RoleRoute element={<CustomerOrders />} allowedRoles={['customer']} />
              } />
              <Route path="rewards" element={
                <RoleRoute element={<CustomerRewards />} allowedRoles={['customer']} />
              } />
            </Route>
            
            {/* Supplier Routes */}
            <Route path="supplier">
              <Route path="dashboard" element={
                <RoleRoute element={<SupplierDashboard />} allowedRoles={['supplier']} />
              } />
              <Route path="products" element={
                <RoleRoute element={<SupplierProducts />} allowedRoles={['supplier']} />
              } />
              <Route path="invoices" element={
                <RoleRoute element={<SupplierInvoices />} allowedRoles={['supplier']} />
              } />
              <Route path="clients" element={
                <RoleRoute element={<SupplierClients />} allowedRoles={['supplier']} />
              } />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="mt-4 text-gray-600">Page not found</p>
              </div>
            } />
          </Route>
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
