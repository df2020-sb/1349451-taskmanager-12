import {COLORS} from '../const.js';
import {getRandomInteger, getRandomArrayElement} from '../utils.js';

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
const descriptions = [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`];

const createDate = () => {
  const isDate = (!!getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }
  const maxDayRange = 7;
  const dayRange = getRandomInteger(-maxDayRange, maxDayRange);
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  currentDate.setDate(currentDate.getDate() + dayRange);
  return new Date(currentDate);
};

const createRepetitions = () => {
  return {
    mo: false,
    tu: false,
    we: (!!getRandomInteger(0, 1)),
    th: false,
    fr: (!!getRandomInteger(0, 1)),
    sa: false,
    su: false,
  };
};

export const createTask = () => {
  const dueDate = createDate();
  const repeating = dueDate === null
    ? createRepetitions()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    };

  return {
    id: generateId(),
    description: getRandomArrayElement(descriptions),
    dueDate,
    repeating,
    color: getRandomArrayElement(COLORS),
    isArchive: (!!getRandomInteger(0, 1)),
    isFavorite: (!!getRandomInteger(0, 1))
  };
};
