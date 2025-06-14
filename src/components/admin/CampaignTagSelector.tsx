
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface CampaignTagSelectorProps {
  campaignId?: string;
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export const CampaignTagSelector = ({ campaignId, selectedTags, onTagsChange }: CampaignTagSelectorProps) => {
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaign_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลด tag ได้"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Tag กิจกรรม</Label>
        <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  const selectedTagObjects = availableTags.filter(tag => selectedTags.includes(tag.id));
  const unselectedTags = availableTags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-4">
      <Label>Tag กิจกรรม</Label>
      
      {/* Selected Tags */}
      {selectedTagObjects.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Tag ที่เลือก:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color }}
                className="border flex items-center gap-1"
              >
                {tag.name}
                <X
                  className="h-3 w-3 cursor-pointer hover:bg-red-100 rounded"
                  onClick={() => removeTag(tag.id)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      {unselectedTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">เลือก Tag:</Label>
          <div className="flex flex-wrap gap-2">
            {unselectedTags.map((tag) => (
              <Button
                key={tag.id}
                variant="outline"
                size="sm"
                onClick={() => handleTagToggle(tag.id)}
                style={{ borderColor: tag.color, color: tag.color }}
                className="hover:bg-opacity-10"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTags.length === 0 && (
        <p className="text-sm text-gray-500">กรุณาเลือกอย่างน้อย 1 tag สำหรับกิจกรรม</p>
      )}
    </div>
  );
};
