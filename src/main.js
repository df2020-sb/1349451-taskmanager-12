import {createTopMenuTemplate} from './view/top-menu';
import {createFilterTemplate} from './view/filter';
import {createBoardTemplate} from './view/board';
import {createTaskEditTemplate} from './view/task-edit';
import {createTaskTemplate} from './view/task';

import {createLoadMoreButtonTemplate} from './view/button';

const TASK_COUNT = 3;

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

const mainElement = document.querySelector(`.main`);
const topMenuElement = mainElement.querySelector(`.main__control`);

render(topMenuElement, createTopMenuTemplate(), `beforeend`);
render(mainElement, createFilterTemplate(), `beforeend`);
render(mainElement, createBoardTemplate(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEditTemplate(), `beforeend`);

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate(), `beforeend`);
}

render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);
