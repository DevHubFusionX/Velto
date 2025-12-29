import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#a3e635]/20 border-t-[#a3e635] animate-spin"></div>
                    <div className="mt-4 text-[#a3e635] text-sm font-medium animate-pulse text-center">Verifying access...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
