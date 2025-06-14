
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface CampaignTag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const AdminTags = () => {
  const [tags, setTags] = useState<CampaignTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<CampaignTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981'
  });
  const { toast } = useToast();

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaign_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
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

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาใส่ชื่อ tag"
      });
      return;
    }

    try {
      if (editingTag) {
        const { error } = await supabase
          .from('campaign_tags')
          .update({
            name: formData.name,
            color: formData.color
          })
          .eq('id', editingTag.id);

        if (error) throw error;

        toast({
          title: "สำเร็จ!",
          description: "แก้ไข tag เรียบร้อยแล้ว"
        });
      } else {
        const { error } = await supabase
          .from('campaign_tags')
          .insert({
            name: formData.name,
            color: formData.color
          });

        if (error) throw error;

        toast({
          title: "สำเร็จ!",
          description: "เพิ่ม tag เรียบร้อยแล้ว"
        });
      }

      setDialogOpen(false);
      setEditingTag(null);
      setFormData({ name: '', color: '#10B981' });
      fetchTags();
    } catch (error) {
      console.error('Error saving tag:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึก tag ได้"
      });
    }
  };

  const handleEdit = (tag: CampaignTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color || '#10B981'
    });
    setDialogOpen(true);
  };

  const handleDelete = async (tag: CampaignTag) => {
    if (!confirm(`คุณต้องการลบ tag "${tag.name}" หรือไม่?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campaign_tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      toast({
        title: "สำเร็จ!",
        description: "ลบ tag เรียบร้อยแล้ว"
      });

      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบ tag ได้"
      });
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({ name: '', color: '#10B981' });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-eco-teal border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">จัดการ Tag</h3>
          <p className="text-sm text-gray-600">สร้าง แก้ไข และจัดการ tag สำหรับกิจกรรม</p>
        </div>
        <Button onClick={handleCreate} className="bg-eco-gradient">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่ม Tag
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="border-none shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-eco-teal/10 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-eco-teal" />
                  </div>
                  <CardTitle className="text-lg">{tag.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline"
                  style={{ 
                    backgroundColor: tag.color + '20', 
                    color: tag.color, 
                    borderColor: tag.color 
                  }}
                >
                  ตัวอย่าง
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">สี:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <span className="font-medium">{tag.color}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tag)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="border-none shadow-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">ยังไม่มี tag</p>
            <Button onClick={handleCreate} className="bg-eco-gradient">
              เพิ่ม tag แรก
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'แก้ไข Tag' : 'เพิ่ม Tag ใหม่'}
            </DialogTitle>
            <DialogDescription>
              {editingTag ? 'แก้ไขข้อมูล tag' : 'สร้าง tag ใหม่สำหรับกิจกรรม'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ Tag</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="เช่น รีไซเคิล, ลดการใช้"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">สี</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
              <Badge 
                variant="outline"
                style={{ 
                  backgroundColor: formData.color + '20', 
                  color: formData.color, 
                  borderColor: formData.color 
                }}
                className="w-fit"
              >
                {formData.name || 'ตัวอย่าง'}
              </Badge>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" className="bg-eco-gradient">
                {editingTag ? 'บันทึกการแก้ไข' : 'เพิ่ม Tag'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
