
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-eco-light">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
