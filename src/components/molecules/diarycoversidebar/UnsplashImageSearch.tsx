import React, { useState, useEffect } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashImageSearchProps {
  onSelectImage: (imageUrl: string) => void;
}

const UnsplashImageSearch: React.FC<UnsplashImageSearchProps> = ({ onSelectImage }) => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRandom, setIsRandom] = useState(true);

  const handleSearch = async (resetPage: boolean = false, random: boolean = false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const searchQuery = random ? 'random' : query;
      const results = await fetchImages(searchQuery, currentPage);

      if (resetPage) {
        setImages(results);
        setPage(1);
      } else {
        setImages((prevImages) => [...prevImages, ...results]);
      }

      setHasMore(results.length > 0);
    } catch (error) {
      console.error('Error fetching images:', error);
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    setIsRandom(false);
    handleSearch(true);
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    handleSearch(page === 1, isRandom);
  }, [page]);

  useEffect(() => {
    handleSearch(true, true); // 초기 랜덤 이미지를 불러옴
  }, []);

  return (
    <div>
      <p className="text-center text-sm font-bold">Photos by UnSplash</p>
      <form onSubmit={handleSubmit}>
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
        {images.map((image) => (
          <img
            key={`image-${image.id}`}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => onSelectImage(image.urls.regular)}
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
