
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { PasswordChangeDialog } from '@/components/profile/PasswordChangeDialog';
import { EcoPointsCard } from '@/components/profile/EcoPointsCard';
import { PointLogsCard } from '@/components/points/PointLogsCard';

export function UserProfile() {
  const { user, profile } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

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
            <ProfileHeader 
              fullName={profile.full_name} 
              email={user.email} 
              avatarUrl={profile.avatar_url}
              userId={user.id}
            />
          </CardHeader>
          
          <CardContent>
            <ProfileForm 
              userId={user.id}
              initialFullName={profile.full_name}
              initialEmail={user.email}
              onPasswordDialogOpen={() => setIsPasswordDialogOpen(true)}
            />
          </CardContent>
        </Card>
        
        <Card>
          <EcoPointsCard points={profile.eco_points || 0} />
        </Card>
        
        <PointLogsCard />
      </div>
      
      <PasswordChangeDialog 
        isOpen={isPasswordDialogOpen} 
        onOpenChange={setIsPasswordDialogOpen} 
        userEmail={user.email}
      />
    </div>
  );
}
