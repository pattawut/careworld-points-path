
interface CampaignsHeaderProps {}

export const CampaignsHeader = ({}: CampaignsHeaderProps) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-eco-blue mb-4">
        แคมเปญกิจกรรม
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        ร่วมกิจกรรมเพื่อสิ่งแวดล้อมและรับคะแนนเพื่อแลกของรางวัล
      </p>
    </div>
  );
};
