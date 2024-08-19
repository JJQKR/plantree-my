import { UpdatePageType } from '@/api/pages.api';
import useBottomSheetStore from '@/stores/bottomsheet.store';
import usePageStore from '@/stores/pages.store';
import React, { useEffect, useState } from 'react';
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
  const { currentPageIndex, setCurrentPageIndex } = usePageStore((state) => state);
  const { activeCardIndices, setActiveCardIndices } = useBottomSheetStore((state) => state);

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (windowWidth < 768) {
      setCurrentPageIndex(index);
      setActiveCardIndices([index]);
    } else {
      if (index % 2 !== 0) {
        setCurrentPageIndex(index - 1);
        setActiveCardIndices([index - 1, index]);
      } else if (index % 2 === 0) {
        setCurrentPageIndex(index);
        setActiveCardIndices([index, index + 1]);
      }
    }
  };

  const showPages = (index: number) => {
    showIndices(index);
  };

  const isActive = activeCardIndices?.includes(pages.indexOf(page));

  console.log(currentPageIndex);

  return (
    <div
      ref={ref}
      // ${isDragging ? 'opacity-50' : ''}
      className={`flex items-center justify-center bg-contain rounded-[0.4rem] w-[5.2rem] sm:h-[3rem] h-[3.6rem] flex-none cursor-pointer ${
        isActive ? 'bg-[#6D8B33] ' : 'bg-[#9E9E9E]'
      } `}
      onClick={() => showPages(pages.indexOf(page))}
    >
      <div className=" text-white flex justify-center items-center w-[1.5rem] h-[1.5rem] rounded sm:text-[1.2rem] text-[1.5rem] font-bold">
        {pages.indexOf(page) + 1}p
      </div>
    </div>
  );
};

export default BottomSheetCard;
