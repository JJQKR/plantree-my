export const addCover = async (coverData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diaryCover/`, {
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

export const getCover = async (id: string) => {
  const response = await fetch(`http://localhost:3000/apis/diaryCover/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const deleteCover = async (id: string) => {
  const response = await fetch(`http://localhost:3000/apis/diaryCover/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const updateCover = async (id: string, coverData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diaryCover/${id}`, {
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
