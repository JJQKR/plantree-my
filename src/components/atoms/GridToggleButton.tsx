import React from 'react';

type GridToggleButtonProps = {
  onClick: () => void;
};

const GridToggleButton: React.FC<GridToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
    >
      Toggle Grid
    </button>
  );
};

export default GridToggleButton;
