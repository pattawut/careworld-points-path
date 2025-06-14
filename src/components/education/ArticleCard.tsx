
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface EducationTag {
  id: string;
  name: string;
  description: string;
  type: 'article' | 'video';
  color: string;
  content?: string;
  youtube_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface ArticleCardProps {
  article: EducationTag;
  onArticleClick: (article: EducationTag) => void;
}

export const ArticleCard = ({ article, onArticleClick }: ArticleCardProps) => {
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Card 
      className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => onArticleClick(article)}
    >
      {article.image_url && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img 
            src={article.image_url}
            alt={article.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: article.color + '20' }}>
            <BookOpen className="h-4 w-4" style={{ color: article.color }} />
          </div>
          <CardTitle className="text-eco-blue">{article.name}</CardTitle>
        </div>
        <p className="text-gray-600">{article.description}</p>
      </CardHeader>
      <CardContent>
        {article.content && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 line-clamp-3">
              {formatContent(article.content.substring(0, 150) + '...')}
            </p>
          </div>
        )}
        <Button variant="outline" className="mt-4 w-full">
          อ่านเพิ่มเติม
        </Button>
      </CardContent>
    </Card>
  );
};
