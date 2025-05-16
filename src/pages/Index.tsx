
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { RecentActivities } from '@/components/home/RecentActivities';
import { Campaigns } from '@/components/home/Campaigns';
import { Stats } from '@/components/home/Stats';
import { LeaderboardPreview } from '@/components/home/LeaderboardPreview';
import { CallToAction } from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <RecentActivities />
        <Campaigns />
        <Stats />
        <LeaderboardPreview />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
