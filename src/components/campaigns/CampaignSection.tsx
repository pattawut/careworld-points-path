
import { Card, CardContent } from '@/components/ui/card';
import { CampaignCard } from './CampaignCard';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  points: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface CampaignSectionProps {
  title: string;
  subtitle: string;
  campaigns: Campaign[];
  loading: boolean;
  emptyMessage: string;
}

export const CampaignSection = ({ 
  title, 
  subtitle, 
  campaigns, 
  loading, 
  emptyMessage 
}: CampaignSectionProps) => {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-eco-blue mb-3">
          {title}
        </h2>
        <p className="text-gray-600">
          {subtitle}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}

      {!loading && campaigns.length === 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">{emptyMessage}</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
