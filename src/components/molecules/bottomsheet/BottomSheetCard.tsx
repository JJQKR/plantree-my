import { UpdatePageType } from '@/api/pages.api';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = {
  CARD: 'card'
};

type BottomSheetCardProps = {
  page: UpdatePageType;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onClick: () => void;
};

type DragItemType = {
  id: string;
  index: number;
  type: typeof ItemType.CARD;
};

const BottomSheetCard: React.FC<BottomSheetCardProps> = ({ page, moveCard, onClick }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: ItemType.CARD,
    hover(item: DragItemType) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = page.index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: (): DragItemType => ({ id: page.content_id, index: page.index, type: ItemType.CARD }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => {
        onClick();
      }}
    >
      <h2 className="text-xl font-bold">{page.index}</h2>
    </div>
  );
};

export default BottomSheetCard;
