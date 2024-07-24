import { MainSidebarProps } from '@/types/main';
import React from 'react';

const Sidebar: React.FC<MainSidebarProps> = ({ onClose }) => {
  return (
    <div className="w-[260px] h-[930px] bg-gray-700 text-white flex-shrink-0">
      <div className="p-4">
        <button onClick={onClose} className="mb-4">
          Close
        </button>
        <nav>
          <ul className="flex flex-col items-center justify-center">
            <li className="w-[240px] h-[300px] bg-black mb-4 ">
              <p>프로필이 들어갈 박스</p>
            </li>
            <li>
              <a href="#" className="text-white">
                list
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
