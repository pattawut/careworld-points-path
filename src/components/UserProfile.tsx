
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

// Schema for profile form
const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
  email: z.string().email({
    message: "อีเมลไม่ถูกต้อง",
  }),
});

// Schema for password form
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
  }),
  newPassword: z.string().min(8, {
    message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
  }),
  confirmPassword: z.string().min(8, {
    message: "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function UserProfile() {
  const { user, profile } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updateProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      // 1. อัปเดตข้อมูลในตาราง profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // 2. อัปเดตอีเมลหากมีการเปลี่ยนแปลง
      if (values.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });
        
        if (emailError) throw emailError;
        
        toast({
          title: "ส่งอีเมลยืนยันแล้ว",
          description: "โปรดตรวจสอบอีเมลของคุณเพื่อยืนยันการเปลี่ยนแปลง",
        });
      }
      
      toast({
        title: "อัปเดตข้อมูลสำเร็จ",
        description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตแล้ว",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้",
      });
    }
  };

  const updatePassword = async (values: PasswordFormValues) => {
    try {
      // 1. เช็ครหัสผ่านปัจจุบัน (ต้องเข้าสู่ระบบใหม่เพื่อตรวจสอบ)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: values.currentPassword,
      });
      
      if (signInError) {
        toast({
          variant: "destructive", 
          title: "รหัสผ่านปัจจุบันไม่ถูกต้อง",
          description: "โปรดตรวจสอบรหัสผ่านปัจจุบันของคุณ",
        });
        return;
      }
      
      // 2. อัปเดตรหัสผ่านใหม่
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        description: "รหัสผ่านของคุณถูกอัปเดตแล้ว",
      });
      
      // ล้างฟอร์มและปิด dialog
      passwordForm.reset();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
      });
    }
  };

  if (!user || !profile) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-eco-blue mb-6">ข้อมูลส่วนตัว</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-lg">{profile.full_name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile.full_name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ-นามสกุล</FormLabel>
                      <FormControl>
                        <Input placeholder="ชื่อ-นามสกุล" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="อีเมล" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPasswordDialogOpen(true)}
                  >
                    เปลี่ยนรหัสผ่าน
                  </Button>
                  <Button type="submit" className="bg-eco-gradient">บันทึกข้อมูล</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>คะแนนสะสม</CardTitle>
            <CardDescription>คะแนนสะสมจากกิจกรรมด้านสิ่งแวดล้อม</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-eco-teal">{profile.eco_points || 0}</p>
                <p className="text-sm text-gray-500 mt-2">คะแนน ECO</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog for password change */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
            <DialogDescription>
              กรอกรหัสผ่านปัจจุบันและรหัสผ่านใหม่ของคุณ
            </DialogDescription>
          </DialogHeader>
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่านปัจจุบัน</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="รหัสผ่านปัจจุบัน" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่านใหม่</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="รหัสผ่านใหม่" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ยืนยันรหัสผ่านใหม่</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="ยืนยันรหัสผ่านใหม่" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                  ยกเลิก
                </Button>
                <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
