
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  title: string;
  activity_type: string;
}

interface ActivityTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

export const ActivityTypeSelector = ({ value, onChange, isDisabled = false }: ActivityTypeSelectorProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, title, activity_type')
          .in('status', ['active', 'promoted'])
          .not('activity_type', 'is', null)
          .is('user_id', null)
          .order('title');

        if (error) throw error;
        
        console.log('Fetched campaigns for activity selector:', data);
        setCampaigns(data || []);
      } catch (error) {
        console.error('Error fetching active campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">ประเภทกิจกรรม</label>
        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">ประเภทกิจกรรม</label>
        <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-500">
          ไม่มีแคมเปญที่เปิดใช้งาน
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor="activityType" className="text-sm font-medium">
        ประเภทกิจกรรม
      </label>
      <select 
        id="activityType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        disabled={isDisabled}
      >
        <option value="">เลือกประเภทกิจกรรม</option>
        {campaigns.map((campaign) => (
          <option key={campaign.id} value={campaign.activity_type}>
            {campaign.title}
          </option>
        ))}
      </select>
    </div>
  );
};
