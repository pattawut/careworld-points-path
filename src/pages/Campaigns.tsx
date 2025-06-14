import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecycleIcon, ShoppingBag, Calendar, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  participants?: number;
  type?: string;
  category?: string;
  path?: string;
  tags?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

type CampaignTag = {
  id: string;
  name: string;
  color: string;
};

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignTags, setCampaignTags] = useState<CampaignTag[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaign tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('campaign_tags')
        .select('*')
        .order('name');
      
      if (tagsError) throw tagsError;
      
      setCampaignTags(tagsData || []);
      
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .in('status', ['active', 'promoted', 'coming_soon'])
        .is('user_id', null)
        .order('created_at', { ascending: false });
          
      if (campaignsError) throw campaignsError;
      
      // Fetch tags for each campaign
      const campaignsWithTags = await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          const { data: tagData, error: tagError } = await supabase
            .from('campaign_tag_relations')
            .select(`
              campaign_tags (
                id,
                name,
                color
              )
            `)
            .eq('campaign_id', campaign.id);

          if (tagError) {
            console.error('Error fetching tags for campaign:', campaign.id, tagError);
            return {
              ...campaign,
              tags: [],
              type: campaign.status === 'active' ? 'ongoing' : 
                    campaign.status === 'promoted' ? 'special' : 'upcoming',
              category: campaign.activity_type || 'general',
              path: `/campaigns/${campaign.id}`,
              participants: Math.floor(Math.random() * 500) + 50
            };
          }

          const tags = tagData?.map(relation => relation.campaign_tags).filter(Boolean) || [];
          return {
            ...campaign,
            tags,
            type: campaign.status === 'active' ? 'ongoing' : 
                  campaign.status === 'promoted' ? 'special' : 'upcoming',
            category: campaign.activity_type || 'general',
            path: `/campaigns/${campaign.id}`,
            participants: Math.floor(Math.random() * 500) + 50
          };
        })
      );
      
      setCampaigns(campaignsWithTags as Campaign[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้"
      });
      
      // Fallback to sample data
      setCampaigns(getSampleCampaigns());
      setCampaignTags([
        { id: 'all', name: 'ทั้งหมด', color: '#6B7280' },
        { id: 'bag', name: 'ถุงผ้า', color: '#10B981' },
        { id: 'reuse', name: 'นำกลับมาใช้ซ้ำ', color: '#3B82F6' },
        { id: 'recycle', name: 'รีไซเคิล', color: '#F59E0B' },
        { id: 'reduce', name: 'ลดการใช้', color: '#EF4444' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSampleCampaigns = (): Campaign[] => [
    {
      id: 'sample-1',
      title: "ถุงผ้ารักษ์โลก",
      description: "รณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน โดยต้องแสดงภาพการใช้ถุงผ้า",
      points: 1,
      type: "ongoing",
      category: "bag",
      image_url: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/bag",
      participants: 320,
      status: 'active',
      activity_type: 'bag',
      start_date: null,
      end_date: null
    },
    {
      id: 'sample-2',
      title: "แก้วและหลอดรียูส",
      description: "ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ โดยต้องแสดงภาพการใช้แก้วน้ำสะอาดและหลอดที่นำกลับมาใช้ใหม่",
      points: 1,
      type: "ongoing",
      category: "reuse",
      image_url: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/reuse",
      participants: 285,
      status: 'active',
      activity_type: 'reuse',
      start_date: null,
      end_date: null
    },
    {
      id: 'sample-3',
      title: "คัดแยกขยะ",
      description: "สนับสนุนให้นำขยะจากบ้านมาร่วมโครงการ เพื่อปลูกจิตสำนึกในการคัดแยกขยะตั้งแต่ต้นทาง",
      points: 1,
      type: "ongoing",
      category: "recycle",
      image_url: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/recycle",
      participants: 420,
      status: 'active',
      activity_type: 'recycle',
      start_date: null,
      end_date: null
    }
  ];
  
  const upcomingCampaigns = [
    {
      id: 'upcoming-1',
      title: "Plastic-Free July",
      description: "ท้าทายตัวเองให้งดใช้พลาสติกแบบใช้ครั้งเดียวตลอดเดือนกรกฎาคม",
      points: 10,
      date: "1-31 กรกฎาคม 2025",
      image_url: "https://images.unsplash.com/photo-1682957317691-36e7de9bd15e?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/upcoming/plastic-free-july",
      status: 'coming_soon',
      activity_type: 'reduce',
      start_date: null,
      end_date: null
    },
    {
      id: 'upcoming-2',
      title: "วันทะเลโลก",
      description: "กิจกรรมพิเศษเนื่องในวันทะเลโลก ร่วมเก็บขยะชายหาดและจัดนิทรรศการให้ความรู้",
      points: 5,
      date: "8 มิถุนายน 2025",
      image_url: "https://images.unsplash.com/photo-1577504075702-8c868da9906e?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/upcoming/world-oceans-day",
      status: 'coming_soon',
      activity_type: 'recycle',
      start_date: null,
      end_date: null
    }
  ];
  
  const filterCampaigns = (campaignsList: Campaign[], tagName?: string) => {
    let filtered = campaignsList;
    
    if (tagName && tagName !== "all" && tagName !== "ทั้งหมด") {
      filtered = filtered.filter(campaign => {
        // Check if campaign has any tags that match the selected tag name
        return campaign.tags?.some(tag => tag.name === tagName) ||
               // Fallback to activity_type for backward compatibility
               campaign.activity_type === tagName ||
               campaign.category === tagName;
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  // Helper function to get tag value for filtering
  const getTagValue = (tag: CampaignTag) => {
    if (tag.name === 'ทั้งหมด') return 'all';
    return tag.name;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'กำลังดำเนินการ';
      case 'promoted':
        return 'โปรโมตแล้ว';
      case 'coming_soon':
        return 'เร็วๆ นี้';
      case 'completed':
        return 'สิ้นสุดแล้ว';
      default:
        return 'กำลังจะมาถึง';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'promoted':
        return 'destructive';
      case 'coming_soon':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'ongoing':
        return 'bg-eco-teal';
      case 'special':
        return 'bg-amber-500';
      case 'contest':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'ongoing':
        return 'กำลังดำเนินการ';
      case 'special':
        return 'กิจกรรมพิเศษ';
      case 'contest':
        return 'การประกวด';
      default:
        return 'กิจกรรม';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bag':
      case 'reduce':
        return <ShoppingBag className="h-4 w-4 text-eco-teal" />;
      case 'reuse':
        return <RecycleIcon className="h-4 w-4 text-eco-teal" />;
      case 'recycle':
        return <Leaf className="h-4 w-4 text-eco-teal" />;
      default:
        return <Leaf className="h-4 w-4 text-eco-teal" />;
    }
  };

  const renderCampaignCard = (campaign: Campaign) => (
    <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
      <div className="aspect-video relative">
        <img 
          src={campaign.image_url || "https://placehold.co/500x300/e5f7f0/2c7873?text=Campaign+Image"} 
          alt={campaign.title || 'Campaign'}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 right-3">
          <Badge className={getBadgeColor(campaign.type || 'ongoing')}>
            {getBadgeText(campaign.type || 'ongoing')}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {getCategoryIcon(campaign.category || campaign.activity_type || 'general')}
          <CardTitle className="text-lg text-eco-blue">{campaign.title || 'แคมเปญ'}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2">
          {campaign.description || "ร่วมกิจกรรมรักษ์โลกกับเรา เพื่อสิ่งแวดล้อมที่ยั่งยืน"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Display campaign tags */}
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {campaign.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ 
                  backgroundColor: tag.color + '20', 
                  color: tag.color, 
                  borderColor: tag.color 
                }}
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>ผู้เข้าร่วม {campaign.participants || 0} คน</span>
          </div>
          <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
          <Link to={campaign.path || `/campaigns/${campaign.id}`}>เข้าร่วมแคมเปญ</Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-eco-gradient opacity-90 -z-10"></div>
          <div className="absolute inset-0 opacity-10 -z-10 leaf-pattern"></div>
          
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                แคมเปญและกิจกรรมรักษ์โลก
              </h1>
              <p className="text-lg text-white/80 mb-6">
                ร่วมเป็นส่วนหนึ่งของการดูแลสิ่งแวดล้อมผ่านแคมเปญและกิจกรรมต่างๆ สะสมแต้มและสร้างการเปลี่ยนแปลงไปด้วยกัน
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="search"
                  placeholder="ค้นหาแคมเปญและกิจกรรม..."
                  className="pl-10 bg-white/90"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-10 bg-eco-light">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-eco-blue mb-2">แคมเปญและกิจกรรมที่เปิดให้ร่วมสนุก</h2>
                <p className="text-gray-600">เลือกแคมเปญและกิจกรรมที่สนใจและร่วมเป็นส่วนหนึ่งในการรักษ์โลก</p>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full mb-8">
              <TabsList className="bg-white/50 p-1">
                {campaignTags.map((tag) => (
                  <TabsTrigger key={tag.id} value={getTagValue(tag)}>
                    {tag.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {campaignTags.map((tag) => (
                <TabsContent key={tag.id} value={getTagValue(tag)} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterCampaigns(campaigns, tag.name).length > 0 ? (
                      filterCampaigns(campaigns, tag.name).map(renderCampaignCard)
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-gray-500">ไม่พบแคมเปญที่ตรงกับการค้นหา</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            {/* Upcoming Campaigns Section */}
            <div className="mt-16">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-eco-blue mb-2">แคมเปญที่กำลังจะมาถึง</h2>
                  <p className="text-gray-600">เตรียมตัวให้พร้อมสำหรับแคมเปญพิเศษที่กำลังจะมาถึง</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingCampaigns.map(campaign => (
                  <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                    <div className="aspect-video relative">
                      <img 
                        src={campaign.image_url || "https://placehold.co/500x300/e5f7f0/2c7873?text=Campaign+Image"} 
                        alt={campaign.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-blue-500 mb-2">กำลังจะมาถึง</Badge>
                        <h3 className="text-xl font-bold text-white mb-1">{campaign.title}</h3>
                        <p className="text-white/90 text-sm">{campaign.date}</p>
                      </div>
                    </div>
                    <CardContent className="pt-4 pb-2">
                      <p className="text-gray-600">{campaign.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="font-semibold text-eco-blue">{campaign.points} แต้ม</span>
                      <Button asChild variant="outline" className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                        <Link to={campaign.path}>ดูรายละเอียด</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
