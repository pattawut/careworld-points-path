
import React from 'react';
import { Link } from 'react-router-dom';

type SheetContentProps = {
  links: Array<{ name: string, href: string }>;
  isActive: (path: string) => boolean;
  onClose: () => void;
};

const SheetContent: React.FC<SheetContentProps> = ({ links, isActive, onClose }) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          onClick={onClose}
          className={`py-2 text-base transition-colors hover:text-eco-blue ${
            isActive(link.href)
              ? 'font-medium text-eco-teal'
              : 'text-gray-600'
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default SheetContent;
