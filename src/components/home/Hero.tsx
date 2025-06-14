
import { Button } from '@/components/ui/button';
import { ArrowRight, Recycle, Leaf, TreePine } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative py-20 bg-eco-gradient overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-bounce">
          <Leaf className="h-12 w-12 text-white" />
        </div>
        <div className="absolute top-32 right-20 animate-pulse">
          <TreePine className="h-16 w-16 text-white" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-bounce delay-300">
          <Recycle className="h-14 w-14 text-white" />
        </div>
      </div>
      
      <div className="container relative px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              CareWorld
              <span className="block text-eco-yellow">รักษ์โลก</span>
              <span className="block text-3xl md:text-4xl">เพื่อโลกที่ยั่งยืน</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-eco-light mb-8 leading-relaxed">
              ร่วมกันสร้างการเปลี่ยนแปลงเพื่อสิ่งแวดล้อม ผ่านกิจกรรมที่สร้างสรรค์และยั่งยืน
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-eco-teal hover:bg-eco-light hover:text-eco-blue transition-all duration-300 shadow-lg"
              >
                เริ่มต้นการเปลี่ยนแปลง
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-eco-teal transition-all duration-300"
              >
                เรียนรู้เพิ่มเติม
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-eco-teal/20 to-eco-blue/20 backdrop-blur-sm border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80" 
                alt="โลกสีเขียวและต้นไม้" 
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-eco-teal/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
