import React, { useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import BottomSheetCard from './BottomSheetCard';
import { supabase } from '@/supabase/client';
import useDiaryStore from '@/stores/diary.store';

type BottomSheetProps = {
  isOpen: boolean;
  onToggle: () => void;
  bottomSheetList: { id: string; title: string; content: string }[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onToggle, bottomSheetList, moveCard }) => {
  const router = useRouter();
  const { diaryId } = useDiaryStore((state) => state);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const togglePageOptions = useDiaryCoverStore((state) => state.togglePageOptions);
  const { setCurrentPage, currentPage } = useDiaryCoverStore((state) => state);
  const {
    coverTitle,
    coverTitlePosition,
    coverTitleFontSize,
    coverTitleWidth,
    coverImagePosition,
    coverImageSize,
    coverBackgroundColor,
    coverScale,
    coverStageSize,
    coverTitleRotation,
    coverImageRotation,
    imageFile,
    setCoverData
  } = useDiaryCoverStore();

  const handleCoverPageClick = () => {
    router.push(`/member/diary/${diaryId}/cover`);
  };

  const handleCardClick = (index: number) => {
    setCurrentPage(index - (index % 2));
  };

  console.log(bottomSheetList);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleAddPageClick = () => {
    if (pathname.includes('diarycover')) {
      handleSaveAndContinue();
    } else {
      togglePageOptions();
    }
  };

  const handleSaveAndContinue = async () => {
    let publicUrl: string | null = null;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cover_img')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('이미지 업로드 실패:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from('cover_img').getPublicUrl(fileName);

      if (!publicUrlData) {
        console.error('공개 URL 가져오기 실패');
        return;
      }

      publicUrl = publicUrlData.publicUrl;
    }

    const coverDataToSave = {
      cover_title: coverTitle || null,
      cover_title_position: coverTitlePosition,
      cover_title_fontsize: coverTitleFontSize,
      cover_title_width: coverTitleWidth,
      cover_title_rotation: coverTitleRotation,
      cover_image: publicUrl,
      cover_image_position: coverImagePosition,
      cover_image_size: coverImageSize,
      cover_image_rotation: coverImageRotation,
      cover_bg_color: coverBackgroundColor,
      cover_scale: coverScale,
      cover_stage_size: coverStageSize
    };

    setCoverData(coverDataToSave);

    router.push(`/member/diary/${diaryId}/parchment`);
  };

  return (
    <div
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-48 bg-white shadow-lg rounded-t-2xl transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-44'
      }`}
    >
      <div className="flex justify-center">
        <div
          className="absolute top-[-32px] w-28 h-8 bg-white rounded-t-xl cursor-pointer flex items-center justify-center z-50"
          onClick={onToggle}
        >
          <span>{isOpen ? '▼' : '▲'}</span>
        </div>
      </div>
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          onClick={scrollLeft}
        >
          ◀
        </button>
        <div ref={scrollRef} className="p-4 text-center overflow-x-auto flex space-x-4">
          <div
            onClick={handleCoverPageClick}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer"
          >
            <h2 className="text-xl font-bold">커버 페이지</h2>
          </div>
          {bottomSheetList.map((item, index) => (
            <BottomSheetCard
              key={item.id}
              id={item.id}
              title={`Page ${index + 1}`}
              content={item.content}
              index={index}
              moveCard={moveCard}
              onClick={() => handleCardClick(index)}
            />
          ))}
          <div
            onClick={handleAddPageClick}
            className="bg-gray-100 rounded-lg shadow-md p-4 w-32 h-40 flex-none cursor-pointer"
          >
            <h2 className="text-xl font-bold">+ 속지 추가</h2>
          </div>
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-2 rounded-full shadow-md z-50"
          onClick={scrollRight}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default BottomSheet;
