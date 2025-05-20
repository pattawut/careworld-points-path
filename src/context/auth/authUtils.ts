
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Profile } from './types';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (data) {
      console.log("Profile data fetched:", data);
      return data as Profile;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const createAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (error) {
      console.error('Error creating admin role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating admin role:', error);
    return false;
  }
};

export const handleSignOut = async (navigate: Function): Promise<void> => {
  try {
    console.log("Signing out user");
    await supabase.auth.signOut();
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    toast({
      variant: "destructive",
      title: "ออกจากระบบไม่สำเร็จ",
      description: "กรุณาลองใหม่อีกครั้ง",
    });
  }
};
