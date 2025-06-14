
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface ArticleModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  article: EducationTag | null;
}

export const ArticleModal = ({ isOpen, onClose, article }: ArticleModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-eco-blue flex items-center gap-3">
            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: article?.color + '20' }}>
              <BookOpen className="h-4 w-4" style={{ color: article?.color }} />
            </div>
            {article?.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            {article?.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {article?.image_url && (
            <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
              <img 
                src={article.image_url}
                alt={article.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {article?.content && (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
