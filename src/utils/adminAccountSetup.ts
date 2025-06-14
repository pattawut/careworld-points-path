
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const createAdminAccount = async () => {
  try {
    console.log("Checking for admin account...");
    
    // Check if admin user exists by checking profiles table
    const { data: existingAdmins, error: adminCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');
      
    if (adminCheckError) {
      console.error('Error checking admin roles:', adminCheckError);
      return;
    }
    
    if (!existingAdmins || existingAdmins.length === 0) {
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
        
        // If admin user was created, update role in profiles
        if (signUpData?.user) {
          console.log('Admin user created, updating role for:', signUpData.user.id);
          
          // Update role in profiles table
          const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', signUpData.user.id);
            
          if (roleError) {
            console.error('Error setting admin role:', roleError);
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
        
        // Check if the user has the admin role in profiles
        const { data: userProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', signInCheck.user.id)
          .maybeSingle();
          
        if (profileCheckError) {
          console.error('Error checking admin role:', profileCheckError);
          return;
        }
        
        // If the user doesn't have the admin role, add it
        if (!userProfile || userProfile.role !== 'admin') {
          const { error: roleUpdateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', signInCheck.user.id);
            
          if (roleUpdateError) {
            console.error('Error updating admin role:', roleUpdateError);
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
