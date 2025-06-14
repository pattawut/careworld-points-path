
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

  // Define default activity types in case no campaigns are found
  const defaultActivityTypes = [
    { value: 'recycling', label: 'รีไซเคิล' },
    { value: 'energy_saving', label: 'ประหยัดพลังงาน' },
    { value: 'water_conservation', label: 'อนุรักษ์น้ำ' },
    { value: 'transportation', label: 'การขนส่งสีเขียว' },
    { value: 'waste_reduction', label: 'ลดขยะ' },
    { value: 'tree_planting', label: 'ปลูกต้นไม้' },
    { value: 'community_cleanup', label: 'ทำความสะอาดชุมชน' },
    { value: 'education', label: 'การศึกษา' },
    { value: 'general', label: 'ทั่วไป' }
  ];

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

  // Use campaigns if available, otherwise fall back to default activity types
  const activityOptions = campaigns.length > 0 
    ? campaigns.map(campaign => ({
        value: campaign.activity_type,
        label: campaign.title
      }))
    : defaultActivityTypes;

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
        {activityOptions.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
