export const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

// export const updateArrayItem = (array, update) => {
//   const index = array.findIndex((item) => item.id === update.id);

//   if (index === -1) {
//     return array;
//   }

//   return [...array.slice(0, index), update, ...array.slice(index + 1)
//   ];
// };
