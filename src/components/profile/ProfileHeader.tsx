
import { useState } from 'react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from './AvatarUpload';

type ProfileHeaderProps = {
  fullName: string | null;
  email: string | undefined;
  avatarUrl: string | null;
  userId: string;
};

export function ProfileHeader({ fullName, email, avatarUrl, userId }: ProfileHeaderProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setCurrentAvatarUrl(newAvatarUrl);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <AvatarUpload
        userId={userId}
        currentAvatarUrl={currentAvatarUrl}
        userFullName={fullName}
        onAvatarUpdate={handleAvatarUpdate}
      />
      <div className="text-center md:text-left">
        <CardTitle className="text-xl">{fullName}</CardTitle>
        <CardDescription className="text-base">{email}</CardDescription>
      </div>
    </div>
  );
}
