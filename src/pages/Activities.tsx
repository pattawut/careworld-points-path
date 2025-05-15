
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RecycleIcon, ShoppingBag, Calendar, Leaf } from 'lucide-react';

const Activities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const campaigns = [
    {
      id: 1,
      title: "ถุงผ้ารักษ์โลก",
      description: "รณรงค์การใช้ถุงผ้าแทนถุงพลาสติกในชีวิตประจำวัน โดยต้องแสดงภาพการใช้ถุงผ้า",
      points: 1,
      type: "ongoing",
      category: "reduce",
      image: "https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/bag",
      participants: 320
    },
    {
      id: 2,
      title: "แก้วและหลอดรียูส",
      description: "ส่งเสริมการใช้แก้วน้ำและหลอดแบบใช้ซ้ำ โดยต้องแสดงภาพการใช้แก้วน้ำสะอาดและหลอดที่นำกลับมาใช้ใหม่",
      points: 1,
      type: "ongoing",
      category: "reuse",
      image: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/reuse",
      participants: 285
    },
    {
      id: 3,
      title: "คัดแยกขยะ",
      description: "สนับสนุนให้นำขยะจากบ้านมาร่วมโครงการ เพื่อปลูกจิตสำนึกในการคัดแยกขยะตั้งแต่ต้นทาง",
      points: 1,
      type: "ongoing",
      category: "recycle",
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/recycle",
      participants: 420
    },
    {
      id: 4,
      title: "Wake Up Waste",
      description: "กิจกรรมพิเศษสำหรับการเก็บขยะในพื้นที่สาธารณะ เช่น ชายหาด สวนสาธารณะ",
      points: 5,
      type: "special",
      category: "recycle",
      image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/special/wake-up-waste",
      participants: 178
    },
    {
      id: 5,
      title: "Green Office",
      description: "ส่งเสริมการลดใช้กระดาษและพลาสติกในที่ทำงาน โดยใช้เทคโนโลยีทดแทนและนำ 3R มาประยุกต์ใช้",
      points: 3,
      type: "ongoing",
      category: "reduce",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/green-office",
      participants: 125
    },
    {
      id: 6,
      title: "Zero Waste Market",
      description: "ชวนร่วมกิจกรรมตลาดปลอดขยะ นำภาชนะมาซื้อของโดยไม่ใช้บรรจุภัณฑ์พลาสติก",
      points: 2,
      type: "special",
      category: "reduce",
      image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/special/zero-waste-market",
      participants: 95
    },
    {
      id: 7,
      title: "ปุ๋ยหมักจากเศษอาหาร",
      description: "เรียนรู้การทำปุ๋ยหมักจากเศษอาหารในครัวเรือน เพื่อลดปริมาณขยะอินทรีย์",
      points: 2,
      type: "ongoing",
      category: "recycle",
      image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/compost",
      participants: 110
    },
    {
      id: 8,
      title: "Green Your Room",
      description: "ประกวดการตกแต่งห้องด้วยวัสดุรีไซเคิลและแนวคิดเป็นมิตรกับสิ่งแวดล้อม",
      points: 3,
      type: "contest",
      category: "reuse",
      image: "https://images.unsplash.com/photo-1574780980578-9c5ca157d8de?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/contest/green-room",
      participants: 65
    }
  ];
  
  const upcomingCampaigns = [
    {
      id: 101,
      title: "Plastic-Free July",
      description: "ท้าทายตัวเองให้งดใช้พลาสติกแบบใช้ครั้งเดียวตลอดเดือนกรกฎาคม",
      points: 10,
      date: "1-31 กรกฎาคม 2025",
      image: "https://images.unsplash.com/photo-1682957317691-36e7de9bd15e?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/upcoming/plastic-free-july"
    },
    {
      id: 102,
      title: "วันทะเลโลก",
      description: "กิจกรรมพิเศษเนื่องในวันทะเลโลก ร่วมเก็บขยะชายหาดและจัดนิทรรศการให้ความรู้",
      points: 5,
      date: "8 มิถุนายน 2025",
      image: "https://images.unsplash.com/photo-1577504075702-8c868da9906e?auto=format&fit=crop&w=500&q=80",
      path: "/campaigns/upcoming/world-oceans-day"
    }
  ];
  
  const filterCampaigns = (campaignsList: typeof campaigns, category?: string) => {
    let filtered = campaignsList;
    
    if (category && category !== "all") {
      filtered = filtered.filter(campaign => campaign.category === category);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(campaign => 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-eco-gradient opacity-90 -z-10"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10 -z-10 leaf-pattern"></div>
          
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                กิจกรรมรักษ์โลก
              </h1>
              <p className="text-lg text-white/80 mb-6">
                ร่วมเป็นส่วนหนึ่งของการดูแลสิ่งแวดล้อมผ่านกิจกรรมต่างๆ สะสมแต้มและสร้างการเปลี่ยนแปลงไปด้วยกัน
              </p>
              <div className="relative max-w-xl mx-auto">
                <Input
                  type="search"
                  placeholder="ค้นหากิจกรรม..."
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
                <h2 className="text-2xl font-bold text-eco-blue mb-2">กิจกรรมที่เปิดให้ร่วมสนุก</h2>
                <p className="text-gray-600">เลือกกิจกรรมที่สนใจและร่วมเป็นส่วนหนึ่งในการรักษ์โลก</p>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full mb-8">
              <TabsList className="bg-white/50 p-1">
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="reduce">ลดการใช้</TabsTrigger>
                <TabsTrigger value="reuse">นำกลับมาใช้ซ้ำ</TabsTrigger>
                <TabsTrigger value="recycle">รีไซเคิล</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCampaigns(campaigns).map(campaign => (
                    <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                      <div className="aspect-video relative">
                        <img 
                          src={campaign.image} 
                          alt={campaign.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className={`
                            ${campaign.type === 'ongoing' ? 'bg-eco-teal' : 
                              campaign.type === 'special' ? 'bg-amber-500' : 
                              campaign.type === 'contest' ? 'bg-purple-500' : 'bg-blue-500'}
                          `}>
                            {campaign.type === 'ongoing' ? 'กำลังดำเนินการ' : 
                              campaign.type === 'special' ? 'กิจกรรมพิเศษ' : 
                              campaign.type === 'contest' ? 'การประกวด' : ''}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {campaign.category === 'reduce' && <ShoppingBag className="h-4 w-4 text-eco-teal" />}
                          {campaign.category === 'reuse' && <RecycleIcon className="h-4 w-4 text-eco-teal" />}
                          {campaign.category === 'recycle' && <Leaf className="h-4 w-4 text-eco-teal" />}
                          <CardTitle className="text-lg text-eco-blue">{campaign.title}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>ผู้เข้าร่วม {campaign.participants} คน</span>
                          </div>
                          <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
                          <Link to={campaign.path}>เข้าร่วมกิจกรรม</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reduce" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCampaigns(campaigns, 'reduce').length > 0 ? (
                    filterCampaigns(campaigns, 'reduce').map(campaign => (
                      <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                        <div className="aspect-video relative">
                          <img 
                            src={campaign.image} 
                            alt={campaign.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={`
                              ${campaign.type === 'ongoing' ? 'bg-eco-teal' : 
                                campaign.type === 'special' ? 'bg-amber-500' : 
                                campaign.type === 'contest' ? 'bg-purple-500' : 'bg-blue-500'}
                            `}>
                              {campaign.type === 'ongoing' ? 'กำลังดำเนินการ' : 
                                campaign.type === 'special' ? 'กิจกรรมพิเศษ' : 
                                campaign.type === 'contest' ? 'การประกวด' : ''}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4 text-eco-teal" />
                            <CardTitle className="text-lg text-eco-blue">{campaign.title}</CardTitle>
                          </div>
                          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>ผู้เข้าร่วม {campaign.participants} คน</span>
                            </div>
                            <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
                            <Link to={campaign.path}>เข้าร่วมกิจกรรม</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-gray-500">ไม่พบกิจกรรมที่ตรงกับการค้นหา</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reuse" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCampaigns(campaigns, 'reuse').length > 0 ? (
                    filterCampaigns(campaigns, 'reuse').map(campaign => (
                      <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                        <div className="aspect-video relative">
                          <img 
                            src={campaign.image} 
                            alt={campaign.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={`
                              ${campaign.type === 'ongoing' ? 'bg-eco-teal' : 
                                campaign.type === 'special' ? 'bg-amber-500' : 
                                campaign.type === 'contest' ? 'bg-purple-500' : 'bg-blue-500'}
                            `}>
                              {campaign.type === 'ongoing' ? 'กำลังดำเนินการ' : 
                                campaign.type === 'special' ? 'กิจกรรมพิเศษ' : 
                                campaign.type === 'contest' ? 'การประกวด' : ''}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <RecycleIcon className="h-4 w-4 text-eco-teal" />
                            <CardTitle className="text-lg text-eco-blue">{campaign.title}</CardTitle>
                          </div>
                          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>ผู้เข้าร่วม {campaign.participants} คน</span>
                            </div>
                            <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
                            <Link to={campaign.path}>เข้าร่วมกิจกรรม</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-gray-500">ไม่พบกิจกรรมที่ตรงกับการค้นหา</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recycle" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterCampaigns(campaigns, 'recycle').length > 0 ? (
                    filterCampaigns(campaigns, 'recycle').map(campaign => (
                      <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                        <div className="aspect-video relative">
                          <img 
                            src={campaign.image} 
                            alt={campaign.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={`
                              ${campaign.type === 'ongoing' ? 'bg-eco-teal' : 
                                campaign.type === 'special' ? 'bg-amber-500' : 
                                campaign.type === 'contest' ? 'bg-purple-500' : 'bg-blue-500'}
                            `}>
                              {campaign.type === 'ongoing' ? 'กำลังดำเนินการ' : 
                                campaign.type === 'special' ? 'กิจกรรมพิเศษ' : 
                                campaign.type === 'contest' ? 'การประกวด' : ''}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-eco-teal" />
                            <CardTitle className="text-lg text-eco-blue">{campaign.title}</CardTitle>
                          </div>
                          <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>ผู้เข้าร่วม {campaign.participants} คน</span>
                            </div>
                            <span className="font-medium text-eco-blue">{campaign.points} แต้ม/ครั้ง</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-eco-gradient hover:opacity-90">
                            <Link to={campaign.path}>เข้าร่วมกิจกรรม</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-gray-500">ไม่พบกิจกรรมที่ตรงกับการค้นหา</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-16">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-eco-blue mb-2">กิจกรรมที่กำลังจะมาถึง</h2>
                  <p className="text-gray-600">เตรียมตัวให้พร้อมสำหรับกิจกรรมพิเศษที่กำลังจะมาถึง</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingCampaigns.map(campaign => (
                  <Card key={campaign.id} className="overflow-hidden border-none shadow-lg">
                    <div className="aspect-video relative">
                      <img 
                        src={campaign.image} 
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

export default Activities;
