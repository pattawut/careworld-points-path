
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { UserProfile } from './AdminUsersTypes';

type UserTableRowProps = {
  user: UserProfile;
  onToggleAdmin: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
};

export function UserTableRow({ user, onToggleAdmin, onEditUser }: UserTableRowProps) {
  // แปลงเวลาเป็นรูปแบบที่อ่านง่าย
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'PPP', { locale: th });
  };

  return (
    <tr className="border-b hover:bg-gray-50">
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
            onClick={() => onEditUser(user)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            แก้ไข
          </Button>
          <Button
            size="sm"
            variant={user.is_admin ? "destructive" : "outline"}
            className={!user.is_admin ? "border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white" : ""}
            onClick={() => onToggleAdmin(user)}
          >
            <Shield className="h-4 w-4 mr-2" />
            {user.is_admin ? 'ยกเลิกแอดมิน' : 'ตั้งเป็นแอดมิน'}
          </Button>
        </div>
      </td>
    </tr>
  );
}
