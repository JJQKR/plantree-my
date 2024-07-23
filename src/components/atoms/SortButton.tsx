import React from 'react';

const SortButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
    >
      정렬
    </button>
  );
};

export default SortButton;
