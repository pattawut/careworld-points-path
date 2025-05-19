
import React, { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile } from './AdminUsersTypes';

// Schema for user edit form
const userFormSchema = z.object({
  full_name: z.string().min(2, {
    message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร",
  })
});

type UserFormValues = z.infer<typeof userFormSchema>;

type UserEditDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: UserProfile | null;
  onSaveUser: (values: UserFormValues) => void;
};

export function UserEditDialog({ isOpen, setIsOpen, selectedUser, onSaveUser }: UserEditDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: selectedUser?.full_name || '',
    },
  });

  // Reset form when selected user changes
  useEffect(() => {
    if (selectedUser) {
      form.reset({
        full_name: selectedUser.full_name || '',
      });
    }
  }, [selectedUser, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลของผู้ใช้งาน อัปเดตข้อมูลและกดบันทึกเมื่อเสร็จสิ้น
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSaveUser)} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="submit">บันทึก</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
