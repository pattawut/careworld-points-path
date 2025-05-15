
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This would typically come from an auth context or redux store
  const mockLogin = () => setIsAuthenticated(true);
  const mockLogout = () => setIsAuthenticated(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-eco-teal" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-eco-gradient">
            CareWorld <span className="text-eco-green">รักษ์โลก</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden gap-6 md:flex">
          <Link to="/" className="text-sm font-medium hover:text-eco-teal transition-colors">
            หน้าหลัก
          </Link>
          <Link to="/education" className="text-sm font-medium hover:text-eco-teal transition-colors">
            ความรู้
          </Link>
          <Link to="/activities" className="text-sm font-medium hover:text-eco-teal transition-colors">
            กิจกรรม
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium hover:text-eco-teal transition-colors">
            อันดับสมาชิก
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-eco-teal transition-colors">
                โปรไฟล์
              </Link>
              <Button variant="outline" onClick={mockLogout} className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                ออกจากระบบ
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={mockLogin}>
                เข้าสู่ระบบ
              </Button>
              <Button className="bg-eco-gradient hover:opacity-90">
                สมัครสมาชิก
              </Button>
            </div>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="ml-auto md:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-sm font-medium hover:text-eco-teal transition-colors">
              หน้าหลัก
            </Link>
            <Link to="/education" className="text-sm font-medium hover:text-eco-teal transition-colors">
              ความรู้
            </Link>
            <Link to="/activities" className="text-sm font-medium hover:text-eco-teal transition-colors">
              กิจกรรม
            </Link>
            <Link to="/leaderboard" className="text-sm font-medium hover:text-eco-teal transition-colors">
              อันดับสมาชิก
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-eco-teal transition-colors">
                  โปรไฟล์
                </Link>
                <Button variant="outline" onClick={mockLogout} className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white">
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={mockLogin}>
                  เข้าสู่ระบบ
                </Button>
                <Button className="bg-eco-gradient hover:opacity-90">
                  สมัครสมาชิก
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
