
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ParticipationForm } from './participation/ParticipationForm';
import { ParticipationStatus } from './participation/ParticipationStatus';
import { useParticipationSubmission } from './participation/useParticipationSubmission';

type Campaign = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  points: number;
  start_date: string | null;
  end_date: string | null;
  status: string;
  activity_type: string | null;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

interface CampaignParticipationProps {
  campaign: Campaign;
  userHasParticipated: boolean;
  onParticipationSuccess: () => void;
}

export const CampaignParticipation = ({ 
  campaign, 
  userHasParticipated, 
  onParticipationSuccess 
}: CampaignParticipationProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { submitParticipation } = useParticipationSubmission(campaign, onParticipationSuccess);

  const handleSubmit = async (file: File | null, description: string, quantity: number) => {
    setSubmitting(true);
    try {
      await submitParticipation(file, description, quantity);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-eco-blue">ร่วมกิจกรรม</CardTitle>
        <CardDescription>
          อัปโหลดรูปภาพและแชร์ประสบการณ์การทำกิจกรรมรักษ์โลกของคุณ
          <br />
          <span className="text-eco-teal font-medium">
            คุณสามารถเข้าร่วมกิจกรรมนี้ได้หลายครั้งเพื่อสะสมคะแนน
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ParticipationForm
          onSubmit={handleSubmit}
          isSubmitting={submitting}
          campaignPoints={campaign.points}
        />
        
        <ParticipationStatus userHasParticipated={userHasParticipated} />
      </CardContent>
    </Card>
  );
};
