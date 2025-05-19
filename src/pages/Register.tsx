
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  
  // ถ้ามีการ login อยู่แล้ว ให้ redirect ไปที่หน้า dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fullName || !email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    
    try {
      setLoading(true);
      
      // ตรวจสอบว่าเป็นผู้ใช้ admin หรือไม่
      const isAdminUser = email === 'admin@example.com' || fullName === 'user admin';

      // ทำการลงทะเบียนผู้ใช้
      const { success, error } = await signUp(email, password, fullName);
      
      if (error) {
        setError(error);
        return;
      }
      
      if (success) {
        // ถ้าเป็นผู้ใช้ admin ให้ลงทะเบียนเป็น admin
        if (isAdminUser) {
          try {
            // ดึง user data ล่าสุด (ในกรณีที่มีการยืนยันอีเมลอยู่แล้ว)
            const { data: { user } } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (user) {
              // เพิ่มบทบาท admin
              await (supabase as any)
                .from('user_roles')
                .insert({
                  user_id: user.id,
                  role: 'admin'
                });
            }
          } catch (err) {
            console.error("Error setting admin role:", err);
          }
        }
        
        toast({
          title: "การลงทะเบียนสำเร็จ!",
          description: "บัญชีผู้ใช้ถูกสร้างแล้ว คุณสามารถเข้าสู่ระบบได้ทันที",
        });
      }
    } catch (err) {
      console.error("Register error:", err);
      setError('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 bg-eco-light">
        <div className="mx-auto w-full max-w-md px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-eco-blue">สร้างบัญชีผู้ใช้</h1>
              <p className="text-gray-500 mt-2">เริ่มต้นการเดินทางสู่การใช้ชีวิตที่เป็นมิตรกับสิ่งแวดล้อม</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded flex items-start gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="อีเมล"
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
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6 bg-eco-gradient"
                disabled={loading}
              >
                {loading ? "กำลังดำเนินการ..." : "สมัครสมาชิก"}
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  มีบัญชีอยู่แล้ว? <Link to="/login" className="text-eco-blue hover:underline">เข้าสู่ระบบ</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
