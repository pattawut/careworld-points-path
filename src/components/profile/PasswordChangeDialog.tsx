
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

type PasswordChangeDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string | undefined;
};

export function PasswordChangeDialog({ isOpen, onOpenChange, userEmail }: PasswordChangeDialogProps) {
  const { toast } = useToast();
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updatePassword = async (values: PasswordFormValues) => {
    try {
      // 1. เช็ครหัสผ่านปัจจุบัน (ต้องเข้าสู่ระบบใหม่เพื่อตรวจสอบ)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail || '',
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
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนรหัสผ่านได้",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                ยกเลิก
              </Button>
              <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
