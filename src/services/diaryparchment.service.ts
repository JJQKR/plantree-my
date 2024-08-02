export const addParchment = async (parchmentData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diaryparchment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parchmentData),
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const getParchment = async (diaryID: string) => {
  const response = await fetch(`http://localhost:3000/apis/diaryparchment/${diaryID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const deleteParchment = async (diaryID: string) => {
  const response = await fetch(`http://localhost:3000/apis/diaryparchment/${diaryID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};

export const updateParchment = async (diaryID: string, parchmentData: any) => {
  const response = await fetch(`http://localhost:3000/apis/diaryparchment/${diaryID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(parchmentData),
    cache: 'no-store'
  });
  const data = await response.json();
  return data;
};
