export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string;
}

export const fetchImages = async (query: string, page: number = 1, perPage: number = 10): Promise<UnsplashImage[]> => {
  const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  const data = await response.json();
  return data.results;
};
