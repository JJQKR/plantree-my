import React from 'react';

const Card: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="w-[380px] h-[570px] bg-red-400 shadow-md rounded-lg flex items-center justify-center">
      <p>{content}</p>
    </div>
  );
};

export default Card;
