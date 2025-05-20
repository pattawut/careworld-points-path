
import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from './AuthContext';
import { Profile, AuthContextType } from './types';
import { fetchProfile, createAdminRole, handleSignOut } from './authUtils';

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
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
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
        fetchProfile(currentSession.user.id).then(profileData => {
          setProfile(profileData);
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
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
    await handleSignOut(navigate);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value: AuthContextType = {
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
