export const addCover = async (coverData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(coverData),
    cache: 'no-store'
  });

  const data = await response.json();
  console.log(data);

  return data;
};

export const getCover = async (diaryId: string) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  const data = await response.json();

  return data;
};

export const deleteCover = async (diaryId: string) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const updateCover = async (diaryId: string, coverData: any) => {
  try {
    const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coverData),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { data: null, error: errorData.message || errorData };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
};
