'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'tailwindcss/tailwind.css';

const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false });

const FlipBookPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <HTMLFlipBook
        width={300}
        height={500}
        minWidth={300}
        maxWidth={500}
        minHeight={400}
        maxHeight={600}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-lg"
      >
        <div className="p-8 bg-red-500">Page 1</div>
        <div className="p-8 bg-red-500">Page 2</div>
        <div className="p-8 bg-white">Page 3</div>
        <div className="p-8 bg-white">Page 4</div>
      </HTMLFlipBook>
    </div>
  );
};

export default FlipBookPage;
