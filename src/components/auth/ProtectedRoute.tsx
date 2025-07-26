import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

type ProtectedRouteProps = {
    allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner fullPage />;
    }

    if (!currentUser) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has any of the allowed roles
    if (allowedRoles && !allowedRoles.includes(currentUser.role || '')) {
        // Redirect to unauthorized page or home
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
