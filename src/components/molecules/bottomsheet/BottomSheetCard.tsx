import { UpdatePageType } from '@/api/pages.api';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import usePageStore from '@/stores/pages.store';
import React from 'react';
// import { useDrag, useDrop } from 'react-dnd';

// const ItemType = {
//   CARD: 'card'
// };

type BottomSheetCardProps = {
  page: UpdatePageType;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onToggle: () => void;
  pages: UpdatePageType[];
};

// type DragItemType = {
//   id: string;
//   index: number;
//   type: typeof ItemType.CARD;
// };

const BottomSheetCard: React.FC<BottomSheetCardProps> = ({ page, moveCard, onToggle, pages }) => {
  const ref = React.useRef(null);
  const { setCurrentPageIndex } = usePageStore((state) => state);
  const { activeCardIndices, setActiveCardIndices } = useBottomSheetStore((state) => state);
  console.log(page);

  // const [, drop] = useDrop({
  //   accept: ItemType.CARD,
  //   hover(item: DragItemType) {
  //     if (!ref.current) return;

  //     const dragIndex = item.index;
  //     const hoverIndex = page.index;

  //     if (dragIndex === hoverIndex) return;

  //     moveCard(dragIndex, hoverIndex);
  //     item.index = hoverIndex;
  //   }
  // });

  // const [{ isDragging }, drag] = useDrag({
  //   type: ItemType.CARD,
  //   item: (): DragItemType => ({ id: page.content_id, index: page.index, type: ItemType.CARD }),
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging()
  //   })
  // });

  // drag(drop(ref));

  const showIndices = (index: number) => {
    if (index % 2 !== 0) {
      setCurrentPageIndex(index - 1);
      setActiveCardIndices([index - 1, index]);
    } else if (index % 2 === 0) {
      setCurrentPageIndex(index);
      setActiveCardIndices([index, index + 1]);
    }
  };

  const showPages = (index: number) => {
    showIndices(index);
  };

  const isActive = activeCardIndices?.includes(pages.indexOf(page));

  return (
    <div
      ref={ref}
      // ${isDragging ? 'opacity-50' : ''}
      className={`flex items-end justify-center bg-contain ${
        page.parchment_style === 'tenMinPlanner'
          ? "bg-[url('/images/tenMinPlannerImage.png')]"
          : page.parchment_style === 'lineNote'
          ? "bg-[url('/images/lineNoteImage.png')]"
          : page.parchment_style === 'blankNote'
          ? "bg-[url('/images/blankNoteImage.png')]"
          : ''
      } rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer ${
        isActive ? 'border-[#008A02] border-[0.3rem]' : ''
      } `}
      onClick={() => showPages(pages.indexOf(page))}
    >
      <div
        className={`${
          isActive ? 'bg-[#008A02]' : 'bg-[#BEBEBE]'
        } text-white flex justify-center w-[1.5rem] h-[1.5rem] rounded text-[1.2rem] font-bold `}
      >
        {pages.indexOf(page) + 1}
      </div>
    </div>
  );
};

export default BottomSheetCard;
