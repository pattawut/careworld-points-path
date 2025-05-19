
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Campaigns as CampaignsList } from '@/components/home/Campaigns';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card } from '@/components/ui/card';

const Campaigns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-eco-light">
        <div className="container px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold text-eco-blue mb-8">แคมเปญทั้งหมด</h1>
          
          <div className="mb-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>ประเภทแคมเปญ</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-eco-teal/50 to-eco-blue/50 p-6 no-underline outline-none focus:shadow-md"
                            href="/campaigns"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-white">
                              แคมเปญทั้งหมด
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              ดูแคมเปญทั้งหมดที่พร้อมให้คุณร่วมกิจกรรม
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">ลดการใช้พลาสติก</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญเกี่ยวกับการลดการใช้พลาสติกแบบใช้ครั้งเดียว
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">รีไซเคิล</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญเกี่ยวกับการคัดแยกและรีไซเคิลขยะ
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">ประหยัดพลังงาน</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญเกี่ยวกับการประหยัดพลังงานและทรัพยากร
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>สถานะ</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">กำลังดำเนินการ</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญที่กำลังดำเนินการอยู่ในปัจจุบัน
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">กำลังจะมาถึง</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญที่จะเริ่มในอนาคตอันใกล้
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">สิ้นสุดแล้ว</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              แคมเปญที่สิ้นสุดไปแล้ว
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <CampaignsList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Campaigns;
