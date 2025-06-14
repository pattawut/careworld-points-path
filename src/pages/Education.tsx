
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RecycleIcon, Leaf, TreePine, Droplets, Youtube, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

  // ฟังก์ชันแปลงข้อความให้แสดงบรรทัดใหม่
  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // ฟังก์ชันเปิดบทความแบบเต็ม
  const handleArticleClick = (article: EducationTag) => {
    setSelectedArticle(article);
    setArticleModalOpen(true);
  };

  // ฟังก์ชันดึง YouTube Video ID จาก URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // ฟังก์ชันสำหรับสร้าง YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const tips = [
    {
      title: 'เคล็ดลับประจำวัน',
      items: [
        'ใช้ขยะเปียกทำปุ่ยหมักสำหรับต้นไม้',
        'นำขวดพลาสติกมาทำกระถางต้นไม้',
        'ใช้กระดาษสองหน้าก่อนทิ้ง',
        'เก็บน้ำฝนมาใช้รดต้นไม้'
      ]
    },
    {
      title: 'ผลกระทบต่อสิ่งแวดล้อม',
      items: [
        'พลาสติก 1 ใบใช้เวลาย่อยสลาย 100-1000 ปี',
        'การแยกขยะช่วยลดการปล่อยก๊าซเรือนกระจก',
        'การใช้ถุงผ้า 1 ใบ = ลดขยะพลาสติก 170 ใบต่อปี',
        'ปลูกต้นไม้ 1 ต้น = ดูดซับ CO2 ได้ 48 ปอนด์ต่อปี'
      ]
    }
  ];

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
        {/* Hero Section */}
        <section className="relative py-20 bg-eco-gradient">
          <div className="container px-4 md:px-6">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                ศูนย์ความรู้
              </h1>
              <p className="text-xl md:text-2xl text-eco-light mb-8">
                เรียนรู้วิธีการดูแลสิ่งแวดล้อมและสร้างโลกที่ยั่งยืน
              </p>
              <Badge className="bg-white/20 text-white text-lg px-6 py-2">
                รู้จัก รู้ทำ รู้คิด เพื่อโลกใส
              </Badge>
            </div>
          </div>
        </section>

        {/* Main Content with Tabs */}
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

              {/* Articles Tab */}
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
                    <Card 
                      key={article.id} 
                      className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => handleArticleClick(article)}
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
                  ))}
                </div>

                {articles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">ยังไม่มีบทความความรู้</p>
                  </div>
                )}

                {/* Tips Section */}
                <div className="py-20 bg-eco-light">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {tips.map((tip, index) => (
                      <Card key={index} className="border-none shadow-md">
                        <CardHeader>
                          <CardTitle className="text-eco-blue flex items-center gap-2">
                            <Leaf className="h-5 w-5" />
                            {tip.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {tip.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <Badge variant="outline" className="text-xs px-2 py-1 mt-0.5">
                                  {itemIndex + 1}
                                </Badge>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Videos Tab */}
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
                  {videos.map((video, index) => (
                    <div key={video.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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

        {/* Call to Action */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-eco-blue mb-4">
              พร้อมเริ่มต้นแล้วหรือยัง?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              นำความรู้ที่ได้ไปใช้ในชีวิตประจำวัน และร่วมสร้างการเปลี่ยนแปลงเพื่อโลกที่ยั่งยืน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-eco-gradient hover:opacity-90">
                เริ่มทำกิจกรรม
              </Button>
              <Button variant="outline" size="lg" className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                ดูแคมเปญทั้งหมด
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Article Modal */}
      <Dialog open={articleModalOpen} onOpenChange={setArticleModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-eco-blue flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: selectedArticle?.color + '20' }}>
                <BookOpen className="h-4 w-4" style={{ color: selectedArticle?.color }} />
              </div>
              {selectedArticle?.name}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedArticle?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            {selectedArticle?.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                <img 
                  src={selectedArticle.image_url}
                  alt={selectedArticle.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {selectedArticle?.content && (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedArticle.content}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Education;
