
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
    
    // Check if admin account exists, if not create it
    const checkAdminAccount = async () => {
      const adminEmail = 'admin@gmail.com';
      
      // Check if user exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
        
      if (checkError) {
        console.error('Error checking for admin account:', checkError);
        return;
      }
      
      // If no admin exists, create one
      if (!existingUsers || existingUsers.length === 0) {
        console.log('No admin account found, creating default admin account');
        
        // Create admin account
        await signUp(adminEmail, '@Test1234', 'System Administrator', true);
        
        toast({
          title: "บัญชีแอดมินถูกสร้างขึ้น",
          description: "บัญชีแอดมินถูกสร้างขึ้นเรียบร้อยแล้ว",
        });
      }
    };
    
    checkAdminAccount();
  }, [user, navigate, signUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, success } = await signIn(email, password);

      if (error) {
        toast({
          variant: "destructive",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: error,
        });
        return;
      }

      if (success) {
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับกลับมา!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <Link to="#" className="text-sm text-eco-blue hover:underline">ลืมรหัสผ่าน?</Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-eco-gradient" disabled={isLoading}>
                  {isLoading ? "กำลังดำเนินการ..." : "เข้าสู่ระบบ"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="text-center text-sm text-gray-600">
                หรือเข้าสู่ระบบด้วย
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"/>
                  </svg>
                  เข้าสู่ระบบด้วย Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z"/>
                  </svg>
                  เข้าสู่ระบบด้วย Facebook
                </Button>
              </div>
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
