
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/context/AuthContext';

// Schema for profile form
const profileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  }),
  email: z.string().email({
    message: "อีเมลไม่ถูกต้อง",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileFormProps = {
  userId: string;
  initialFullName: string | null;
  initialEmail: string | undefined;
  onPasswordDialogOpen: () => void;
};

export function ProfileForm({ userId, initialFullName, initialEmail, onPasswordDialogOpen }: ProfileFormProps) {
  const { toast } = useToast();
  const auth = useAuth();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: initialFullName || '',
      email: initialEmail || '',
    },
  });

  const updateProfile = async (values: ProfileFormValues) => {
    if (!userId) return;
    
    try {
      // 1. อัปเดตข้อมูลในตาราง profiles (ไม่รวม email)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // 2. อัปเดตอีเมลหากมีการเปลี่ยนแปลง
      if (values.email !== initialEmail) {
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

      // Force refresh profile data
      if (auth.user) {
        // Create a brief delay to allow the update to complete
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้",
      });
    }
  };

  return (
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
            onClick={onPasswordDialogOpen}
          >
            เปลี่ยนรหัสผ่าน
          </Button>
          <Button type="submit" className="bg-eco-gradient">บันทึกข้อมูล</Button>
        </div>
      </form>
    </Form>
  );
}
