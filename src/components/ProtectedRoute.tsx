
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only proceed if we've finished the initial loading
    if (!isLoading) {
      // If no user is found after loading is complete, redirect to login
      if (!user || !session) {
        toast({
          variant: "destructive",
          title: "กรุณาเข้าสู่ระบบ",
          description: "คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้",
        });
        navigate('/login', { replace: true });
      } else {
        console.log("Protected route - User authenticated:", user.email);
        setAuthChecked(true);
      }
    }
  }, [user, session, isLoading, navigate]);

  // While loading or checking auth, show loading state
  if (isLoading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
          <p className="text-eco-blue font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // If we've checked auth and we have a user, render the children
  return user && session ? <>{children}</> : null;
};

export default ProtectedRoute;
