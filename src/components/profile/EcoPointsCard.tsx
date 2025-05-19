
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type EcoPointsCardProps = {
  points: number;
};

export function EcoPointsCard({ points }: EcoPointsCardProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>คะแนนสะสม</CardTitle>
        <CardDescription>คะแนนสะสมจากกิจกรรมด้านสิ่งแวดล้อม</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-eco-teal">{points || 0}</p>
            <p className="text-sm text-gray-500 mt-2">คะแนน ECO</p>
          </div>
        </div>
      </CardContent>
    </>
  );
}
