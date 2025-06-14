
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UsersTable } from './UsersTable';
import { UserEditDialog } from './UserEditDialog';
import { UserProfile } from './AdminUsersTypes';
import { z } from 'zod';

const userFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลผู้ใช้จาก profiles รวมถึง role
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
      
      // ดึงข้อมูลอีเมลจาก auth.users (ต้องใช้ admin policy ใน database)
      const { data: userData, error: userError } = await (supabase as any).auth.admin.listUsers();
      
      const emailMap: Record<string, string> = {};
      if (userData?.users) {
        userData.users.forEach((user: any) => {
          emailMap[user.id] = user.email;
        });
      }
      
      // รวมข้อมูลจาก profiles และอีเมล
      const enhancedProfiles: UserProfile[] = profilesData.map(profile => ({
        ...profile,
        is_admin: profile.role === 'admin',
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

  // เปลี่ยนสถานะ admin
  const toggleAdminStatus = async (user: UserProfile) => {
    try {
      const newRole = user.is_admin ? 'user' : 'admin';
      
      // อัปเดต role ในตาราง profiles
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
          
      if (error) throw error;
      
      // อัปเดตสถานะในสเตท
      setUsers(prev => 
        prev.map(u => u.id === user.id ? { ...u, is_admin: newRole === 'admin', role: newRole } : u)
      );
      
      toast({
        title: "สำเร็จ",
        description: newRole === 'admin' 
          ? `กำหนดสิทธิ์แอดมินให้ ${user.full_name || 'ผู้ใช้'} แล้ว`
          : `ถอดสิทธิ์แอดมินจาก ${user.full_name || 'ผู้ใช้'} แล้ว`
      });
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
      <UsersTable 
        users={users}
        onToggleAdmin={toggleAdminStatus}
        onEditUser={openEditDialog}
      />

      <UserEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedUser={selectedUser}
        onSaveUser={handleEditUser}
      />
    </div>
  );
}
