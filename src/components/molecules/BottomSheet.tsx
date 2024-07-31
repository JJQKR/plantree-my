import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useParams, useRouter } from 'next/navigation';

type BottomSheetProps = {
  isOpen: boolean;
  onToggle: () => void;
  bottomSheetList: { id: string; title: string; content: string }[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

type CardProps = {
  id: string;
  title: string;
  content: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

const ItemType = {
  CARD: 'card'
};

const Card: React.FC<CardProps> = ({ id, title, content, index, moveCard }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    hover(item: { id: string; index: number }) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none ${isDragging ? 'opacity-50' : ''}`}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onToggle, bottomSheetList, moveCard }) => {
  const router = useRouter();
  const { diaryId } = useParams();

  const handleCoverPageClick = () => {
    router.push(`/member/diaryedit/${diaryId}/diarycover`);
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-48 bg-white shadow-lg rounded-t-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-44'
      }`}
    >
      <div className="flex justify-center">
        <div
          className="absolute top-[-32px] w-28 h-8 bg-white rounded-t-xl cursor-pointer flex items-center justify-center"
          onClick={onToggle}
        >
          <span>{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>
      <div className="p-4 text-center overflow-x-auto flex space-x-4">
        <div
          onClick={handleCoverPageClick}
          className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer"
        >
          <h2 className="text-xl font-bold">커버 페이지</h2>
        </div>
        {bottomSheetList.map((item, index) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomSheet;
