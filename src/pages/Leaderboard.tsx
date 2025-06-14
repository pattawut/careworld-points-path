import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getAvatarUrl } from '@/utils/avatarUtils';

type LeaderboardUser = {
  id: string;
  full_name: string;
  eco_points: number;
  avatar_url: string | null;
  activities_count: number;
  latest_activity?: {
    title: string;
    image_url: string;
    created_at: string;
  };
};

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allTimeUsers, setAllTimeUsers] = useState<LeaderboardUser[]>([]);
  const [monthlyUsers, setMonthlyUsers] = useState<LeaderboardUser[]>([]);
  const [weeklyUsers, setWeeklyUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);

        // Fetch all users with their eco_points
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, full_name, eco_points, avatar_url')
          .order('eco_points', { ascending: false });

        if (usersError) {
          throw usersError;
        }

        if (!users || users.length === 0) {
          setAllTimeUsers([]);
          setMonthlyUsers([]);
          setWeeklyUsers([]);
          return;
        }

        // Get activity counts and latest activities for each user
        const usersWithActivities = await Promise.all(
          users.map(async (user) => {
            // Count total activities
            const { count: totalCount } = await supabase
              .from('campaigns')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);

            // Count monthly activities (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const { count: monthlyCount } = await supabase
              .from('campaigns')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .gte('created_at', thirtyDaysAgo.toISOString());

            // Count weekly activities (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const { count: weeklyCount } = await supabase
              .from('campaigns')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .gte('created_at', sevenDaysAgo.toISOString());

            // Get latest activity
            const { data: latestActivity } = await supabase
              .from('campaigns')
              .select('title, image_url, created_at')
              .eq('user_id', user.id)
              .not('image_url', 'is', null)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // Get actual eco_points for monthly and weekly calculations
            // Calculate monthly points (get activities from last 30 days and sum their points)
            const { data: monthlyActivities } = await supabase
              .from('campaigns')
              .select('points')
              .eq('user_id', user.id)
              .gte('created_at', thirtyDaysAgo.toISOString());

            const monthlyPoints = monthlyActivities?.reduce((sum, activity) => sum + (activity.points || 0), 0) || 0;

            // Calculate weekly points (get activities from last 7 days and sum their points)
            const { data: weeklyActivities } = await supabase
              .from('campaigns')
              .select('points')
              .eq('user_id', user.id)
              .gte('created_at', sevenDaysAgo.toISOString());

            const weeklyPoints = weeklyActivities?.reduce((sum, activity) => sum + (activity.points || 0), 0) || 0;

            return {
              ...user,
              activities_count: totalCount || 0,
              monthly_count: monthlyCount || 0,
              weekly_count: weeklyCount || 0,
              monthly_points: monthlyPoints,
              weekly_points: weeklyPoints,
              latest_activity: latestActivity || undefined
            };
          })
        );

        // Sort and set all-time leaderboard (using actual eco_points)
        const sortedAllTime = usersWithActivities
          .sort((a, b) => (b.eco_points || 0) - (a.eco_points || 0))
          .map(user => ({
            id: user.id,
            full_name: user.full_name || 'ไม่ระบุชื่อ',
            eco_points: user.eco_points || 0,
            avatar_url: user.avatar_url,
            activities_count: user.activities_count,
            latest_activity: user.latest_activity
          }));

        // Monthly leaderboard (using calculated monthly points)
        const monthlyLeaderboard = usersWithActivities
          .map(user => ({
            id: user.id,
            full_name: user.full_name || 'ไม่ระบุชื่อ',
            eco_points: user.monthly_points,
            avatar_url: user.avatar_url,
            activities_count: user.monthly_count,
            latest_activity: user.latest_activity
          }))
          .filter(user => user.eco_points > 0)
          .sort((a, b) => b.eco_points - a.eco_points);

        // Weekly leaderboard (using calculated weekly points)
        const weeklyLeaderboard = usersWithActivities
          .map(user => ({
            id: user.id,
            full_name: user.full_name || 'ไม่ระบุชื่อ',
            eco_points: user.weekly_points,
            avatar_url: user.avatar_url,
            activities_count: user.weekly_count,
            latest_activity: user.latest_activity
          }))
          .filter(user => user.eco_points > 0)
          .sort((a, b) => b.eco_points - a.eco_points);

        setAllTimeUsers(sortedAllTime);
        setMonthlyUsers(monthlyLeaderboard);
        setWeeklyUsers(weeklyLeaderboard);

      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        toast({
          variant: "destructive",
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลอันดับได้",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [toast]);

  const filterUsers = (users: LeaderboardUser[]) => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderTopThree = (users: LeaderboardUser[]) => {
    const filteredUsers = filterUsers(users);
    
    if (filteredUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">ยังไม่มีข้อมูลอันดับ</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {filteredUsers.slice(0, 3).map((user, index) => (
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
                    src={getAvatarUrl(user.avatar_url, user.id)} 
                    alt={user.full_name} 
                    className="rounded-full object-cover w-24 h-24 border-4 border-white shadow-lg"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Award className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-eco-blue text-center">{user.full_name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{user.activities_count} กิจกรรม</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-eco-light rounded-full px-4 py-1 font-semibold text-eco-blue">
                    {user.eco_points} แต้ม
                  </div>
                </div>
                {user.latest_activity && (
                  <div className="w-full">
                    <div className="text-sm text-gray-500 mb-2">กิจกรรมล่าสุด</div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img 
                          src={user.latest_activity.image_url} 
                          alt={user.latest_activity.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-700">{user.latest_activity.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderLeaderboardTable = (users: LeaderboardUser[]) => {
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
                        src={getAvatarUrl(user.avatar_url, user.id)} 
                        alt={user.full_name} 
                        className="rounded-full w-10 h-10 object-cover"
                      />
                      <span className="font-medium text-eco-blue">{user.full_name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {user.latest_activity ? (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-sm overflow-hidden">
                          <img 
                            src={user.latest_activity.image_url} 
                            alt={user.latest_activity.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-gray-700 text-sm">{user.latest_activity.title}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">ยังไม่มีกิจกรรม</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-700">
                    {user.activities_count}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-eco-blue">{user.eco_points}</span>
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10 bg-eco-light">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eco-teal mx-auto mb-4"></div>
                <p className="text-gray-600">กำลังโหลดข้อมูลอันดับ...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
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
                  {renderTopThree(allTimeUsers)}
                </TabsContent>
                
                <TabsContent value="monthly">
                  {renderTopThree(monthlyUsers)}
                </TabsContent>
                
                <TabsContent value="weekly">
                  {renderTopThree(weeklyUsers)}
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
