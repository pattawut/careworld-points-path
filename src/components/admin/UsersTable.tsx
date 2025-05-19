
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { UserTableRow } from './UserTableRow';
import { UserProfile } from './AdminUsersTypes';
import { useState } from 'react';

type UsersTableProps = {
  users: UserProfile[];
  onToggleAdmin: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
};

export function UsersTable({ users, onToggleAdmin, onEditUser }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // กรองข้อมูลผู้ใช้ตามคำค้นหา
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      (user.full_name && user.full_name.toLowerCase().includes(searchString)) ||
      (user.email && user.email.toLowerCase().includes(searchString)) ||
      (user.id.toLowerCase().includes(searchString))
    );
  });

  return (
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
                  <UserTableRow 
                    key={user.id} 
                    user={user} 
                    onToggleAdmin={onToggleAdmin} 
                    onEditUser={onEditUser} 
                  />
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
  );
}
