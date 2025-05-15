
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, ShoppingBag, RecycleIcon, Calendar, Users, Leaf, ImageIcon } from 'lucide-react';

const UserStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">คะแนนสะสม</p>
              <h3 className="text-2xl font-bold text-eco-blue">248</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-eco-teal/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-eco-teal" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">กิจกรรมที่เข้าร่วม</p>
              <h3 className="text-2xl font-bold text-eco-blue">23</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-eco-teal/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-eco-teal" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">อันดับปัจจุบัน</p>
              <h3 className="text-2xl font-bold text-eco-blue">15</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-eco-teal/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-eco-teal" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">ขยะที่คัดแยกแล้ว</p>
              <h3 className="text-2xl font-bold text-eco-blue">34 กก.</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-eco-teal/10 flex items-center justify-center">
              <RecycleIcon className="h-6 w-6 text-eco-teal" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NextLevel = () => {
  return (
    <Card className="border-none shadow-md mb-8">
      <CardHeader className="pb-3">
        <CardTitle>ความคืบหน้าระดับถัดไป</CardTitle>
        <CardDescription>อีก 52 คะแนน เพื่อไปสู่ระดับ "นักอนุรักษ์ธรรมชาติ"</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">248/300 คะแนน</span>
            <span className="text-sm text-gray-500">83%</span>
          </div>
          <Progress value={83} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: 'recycle',
      title: 'คัดแยกขยะรีไซเคิล',
      points: 1,
      date: '15 พ.ค. 2025',
      image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 2,
      type: 'bag',
      title: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      points: 1,
      date: '14 พ.ค. 2025',
      image: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 3,
      type: 'cup',
      title: 'ใช้แก้วส่วนตัว',
      points: 1,
      date: '12 พ.ค. 2025',
      image: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 4,
      type: 'special',
      title: 'กิจกรรม Wake Up Waste',
      points: 5,
      date: '10 พ.ค. 2025',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=200&q=80'
    }
  ];
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>กิจกรรมล่าสุด</CardTitle>
        <CardDescription>กิจกรรมที่คุณได้เข้าร่วมล่าสุด</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="text-base font-medium text-eco-blue">{activity.title}</h4>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
              <div className="bg-eco-light rounded-full px-3 py-1 font-medium text-eco-blue">
                +{activity.points} แต้ม
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AvailableCampaigns = () => {
  const campaigns = [
    {
      id: 1,
      title: 'ถุงผ้ารักษ์โลก',
      description: 'ใช้ถุงผ้าแทนถุงพลาสติกเพื่อลดขยะ',
      points: 1,
      icon: ShoppingBag,
      path: '/campaigns/bag'
    },
    {
      id: 2,
      title: 'แก้วและหลอดรียูส',
      description: 'ใช้แก้วและหลอดส่วนตัวเพื่อลดพลาสติกแบบใช้ครั้งเดียว',
      points: 1,
      icon: RecycleIcon,
      path: '/campaigns/reuse'
    },
    {
      id: 3,
      title: 'คัดแยกขยะ',
      description: 'คัดแยกขยะที่บ้านเพื่อการรีไซเคิลที่มีประสิทธิภาพ',
      points: 1,
      icon: Leaf,
      path: '/campaigns/recycle'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center">
                <campaign.icon className="h-5 w-5 text-eco-teal" />
              </div>
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-eco-blue">+{campaign.points} คะแนน/ครั้ง</span>
              <Button asChild variant="outline" className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                <Link to={campaign.path}>เข้าร่วม</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const UploadActivity = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [activityType, setActivityType] = useState('recycle');
  
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
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle>อัปโหลดกิจกรรม</CardTitle>
        <CardDescription>แชร์ภาพกิจกรรมรักษ์โลกของคุณเพื่อสะสมแต้ม</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="activityType" className="text-sm font-medium">
              ประเภทกิจกรรม
            </label>
            <select 
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="recycle">คัดแยกขยะ</option>
              <option value="bag">ใช้ถุงผ้า</option>
              <option value="cup">ใช้แก้วส่วนตัว</option>
              <option value="straw">ใช้หลอดส่วนตัว</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              คำอธิบายกิจกรรม
            </label>
            <textarea 
              id="description"
              placeholder="อธิบายสั้นๆ เกี่ยวกับกิจกรรมของคุณ"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
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
                      <span className="font-semibold">คลิกเพื่ออัปโหลดรูปภาพ</span>
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
          
          <Button type="button" className="w-full bg-eco-gradient hover:opacity-90">
            อัปโหลดกิจกรรม
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-eco-blue">สวัสดี, สมชาย ใจดี</h1>
              <p className="text-gray-600">ยินดีต้อนรับกลับมา! ติดตามความคืบหน้าของคุณได้ที่นี่</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild className="bg-eco-gradient hover:opacity-90">
                <Link to="/activities">ร่วมกิจกรรมเพิ่มเติม</Link>
              </Button>
            </div>
          </div>
          
          <UserStats />
          
          <NextLevel />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="border-b w-full justify-start rounded-none gap-4 px-0 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none">ภาพรวม</TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none">อัปโหลดกิจกรรม</TabsTrigger>
              <TabsTrigger value="campaigns" className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none">กิจกรรมที่น่าสนใจ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <RecentActivities />
            </TabsContent>
            
            <TabsContent value="upload">
              <UploadActivity />
            </TabsContent>
            
            <TabsContent value="campaigns">
              <AvailableCampaigns />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
