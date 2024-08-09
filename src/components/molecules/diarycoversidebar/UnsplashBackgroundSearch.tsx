import React, { useState, useEffect } from 'react';
import { fetchImages, UnsplashImage } from '../../../lib/utils/unsplash';

interface UnsplashBackgroundSearchProps {
  onSelectBackground: (imageUrl: string) => void;
}

const UnsplashBackgroundSearch: React.FC<UnsplashBackgroundSearchProps> = ({ onSelectBackground }) => {
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const results = await fetchImages('gradient', page);
      if (results.length === 0) {
        setHasMore(false);
      } else {
        setImages((prevImages) => [...prevImages, ...results]);
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomImages(); // 컴포넌트가 마운트될 때 초기 이미지 로드
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <p className="text-center text-sm font-bold">Photos by UnSplash</p>
      <div>
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.thumb}
            alt={image.alt_description}
            onClick={() => onSelectBackground(image.urls.regular)}
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
