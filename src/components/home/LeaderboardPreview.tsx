
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  eco_points: number;
  activities_count?: number;
};

export const LeaderboardPreview = () => {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch top users by eco_points
        const { data: users, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, eco_points')
          .order('eco_points', { ascending: false })
          .limit(3);
          
        if (error) {
          throw error;
        }
        
        if (!users || users.length === 0) {
          setTopUsers([]);
          return;
        }
          
        // Count activities for each user from campaigns table
        const usersWithActivitiesCounts = await Promise.all(
          users.map(async (user) => {
            const { count, error } = await supabase
              .from('campaigns')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
              
            return {
              ...user,
              activities_count: count || 0
            };
          })
        );
        
        setTopUsers(usersWithActivitiesCounts);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopUsers();
  }, []);
  
  // Default mock data in case of no users or loading state
  const defaultUsers = [
    {
      id: '1',
      full_name: 'สมชาย ใจดี',
      eco_points: 530,
      activities_count: 42,
      avatar_url: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: '2',
      full_name: 'สมหญิง รักโลก',
      eco_points: 480,
      activities_count: 38,
      avatar_url: 'https://i.pravatar.cc/100?img=5'
    },
    {
      id: '3',
      full_name: 'ภาสกร นิยมไทย',
      eco_points: 450,
      activities_count: 36,
      avatar_url: 'https://i.pravatar.cc/100?img=3'
    }
  ];

  // Use real data if available, otherwise use mock data
  const displayUsers = topUsers.length > 0 ? topUsers : defaultUsers;

  return (
    <section className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-eco-blue mb-3">อันดับผู้นำ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            สมาชิกที่มีคะแนนสูงสุดจากการร่วมกิจกรรมต่างๆ ในโครงการ CareWorld รักษ์โลก
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {displayUsers.map((user, index) => (
            <Card key={user.id} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
              <div className="absolute top-3 left-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-eco-gradient text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <img 
                    src={user.avatar_url || `https://i.pravatar.cc/100?img=${index + 1}`} 
                    alt={user.full_name} 
                    className="rounded-full object-cover w-full h-full border-4 border-eco-teal"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Award className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-eco-blue mb-1">{user.full_name}</h3>
                <p className="text-gray-600 text-sm mb-4">กิจกรรมที่ร่วม: {user.activities_count || 0}</p>
                <div className="bg-eco-light rounded-full px-4 py-2 font-semibold text-eco-blue">
                  {user.eco_points} แต้ม
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild className="bg-eco-gradient hover:opacity-90">
            <Link to="/leaderboard">ดูอันดับทั้งหมด</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
