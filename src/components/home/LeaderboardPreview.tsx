
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award } from 'lucide-react';

export const LeaderboardPreview = () => {
  const topUsers = [
    {
      id: 1,
      name: 'สมชาย ใจดี',
      points: 530,
      activities: 42,
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      id: 2,
      name: 'สมหญิง รักโลก',
      points: 480,
      activities: 38,
      avatar: 'https://i.pravatar.cc/100?img=5'
    },
    {
      id: 3,
      name: 'ภาสกร นิยมไทย',
      points: 450,
      activities: 36,
      avatar: 'https://i.pravatar.cc/100?img=3'
    }
  ];

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
          {topUsers.map((user, index) => (
            <Card key={user.id} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow p-6 text-center">
              <div className="absolute top-3 left-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-eco-gradient text-white font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="rounded-full object-cover w-full h-full border-4 border-eco-teal"
                  />
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Award className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-eco-blue mb-1">{user.name}</h3>
                <p className="text-gray-600 text-sm mb-4">กิจกรรมที่ร่วม: {user.activities}</p>
                <div className="bg-eco-light rounded-full px-4 py-2 font-semibold text-eco-blue">
                  {user.points} แต้ม
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
