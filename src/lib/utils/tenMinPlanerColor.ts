const getColorClass = (color: string) => {
  console.log(color);
  const colorMap: { [key: string]: string } = {
    red: 'text-red-300',
    yellow: 'text-yellow-300',
    green: 'text-green-300',
    orange: 'text-orange-300',
    transparent: `text-transparent`
  };
  return colorMap[color] || 'bg-black';
};

const getBackgroundColorClass = (color: string) => {
  console.log(color);
  const colorMap: { [key: string]: string } = {
    red: 'bg-red-300',
    yellow: 'bg-yellow-300',
    green: 'bg-green-300',
    orange: 'bg-orange-300',
    transparent: 'bg-transparent'
  };
  return colorMap[color] || 'bg-black';
};

export { getColorClass, getBackgroundColorClass };
