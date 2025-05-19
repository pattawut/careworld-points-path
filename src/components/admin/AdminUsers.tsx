
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, ShieldCheck, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  eco_points: number;
  created_at: string;
  is_admin: boolean;
  email?: string;
};

// Schema for user edit form
const userFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
  email: z.string().email({
    message: "อีเมลไม่ถูกต้อง",
  }).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: '',
    },
  });
  
  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลผู้ใช้จาก profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profilesError) throw profilesError;
      
      if (!profilesData) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // ดึงข้อมูล admin จาก user_roles
      const { data: rolesData, error: rolesError } = await (supabase as any)
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'admin');
        
      if (rolesError) throw rolesError;
      
      // สร้าง map ของ admin users
      const adminMap: Record<string, boolean> = {};
      if (rolesData) {
        rolesData.forEach((role: any) => {
          adminMap[role.user_id] = true;
        });
      }
      
      // ดึงข้อมูลอีเมลจาก auth.users (ต้องใช้ admin policy ใน database)
      const { data: userData, error: userError } = await (supabase as any).auth.admin.listUsers();
      
      const emailMap: Record<string, string> = {};
      if (userData?.users) {
        userData.users.forEach((user: any) => {
          emailMap[user.id] = user.email;
        });
      }
      
      // รวมข้อมูลจาก profiles และ admin status
      const enhancedProfiles: UserProfile[] = profilesData.map(profile => ({
        ...profile,
        is_admin: !!adminMap[profile.id],
        email: emailMap[profile.id]
      }));
      
      setUsers(enhancedProfiles);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // กรองข้อมูลผู้ใช้ตามคำค้นหา
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      (user.full_name && user.full_name.toLowerCase().includes(searchString)) ||
      (user.email && user.email.toLowerCase().includes(searchString)) ||
      (user.id.toLowerCase().includes(searchString))
    );
  });
  
  // เปลี่ยนสถานะ admin
  const toggleAdminStatus = async (user: UserProfile) => {
    try {
      if (user.is_admin) {
        // ถอดบทบาท admin
        const { error } = await (supabase as any)
          .from('user_roles')
          .delete()
          .eq('user_id', user.id)
          .eq('role', 'admin');
          
        if (error) throw error;
        
        // อัปเดตสถานะในสเตท
        setUsers(prev => 
          prev.map(u => u.id === user.id ? { ...u, is_admin: false } : u)
        );
        
        toast({
          title: "สำเร็จ",
          description: `ถอดสิทธิ์แอดมินจาก ${user.full_name || 'ผู้ใช้'} แล้ว`
        });
      } else {
        // เพิ่มบทบาท admin
        const { error } = await (supabase as any)
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin'
          });
          
        if (error) throw error;
        
        // อัปเดตสถานะในสเตท
        setUsers(prev => 
          prev.map(u => u.id === user.id ? { ...u, is_admin: true } : u)
        );
        
        toast({
          title: "สำเร็จ",
          description: `กำหนดสิทธิ์แอดมินให้ ${user.full_name || 'ผู้ใช้'} แล้ว`
        });
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนแปลงสถานะแอดมินได้"
      });
    }
  };

  // เปิด dialog แก้ไขข้อมูลผู้ใช้
  const openEditDialog = (user: UserProfile) => {
    setSelectedUser(user);
    form.reset({
      full_name: user.full_name || '',
    });
    setIsEditDialogOpen(true);
  };

  // บันทึกข้อมูลผู้ใช้ที่แก้ไข
  const handleEditUser = async (values: UserFormValues) => {
    if (!selectedUser) return;
    
    try {
      // อัปเดตข้อมูลใน profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
        })
        .eq('id', selectedUser.id);
      
      if (profileError) throw profileError;
      
      // อัปเดตข้อมูลในสเตท
      setUsers(prev =>
        prev.map(u => u.id === selectedUser.id ? { ...u, full_name: values.full_name } : u)
      );
      
      toast({
        title: "สำเร็จ",
        description: `อัปเดตข้อมูลของ ${values.full_name} แล้ว`
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้"
      });
    }
  };
  
  // แปลงเวลาเป็นรูปแบบที่อ่านง่าย
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP', { locale: th });
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-500">กำลังโหลดข้อมูลผู้ใช้...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>จัดการผู้ใช้งานระบบ</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาผู้ใช้..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ผู้ใช้</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ID</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">คะแนน</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">วันที่สมัคร</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">สถานะ</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.full_name?.charAt(0) || '?'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-eco-blue">{user.full_name || 'ไม่ระบุชื่อ'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-500">{user.id.substring(0, 8)}...</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="bg-eco-light text-eco-blue">
                          {user.eco_points || 0}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {user.is_admin ? (
                          <Badge className="bg-eco-blue">
                            <ShieldCheck className="h-3 w-3 mr-1" /> แอดมิน
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            ผู้ใช้ทั่วไป
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            แก้ไข
                          </Button>
                          <Button
                            size="sm"
                            variant={user.is_admin ? "destructive" : "outline"}
                            className={!user.is_admin ? "border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white" : ""}
                            onClick={() => toggleAdminStatus(user)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            {user.is_admin ? 'ยกเลิกแอดมิน' : 'ตั้งเป็นแอดมิน'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      {searchTerm 
                        ? 'ไม่พบผู้ใช้ที่ตรงกับการค้นหา' 
                        : 'ไม่มีข้อมูลผู้ใช้ในระบบ'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog สำหรับแก้ไขข้อมูลผู้ใช้ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลของผู้ใช้งาน อัปเดตข้อมูลและกดบันทึกเมื่อเสร็จสิ้น
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditUser)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input placeholder="ชื่อผู้ใช้" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
