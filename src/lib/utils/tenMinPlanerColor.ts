export const getColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    pink: '#FFCBCB',
    lemon: '#FDFFAB',
    greentee: '#A1EEBD',
    sky: '#7BD3EA',
    transparent: 'transparent'
  };
  return colorMap[color] || 'bg-black';
};

export const getBackgroundColorClass = (color: string) => {
  const colorMap: { [key: string]: string } = {
    pink: '#FFCBCB',
    lemon: '#FDFFAB',
    greentee: '#A1EEBD',
    sky: '#7BD3EA',
    transparent: 'transparent'
  };
  return colorMap[color] || 'bg-black';
};
