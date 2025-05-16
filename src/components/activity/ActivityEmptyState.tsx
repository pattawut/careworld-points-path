
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const ActivityEmptyState = () => {
  return (
    <Card className="border-none shadow-md text-center py-10">
      <CardContent>
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-xl font-semibold text-eco-blue mb-2">ยังไม่มีกิจกรรม</h3>
        <p className="text-gray-500 mb-4">คุณยังไม่มีการแชร์กิจกรรมรักษ์โลกในระบบ</p>
      </CardContent>
    </Card>
  );
};
