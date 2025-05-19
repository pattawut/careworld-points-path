
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  eco_points: number;
};

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (currentSession?.user) {
          setTimeout(async () => {
            await fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as Profile);
        console.log("Profile data fetched:", data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const createAdminRole = async (userId: string) => {
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

  const signUp = async (email: string, password: string, fullName: string, isAdmin = false) => {
    try {
      console.log("Signing up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: fullName,
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        return { error: error.message, success: false };
      }

      // Success but needs email verification
      if (data.user && !data.session) {
        console.log("User created but needs email verification");
        return { 
          error: null, 
          success: true 
        };
      }

      // Auto sign in (if email verification is disabled)
      if (data.session && data.user) {
        console.log("User signed up and logged in automatically");
        setSession(data.session);
        setUser(data.user);
        
        // If this is meant to be an admin, create the admin role
        if (isAdmin) {
          const adminCreated = await createAdminRole(data.user.id);
          if (!adminCreated) {
            return { 
              error: "สมัครสมาชิกสำเร็จ แต่ไม่สามารถกำหนดสิทธิ์แอดมินได้", 
              success: true 
            };
          }
        }
        
        return { error: null, success: true };
      }

      return { error: null, success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง', 
        success: false 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        return { error: error.message, success: false };
      }

      console.log("User logged in successfully");
      setSession(data.session);
      setUser(data.user);
      
      // Fetch user profile
      if (data.user) {
        fetchProfile(data.user.id);
      }
      
      return { error: null, success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        error: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง', 
        success: false 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
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

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
