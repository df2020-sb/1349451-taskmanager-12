import AbstractView from "../view/abstract";

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

  if (compareResult) {
    return compareResult;
  }
  return taskA.dueDate.getTime() - taskB.dueDate.getTime();
};

export const sortTaskDown = (taskA, taskB) => {
  const compareResult = compareNullDates(taskA.dueDate, taskB.dueDate);

  if (compareResult) {
    return compareResult;
  }
  return taskB.dueDate.getTime() - taskA.dueDate.getTime();
};


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

  if (element === null) {
    return;
  }

  if (!(element instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }
  element.getElement().remove();
  element.removeElement();
};
