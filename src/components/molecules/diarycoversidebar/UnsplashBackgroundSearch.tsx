import React, { useState, useEffect } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashBackgroundSearchProps {
  handleBackgroundImageChange: (imageUrl: string) => void;
}

const UnsplashBackgroundSearch: React.FC<UnsplashBackgroundSearchProps> = ({ handleBackgroundImageChange }) => {
  const [query, setQuery] = useState('gradient'); // 초기 검색어를 'gradient'로 설정
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImagesFromUnsplash = async (resetPage: boolean = false) => {
    setLoading(true);
    try {
      const currentPage = resetPage ? 1 : page;
      const results = await fetchImages(query, currentPage);

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

  useEffect(() => {
    if (page === 1 && images.length === 0) {
      fetchImagesFromUnsplash(true); // 초기 로딩 시 첫 페이지 이미지 가져오기
    } else if (page > 1) {
      fetchImagesFromUnsplash();
    }
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setHasMore(true);
    fetchImagesFromUnsplash(true); // 새로운 검색어로 첫 페이지 이미지 가져오기
  };

  return (
    <div>
      <p className="text-center text-sm font-bold">Photos by UnSplash</p>
      <form onSubmit={handleSearch} className="text-center my-4">
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
            key={`background-${image.id}-${index}`}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => handleBackgroundImageChange(image.urls.regular)}
            className="cursor-pointer my-2"
          />
        ))}
        {loading && <p>Loading...</p>}
        {!loading && hasMore && (
          <button
            onClick={handleLoadMore}
            className="mt-2 px-2 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-300"
          >
            더보기
          </button>
        )}
        {!loading && !hasMore && <p>더 이상 결과가 없습니다.</p>}
      </div>
    </div>
  );
};

export default UnsplashBackgroundSearch;
