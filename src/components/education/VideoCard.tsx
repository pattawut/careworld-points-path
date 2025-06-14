
import React from 'react';
import { Button } from '@/components/ui/button';
import { Youtube } from 'lucide-react';

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

interface VideoCardProps {
  video: EducationTag;
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
        {video.youtube_url && getYouTubeVideoId(video.youtube_url) ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.youtube_url)}`}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Youtube className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full flex items-center justify-center" style={{ backgroundColor: video.color + '20' }}>
            <Youtube className="h-4 w-4" style={{ color: video.color }} />
          </div>
        </div>
        <h3 className="text-xl font-bold text-eco-blue">
          {video.name}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {video.description}
        </p>
        {video.youtube_url && (
          <div className="pt-4">
            <Button 
              variant="outline" 
              className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white"
              onClick={() => window.open(video.youtube_url, '_blank')}
            >
              ดูใน YouTube
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
