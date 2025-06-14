
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ActivityFormHeaderProps {
  isEditing: boolean;
}

export const ActivityFormHeader = ({ isEditing }: ActivityFormHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>{isEditing ? 'แก้ไขกิจกรรม' : 'อัปโหลดกิจกรรม'}</CardTitle>
      <CardDescription>
        {isEditing 
          ? 'แก้ไขรายละเอียดกิจกรรมของคุณ' 
          : 'แชร์ภาพกิจกรรมรักษ์โลกของคุณเพื่อสะสมแต้ม'}
      </CardDescription>
    </CardHeader>
  );
};
