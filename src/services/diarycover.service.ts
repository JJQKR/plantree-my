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
  return data;
};

export const getCover = async (diaryID: string) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const deleteCover = async (diaryID: string) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const updateCover = async (diaryID: string, coverData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diarycover/${diaryID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(coverData),
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};
