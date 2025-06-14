
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth';
import { useCampaignData } from '@/hooks/useCampaignData';
import { CampaignHeader } from '@/components/campaigns/CampaignHeader';
import { CampaignDetails } from '@/components/campaigns/CampaignDetails';
import { CampaignParticipation } from '@/components/campaigns/CampaignParticipation';
import { CampaignGallery } from '@/components/campaigns/CampaignGallery';

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { campaign, loading, userHasParticipated, setUserHasParticipated } = useCampaignData(id, user?.id);

  const handleParticipationSuccess = () => {
    setUserHasParticipated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500">กำลังโหลดข้อมูลแคมเปญ...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return <Navigate to="/campaigns" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-6">
          <CampaignHeader campaign={campaign} />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">รายละเอียด</TabsTrigger>
              <TabsTrigger value="participate">ร่วมกิจกรรม</TabsTrigger>
              <TabsTrigger value="gallery">แกลเลอรี่</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <CampaignDetails campaign={campaign} />
            </TabsContent>
            
            <TabsContent value="participate" className="mt-6">
              <CampaignParticipation 
                campaign={campaign}
                userHasParticipated={userHasParticipated}
                onParticipationSuccess={handleParticipationSuccess}
              />
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-6">
              <CampaignGallery campaignTitle={campaign.title || ''} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
