
import { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  eco_points: number;
  role?: string | null;
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, isAdmin?: boolean) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: string | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};
