
type GalleryEmptyStateProps = {
  showUserActivities?: boolean;
};

export function GalleryEmptyState({ showUserActivities = false }: GalleryEmptyStateProps) {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500">
        {showUserActivities ? 'คุณยังไม่มีกิจกรรมที่บันทึกไว้' : 'ยังไม่มีกิจกรรมที่แสดง'}
      </p>
    </div>
  );
}
