import {createTopMenuTemplate} from './view/top-menu';
import {createFiltersTemplate} from './view/filter';
import {createBoardTemplate} from './view/board';
import {createTaskEditTemplate} from './view/task-edit';
import {createTaskTemplate} from './view/task';
import {createTask} from './mock/task';
import {createFilters} from './mock/filter';
import {createLoadMoreButtonTemplate} from './view/button';

const TASK_COUNT = 30;
const TASKS_PER_LOAD = 8;

const tasks = new Array(TASK_COUNT).fill().map(createTask);
const filters = createFilters(tasks);

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

const mainElement = document.querySelector(`.main`);
const topMenuElement = mainElement.querySelector(`.main__control`);

render(topMenuElement, createTopMenuTemplate(), `beforeend`);
render(mainElement, createFiltersTemplate(filters), `beforeend`);
render(mainElement, createBoardTemplate(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(taskListElement, createTaskEditTemplate(tasks[0]), `beforeend`);

for (let i = 0; i < Math.min(tasks.length, TASKS_PER_LOAD); i++) {
  render(taskListElement, createTaskTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > TASKS_PER_LOAD) {
  let loadedTasks = TASKS_PER_LOAD;

  render(boardElement, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = document.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(loadedTasks, loadedTasks + TASKS_PER_LOAD)
      .forEach((task) => render(taskListElement, createTaskTemplate(task), `beforeend`));

    loadedTasks += TASKS_PER_LOAD;

    if (loadedTasks >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}

