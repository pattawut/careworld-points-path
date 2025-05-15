
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !password) {
      toast({
        variant: "destructive",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกชื่อ อีเมล และรหัสผ่าน",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "รหัสผ่านไม่ตรงกัน",
        description: "กรุณาตรวจสอบรหัสผ่านของคุณอีกครั้ง",
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: "กรุณายอมรับข้อกำหนด",
        description: "คุณต้องยอมรับข้อกำหนดและเงื่อนไขการใช้งาน",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error, success } = await signUp(email, password, name);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "สมัครสมาชิกไม่สำเร็จ",
          description: error,
        });
        return;
      }
      
      if (success) {
        toast({
          title: "สมัครสมาชิกสำเร็จ",
          description: "ยินดีต้อนรับเข้าสู่โครงการ CareWorld รักษ์โลก",
        });
        navigate('/dashboard');
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "สมัครสมาชิกไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-eco-light">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-eco-teal mb-4">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-center text-3xl font-bold text-eco-blue">
              สมัครสมาชิก
            </h2>
            <p className="mt-2 text-center text-gray-600">
              เริ่มต้นการเป็นส่วนหนึ่งของโครงการ CareWorld รักษ์โลก
            </p>
          </div>
          
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">สร้างบัญชีผู้ใช้</CardTitle>
              <CardDescription>กรอกข้อมูลด้านล่างเพื่อสมัครสมาชิก</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="name"
                    placeholder="สมชาย ใจดี"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    ฉันยอมรับ{' '}
                    <Link
                      to="/terms"
                      className="font-medium text-eco-teal hover:text-eco-blue transition-colors"
                    >
                      ข้อกำหนดและเงื่อนไข
                    </Link>
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-eco-gradient hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-center text-sm text-gray-600 w-full">
                มีบัญชีอยู่แล้ว?{' '}
                <Link
                  to="/login"
                  className="font-medium text-eco-teal hover:text-eco-blue transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
