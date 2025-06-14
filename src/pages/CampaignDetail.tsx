
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActivityImageUpload } from '@/components/activity/ActivityImageUpload';
import { ActivityGallery } from '@/components/ActivityGallery';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, Target, Award } from 'lucide-react';

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

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [userHasParticipated, setUserHasParticipated] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaign();
      if (user) {
        checkUserParticipation();
      }
    }
  }, [id, user]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (campaignError) throw campaignError;

      // Fetch tags for the campaign
      const { data: tagData, error: tagError } = await supabase
        .from('campaign_tag_relations')
        .select(`
          campaign_tags (
            id,
            name,
            color
          )
        `)
        .eq('campaign_id', id);

      if (tagError) {
        console.error('Error fetching tags:', tagError);
      }

      const tags = tagData?.map(relation => relation.campaign_tags).filter(Boolean) || [];
      
      setCampaign({
        ...campaignData,
        tags
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลแคมเปญได้"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserParticipation = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', campaign?.title)
        .limit(1);

      if (error) throw error;

      setUserHasParticipated(data && data.length > 0);
    } catch (error) {
      console.error('Error checking participation:', error);
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || !campaign) {
      toast({
        variant: "destructive",
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "กรุณาเลือกรูปภาพ",
        description: "คุณต้องอัปโหลดรูปภาพเพื่อเข้าร่วมแคมเปญ"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "กรุณาใส่คำอธิบาย",
        description: "คุณต้องใส่คำอธิบายกิจกรรมของคุณ"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${user.id}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(`activities/${fileName}`, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(uploadData.path);

      // Create user activity record
      const { error: insertError } = await supabase
        .from('campaigns')
        .insert({
          title: `${campaign.title} - กิจกรรมของ ${user.email}`,
          description: description,
          image_url: publicUrl,
          points: campaign.points,
          user_id: user.id,
          activity_type: campaign.activity_type,
          status: 'completed'
        });

      if (insertError) throw insertError;

      toast({
        title: "เข้าร่วมสำเร็จ!",
        description: `คุณได้รับ ${campaign.points} แต้มจากการเข้าร่วมแคมเปญนี้`
      });

      // Reset form
      setSelectedFile(null);
      setPreview(null);
      setDescription('');
      setUserHasParticipated(true);

    } catch (error) {
      console.error('Error submitting activity:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งกิจกรรมได้ กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setSubmitting(false);
    }
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
          {/* Campaign Header */}
          <div className="relative mb-8">
            <div className="aspect-video md:aspect-[3/1] relative rounded-xl overflow-hidden">
              <img 
                src={campaign.image_url || "https://placehold.co/1200x400/e5f7f0/2c7873?text=Campaign+Image"}
                alt={campaign.title || 'Campaign'}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.tags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      style={{ 
                        backgroundColor: tag.color + '20', 
                        color: tag.color, 
                        borderColor: tag.color 
                      }}
                      className="border"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {campaign.title || 'แคมเปญ'}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1">
                    <Award className="h-5 w-5" />
                    <span>{campaign.points} แต้ม/ครั้ง</span>
                  </div>
                  {campaign.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-5 w-5" />
                      <span>เริ่ม: {new Date(campaign.start_date).toLocaleDateString('th-TH')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">รายละเอียด</TabsTrigger>
              <TabsTrigger value="participate">ร่วมกิจกรรม</TabsTrigger>
              <TabsTrigger value="gallery">แกลเลอรี่</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-eco-blue">รายละเอียดแคมเปญ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">คำอธิบาย</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {campaign.description || "ร่วมแคมเปญรักษ์โลกกับเรา เพื่อสิ่งแวดล้อมที่ยั่งยืน"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Target className="h-5 w-5 text-eco-teal" />
                        <div>
                          <p className="font-medium">คะแนนที่ได้รับ</p>
                          <p className="text-gray-600">{campaign.points} แต้มต่อการเข้าร่วม</p>
                        </div>
                      </div>
                      
                      {campaign.activity_type && (
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-eco-teal" />
                          <div>
                            <p className="font-medium">ประเภทกิจกรรม</p>
                            <p className="text-gray-600">{campaign.activity_type}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {campaign.start_date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-eco-teal" />
                          <div>
                            <p className="font-medium">วันที่เริ่ม</p>
                            <p className="text-gray-600">
                              {new Date(campaign.start_date).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {campaign.end_date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-eco-teal" />
                          <div>
                            <p className="font-medium">วันที่สิ้นสุด</p>
                            <p className="text-gray-600">
                              {new Date(campaign.end_date).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="participate" className="mt-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-eco-blue">ร่วมกิจกรรม</CardTitle>
                  <CardDescription>
                    อัปโหลดรูปภาพและแชร์ประสบการณ์การทำกิจกรรมรักษ์โลกของคุณ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {userHasParticipated ? (
                    <div className="text-center py-12">
                      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Award className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">เข้าร่วมแล้ว!</h3>
                      <p className="text-gray-600">
                        คุณได้เข้าร่วมแคมเปญนี้แล้วและได้รับ {campaign.points} แต้ม
                      </p>
                    </div>
                  ) : (
                    <>
                      <ActivityImageUpload
                        preview={preview}
                        onChange={handleFileChange}
                        isRequired
                      />
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          อธิบายกิจกรรมของคุณ <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="description"
                          placeholder="เล่าถึงกิจกรรมที่คุณทำ เช่น ใช้ถุงผ้าไปซื้อของที่ตลาด..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleSubmit}
                        disabled={submitting || !selectedFile || !description.trim()}
                        className="w-full bg-eco-gradient hover:opacity-90"
                      >
                        {submitting ? "กำลังส่ง..." : `ส่งกิจกรรมและรับ ${campaign.points} แต้ม`}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-eco-blue">แกลเลอรี่กิจกรรม</CardTitle>
                  <CardDescription>
                    ชมกิจกรรมที่ผู้ใช้อื่นๆ ได้เข้าร่วมแล้ว
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityGallery showCaption={true} showUserActivities={true} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
