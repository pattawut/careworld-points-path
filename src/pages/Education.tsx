import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecycleIcon, Leaf, TreePine, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Education = () => {
  const educationCards = [
    {
      title: 'การแยกขยะอย่างถูกต้อง',
      description: 'เรียนรู้วิธีการแยกขยะแต่ละประเภทเพื่อให้เกิดประโยชน์สูงสุด',
      icon: <RecycleIcon className="h-8 w-8 text-eco-teal" />,
      content: [
        'ขยะเปียก: เศษอาหาร ใบไม้ เหลือจากการปรุงอาหาร',
        'ขยะแห้ง: กระดาษ พลาสติก แก้ว โลหะ',
        'ขยะอันตราย: ถ่านไฟฉาย หลอดไฟ ยา เคมี',
        'ขยะรีไซเคิล: ขวดพลาสติก กระป๋อง กระดาษ'
      ],
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'ลดการใช้พลาสติก',
      description: 'วิธีง่ายๆ ในการลดการใช้พลาสติกในชีวิตประจำวัน',
      icon: <Leaf className="h-8 w-8 text-eco-teal" />,
      content: [
        'ใช้ถุงผ้าแทนถุงพลาสติก',
        'ใช้แก้วน้ำและหลอดส่วนตัว',
        'เลือกซื้อสินค้าที่มีบรรจุภัณฑ์น้อย',
        'นำภาชนะไปซื้ออาหารแทนโฟมหรือถุงพลาสติก'
      ],
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'การปลูกต้นไม้และดูแลสิ่งแวดล้อม',
      description: 'เริ่มต้นสร้างสีเขียวรอบตัวเพื่อโลกที่ดีขึ้น',
      icon: <TreePine className="h-8 w-8 text-eco-teal" />,
      content: [
        'ปลูกต้นไม้ในบ้านและชุมชน',
        'ดูแลพื้นที่สีเขียวให้เจริญเติบโต',
        'ใช้น้ำอย่างประหยัดและรู้คุณค่า',
        'ร่วมกิจกรรมอนุรักษ์ธรรมชาติในชุมชน'
      ],
      image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'การประหยัดพลังงาน',
      description: 'เทคนิคง่ายๆ ในการใช้พลังงานอย่างมีประสิทธิภาพ',
      icon: <Droplets className="h-8 w-8 text-eco-teal" />,
      content: [
        'ปิดไฟและเครื่องใช้ไฟฟ้าเมื่อไม่ใช้',
        'ใช้หลอดไฟ LED ประหยัดพลังงาน',
        'ตั้งอุณหภูมิแอร์ที่เหมาะสม 25-26 องศา',
        'เลือกใช้เครื่องใช้ไฟฟ้าที่ประหยัดพลังงาน'
      ],
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80'
    }
  ];

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

        {/* Education Cards */}
        <section className="py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-eco-blue mb-4">
                หัวข้อการเรียนรู้
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                ความรู้พื้นฐานที่จำเป็นสำหรับการดูแลสิ่งแวดล้อมในชีวิตประจำวัน
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {educationCards.map((card, index) => (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {card.icon}
                      <CardTitle className="text-eco-blue">{card.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{card.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {card.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-eco-teal rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-20 bg-eco-light">
          <div className="container px-4 md:px-6">
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
    </div>
  );
};

export default Education;
