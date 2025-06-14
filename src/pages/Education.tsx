
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { EducationHero } from '@/components/education/EducationHero';
import { ArticleCard } from '@/components/education/ArticleCard';
import { VideoCard } from '@/components/education/VideoCard';
import { ArticleModal } from '@/components/education/ArticleModal';
import { EducationTips } from '@/components/education/EducationTips';
import { CallToActionSection } from '@/components/education/CallToActionSection';

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

const Education = () => {
  const [articles, setArticles] = useState<EducationTag[]>([]);
  const [videos, setVideos] = useState<EducationTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<EducationTag | null>(null);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEducationTags();
  }, []);

  const fetchEducationTags = async () => {
    try {
      const { data, error } = await supabase
        .from('education_tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type cast the data to ensure proper typing
      const typedData = (data || []).map(item => ({
        ...item,
        type: item.type as 'article' | 'video'
      })) as EducationTag[];

      const articleData = typedData.filter(tag => tag.type === 'article');
      const videoData = typedData.filter(tag => tag.type === 'video');

      setArticles(articleData);
      setVideos(videoData);
    } catch (error) {
      console.error('Error fetching education tags:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลความรู้ได้"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: EducationTag) => {
    setSelectedArticle(article);
    setArticleModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <EducationHero />

        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-12">
                <TabsTrigger value="articles" className="text-base">
                  บทความความรู้
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-base">
                  วิดีโอความรู้
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-eco-blue mb-4">
                    หัวข้อการเรียนรู้
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    ความรู้พื้นฐานที่จำเป็นสำหรับการดูแลสิ่งแวดล้อมในชีวิตประจำวัน
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {articles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article}
                      onArticleClick={handleArticleClick}
                    />
                  ))}
                </div>

                {articles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">ยังไม่มีบทความความรู้</p>
                  </div>
                )}

                <EducationTips />
              </TabsContent>

              <TabsContent value="videos" className="space-y-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-eco-blue mb-4">
                    วิดีโอเพื่อการเรียนรู้
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    เรียนรู้ผ่านคลิปวิดีโอที่น่าสนใจและเข้าใจง่าย
                  </p>
                </div>

                <div className="space-y-12">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                {videos.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">ยังไม่มีวิดีโอความรู้</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <CallToActionSection />
      </main>
      <Footer />

      <ArticleModal 
        isOpen={articleModalOpen}
        onClose={setArticleModalOpen}
        article={selectedArticle}
      />
    </div>
  );
};

export default Education;
