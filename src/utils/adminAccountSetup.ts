
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const createAdminAccount = async () => {
  try {
    console.log("Checking for admin account...");
    
    // Check if admin user exists
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
      
    if (userCheckError) {
      console.error('Error checking admin roles:', userCheckError);
      return;
    }
    
    if (!existingUsers || existingUsers.length === 0) {
      console.log('No admin found, creating default admin account');
      
      // Check if the admin email already exists as a user
      const adminEmail = 'admin@gmail.com';
      
      // Try to sign in with admin credentials to check if account exists
      const { data: signInCheck, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: '@Test1234'
      });
      
      // If sign in fails with auth/user-not-found, create the admin user
      if (signInError) {
        console.log('Admin account does not exist, creating it');
        
        const adminPassword = '@Test1234';
        const adminName = 'System Administrator';
        
        console.log('Creating admin account with email:', adminEmail);
        
        // Create admin user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
          options: {
            data: {
              name: adminName,
            }
          }
        });
        
        if (signUpError) {
          console.error('Error creating admin account:', signUpError);
          return;
        }
        
        // If admin user was created, create role
        if (signUpData?.user) {
          console.log('Admin user created, creating admin role for:', signUpData.user.id);
          
          // Create admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: signUpData.user.id,
              role: 'admin'
            });
            
          if (roleError) {
            console.error('Error creating admin role:', roleError);
            return;
          }
          
          toast({
            title: "บัญชีแอดมินถูกสร้างขึ้น",
            description: "บัญชีแอดมินถูกสร้างขึ้นเรียบร้อยแล้ว (admin@gmail.com)",
          });
        }
      } else if (signInCheck?.user) {
        // User exists but might not have admin role
        console.log('Admin user exists, checking for admin role');
        
        // Check if the user has the admin role
        const { data: hasAdminRole, error: roleCheckError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', signInCheck.user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (roleCheckError) {
          console.error('Error checking admin role:', roleCheckError);
          return;
        }
        
        // If the user doesn't have the admin role, add it
        if (!hasAdminRole) {
          const { error: roleInsertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: signInCheck.user.id,
              role: 'admin'
            });
            
          if (roleInsertError) {
            console.error('Error adding admin role:', roleInsertError);
            return;
          }
          
          toast({
            title: "บัญชีแอดมินถูกอัปเดต",
            description: "บัญชี admin@gmail.com ได้รับสิทธิ์แอดมินแล้ว",
          });
        }
      }
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error setting up admin account:', error);
  }
};
