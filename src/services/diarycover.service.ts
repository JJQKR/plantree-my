// addCover 함수
export const addCover = async (coverData: any) => {
  try {
    const response = await fetch(`http://localhost:3000/apis/diarycover/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(coverData),
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add cover');
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error adding cover:', error);
    throw error;
  }
};

// getCover 함수
export const getCover = async (diaryId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get cover');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cover:', error);
    throw error;
  }
};

// deleteCover 함수
export const deleteCover = async (diaryId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete cover');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting cover:', error);
    throw error;
  }
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
