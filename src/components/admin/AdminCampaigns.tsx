
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// กำหนด type สำหรับข้อมูลแคมเปญ
type Campaign = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  // ข้อมูลสำหรับฟอร์มสร้าง/แก้ไขแคมเปญ
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { toast } = useToast();
  
  // โหลดแคมเปญ
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        // เนื่องจาก types ยังไม่ถูกอัปเดต เราจำเป็นต้องใช้ any ชั่วคราว
        const { data, error } = await (supabase as any)
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // แปลงข้อมูลให้เป็นรูปแบบ Campaign[]
        setCampaigns(data as Campaign[]);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลแคมเปญได้"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [toast]);
  
  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setStatus('upcoming');
    setStartDate(undefined);
    setEndDate(undefined);
    setEditingCampaign(null);
  };
  
  // เตรียมข้อมูลสำหรับแก้ไข
  const prepareEdit = (campaign: Campaign) => {
    setTitle(campaign.title);
    setDescription(campaign.description || '');
    setImageUrl(campaign.image_url || '');
    setStatus(campaign.status);
    if (campaign.start_date) setStartDate(new Date(campaign.start_date));
    if (campaign.end_date) setEndDate(new Date(campaign.end_date));
    setEditingCampaign(campaign);
    setIsAddingCampaign(true);
  };
  
  // บันทึกแคมเปญ
  const saveCampaign = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "กรุณากรอกชื่อแคมเปญ",
        description: "ชื่อแคมเปญจำเป็นต้องระบุ"
      });
      return;
    }
    
    try {
      const campaignData = {
        title,
        description: description || null,
        image_url: imageUrl || null,
        status,
        start_date: startDate ? startDate.toISOString() : null,
        end_date: endDate ? endDate.toISOString() : null
      };
      
      let result;
      
      if (editingCampaign) {
        // อัปเดตแคมเปญ
        const { data, error } = await (supabase as any)
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id)
          .select();
          
        if (error) throw error;
        result = data;
        
        // อัปเดตข้อมูลในสเตท
        setCampaigns(prev => 
          prev.map(c => c.id === editingCampaign.id ? { ...c, ...campaignData } : c)
        );
        
        toast({
          title: "อัปเดตแคมเปญสำเร็จ",
          description: `แคมเปญ "${title}" ได้รับการอัปเดตแล้ว`
        });
      } else {
        // สร้างแคมเปญใหม่
        const { data, error } = await (supabase as any)
          .from('campaigns')
          .insert(campaignData)
          .select();
          
        if (error) throw error;
        result = data;
        
        // เพิ่มข้อมูลในสเตท
        if (data && data.length > 0) {
          setCampaigns(prev => [data[0] as Campaign, ...prev]);
        }
        
        toast({
          title: "สร้างแคมเปญสำเร็จ",
          description: `แคมเปญ "${title}" ได้ถูกสร้างแล้ว`
        });
      }
      
      // รีเซ็ตฟอร์มและปิด
      resetForm();
      setIsAddingCampaign(false);
      
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกแคมเปญได้"
      });
    }
  };
  
  // ลบแคมเปญ
  const deleteCampaign = async (id: string, title: string) => {
    if (!window.confirm(`คุณแน่ใจที่จะลบแคมเปญ "${title}" หรือไม่?`)) {
      return;
    }
    
    try {
      const { error } = await (supabase as any)
        .from('campaigns')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // อัปเดตสเตท
      setCampaigns(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "ลบแคมเปญสำเร็จ",
        description: `แคมเปญ "${title}" ได้ถูกลบแล้ว`
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบแคมเปญได้"
      });
    }
  };
  
  // ฟังก์ชันแสดงสถานะแคมเปญ
  const renderStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">กำลังดำเนินการ</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-gray-500">สิ้นสุดแล้ว</Badge>;
      case 'upcoming':
      default:
        return <Badge className="bg-blue-500">กำลังจะมาถึง</Badge>;
    }
  };
  
  // แสดงวันที่ในรูปแบบที่อ่านง่าย
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return format(new Date(dateStr), 'PPP', { locale: th });
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-500">กำลังโหลดข้อมูลแคมเปญ...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-eco-blue">แคมเปญทั้งหมด</h2>
        <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
          <DialogTrigger asChild>
            <Button className="bg-eco-gradient">
              <PlusCircle className="h-4 w-4 mr-2" />
              สร้างแคมเปญใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingCampaign ? 'แก้ไขแคมเปญ' : 'สร้างแคมเปญใหม่'}</DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'แก้ไขรายละเอียดแคมเปญด้านล่าง' : 'กรอกข้อมูลเพื่อสร้างแคมเปญใหม่'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">ชื่อแคมเปญ *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ชื่อแคมเปญ"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">รายละเอียด</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="รายละเอียดแคมเปญ"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">URL รูปภาพ</Label>
                <Input
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">สถานะ</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="upcoming">กำลังจะมาถึง</option>
                  <option value="active">กำลังดำเนินการ</option>
                  <option value="completed">สิ้นสุดแล้ว</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>วันที่เริ่มต้น</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!startDate && 'text-muted-foreground'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP', { locale: th }) : <span>เลือกวันที่</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label>วันที่สิ้นสุด</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!endDate && 'text-muted-foreground'}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP', { locale: th }) : <span>เลือกวันที่</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                resetForm();
                setIsAddingCampaign(false);
              }}>
                ยกเลิก
              </Button>
              <Button className="bg-eco-gradient" onClick={saveCampaign}>
                {editingCampaign ? 'บันทึกการแก้ไข' : 'สร้างแคมเปญ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">ยังไม่มีแคมเปญ</p>
          <Button 
            className="mt-4 bg-eco-gradient"
            onClick={() => setIsAddingCampaign(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            สร้างแคมเปญแรก
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
              {campaign.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={campaign.image_url} 
                    alt={campaign.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-eco-blue">{campaign.title}</CardTitle>
                    <CardDescription>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</CardDescription>
                  </div>
                  <div>
                    {renderStatus(campaign.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-2">{campaign.description || 'ไม่มีรายละเอียด'}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white"
                  onClick={() => prepareEdit(campaign)}
                >
                  <Edit className="h-4 w-4 mr-2" /> แก้ไข
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => deleteCampaign(campaign.id, campaign.title)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> ลบ
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
