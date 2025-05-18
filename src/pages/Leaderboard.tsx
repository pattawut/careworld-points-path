import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, Users, Calendar } from 'lucide-react';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const allTimeUsers = [
    {
      id: 1,
      name: 'สมชาย ใจดี',
      points: 748,
      activities: 86,
      avatar: 'https://i.pravatar.cc/100?img=1',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'สมหญิง รักโลก',
      points: 712,
      activities: 79,
      avatar: 'https://i.pravatar.cc/100?img=5',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'ภาสกร นิยมไทย',
      points: 690,
      activities: 74,
      avatar: 'https://i.pravatar.cc/100?img=3',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'วันชัย สมศักดิ์',
      points: 654,
      activities: 68,
      avatar: 'https://i.pravatar.cc/100?img=12',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1558640476-437a5e791cb2?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 5,
      name: 'มนัสนันท์ พัฒนา',
      points: 612,
      activities: 65,
      avatar: 'https://i.pravatar.cc/100?img=9',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 6,
      name: 'ธนาพร ดาวเด่น',
      points: 598,
      activities: 62,
      avatar: 'https://i.pravatar.cc/100?img=10',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 7,
      name: 'กิตติภพ วิเศษ',
      points: 573,
      activities: 59,
      avatar: 'https://i.pravatar.cc/100?img=19',
      lastActivity: 'กิจกรรม Wake Up Waste',
      lastImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 8,
      name: 'สุชาดา เรืองเดช',
      points: 548,
      activities: 54,
      avatar: 'https://i.pravatar.cc/100?img=6',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    }
  ];
  
  const monthlyUsers = [
    {
      id: 2,
      name: 'สมหญิง รักโลก',
      points: 112,
      activities: 12,
      avatar: 'https://i.pravatar.cc/100?img=5',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 1,
      name: 'สมชาย ใจดี',
      points: 98,
      activities: 10,
      avatar: 'https://i.pravatar.cc/100?img=1',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 5,
      name: 'มนัสนันท์ พัฒนา',
      points: 92,
      activities: 9,
      avatar: 'https://i.pravatar.cc/100?img=9',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 7,
      name: 'กิตติภพ วิเศษ',
      points: 85,
      activities: 8,
      avatar: 'https://i.pravatar.cc/100?img=19',
      lastActivity: 'กิจกรรม Wake Up Waste',
      lastImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'ภาสกร นิยมไทย',
      points: 78,
      activities: 8,
      avatar: 'https://i.pravatar.cc/100?img=3',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'วันชัย สมศักดิ์',
      points: 74,
      activities: 7,
      avatar: 'https://i.pravatar.cc/100?img=12',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1558640476-437a5e791cb2?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 6,
      name: 'ธนาพร ดาวเด่น',
      points: 68,
      activities: 7,
      avatar: 'https://i.pravatar.cc/100?img=10',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 8,
      name: 'สุชาดา เรืองเดช',
      points: 65,
      activities: 6,
      avatar: 'https://i.pravatar.cc/100?img=6',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    }
  ];
  
  const weeklyUsers = [
    {
      id: 5,
      name: 'มนัสนันท์ พัฒนา',
      points: 42,
      activities: 4,
      avatar: 'https://i.pravatar.cc/100?img=9',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 2,
      name: 'สมหญิง รักโลก',
      points: 38,
      activities: 4,
      avatar: 'https://i.pravatar.cc/100?img=5',
      lastActivity: 'ใช้ถุงผ้าแทนถุงพลาสติก',
      lastImage: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 7,
      name: 'กิตติภพ วิเศษ',
      points: 35,
      activities: 3,
      avatar: 'https://i.pravatar.cc/100?img=19',
      lastActivity: 'กิจกรรม Wake Up Waste',
      lastImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 1,
      name: 'สมชาย ใจดี',
      points: 32,
      activities: 3,
      avatar: 'https://i.pravatar.cc/100?img=1',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 3,
      name: 'ภาสกร นิยมไทย',
      points: 28,
      activities: 3,
      avatar: 'https://i.pravatar.cc/100?img=3',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 6,
      name: 'ธนาพร ดาวเด่น',
      points: 25,
      activities: 2,
      avatar: 'https://i.pravatar.cc/100?img=10',
      lastActivity: 'ใช้แก้วส่วนตัว',
      lastImage: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 4,
      name: 'วันชัย สมศักดิ์',
      points: 21,
      activities: 2,
      avatar: 'https://i.pravatar.cc/100?img=12',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1558640476-437a5e791cb2?auto=format&fit=crop&w=100&q=80'
    },
    {
      id: 8,
      name: 'สุชาดา เรืองเดช',
      points: 18,
      activities: 2,
      avatar: 'https://i.pravatar.cc/100?img=6',
      lastActivity: 'คัดแยกขยะรีไซเคิล',
      lastImage: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=100&q=80'
    }
  ];
  
  const filterUsers = (users: typeof allTimeUsers) => {
    if (!searchTerm) return users;
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const renderTopThree = (users: typeof allTimeUsers) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {users.slice(0, 3).map((user, index) => (
          <Card key={user.id} className={`border-none shadow-lg overflow-hidden ${index === 0 ? 'md:order-2 ring-2 ring-yellow-400' : index === 1 ? 'md:order-1' : 'md:order-3'}`}>
            <div className="relative h-32 bg-eco-gradient">
              <div className="absolute top-3 left-3">
                <Badge className={`${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'} px-3 font-bold`}>
                  {index + 1}
                </Badge>
              </div>
            </div>
            <div className="relative px-6 pb-6">
              <div className="flex flex-col items-center">
                <div className="relative -mt-16 mb-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="rounded-full object-cover w-24 h-24 border-4 border-white shadow-lg"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Award className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-eco-blue text-center">{user.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{user.activities} กิจกรรม</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-eco-light rounded-full px-4 py-1 font-semibold text-eco-blue">
                    {user.points} แต้ม
                  </div>
                </div>
                <div className="w-full">
                  <div className="text-sm text-gray-500 mb-2">กิจกรรมล่าสุด</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img 
                        src={user.lastImage} 
                        alt={user.lastActivity} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-700">{user.lastActivity}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderLeaderboardTable = (users: typeof allTimeUsers) => {
    const filteredUsers = filterUsers(users);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">อันดับ</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">ผู้ใช้</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">กิจกรรมล่าสุด</th>
              <th className="py-3 px-4 text-center text-sm font-medium text-gray-500">จำนวนกิจกรรม</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">คะแนน</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-eco-light text-eco-blue font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      <span className="font-medium text-eco-blue">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-sm overflow-hidden">
                        <img 
                          src={user.lastImage} 
                          alt={user.lastActivity} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-gray-700 text-sm">{user.lastActivity}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700">
                    {user.activities}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-eco-blue">{user.points}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  ไม่พบผู้ใช้ที่ตรงกับการค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-eco-light">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-eco-blue mb-1">อันดับสมาชิก</h1>
              <p className="text-gray-600">สมาชิกที่มีคะแนนสูงสุดจากการร่วมกิจกรรมต่างๆ</p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <Input
                type="search"
                placeholder="ค้นหาชื่อสมาชิก"
                className="max-w-xs pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <Card className="border-none shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-eco-teal" />
                <div>
                  <CardTitle>ผู้นำคนล่าสุด</CardTitle>
                  <CardDescription>สมาชิกที่มีคะแนนสูงสุด 3 อันดับแรก</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all-time">
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="all-time">ตลอดกาล</TabsTrigger>
                    <TabsTrigger value="monthly">รายเดือน</TabsTrigger>
                    <TabsTrigger value="weekly">รายสัปดาห์</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all-time">
                  {renderTopThree(filterUsers(allTimeUsers))}
                </TabsContent>
                
                <TabsContent value="monthly">
                  {renderTopThree(filterUsers(monthlyUsers))}
                </TabsContent>
                
                <TabsContent value="weekly">
                  {renderTopThree(filterUsers(weeklyUsers))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-eco-teal" />
                <div>
                  <CardTitle>ตารางอันดับทั้งหมด</CardTitle>
                  <CardDescription>สมาชิกทั้งหมดเรียงตามคะแนน</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all-time">
                <div className="flex items-center justify-between mb-6">
                  <TabsList>
                    <TabsTrigger value="all-time">ตลอดกาล</TabsTrigger>
                    <TabsTrigger value="monthly">รายเดือน</TabsTrigger>
                    <TabsTrigger value="weekly">รายสัปดาห์</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all-time">
                  {renderLeaderboardTable(allTimeUsers)}
                </TabsContent>
                
                <TabsContent value="monthly">
                  {renderLeaderboardTable(monthlyUsers)}
                </TabsContent>
                
                <TabsContent value="weekly">
                  {renderLeaderboardTable(weeklyUsers)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
