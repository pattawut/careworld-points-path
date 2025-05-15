
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RecycleIcon, Leaf } from "lucide-react";

const Education = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-eco-gradient opacity-90 -z-10"></div>
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10 -z-10 leaf-pattern"></div>
          
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ความรู้เกี่ยวกับความยั่งยืน
              </h1>
              <p className="text-lg text-white/80 mb-8">
                เรียนรู้เกี่ยวกับการจัดการขยะอย่างยั่งยืน การคัดแยกขยะ และการลดปริมาณขยะพลาสติกในชีวิตประจำวัน
              </p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16 bg-eco-light">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="waste-types" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/50 p-1">
                  <TabsTrigger value="waste-types">ประเภทของขยะ</TabsTrigger>
                  <TabsTrigger value="recycling">การรีไซเคิล</TabsTrigger>
                  <TabsTrigger value="plastic-reduction">ลดพลาสติก</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Waste Types Tab */}
              <TabsContent value="waste-types">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Card className="border-none shadow-lg h-full">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-eco-blue flex items-center gap-2">
                          <RecycleIcon className="h-5 w-5 text-eco-teal" />
                          ประเภทของขยะ
                        </CardTitle>
                        <CardDescription>
                          การแบ่งประเภทขยะเพื่อการจัดการที่เหมาะสม
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p>
                          การคัดแยกขยะเป็นขั้นตอนสำคัญในการจัดการขยะอย่างยั่งยืน โดยทั่วไปสามารถแบ่งขยะออกเป็น 4 ประเภทหลัก ดังนี้
                        </p>
                        
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger className="text-left text-eco-blue font-medium">
                              ขยะรีไซเคิล (สีเหลือง)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p>
                                  ขยะรีไซเคิล คือ ขยะที่สามารถนำกลับมาแปรรูปใช้ประโยชน์ใหม่ได้ เช่น ขวดพลาสติก กระดาษ กระป๋องอลูมิเนียม แก้ว โลหะต่างๆ
                                </p>
                                <p className="font-medium">ตัวอย่างขยะรีไซเคิล:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                  <li>ขวดพลาสติก PET เช่น ขวดน้ำดื่ม</li>
                                  <li>กระป๋องอลูมิเนียม กระป๋องเครื่องดื่ม</li>
                                  <li>กระดาษ หนังสือพิมพ์ นิตยสาร กล่องกระดาษ</li>
                                  <li>ขวดแก้ว</li>
                                  <li>โลหะต่างๆ</li>
                                </ul>
                                <p>
                                  <strong>ข้อควรระวัง:</strong> ควรล้างทำความสะอาดก่อนนำไปรีไซเคิล
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-2">
                            <AccordionTrigger className="text-left text-eco-blue font-medium">
                              ขยะอินทรีย์หรือขยะย่อยสลายได้ (สีเขียว)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p>
                                  ขยะอินทรีย์ คือ ขยะที่ย่อยสลายได้ตามธรรมชาติ สามารถนำไปทำปุ๋ยหมักหรือน้ำหมักชีวภาพได้
                                </p>
                                <p className="font-medium">ตัวอย่างขยะอินทรีย์:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                  <li>เศษอาหาร</li>
                                  <li>เปลือกผลไม้</li>
                                  <li>ใบไม้ กิ่งไม้</li>
                                  <li>เศษผัก</li>
                                  <li>เศษเนื้อสัตว์ กระดูก</li>
                                </ul>
                                <p>
                                  <strong>ประโยชน์:</strong> สามารถนำไปทำเป็นปุ๋ยหมัก ลดปริมาณขยะและก๊าซเรือนกระจก
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-3">
                            <AccordionTrigger className="text-left text-eco-blue font-medium">
                              ขยะทั่วไป (สีน้ำเงิน)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p>
                                  ขยะทั่วไป คือ ขยะที่ย่อยสลายยาก ไม่สามารถนำกลับมารีไซเคิลได้ หรือการรีไซเคิลไม่คุ้มทุน
                                </p>
                                <p className="font-medium">ตัวอย่างขยะทั่วไป:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                  <li>โฟม</li>
                                  <li>ถุงพลาสติกที่ปนเปื้อน</li>
                                  <li>ซองบรรจุภัณฑ์อาหาร</li>
                                  <li>หลอดดูดน้ำ</li>
                                  <li>กระดาษเคลือบพลาสติก</li>
                                </ul>
                                <p>
                                  <strong>การจัดการ:</strong> ส่วนใหญ่จะถูกนำไปฝังกลบหรือเผาทำลาย
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="item-4">
                            <AccordionTrigger className="text-left text-eco-blue font-medium">
                              ขยะอันตราย (สีแดง)
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p>
                                  ขยะอันตราย คือ ขยะที่มีสารพิษหรืออันตราย จำเป็นต้องได้รับการจัดการพิเศษ
                                </p>
                                <p className="font-medium">ตัวอย่างขยะอันตราย:</p>
                                <ul className="list-disc pl-6 space-y-1">
                                  <li>แบตเตอรี่</li>
                                  <li>หลอดไฟ</li>
                                  <li>กระป๋องสเปรย์</li>
                                  <li>ยาหมดอายุ</li>
                                  <li>อุปกรณ์อิเล็กทรอนิกส์</li>
                                  <li>ภาชนะบรรจุสารเคมี</li>
                                </ul>
                                <p>
                                  <strong>การจัดการ:</strong> ต้องแยกเก็บและส่งให้หน่วยงานที่มีความเชี่ยวชาญในการกำจัดขยะอันตรายโดยเฉพาะ
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-lg">
                      <CardContent className="pt-6">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1611284446314-60a58ac0dade?auto=format&fit=crop&w=1000&q=80" 
                            alt="การคัดแยกขยะ"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-eco-blue">เคล็ดลับการคัดแยกขยะ</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-sm">1</span>
                            </div>
                            <p className="text-gray-600">ทำความสะอาดภาชนะก่อนนำไปคัดแยก เพื่อลดกลิ่นเหม็นและเชื้อโรค</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-sm">2</span>
                            </div>
                            <p className="text-gray-600">ใช้ถังขยะแยกประเภทตามสี เพื่อให้ง่ายต่อการคัดแยก</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-sm">3</span>
                            </div>
                            <p className="text-gray-600">แยกฝาขวดพลาสติกออกจากขวด เพราะทำจากพลาสติกคนละชนิด</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-sm">4</span>
                            </div>
                            <p className="text-gray-600">ทิ้งขยะอันตรายในจุดรวบรวมขยะอันตรายที่กำหนดเท่านั้น</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-6 w-6 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-sm">5</span>
                            </div>
                            <p className="text-gray-600">หมั่นศึกษาสัญลักษณ์รีไซเคิลบนผลิตภัณฑ์เพื่อคัดแยกได้อย่างถูกต้อง</p>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Recycling Tab */}
              <TabsContent value="recycling">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-eco-blue flex items-center gap-2">
                        <RecycleIcon className="h-5 w-5 text-eco-teal" />
                        กระบวนการรีไซเคิล
                      </CardTitle>
                      <CardDescription>
                        เรียนรู้กระบวนการแปรรูปขยะให้กลับมาใช้ใหม่ได้
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        กระบวนการรีไซเคิลประกอบไปด้วยหลายขั้นตอน ตั้งแต่การเก็บรวบรวม การคัดแยก การทำความสะอาด การแปรรูป และการผลิตเป็นผลิตภัณฑ์ใหม่
                      </p>
                      
                      <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">1. การเก็บรวบรวม</h3>
                          <p className="text-gray-600">
                            ขยะรีไซเคิลจะถูกเก็บรวบรวมจากบ้านเรือน ธุรกิจ และจุดทิ้งขยะสาธารณะ โดยอาจมีการคัดแยกประเภทเบื้องต้น
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">2. การคัดแยก</h3>
                          <p className="text-gray-600">
                            วัสดุที่รวบรวมมาจะถูกคัดแยกตามประเภท เช่น พลาสติก กระดาษ แก้ว โลหะ ซึ่งอาจใช้แรงงานคนหรือเครื่องจักรอัตโนมัติ
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">3. การทำความสะอาด</h3>
                          <p className="text-gray-600">
                            วัสดุที่คัดแยกแล้วจะถูกทำความสะอาด เพื่อกำจัดสิ่งปนเปื้อนและเตรียมพร้อมสำหรับการแปรรูป
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">4. การแปรรูป</h3>
                          <p className="text-gray-600">
                            วัสดุจะถูกแปรรูปให้กลับมาเป็นวัตถุดิบใหม่ เช่น พลาสติกจะถูกหลอมและแปรรูปเป็นเม็ดพลาสติก กระดาษจะถูกย่อยเป็นเยื่อกระดาษ
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">5. การผลิตผลิตภัณฑ์ใหม่</h3>
                          <p className="text-gray-600">
                            วัตถุดิบที่ได้จากการรีไซเคิลจะถูกนำไปผลิตเป็นสินค้าหรือผลิตภัณฑ์ใหม่ เช่น กระดาษรีไซเคิล เสื้อจากขวด PET
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-eco-blue">ประโยชน์ของการรีไซเคิล</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-eco-teal/20">
                            <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mb-3">
                              <Leaf className="h-5 w-5 text-eco-teal" />
                            </div>
                            <h3 className="text-lg font-semibold text-eco-blue mb-2">ลดการใช้ทรัพยากรธรรมชาติ</h3>
                            <p className="text-gray-600 text-sm">
                              ลดการตัดไม้ทำลายป่า การขุดแร่ และการใช้น้ำมันในการผลิตวัสดุใหม่
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-eco-teal/20">
                            <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mb-3">
                              <RecycleIcon className="h-5 w-5 text-eco-teal" />
                            </div>
                            <h3 className="text-lg font-semibold text-eco-blue mb-2">ลดปริมาณขยะฝังกลบ</h3>
                            <p className="text-gray-600 text-sm">
                              ช่วยยืดอายุการใช้งานของหลุมฝังกลบ และลดมลพิษจากการฝังกลบ
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-eco-teal/20">
                            <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mb-3">
                              <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-eco-blue mb-2">ประหยัดพลังงาน</h3>
                            <p className="text-gray-600 text-sm">
                              การผลิตสินค้าจากวัสดุรีไซเคิลใช้พลังงานน้อยกว่าการผลิตจากวัตถุดิบใหม่
                            </p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg border border-eco-teal/20">
                            <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mb-3">
                              <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 6v7l5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-eco-blue mb-2">ลดการปล่อยก๊าซเรือนกระจก</h3>
                            <p className="text-gray-600 text-sm">
                              ลดปริมาณก๊าซเรือนกระจกที่เกิดจากการผลิตและกำจัดขยะ
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="font-semibold text-eco-blue mb-3">การรีไซเคิลในตัวเลข</h3>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-eco-teal/20">
                              <p className="text-gray-600">
                                <span className="font-semibold text-eco-blue">การรีไซเคิลอลูมิเนียม 1 ตัน</span> ช่วยประหยัดแร่บอกไซต์ได้ถึง 4 ตัน และประหยัดพลังงานได้ 95%
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-eco-teal/20">
                              <p className="text-gray-600">
                                <span className="font-semibold text-eco-blue">การรีไซเคิลกระดาษ 1 ตัน</span> ช่วยประหยัดต้นไม้ได้ 17 ต้น น้ำ 26,000 ลิตร และพื้นที่ฝังกลบ 3 ลูกบาศก์เมตร
                              </p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-eco-teal/20">
                              <p className="text-gray-600">
                                <span className="font-semibold text-eco-blue">การรีไซเคิลพลาสติก 1 ตัน</span> ช่วยประหยัดน้ำมันได้ 16 บาร์เรล และลดการปล่อยก๊าซเรือนกระจก 1-3 ตัน
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-lg">
                      <CardContent className="pt-6">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=1000&q=80" 
                            alt="การรีไซเคิล"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Plastic Reduction Tab */}
              <TabsContent value="plastic-reduction">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-eco-blue flex items-center gap-2">
                        <Leaf className="h-5 w-5 text-eco-teal" />
                        ปัญหาจากขยะพลาสติก
                      </CardTitle>
                      <CardDescription>
                        ผลกระทบต่อสิ่งแวดล้อมและสุขภาพ
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        พลาสติกเป็นวัสดุที่ย่อยสลายยาก ใช้เวลานานหลายร้อยปีในการสลายตัว ก่อให้เกิดปัญหาสิ่งแวดล้อมรุนแรง ทั้งในทะเล แม่น้ำ และบนบก
                      </p>
                      
                      <div className="space-y-6 mt-6">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">ผลกระทบต่อสิ่งแวดล้อมทางทะเล</h3>
                          <p className="text-gray-600">
                            ขยะพลาสติกในทะเลส่งผลให้สัตว์ทะเลกินเข้าไปเข้าใจผิดว่าเป็นอาหาร หรือติดอยู่ในขยะพลาสติกจนบาดเจ็บหรือเสียชีวิต
                          </p>
                          <div className="mt-3">
                            <img 
                              src="https://images.unsplash.com/photo-1621450254503-b92edad6adca?auto=format&fit=crop&w=500&q=80"
                              alt="ขยะพลาสติกในทะเล" 
                              className="rounded-lg w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">ปัญหาไมโครพลาสติก</h3>
                          <p className="text-gray-600">
                            พลาสติกขนาดเล็กที่แตกตัวจากชิ้นพลาสติกใหญ่ สามารถเข้าสู่ห่วงโซ่อาหารและร่างกายมนุษย์ ส่งผลกระทบต่อสุขภาพในระยะยาว
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">การปนเปื้อนในดินและน้ำ</h3>
                          <p className="text-gray-600">
                            พลาสติกปล่อยสารเคมีอันตรายลงสู่ดินและแหล่งน้ำ ส่งผลต่อระบบนิเวศและสิ่งมีชีวิตในธรรมชาติ
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-eco-blue">การเผาไหม้พลาสติก</h3>
                          <p className="text-gray-600">
                            การเผาขยะพลาสติกปล่อยสารพิษและก๊าซเรือนกระจกสู่ชั้นบรรยากาศ ส่งผลต่อมลภาวะทางอากาศและภาวะโลกร้อน
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-semibold text-eco-blue mb-3">สถิติที่น่าตกใจ</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-xs">!</span>
                            </div>
                            <p className="text-gray-600">
                              มีขยะพลาสติกราว 8 ล้านตันไหลลงสู่มหาสมุทรทุกปี
                            </p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-xs">!</span>
                            </div>
                            <p className="text-gray-600">
                              ถุงพลาสติกที่ใช้เพียงไม่กี่นาทีต้องใช้เวลาย่อยสลายถึง 500-1,000 ปี
                            </p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-xs">!</span>
                            </div>
                            <p className="text-gray-600">
                              แต่ละปีมีสัตว์ทะเลกว่า 100,000 ตัวเสียชีวิตจากการบริโภคหรือติดขยะพลาสติก
                            </p>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="mt-1 h-5 w-5 rounded-full bg-eco-teal/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-eco-teal font-medium text-xs">!</span>
                            </div>
                            <p className="text-gray-600">
                              มนุษย์บริโภคไมโครพลาสติกผ่านอาหาร น้ำดื่ม และอากาศที่หายใจเข้าไป
                            </p>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex flex-col gap-6">
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-eco-blue">วิธีลดการใช้พลาสติก</CardTitle>
                        <CardDescription>
                          เคล็ดลับง่ายๆ ที่ช่วยลดขยะพลาสติกในชีวิตประจำวัน
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                              <path d="M16 2v4M8 2v4M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-eco-blue">ใช้ถุงผ้าแทนถุงพลาสติก</h3>
                            <p className="text-gray-600 mt-1">
                              พกถุงผ้าติดตัวเสมอสำหรับการซื้อของ ช่วยลดการใช้ถุงพลาสติกแบบใช้ครั้งเดียว
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" stroke="currentColor" strokeWidth="2" />
                              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-eco-blue">ใช้แก้วน้ำส่วนตัว</h3>
                            <p className="text-gray-600 mt-1">
                              พกแก้วน้ำส่วนตัวเวลาออกไปซื้อเครื่องดื่ม ช่วยลดการใช้แก้วพลาสติกแบบใช้ครั้งเดียว
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                              <path d="M9 14h6M9 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-eco-blue">เลือกบรรจุภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม</h3>
                            <p className="text-gray-600 mt-1">
                              เลือกซื้อสินค้าที่มีบรรจุภัณฑ์ทางเลือก เช่น กระดาษ แก้ว หรือวัสดุย่อยสลายได้ทางชีวภาพ
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mt-1 flex-shrink-0">
                            <svg className="h-5 w-5 text-eco-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 18H3M21 14H3M21 10H3M21 6H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-eco-blue">ปฏิเสธหลอดพลาสติก</h3>
                            <p className="text-gray-600 mt-1">
                              บอกพนักงานว่าไม่ต้องการหลอด หรือใช้หลอดกระดาษ/หลอดโลหะแทน
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-eco-teal/10 flex items-center justify-center mt-1 flex-shrink-0">
                            <RecycleIcon className="h-5 w-5 text-eco-teal" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-eco-blue">ซื้อผลิตภัณฑ์รีฟิล</h3>
                            <p className="text-gray-600 mt-1">
                              เลือกซื้อผลิตภัณฑ์ที่มีบรรจุภัณฑ์แบบรีฟิลได้ เช่น สบู่ แชมพู น้ำยาล้างจาน
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-none shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-eco-blue">ทางเลือกแทนพลาสติก</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg border border-eco-teal/20">
                            <h4 className="font-medium text-eco-blue mb-2">ถุงผ้า</h4>
                            <p className="text-sm text-gray-600">
                              ใช้แทนถุงพลาสติกในการช็อปปิ้ง ใช้ได้หลายครั้งและซักทำความสะอาดได้
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg border border-eco-teal/20">
                            <h4 className="font-medium text-eco-blue mb-2">แก้วสแตนเลส</h4>
                            <p className="text-sm text-gray-600">
                              ทนทาน เก็บความเย็น/ร้อนได้ดี ใช้แทนแก้วพลาสติก
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg border border-eco-teal/20">
                            <h4 className="font-medium text-eco-blue mb-2">กล่องข้าวสแตนเลส</h4>
                            <p className="text-sm text-gray-600">
                              ใช้แทนกล่องอาหารโฟมหรือพลาสติก เหมาะสำหรับการใส่อาหารไปทำงาน
                            </p>
                          </div>
                          
                          <div className="p-4 rounded-lg border border-eco-teal/20">
                            <h4 className="font-medium text-eco-blue mb-2">หลอดโลหะ/กระดาษ</h4>
                            <p className="text-sm text-gray-600">
                              หลอดโลหะใช้ซ้ำได้ หลอดกระดาษย่อยสลายได้เร็วกว่าหลอดพลาสติกมาก
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Education;
