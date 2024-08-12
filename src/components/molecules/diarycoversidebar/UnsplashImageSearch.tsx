import React, { useState, useEffect, useCallback } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashImageSearchProps {
  handleSelectImage: (imageUrl: string) => void;
}

const UnsplashImageSearch: React.FC<UnsplashImageSearchProps> = ({ handleSelectImage }) => {
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

        setImages((prevImages) => (resetPage ? results : [...prevImages, ...results]));
        setHasMore(results.length > 0);
        setIsRandom(random);
        setPage(resetPage ? 1 : currentPage);
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
      setPage((prevPage) => prevPage + 1);
      handleSearch(false, isRandom);
    }
  };

  useEffect(() => {
    if (images.length === 0) {
      handleSearch(true, true);
    }
  }, []); // 컴포넌트 마운트 시에만 실행

  useEffect(() => {
    saveToSessionStorage();
  }, [saveToSessionStorage]);

  return (
    <div>
      <p className="text-center text-sm font-bold">Photos by UnSplash</p>
      <form onSubmit={handleSubmit} className="text-center my-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images"
          className="my-2 px-2 py-1 border rounded w-full"
        />
        <button
          type="submit"
          className="my-3 px-2 py-1 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300"
        >
          검색하기
        </button>
      </form>
      <div>
        {images.map((image, index) => (
          <img
            key={`image-${image.id}-${index}`}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => handleSelectImage(image.urls.regular)}
            className="cursor-pointer my-2"
          />
        ))}
        {loading && <p>Loading...</p>}
        {!loading && images.length > 0 && hasMore && (
          <button
            onClick={handleLoadMore}
            className="mt-2 px-2 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300"
          >
            더보기
          </button>
        )}
        {!loading && images.length === 0 && <p>검색결과가 없습니다.</p>}
        {!loading && !hasMore && images.length > 0 && <p>더 이상 결과가 없습니다.</p>}
      </div>
    </div>
  );
};

export default UnsplashImageSearch;
