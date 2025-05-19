import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from './ui/badge';

const links = [
  { name: 'หน้าหลัก', href: '/' },
  { name: 'แอคทิวิตี้', href: '/activities' },
  { name: 'กิจกรรม', href: '/campaigns' },
  { name: 'ความรู้', href: '/education' },
  { name: 'อันดับ', href: '/leaderboard' },
];

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);

  // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await (window.supabase as any).from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-eco-teal to-eco-blue bg-clip-text text-xl font-bold text-transparent">
              EcoLife
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm transition-colors hover:text-eco-blue ${
                  isActive(link.href)
                    ? 'font-medium text-eco-teal'
                    : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className="hidden sm:flex bg-eco-light text-eco-blue border-none"
              >
                {profile?.eco_points || 0} คะแนน
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={profile?.full_name || ""}
                      />
                      <AvatarFallback className="text-sm">
                        {profile?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col p-2">
                    <p className="text-sm font-medium">
                      {profile?.full_name || "ผู้ใช้"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      แดชบอร์ด
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      ข้อมูลส่วนตัว
                    </Link>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        จัดการระบบ
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Button
                variant="outline"
                className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white"
                onClick={() => navigate('/login')}
              >
                เข้าสู่ระบบ
              </Button>
              <Button
                className="bg-eco-gradient"
                onClick={() => navigate('/register')}
              >
                สมัครสมาชิก
              </Button>
            </div>
          )}

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle Menu"
                  className="md:hidden"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="bg-gradient-to-r from-eco-teal to-eco-blue bg-clip-text text-xl font-bold text-transparent">
                    EcoLife
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`py-2 text-base transition-colors hover:text-eco-blue ${
                        isActive(link.href)
                          ? 'font-medium text-eco-teal'
                          : 'text-gray-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t my-2" />
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={profile?.avatar_url || undefined}
                            alt={profile?.full_name || ""}
                          />
                          <AvatarFallback>
                            {profile?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{profile?.full_name}</p>
                          <p className="text-xs text-gray-500">{profile?.eco_points || 0} คะแนน</p>
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="py-2 text-base text-gray-600"
                      >
                        แดชบอร์ด
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="py-2 text-base text-gray-600"
                      >
                        ข้อมูลส่วนตัว
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="py-2 text-base text-gray-600"
                        >
                          จัดการระบบ
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="py-2 text-base text-red-500 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        ออกจากระบบ
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="border-eco-teal text-eco-teal hover:bg-eco-teal hover:text-white w-full"
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                      >
                        เข้าสู่ระบบ
                      </Button>
                      <Button
                        className="w-full bg-eco-gradient"
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                      >
                        สมัครสมาชิก
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}

// This is a hack to make TypeScript happy
declare global {
  interface Window {
    supabase: any;
  }
}
