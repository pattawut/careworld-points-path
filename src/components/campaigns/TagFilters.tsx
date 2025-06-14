
import { Badge } from '@/components/ui/badge';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagFiltersProps {
  tags: Tag[];
  selectedTag: string;
  onTagSelect: (tagName: string) => void;
}

export const TagFilters = ({ tags, selectedTag, onTagSelect }: TagFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-12 justify-center">
      <Badge
        variant={selectedTag === 'ทั้งหมด' ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-eco-teal hover:text-white transition-colors"
        onClick={() => onTagSelect('ทั้งหมด')}
      >
        ทั้งหมด
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTag === tag.name ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-eco-teal hover:text-white transition-colors"
          style={{
            backgroundColor: selectedTag === tag.name ? tag.color : 'transparent',
            color: selectedTag === tag.name ? 'white' : tag.color,
            borderColor: tag.color
          }}
          onClick={() => onTagSelect(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};
