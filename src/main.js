import TopMenu from './view/top-menu';
import LoadMoreButton from './view/button';
import Board from './view/board';
import Filter from './view/filter';
import Sort from './view/sort';
import Task from './view/task';
import TaskList from './view/task-list';
import TaskEdit from './view/task-edit';
import {createFilters} from './mock/filter';
import {createTask} from './mock/task';
import {RenderPosition, render} from './utils';

const TASK_COUNT = 30;
const TASKS_PER_LOAD = 8;

const tasks = new Array(TASK_COUNT).fill().map(createTask);
const filters = createFilters(tasks);

const main = document.querySelector(`.main`);
const topMenuContainer = main.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new Task(task);
  const taskEditComponent = new TaskEdit(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

render(topMenuContainer, new TopMenu().getElement(), RenderPosition.BEFOREEND);
render(main, new Filter(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new Board();
render(main, boardComponent.getElement(), RenderPosition.BEFOREEND);
render(boardComponent.getElement(), new Sort().getElement(), RenderPosition.AFTERBEGIN);

const taskListComponent = new TaskList();
render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 0; i < Math.min(tasks.length, TASKS_PER_LOAD); i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

if (tasks.length > TASKS_PER_LOAD) {
  let loadedTasks = TASKS_PER_LOAD;

  const loadMoreButton = new LoadMoreButton();
  render(boardComponent.getElement(), loadMoreButton.getElement(), RenderPosition.BEFOREEND);
  loadMoreButton.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(loadedTasks, loadedTasks + TASKS_PER_LOAD)
      .forEach((task) => renderTask(taskListComponent.getElement(), task));

    loadedTasks += TASKS_PER_LOAD;

    if (loadedTasks >= tasks.length) {
      // loadMoreButton.getElement().remove();
      loadMoreButton.removeElement();
    }
  });
}

