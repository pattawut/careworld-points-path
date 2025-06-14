
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, BookOpen, Youtube, Upload, X } from 'lucide-react';

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

export const AdminEducationTags = () => {
  const [tags, setTags] = useState<EducationTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<EducationTag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'article' as 'article' | 'video',
    color: '#10B981',
    content: '',
    youtube_url: '',
    image_url: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  // Mock data สำหรับตัวอย่าง
  const mockTags: EducationTag[] = [
    {
      id: '1',
      name: 'การแยกขยะ',
      description: 'วิธีการแยกขยะอย่างถูกต้องและมีประสิทธิภาพ',
      type: 'article',
      color: '#10B981',
      content: 'เนื้อหาเกี่ยวกับการแยกขยะ...',
      image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'ลดใช้พลาสติก',
      description: 'วิธีการลดการใช้พลาสติกในชีวิตประจำวัน',
      type: 'video',
      color: '#3B82F6',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'รีไซเคิล',
      description: 'การนำของเหลือใช้มาใช้ประโยชน์ใหม่',
      type: 'article',
      color: '#F59E0B',
      content: 'เนื้อหาเกี่ยวกับการรีไซเคิล...',
      image_url: 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=400&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // ใช้ mock data แทนการเรียก API จริง
    setTags(mockTags);
  }, []);

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

  // ฟังก์ชันจำลองการอัปโหลดรูป
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      // จำลองการอัปโหลด - ในความเป็นจริงควรอัปโหลดไปยัง Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // สร้าง URL ชั่วคราวสำหรับรูปที่อัปโหลด
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      
      toast({
        title: "สำเร็จ!",
        description: "อัปโหลดรูปภาพเรียบร้อยแล้ว"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปโหลดรูปภาพได้"
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาใส่ชื่อหัวข้อ"
      });
      return;
    }

    if (formData.type === 'video' && !formData.youtube_url.trim()) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "กรุณาใส่ลิงก์ YouTube"
      });
      return;
    }

    try {
      const newTag: EducationTag = {
        id: editingTag?.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        color: formData.color,
        content: formData.type === 'article' ? formData.content : undefined,
        youtube_url: formData.type === 'video' ? formData.youtube_url : undefined,
        image_url: formData.image_url || undefined,
        created_at: editingTag?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingTag) {
        setTags(prev => prev.map(tag => tag.id === editingTag.id ? newTag : tag));
        toast({
          title: "สำเร็จ!",
          description: "แก้ไขหัวข้อความรู้เรียบร้อยแล้ว"
        });
      } else {
        setTags(prev => [...prev, newTag]);
        toast({
          title: "สำเร็จ!",
          description: "เพิ่มหัวข้อความรู้เรียบร้อยแล้ว"
        });
      }

      setDialogOpen(false);
      setEditingTag(null);
      setFormData({ name: '', description: '', type: 'article', color: '#10B981', content: '', youtube_url: '', image_url: '' });
    } catch (error) {
      console.error('Error saving education tag:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกหัวข้อความรู้ได้"
      });
    }
  };

  const handleEdit = (tag: EducationTag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description,
      type: tag.type,
      color: tag.color || '#10B981',
      content: tag.content || '',
      youtube_url: tag.youtube_url || '',
      image_url: tag.image_url || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = async (tag: EducationTag) => {
    if (!confirm(`คุณต้องการลบหัวข้อ "${tag.name}" หรือไม่?`)) {
      return;
    }

    try {
      setTags(prev => prev.filter(t => t.id !== tag.id));
      toast({
        title: "สำเร็จ!",
        description: "ลบหัวข้อความรู้เรียบร้อยแล้ว"
      });
    } catch (error) {
      console.error('Error deleting education tag:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบหัวข้อความรู้ได้"
      });
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    setFormData({ name: '', description: '', type: 'article', color: '#10B981', content: '', youtube_url: '', image_url: '' });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">จัดการหัวข้อความรู้</h3>
          <p className="text-sm text-gray-600">สร้าง แก้ไข และจัดการหัวข้อความรู้สำหรับหน้าศูนย์ความรู้</p>
        </div>
        <Button onClick={handleCreate} className="bg-eco-gradient">
          <Plus className="h-4 w-4 mr-2" />
          เพิ่มหัวข้อความรู้
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <Card key={tag.id} className="border-none shadow-md">
            <CardHeader className="pb-3">
              {/* รูปภาพพรีวิว */}
              {(tag.image_url || (tag.youtube_url && getYouTubeThumbnail(tag.youtube_url))) && (
                <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                  <img 
                    src={tag.type === 'video' && tag.youtube_url ? getYouTubeThumbnail(tag.youtube_url)! : tag.image_url!}
                    alt={tag.name}
                    className="w-full h-full object-cover"
                  />
                  {tag.type === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Youtube className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-eco-teal/10 flex items-center justify-center">
                    {tag.type === 'video' ? (
                      <Youtube className="h-4 w-4 text-red-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-eco-teal" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{tag.name}</CardTitle>
                </div>
                <Badge 
                  variant="outline"
                  style={{ 
                    backgroundColor: tag.color + '20', 
                    color: tag.color, 
                    borderColor: tag.color 
                  }}
                >
                  {tag.type === 'video' ? 'วิดีโอ' : 'บทความ'}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {tag.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ประเภท:</span>
                  <span className="font-medium">
                    {tag.type === 'video' ? 'วิดีโอ' : 'บทความ'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">สี:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: tag.color }}
                    ></div>
                    <span className="font-medium">{tag.color}</span>
                  </div>
                </div>

                {tag.type === 'video' && tag.youtube_url && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">YouTube:</span>
                    <span className="font-medium text-xs truncate max-w-[100px]">
                      {getYouTubeVideoId(tag.youtube_url)}
                    </span>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(tag)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    แก้ไข
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tag)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tags.length === 0 && (
        <Card className="border-none shadow-md">
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">ยังไม่มีหัวข้อความรู้</p>
            <Button onClick={handleCreate} className="bg-eco-gradient">
              เพิ่มหัวข้อความรู้แรก
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'แก้ไขหัวข้อความรู้' : 'เพิ่มหัวข้อความรู้ใหม่'}
            </DialogTitle>
            <DialogDescription>
              {editingTag ? 'แก้ไขข้อมูลหัวข้อความรู้' : 'สร้างหัวข้อความรู้ใหม่สำหรับหน้าศูนย์ความรู้'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อหัวข้อ</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="เช่น การแยกขยะ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">ประเภท</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'article' | 'video' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eco-teal"
                  required
                >
                  <option value="article">บทความ</option>
                  <option value="video">วิดีโอ</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="อธิบายเนื้อหาของหัวข้อนี้"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">สี</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#10B981"
                  className="flex-1"
                />
              </div>
            </div>

            {formData.type === 'article' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="article-image">รูปภาพประกอบบทความ</Label>
                  <div className="space-y-3">
                    {formData.image_url && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80"
                          onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImage}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">เนื้อหา</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="เนื้อหาของบทความ..."
                    rows={6}
                  />
                </div>
              </>
            )}

            {formData.type === 'video' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">ลิงก์ YouTube</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    type="url"
                  />
                </div>
                
                {formData.youtube_url && getYouTubeThumbnail(formData.youtube_url) && (
                  <div className="space-y-2">
                    <Label>พรีวิววิดีโอ</Label>
                    <div className="aspect-video rounded-lg overflow-hidden border">
                      <img 
                        src={getYouTubeThumbnail(formData.youtube_url)!}
                        alt="YouTube Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" className="bg-eco-gradient">
                {editingTag ? 'บันทึกการแก้ไข' : 'เพิ่มหัวข้อความรู้'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
