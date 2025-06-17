
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Minus, Plus, Gift } from 'lucide-react';
import { useUserPointLogs } from '@/hooks/useUserPointLogs';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

export const PointLogsCard = () => {
  const { pointLogs, loading } = useUserPointLogs();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'earned':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'deducted':
        return <Minus className="h-4 w-4 text-red-600" />;
      case 'bonus':
        return <Gift className="h-4 w-4 text-blue-600" />;
      default:
        return <Award className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'earned':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deducted':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'bonus':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionText = (actionType: string) => {
    switch (actionType) {
      case 'earned':
        return 'ได้รับ';
      case 'deducted':
        return 'หัก';
      case 'bonus':
        return 'โบนัส';
      case 'penalty':
        return 'ปรับ';
      default:
        return actionType;
    }
  };

  if (loading) {
    return (
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-eco-blue">ประวัติคะแนน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-teal"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-eco-blue">ประวัติคะแนน</CardTitle>
      </CardHeader>
      <CardContent>
        {pointLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>ยังไม่มีประวัติคะแนน</p>
            <p className="text-sm">เริ่มทำกิจกรรมเพื่อสะสมคะแนนกันเถอะ!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pointLogs.map((log) => {
              const totalPoints = log.points * log.quantity;
              return (
                <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getActionIcon(log.action_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {log.description || `${log.action_type} คะแนน`}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {format(new Date(log.created_at), 'dd MMM yyyy เวลา HH:mm', { locale: th })}
                        </p>
                        {log.activity_type && (
                          <Badge variant="outline" className="text-xs">
                            {log.activity_type}
                          </Badge>
                        )}
                        {log.quantity > 1 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            จำนวน {log.quantity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getActionColor(log.action_type)}>
                      {getActionText(log.action_type)}
                    </Badge>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        log.action_type === 'earned' || log.action_type === 'bonus' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {log.action_type === 'earned' || log.action_type === 'bonus' ? '+' : '-'}{totalPoints}
                      </span>
                      {log.quantity > 1 && (
                        <p className="text-xs text-gray-500">
                          ({log.points} × {log.quantity})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
