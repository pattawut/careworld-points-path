
import { Button } from '@/components/ui/button';

export const SocialLoginButtons = () => {
  return (
    <>
      <div className="text-center text-sm text-gray-600">
        หรือเข้าสู่ระบบด้วย
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Button variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z"/>
          </svg>
          เข้าสู่ระบบด้วย Google
        </Button>
        <Button variant="outline" className="w-full">
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z"/>
          </svg>
          เข้าสู่ระบบด้วย Facebook
        </Button>
      </div>
    </>
  );
};
