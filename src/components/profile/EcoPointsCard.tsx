
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserPointLogs } from '@/hooks/useUserPointLogs';

type EcoPointsCardProps = {
  points: number;
};

export function EcoPointsCard({ points }: EcoPointsCardProps) {
  const { totalPoints, loading } = useUserPointLogs();
  
  // Use totalPoints from the point logs system if available, otherwise fallback to props
  const displayPoints = totalPoints !== undefined ? totalPoints : points;

  return (
    <>
      <CardHeader>
        <CardTitle>คะแนนสะสม</CardTitle>
        <CardDescription>คะแนนสะสมจากกิจกรรมด้านสิ่งแวดล้อม</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-teal mx-auto mb-2"></div>
            ) : (
              <p className="text-4xl font-bold text-eco-teal">{displayPoints || 0}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">คะแนน ECO</p>
          </div>
        </div>
      </CardContent>
    </>
  );
}
