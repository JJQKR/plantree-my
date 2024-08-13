import { UpdatePageType } from '@/api/pages.api';
import usePageStore from '@/stores/pages.store';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = {
  CARD: 'card'
};

type BottomSheetCardProps = {
  page: UpdatePageType;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onToggle: () => void;
};

type DragItemType = {
  id: string;
  index: number;
  type: typeof ItemType.CARD;
};

const BottomSheetCard: React.FC<BottomSheetCardProps> = ({ page, moveCard, onToggle }) => {
  const ref = React.useRef(null);
  const { currentPageIndex, setCurrentPageIndex } = usePageStore((state) => state);

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

  const showPages = (index: number) => {
    console.log({ index });
    if (index === 1) {
      setCurrentPageIndex(index - 1);
    } else if (index % 2 === 0) {
      console.log('akwdk');
      setCurrentPageIndex(index - 2);
    } else {
      setCurrentPageIndex(index - 1);
    }
  };

  return (
    <div
      ref={ref}
      className={`flex items-end justify-center bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => showPages(page.index)}
    >
      <div className="bg-green-500 w-[2rem] h-[2rem] rounded text-xl font-bold  ">{page.index}</div>
    </div>
  );
};

export default BottomSheetCard;
