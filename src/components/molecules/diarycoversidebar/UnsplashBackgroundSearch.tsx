import React, { useState, useEffect, useCallback } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashBackgroundSearchProps {
  handleBackgroundImageChange: (imageUrl: string) => void;
  handleDeselectElement: () => void;
  handleCloseMenu: () => void;
}

const UnsplashBackgroundSearch: React.FC<UnsplashBackgroundSearchProps> = ({
  handleBackgroundImageChange,
  handleDeselectElement,
  handleCloseMenu
}) => {
  const [query, setQuery] = useState(() => sessionStorage.getItem('backgroundQuery') || 'gradient');
  const [images, setImages] = useState<UnsplashImage[]>(() => {
    const savedImages = sessionStorage.getItem('backgroundImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(() => Number(sessionStorage.getItem('backgroundPage')) || 1);
  const [hasMore, setHasMore] = useState(() => sessionStorage.getItem('backgroundHasMore') !== 'false');

  const saveToSessionStorage = useCallback(() => {
    sessionStorage.setItem('backgroundImages', JSON.stringify(images));
    sessionStorage.setItem('backgroundQuery', query);
    sessionStorage.setItem('backgroundPage', page.toString());
    sessionStorage.setItem('backgroundHasMore', hasMore.toString());
  }, [images, query, page, hasMore]);

  const fetchImagesFromUnsplash = useCallback(
    async (resetPage: boolean = false) => {
      setLoading(true);
      try {
        const currentPage = resetPage ? 1 : page;
        const results = await fetchImages(query, currentPage);

        if (resetPage) {
          setImages(results);
          setPage(2); // 다음 페이지를 위해 페이지를 2로 설정
        } else {
          setImages((prevImages) => [...prevImages, ...results]);
          setPage(currentPage + 1); // 다음 페이지로 이동
        }

        setHasMore(results.length > 0);
      } catch (error) {
        console.error('Error fetching images:', error);
        setHasMore(false);
      }
      setLoading(false);
    },
    [query, page]
  );

  useEffect(() => {
    if (images.length === 0 && page === 1) {
      fetchImagesFromUnsplash(true); // 초기 로딩 시 첫 페이지 이미지 가져오기
    }
  }, [fetchImagesFromUnsplash, images.length, page]);

  useEffect(() => {
    saveToSessionStorage(); // 상태가 변경될 때마다 세션 스토리지에 저장
  }, [saveToSessionStorage]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchImagesFromUnsplash(); // 현재 페이지에서 이미지를 추가로 불러옴
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    fetchImagesFromUnsplash(true); // 새로운 검색어로 첫 페이지 이미지 가져오기
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseMenu]);

  return (
    <div>
      <p className="text-center text-sm font-bold mb-4">Photos by UnSplash</p>
      <form onSubmit={handleSearch} className="flex mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleDeselectElement}
          placeholder="Search for images"
          className="flex-grow px-2 py-1 border rounded-l"
        />
        <button type="submit" className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-r">
          검색하기
        </button>
      </form>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <img
            key={`background-${image.id}-${index}`}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => handleBackgroundImageChange(image.urls.regular)}
            className="cursor-pointer w-full h-auto"
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && hasMore && (
        <button
          onClick={handleLoadMore}
          className="mt-2 px-2 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 w-full"
        >
          더보기
        </button>
      )}
      {!loading && !hasMore && <p>더 이상 결과가 없습니다.</p>}
    </div>
  );
};

export default UnsplashBackgroundSearch;
