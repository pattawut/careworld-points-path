
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardDescription, CardTitle } from '@/components/ui/card';

type ProfileHeaderProps = {
  fullName: string | null;
  email: string | undefined;
  avatarUrl: string | null;
};

export function ProfileHeader({ fullName, email, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="text-lg">{fullName?.charAt(0) || '?'}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{fullName}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </div>
    </div>
  );
}
