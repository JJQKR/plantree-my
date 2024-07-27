'use client';
import { useRouter } from 'next/navigation';
import { useDiaryCoverStore } from '@/stores/diarycover.store';
import { addCover } from '@/services/cover.service';

const DiaryParchmentPage: React.FC = () => {
  const router = useRouter();
  const { coverData } = useDiaryCoverStore();

  const handleFinalSave = async () => {
    if (!coverData) {
      console.error('커버 데이터가 없습니다.');
      return;
    }

    try {
      const response = await addCover(coverData);
      console.log('Cover 저장 성공:', response);
    } catch (error) {
      console.error('Cover 저장 실패:', error);
    }

    router.push('/member');
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-grow">
        <div className="w-1/2 border-r border-gray-300 flex items-center justify-center">
          <div className=" bg-white shadow-lg p-2">
            <img src="https://via.placeholder.com/400x800" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-white shadow-lg p-2">
            <img src="https://via.placeholder.com/400X800" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <button
        onClick={handleFinalSave}
        className="m-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-300"
      >
        저장
      </button>
    </div>
  );
};

export default DiaryParchmentPage;
