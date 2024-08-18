import React, { useState, useEffect, useCallback } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashImageSearchProps {
  handleSelectImage: (imageUrl: string) => void;
  handleDeselectElement: () => void;
  handleCloseMenu: () => void;
}

const UnsplashImageSearch: React.FC<UnsplashImageSearchProps> = ({
  handleSelectImage,
  handleDeselectElement,
  handleCloseMenu
}) => {
  const [query, setQuery] = useState(() => sessionStorage.getItem('unsplashQuery') || '');
  const [images, setImages] = useState<UnsplashImage[]>(() => {
    const savedImages = sessionStorage.getItem('unsplashImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(() => Number(sessionStorage.getItem('unsplashPage')) || 1);
  const [hasMore, setHasMore] = useState(() => sessionStorage.getItem('unsplashHasMore') !== 'false');
  const [isRandom, setIsRandom] = useState(() => sessionStorage.getItem('unsplashIsRandom') !== 'false');

  const saveToSessionStorage = useCallback(() => {
    sessionStorage.setItem('unsplashImages', JSON.stringify(images));
    sessionStorage.setItem('unsplashQuery', query);
    sessionStorage.setItem('unsplashPage', page.toString());
    sessionStorage.setItem('unsplashHasMore', hasMore.toString());
    sessionStorage.setItem('unsplashIsRandom', isRandom.toString());
  }, [images, query, page, hasMore, isRandom]);

  const handleSearch = useCallback(
    async (resetPage: boolean = false, random: boolean = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const currentPage = resetPage ? 1 : page;
        const searchQuery = random ? 'random' : query;
        const results = await fetchImages(searchQuery, currentPage);

        if (resetPage) {
          setImages(results);
          setPage(2); // 다음 페이지를 위해 페이지를 2로 설정
        } else {
          setImages((prevImages) => [...prevImages, ...results]);
        }

        setHasMore(results.length > 0);
        setIsRandom(random);
      } catch (error) {
        console.error('Error fetching images:', error);
        setHasMore(false);
      }
      setLoading(false);
    },
    [query, page, loading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRandom(false);
    handleSearch(true, false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page;
      setPage(nextPage + 1);
      handleSearch(false, isRandom); // 현재 페이지에서 이미지를 추가로 불러옴
    }
  };

  useEffect(() => {
    if (images.length === 0) {
      handleSearch(true, true);
    }
  }, []);

  useEffect(() => {
    saveToSessionStorage();
  }, [saveToSessionStorage]);

  useEffect(() => {
    sessionStorage.setItem('unsplashPage', page.toString());
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseMenu(); // Escape 키가 눌리면 메뉴를 닫음
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
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={query}
          onFocus={handleDeselectElement}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images"
          className="flex-grow px-2 py-1 border rounded-l  mr-4"
        />
        <button type="submit" className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-r">
          검색하기
        </button>
      </form>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <img
            key={`image-${image.id}-${index}`}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => handleSelectImage(image.urls.regular)}
            className="cursor-pointer w-full h-auto"
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!loading && images.length > 0 && hasMore && (
        <button
          onClick={handleLoadMore}
          className="mt-2 px-2 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300 w-full"
        >
          더보기
        </button>
      )}
      {!loading && images.length === 0 && <p>검색결과가 없습니다.</p>}
      {!loading && !hasMore && images.length > 0 && <p>더 이상 결과가 없습니다.</p>}
    </div>
  );
};

export default UnsplashImageSearch;
