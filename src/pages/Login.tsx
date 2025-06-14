
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { createAdminAccount } from '@/utils/adminAccountSetup';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard (not admin)
    if (user) {
      navigate('/dashboard');
    }
    
    // Create admin account if it doesn't exist
    createAdminAccount();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-eco-light flex items-center justify-center">
        <div className="container max-w-md px-4">
          <Card className="shadow-lg border-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">เข้าสู่ระบบ</CardTitle>
              <CardDescription className="text-center">
                เข้าสู่ระบบเพื่อเริ่มต้นทำกิจกรรม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <SocialLoginButtons />
              <div className="text-center text-sm mt-2">
                ยังไม่มีบัญชี? <Link to="/register" className="text-eco-blue hover:underline">สมัครสมาชิก</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
