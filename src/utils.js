import AbstractView from "./view/abstract";
import moment from "moment";

// common
export const getRandomInteger = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));
  return Math.floor(min + Math.random() * (max - min + 1));
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

// dates
const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  return new Date(currentDate);
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getTime() > dueDate.getTime();
};

export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }
  const currentDate = getCurrentDate();
  return currentDate.getTime() === dueDate.getTime();
};

export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

export const formatDueDate = (dueDate) => {
  if (!(dueDate instanceof Date)) {
    return ``;
  }
  return moment(dueDate).format(`D MMMM`);
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const compareNullDates = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};


export const sortTaskUp = (taskA, taskB) => {
  let compareResult = compareNullDates(taskA.dueDate, taskB.dueDate);

  if (compareResult !== null) {
    return compareResult;
  }
  return taskA.dueDate.getTime() - taskB.dueDate.getTime();
};

export const sortTaskDown = (taskA, taskB) => {
  const compareResult = compareNullDates(taskA.dueDate, taskB.dueDate);

  if (compareResult !== null) {
    return compareResult;
  }
  return taskB.dueDate.getTime() - taskA.dueDate.getTime();
};


// render

export const render = (container, element, position) => {

  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newElement, oldElement) => {
  if (oldElement instanceof AbstractView) {
    oldElement = oldElement.getElement();
  }

  if (newElement instanceof AbstractView) {
    newElement = newElement.getElement();
  }

  const parent = oldElement.parentElement;

  if (parent === null || oldElement === null || newElement === null) {
    throw new Error(`Can't replace unexisting elements`);
  }
  parent.replaceChild(newElement, oldElement);
};

export const remove = (element) => {
  if (!(element instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }
  element.getElement().remove();
  element.removeElement();
};

export const updateArrayItem = (array, update) => {
  const index = array.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return array;
  }

  return [...array.slice(0, index), update, ...array.slice(index + 1)
  ];
};
