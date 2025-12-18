import React from 'react';
import type { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {children}
    </div>
  );
};

export default Sidebar;
