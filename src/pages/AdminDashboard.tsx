import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AdminCampaigns } from '@/components/admin/AdminCampaigns';
import { AdminUsers } from '@/components/admin/AdminUsers';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }
      
      try {
        // เช็คจาก profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถตรวจสอบสถานะแอดมินได้"
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminStatus();
  }, [user, toast]);
  
  // สร้างบทบาท admin สำหรับผู้ใช้ปัจจุบัน
  const makeCurrentUserAdmin = async () => {
    if (!user) return;
    
    try {
      // อัปเดต role ในตาราง profiles
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "สำเร็จ!",
        description: "คุณได้รับสิทธิ์แอดมินแล้ว กำลังรีโหลดหน้า..."
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error setting admin role:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถกำหนดบทบาทแอดมินได้"
      });
    }
  };
  
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">กำลังตรวจสอบสิทธิ์...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container px-4 md:px-6">
            <Card className="max-w-md mx-auto border-none shadow-lg">
              <CardHeader>
                <CardTitle>ไม่มีสิทธิ์เข้าถึง</CardTitle>
                <CardDescription>
                  คุณไม่มีสิทธิ์เข้าถึงหน้านี้ เนื่องจากต้องมีบทบาทเป็นแอดมิน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-eco-gradient">ขอสิทธิ์แอดมิน</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>กำหนดสิทธิ์แอดมิน</DialogTitle>
                      <DialogDescription>
                        คุณต้องการกำหนดบัญชีนี้เป็นแอดมินหรือไม่? การดำเนินการนี้จะให้สิทธิ์คุณในการจัดการแคมเปญและผู้ใช้ทั้งหมด
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => navigate('/')}>ยกเลิก</Button>
                      <Button className="bg-eco-gradient" onClick={makeCurrentUserAdmin}>ยืนยัน</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">กลับสู่หน้าหลัก</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-eco-blue mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
              <p className="text-gray-600">จัดการแคมเปญและผู้ใช้งานของระบบ</p>
            </div>
            <Button asChild className="mt-4 md:mt-0 bg-eco-gradient">
              <Link to="/dashboard">กลับสู่แดชบอร์ดผู้ใช้</Link>
            </Button>
          </div>
          
          <Tabs defaultValue="campaigns" className="w-full">
            <TabsList className="border-b w-full justify-start rounded-none gap-4 px-0 mb-6">
              <TabsTrigger 
                value="campaigns" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none"
              >
                จัดการกิจกรรม
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none"
              >
                จัดการผู้ใช้
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns">
              <AdminCampaigns />
            </TabsContent>
            
            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
