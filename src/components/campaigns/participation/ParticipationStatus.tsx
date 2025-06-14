
import { Award } from 'lucide-react';

interface ParticipationStatusProps {
  userHasParticipated: boolean;
}

export const ParticipationStatus = ({ userHasParticipated }: ParticipationStatusProps) => {
  if (!userHasParticipated) return null;

  return (
    <div className="text-center py-4">
      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
        <Award className="h-8 w-8 text-green-600" />
      </div>
      <p className="text-sm text-green-600 font-medium">
        คุณเคยเข้าร่วมแคมเปญนี้แล้ว แต่สามารถเข้าร่วมอีกครั้งได้เพื่อสะสมคะแนนเพิ่มเติม
      </p>
    </div>
  );
};
