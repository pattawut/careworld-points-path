import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, Calendar, Users, RecycleIcon, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ActivityForm } from '@/components/ActivityForm';
import { ActivityList } from '@/components/ActivityList';
import { AvailableCampaigns } from '@/components/dashboard/AvailableCampaigns';

const UserStats = () => {
  const { profile } = useAuth();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">คะแนนสะสม</p>
              <h3 className="text-2xl font-bold text-eco-blue">{profile?.eco_points || 0}</h3>
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
              <h3 className="text-2xl font-bold text-eco-blue">-</h3>
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
              <h3 className="text-2xl font-bold text-eco-blue">-</h3>
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
              <h3 className="text-2xl font-bold text-eco-blue">-</h3>
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
  const { profile } = useAuth();
  const currentPoints = profile?.eco_points || 0;
  const nextLevel = 300; // Points needed for next level
  const progress = Math.min(Math.round((currentPoints / nextLevel) * 100), 100);
  
  return (
    <Card className="border-none shadow-md mb-8">
      <CardHeader className="pb-3">
        <CardTitle>ความคืบหน้าระดับถัดไป</CardTitle>
        <CardDescription>อีก {nextLevel - currentPoints} คะแนน เพื่อไปสู่ระดับ "นักอนุรักษ์ธรรมชาติ"</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{currentPoints}/{nextLevel} คะแนน</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('myActivities');
  const { user, profile, isLoading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  if (isLoading) {
    return null; // Loading state
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const handleActivitySuccess = () => {
    setActiveTab('myActivities');
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user is admin
  const isAdmin = profile?.role === 'admin';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-eco-blue">สวัสดี, {profile?.full_name || 'สมาชิก'}</h1>
              <p className="text-gray-600">ยินดีต้อนรับกลับมา! ติดตามความคืบหน้าของคุณได้ที่นี่</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline" className="border-eco-blue text-eco-blue hover:bg-eco-blue hover:text-white">
                  <Link to="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    จัดการระบบ
                  </Link>
                </Button>
              )}
              <Button asChild className="bg-eco-gradient hover:opacity-90">
                <Link to="/activities">ร่วมกิจกรรมเพิ่มเติม</Link>
              </Button>
            </div>
          </div>
          
          <UserStats />
          
          <NextLevel />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="border-b w-full justify-start rounded-none gap-4 px-0 mb-6">
              <TabsTrigger 
                value="myActivities" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none"
              >
                กิจกรรมของฉัน
              </TabsTrigger>
              <TabsTrigger 
                value="uploadActivity" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none"
              >
                อัปโหลดกิจกรรม
              </TabsTrigger>
              <TabsTrigger 
                value="campaigns" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-eco-teal rounded-none"
              >
                กิจกรรมที่น่าสนใจ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="myActivities">
              <ActivityList key={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="uploadActivity">
              <ActivityForm onSuccess={handleActivitySuccess} />
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
