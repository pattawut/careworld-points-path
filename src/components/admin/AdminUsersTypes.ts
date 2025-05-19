
export type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  eco_points: number;
  created_at: string;
  is_admin: boolean;
  email?: string;
};
