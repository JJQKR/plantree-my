'use client';

import React, { useState } from 'react';
import TestPages from '@/components/templates/flipping';
import IndexBottomSheet from '@/components/templates/IndexBottomSheet';
import '../globals.css';

const ViewPage: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <div className="relative">
      <TestPages selectedPage={selectedPage} />
      <IndexBottomSheet setSelectedPage={setSelectedPage} />
    </div>
  );
};

export default ViewPage;
