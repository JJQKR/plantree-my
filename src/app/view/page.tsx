import React from 'react';
import TestPages from '@/components/templates/flipping';
import IndexBottomSheet from '@/components/templates/IndexBottomSheet';
import '../globals.css';

const ViewPage: React.FC = () => {
  return (
    <div>
      <TestPages />
      <IndexBottomSheet />
    </div>
  );
};

export default ViewPage;
