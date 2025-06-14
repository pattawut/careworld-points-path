
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf } from 'lucide-react';

export const EducationTips = () => {
  const tips = [
    {
      title: 'เคล็ดลับประจำวัน',
      items: [
        'ใช้ขยะเปียกทำปุ่ยหมักสำหรับต้นไม้',
        'นำขวดพลาสติกมาทำกระถางต้นไม้',
        'ใช้กระดาษสองหน้าก่อนทิ้ง',
        'เก็บน้ำฝนมาใช้รดต้นไม้'
      ]
    },
    {
      title: 'ผลกระทบต่อสิ่งแวดล้อม',
      items: [
        'พลาสติก 1 ใบใช้เวลาย่อยสลาย 100-1000 ปี',
        'การแยกขยะช่วยลดการปล่อยก๊าซเรือนกระจก',
        'การใช้ถุงผ้า 1 ใบ = ลดขยะพลาสติก 170 ใบต่อปี',
        'ปลูกต้นไม้ 1 ต้น = ดูดซับ CO2 ได้ 48 ปอนด์ต่อปี'
      ]
    }
  ];

  return (
    <div className="py-20 bg-eco-light">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {tips.map((tip, index) => (
          <Card key={index} className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-eco-blue flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tip.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">
                      {itemIndex + 1}
                    </Badge>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
