import TopMenu from './view/top-menu';
import LoadMoreButton from './view/button';
import Board from './view/board';
import Filter from './view/filter';
import NoTask from './view/no-task';
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

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (container, items) => {

  const boardComponent = new Board();
  render(container, boardComponent.getElement(), RenderPosition.BEFOREEND);

  const taskListComponent = new TaskList();
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

  if (items.every((item) => item.isArchive)) {
    render(boardComponent.getElement(), new NoTask().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent.getElement(), new Sort().getElement(), RenderPosition.AFTERBEGIN);

  items
    .slice(0, Math.min(tasks.length, TASKS_PER_LOAD))
    .forEach((item) => renderTask(taskListComponent.getElement(), item));

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
        loadMoreButton.removeElement();
      }
    });
  }
};

render(topMenuContainer, new TopMenu().getElement(), RenderPosition.BEFOREEND);
render(main, new Filter(filters).getElement(), RenderPosition.BEFOREEND);
renderBoard(main, tasks);
