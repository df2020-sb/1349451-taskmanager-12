import LoadMoreButton from '../view/button';
import Board from '../view/board';
import NoTask from '../view/no-task';
import Sort from '../view/sort';
import Task from '../view/task';
import TaskList from '../view/task-list';
import TaskEdit from '../view/task-edit';
import {RenderPosition, render, remove, replace} from '../utils';

const TASKS_PER_LOAD = 8;

export default class BoardPresenter {

  constructor(container, tasks) {
    this._tasks = [...tasks];
    this._loadedTasksCount = TASKS_PER_LOAD;

    this._container = container;
    this._boardContainer = new Board();
    this._sortComponent = new Sort();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTask();
    this._buttonComponent = new LoadMoreButton();

    this._handleButtonClick = this._handleButtonClick.bind(this);
  }

  _renderBoardContainer() {
    render(this._container, this._boardContainer, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskComponent = new Task(task);
    const taskEditComponent = new TaskEdit(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
  }

  _renderTasks(from, to) {
    this._tasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardContainer, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleButtonClick() {
    this._renderTasks(this._loadedTasksCount, this._loadedTasksCount + TASKS_PER_LOAD);
    this._loadedTasksCount += TASKS_PER_LOAD;

    if (this._loadedTasksCount >= this._tasks.length) {
      remove(this._buttonComponent);
    }
  }

  _renderButton() {
    render(this._boardContainer, this._buttonComponent, RenderPosition.BEFOREEND);
    this._buttonComponent.setClickHandler(this._handleButtonClick);
  }

  _renderTaskList() {
    render(this._boardContainer, this._taskListComponent, RenderPosition.BEFOREEND);
    this._renderTasks(0, Math.min(this._tasks.length, TASKS_PER_LOAD));
    if (this._tasks.length > TASKS_PER_LOAD) {
      this._renderButton();
    }
  }

  init() {
    this._renderBoardContainer();

    if (this._tasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
