import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecycleIcon, ShoppingBag, ImageIcon, Award, Calendar, Users, Leaf } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const campaignsData = {
  "bag": {
    id: 1,
    title: "ถุงผ้ารักษ์โลก",
    description: "รณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน เพื่อลดปริมาณขยะพลาสติกที่ทำลายสิ่งแวดล้อม",
    longDescription: `การใช้ถุงพลาสติกแบบใช้ครั้งเดียวทิ้งเป็นหนึ่งในปัญหาสิ่งแวดล้อมที่ใหญ่ที่สุด ถุงพลาสติกใช้เวลาย่อยสลายหลายร้อยปี และส่วนใหญ่มักลงเอยในมหาสมุทร ส่งผลกระทบต่อสิ่งมีชีวิตในทะเล 

แคมเปญนี้ส่งเสริมให้ทุกคนหันมาใช้ถุงผ้าที่สามารถใช้ซ้ำได้หลายครั้ง ลดการสร้างขยะพลาสติก และช่วยลดผลกระทบต่อสิ่งแวดล้อม`,
    rules: [
      "ใช้ถุงผ้าในการซื้อสินค้าแทนถุงพลาสติก",
      "ถ่ายรูปการใช้ถุงผ้าในสถานการณ์จริง",
      "อธิบายสั้นๆ ว่าคุณใช้ถุงผ้าในสถานการณ์ใด",
      "เมื่อใช้ถุงผ้าอย่างต่อเนื่อง 5 ครั้งจะได้รับโบนัสพิเศษ +2 แต้ม"
    ],
    points: 1,
    bonusPoints: "+2 เมื่อใช้ต่อเนื่อง 5 ครั้ง",
    type: "ongoing",
    category: "reduce",
    icon: ShoppingBag,
    image: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=1000&q=80",
    coverImage: "https://images.unsplash.com/photo-1610024062303-58e9c0b43c8f?auto=format&fit=crop&w=1200&q=80",
    participants: 320,
    endDate: null,
    gallery: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1598532213504-961f22143e3c?auto=format&fit=crop&w=600&q=80",
        user: "สมหญิง รักโลก",
        date: "2 วันก่อน",
        caption: "ใช้ถุงผ้าไปซื้อผักที่ตลาดนัด ช่วยลดการใช้ถุงพลาสติกได้หลายใบเลย!"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?auto=format&fit=crop&w=600&q=80",
        user: "สมชาย ใจดี",
        date: "3 วันก่อน",
        caption: "พกถุงผ้าไปซื้อของที่ซูเปอร์มาร์เก็ต สะดวกและช่วยลดขยะได้มาก"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=600&q=80",
        user: "ภาสกร นิยมไทย",
        date: "1 สัปดาห์ก่อน",
        caption: "ใช้ถุงผ้าแทนถุงพลาสติกทุกครั้งที่ไปจ่ายตลาด ทำจนเป็นนิสัยแล้วค่ะ"
      }
    ]
  },
  "reuse": {
    id: 2,
    title: "แก้วและหลอดรียูส",
    description: "ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ ลดการสร้างขยะพลาสติกแบบใช้ครั้งเดียว",
    longDescription: `แก้วพลาสติกและหลอดพลาสติกแบบใช้ครั้งเดียวเป็นหนึ่งในขยะที่พบมากที่สุดในทะเลและชายหาด พวกมันส่งผลกระทบอย่างมากต่อสิ่งมีชีวิตในทะเล

แคมเปญนี้ส่งเสริมให้ทุกคนใช้แก้วและหลอดแบบพกพาที่สามารถใช้ซ้ำได้ เพื่อลดการสร้างขยะพลาสติกในชีวิตประจำวัน และช่วยลดปริมาณขยะที่จะลงสู่มหาสมุทร`,
    rules: [
      "ใช้แก้วส่วนตัวหรือแก้วที่นำกลับมาใช้ใหม่ได้",
      "หากใช้หลอด ให้ใช้หลอดที่นำกลับมาใช้ใหม่ได้ เช่น หลอดโลหะ หลอดซิลิโคน",
      "ถ่ายรูปการใช้แก้วหรือหลอดส่วนตัวในสถานการณ์จริง",
      "อธิบายสั้นๆ ว่าคุณใช้แก้วหรือหลอดรียูสในสถานการณ์ใด",
      "เมื่อใช้แก้วส่วนตัวอย่างต่อเนื่อง 7 ครั้งจะได้รับโบนัสพิเศษ +3 แต้ม"
    ],
    points: 1,
    bonusPoints: "+3 เมื่อใช้ต่อเนื่อง 7 ครั้ง",
    type: "ongoing",
    category: "reuse",
    icon: RecycleIcon,
    image: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1000&q=80",
    coverImage: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=1200&q=80",
    participants: 285,
    endDate: null,
    gallery: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?auto=format&fit=crop&w=600&q=80",
        user: "ธนาพร ดาวเด่น",
        date: "วันนี้",
        caption: "แก้วสแตนเลสคู่ใจ ไปไหนมาไหนพกติดกระเป๋าตลอด ช่วยโลกได้ทุกวัน!"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1581541704900-33b4359c1583?auto=format&fit=crop&w=600&q=80",
        user: "กิตติภพ วิเศษ",
        date: "2 วันก่อน",
        caption: "หลอดโลหะสวยๆ กับเครื่องดื่มเย็นๆ ช่วยลดขยะพลาสติกได้อีกชิ้น"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=600&q=80",
        user: "สมชาย ใจดี",
        date: "4 วันก่อน",
        caption: "แก้วเซรามิคส์วนตัว นำมาใช้ที่ออฟฟิศทุกวัน ลดขยะได้เยอะมาก"
      }
    ]
  },
  "recycle": {
    id: 3,
    title: "คัดแยกขยะ",
    description: "สนับสนุนให้นำขยะจากบ้านมาร่วมโครงการ เพื่อปลูกจิตสำนึกในการคัดแยกขยะตั้งแต่ต้นทาง",
    longDescription: `การคัดแยกขยะที่ต้นทางเป็นสิ่งสำคัญในการจัดการขยะอย่างยั่งยืน เมื่อเราคัดแยกขยะตั้งแต่ต้นทาง จะทำให้ขยะที่สามารถนำไปรีไซเคิลได้ถูกส่งไปแปรรูปให้เกิดประโยชน์ ลดปริมาณขยะที่ต้องนำไปฝังกลบหรือเผาทำลาย

แคมเปญนี้ส่งเสริมให้ทุกคนคัดแยกขยะในครัวเรือนอย่างถูกวิธี เพื่อให้การจัดการขยะมีประสิทธิภาพมากขึ้น และช่วยลดผลกระทบต่อสิ่งแวดล้อม`,
    rules: [
      "คัดแยกขยะในบ้านตามประเภท (ขยะรีไซเคิล ขยะอินทรีย์ ขยะทั่วไป ขยะอันตราย)",
      "ถ่ายรูปขยะที่คัดแยกแล้ว พร้อมระบุประเภท",
      "อธิบายสั้นๆ ว่าคุณคัดแยกขยะอะไร และจะนำไปจัดการอย่างไรต่อ",
      "การคัดแยกขยะอันตรายอย่างถูกต้องจะได้รับโบนัสเพิ่ม +1 แต้ม"
    ],
    points: 1,
    bonusPoints: "+1 สำหรับการคัดแยกขยะอันตรายอย่างถูกต้อง",
    type: "ongoing",
    category: "recycle",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1000&q=80",
    coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
    participants: 420,
    endDate: null,
    gallery: [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        user: "มนัสนันท์ พัฒนา",
        date: "เมื่อวาน",
        caption: "คัดแยกขยะรีไซเคิลประจำสัปดาห์ แยกพลาสติก กระดาษ และโลหะออกจากกัน เพื่อนำไปรีไซเคิลต่อ"
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1604187350603-21be3cc7a5dc?auto=format&fit=crop&w=600&q=80",
        user: "สุชาดา เรืองเดช",
        date: "3 วันก่อน",
        caption: "แยกขวดพลาสติกและกระป๋องอลูมิเนียมก่อนนำไปขาย ช่วยเพิ่มมูลค่าและลดขยะฝังกลบ"
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1611284446314-60a58ac0dade?auto=format&fit=crop&w=600&q=80",
        user: "ภาสกร นิยมไทย",
        date: "1 สัปดาห์ก่อน",
        caption: "ถังขยะแยกประเภทที่บ้าน ทำให้การคัดแยกขยะเป็นเรื่องง่าย"
      }
    ]
  }
};

const CampaignDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const { toast } = useToast();
  
  // Fallback if slug doesn't exist
  const campaign = slug && campaignsData[slug as keyof typeof campaignsData]
    ? campaignsData[slug as keyof typeof campaignsData]
    : campaignsData.bag; // Default to bag campaign
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    if (!preview) {
      toast({
        variant: "destructive",
        title: "กรุณาอัพโหลดรูปภาพ",
        description: "คุณต้องแนบรูปภาพเพื่อร่วมกิจกรรม",
      });
      return;
    }
    
    if (caption.length < 10) {
      toast({
        variant: "destructive",
        title: "กรุณาเพิ่มคำอธิบาย",
        description: "คำอธิบายควรมีความยาวอย่างน้อย 10 ตัวอักษร",
      });
      return;
    }
    
    // Mock submission success
    toast({
      title: "อัพโหลดสำเร็จ!",
      description: `คุณได้รับ ${campaign.points} แต้มจากกิจกรรม ${campaign.title}`,
    });
    
    // Reset form
    setPreview(null);
    setCaption('');
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const navigateToTab = (tabValue: string) => {
    setActiveTab(tabValue);
  };
  
  const CampaignIcon = campaign.icon;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Cover Image */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src={campaign.coverImage} 
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container px-4 md:px-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`
                  ${campaign.type === 'ongoing' ? 'bg-eco-teal' : 
                    campaign.type === 'special' ? 'bg-amber-500' : 
                    campaign.type === 'contest' ? 'bg-purple-500' : 'bg-blue-500'}
                `}>
                  {campaign.type === 'ongoing' ? 'กำลังดำเนินการ' : 
                    campaign.type === 'special' ? 'กิจกรรมพิเศษ' : 
                    campaign.type === 'contest' ? 'การประกวด' : ''}
                </Badge>
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{campaign.participants} คนเข้าร่วม</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
                <CampaignIcon className="h-6 w-6" />
                {campaign.title}
              </h1>
              <p className="text-white/90 max-w-2xl">{campaign.description}</p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-10 bg-eco-light">
          <div className="container px-4 md:px-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="bg-white/50 p-1">
                  <TabsTrigger value="about">รายละเอียด</TabsTrigger>
                  <TabsTrigger value="participate">ร่วมกิจกรรม</TabsTrigger>
                  <TabsTrigger value="gallery">แกลเลอรี่</TabsTrigger>
                </TabsList>
              </div>
              
              {/* About Tab */}
              <TabsContent value="about">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card className="border-none shadow-lg mb-6">
                      <CardContent className="pt-6">
                        <div className="prose max-w-none">
                          <h2 className="text-2xl font-bold text-eco-blue mb-4">เกี่ยวกับกิจกรรม</h2>
                          {campaign.longDescription.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="mb-4 text-gray-700">{paragraph}</p>
                          ))}
                          
                          <h3 className="text-xl font-bold text-eco-blue mt-8 mb-4">กฎกติกาการร่วมกิจกรรม</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {campaign.rules.map((rule, index) => (
                              <li key={index} className="text-gray-700">{rule}</li>
                            ))}
                          </ul>
                          
                          <div className="mt-8 flex items-center justify-center">
                            <Button 
                              size="lg" 
                              className="bg-eco-gradient hover:opacity-90"
                              onClick={() => navigateToTab('participate')}
                            >
                              ร่วมกิจกรรมเลย
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="border-none shadow-lg sticky top-24">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-xl text-eco-blue mb-6">รายละเอียดกิจกรรม</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b">
                            <span className="text-gray-600">ประเภท</span>
                            <span className="font-medium text-eco-blue">{
                              campaign.category === 'reduce' ? 'ลดการใช้' : 
                              campaign.category === 'reuse' ? 'นำกลับมาใช้ซ้ำ' : 'รีไซเคิล'
                            }</span>
                          </div>
                          <div className="flex items-center justify-between pb-3 border-b">
                            <span className="text-gray-600">คะแนน</span>
                            <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
                          </div>
                          <div className="flex items-center justify-between pb-3 border-b">
                            <span className="text-gray-600">คะแนนโบนัส</span>
                            <span className="font-medium text-eco-blue">{campaign.bonusPoints}</span>
                          </div>
                          <div className="flex items-center justify-between pb-3 border-b">
                            <span className="text-gray-600">ผู้เข้าร่วม</span>
                            <span className="font-medium text-eco-blue">{campaign.participants} คน</span>
                          </div>
                          <div className="flex items-center justify-between pb-3 border-b">
                            <span className="text-gray-600">วันสิ้นสุด</span>
                            <span className="font-medium text-eco-blue">{campaign.endDate || 'ไม่มีกำหนด'}</span>
                          </div>
                        </div>
                        
                        <div className="mt-8 bg-eco-teal/10 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-eco-teal/20 flex items-center justify-center">
                              <Award className="h-5 w-5 text-eco-teal" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-eco-blue">ร่วมกิจกรรมวันนี้</h4>
                              <p className="text-sm text-gray-600">แชร์ภาพกิจกรรมของคุณ</p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => navigateToTab('participate')}
                            className="w-full bg-eco-gradient hover:opacity-90"
                          >
                            ร่วมกิจกรรมเลย
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Participate Tab */}
              <TabsContent value="participate" id="participate">
                <Card className="border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="max-w-2xl mx-auto">
                      <h2 className="text-2xl font-bold text-eco-blue mb-2">ร่วมกิจกรรม {campaign.title}</h2>
                      <p className="text-gray-600 mb-6">อัพโหลดรูปภาพและคำอธิบายเพื่อร่วมกิจกรรมและรับแต้มสะสม</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            รูปภาพกิจกรรม
                          </label>
                          {preview ? (
                            <div className="relative">
                              <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-64 object-cover rounded-md border"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 bg-white"
                                onClick={() => setPreview(null)}
                              >
                                เปลี่ยนรูป
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="image"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-eco-teal bg-gray-50 hover:bg-gray-100"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">คลิกเพื่ออัพโหลดรูปภาพ</span>
                                  </p>
                                  <p className="text-xs text-gray-500">PNG, JPG หรือ HEIC (สูงสุด 5 MB)</p>
                                </div>
                                <input
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            คำอธิบาย
                          </label>
                          <textarea 
                            rows={4} 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            placeholder={`อธิบายสั้นๆ เกี่ยวกับกิจกรรม ${campaign.title} ของคุณ...`}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                          />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={handleSubmit}
                            className="w-full bg-eco-gradient hover:opacity-90"
                            size="lg"
                          >
                            อัพโหลดและรับแต้ม
                          </Button>
                          <p className="text-center text-sm text-gray-500">
                            รูปภาพที่อัพโหลดอาจถูกใช้เพื่อประชาสัมพันธ์กิจกรรม
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-eco-blue mb-2">แกลเลอรี่กิจกรรม</h2>
                  <p className="text-gray-600">ภาพกิจกรรมจากผู้เข้าร่วมกิจกรรม {campaign.title}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {campaign.gallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden border-none shadow-lg">
                      <div className="aspect-square relative">
                        <img 
                          src={item.image} 
                          alt={item.caption}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${item.id}`} alt={item.user} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-eco-blue">{item.user}</p>
                            <p className="text-xs text-gray-500">{item.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{item.caption}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    อัพโหลดรูปภาพของคุณเพื่อร่วมแสดงในแกลเลอรี่
                  </p>
                  <Button 
                    onClick={() => navigateToTab('participate')}
                    className="mt-4 bg-eco-gradient hover:opacity-90"
                  >
                    ร่วมกิจกรรมเลย
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignDetail;
