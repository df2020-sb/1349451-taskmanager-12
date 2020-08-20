import LoadMoreButton from '../view/button';
import Board from '../view/board';
import NoTask from '../view/no-task';
import Sort from '../view/sort';
import TaskPresenter from './task';
import TaskList from '../view/task-list';
import {RenderPosition, render, remove, sortTaskDown, sortTaskUp, updateArrayItem} from '../utils';
import {SortType} from "../const.js";

const TASKS_PER_LOAD = 8;

export default class BoardPresenter {

  constructor(container, receivedTasks) {
    this._receivedTasks = [...receivedTasks];
    this._tasks = [...receivedTasks];
    this._loadedTasksCount = TASKS_PER_LOAD;
    this._currenSortType = SortType.DEFAULT;

    this._container = container;
    this._boardContainer = new Board();
    this._sortComponent = new Sort();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTask();
    this._buttonComponent = new LoadMoreButton();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleButtonClick = this._handleButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._taskPresenter = {};
  }

  _renderBoardContainer() {
    render(this._container, this._boardContainer, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeSelectHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(from, to) {
    this._tasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardContainer, this._noTaskComponent, RenderPosition.AFTERBEGIN);
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

  _handleButtonClick() {
    this._renderTasks(this._loadedTasksCount, this._loadedTasksCount + TASKS_PER_LOAD);
    this._loadedTasksCount += TASKS_PER_LOAD;

    if (this._loadedTasksCount >= this._tasks.length) {
      remove(this._buttonComponent);
    }
  }

  _handleSortTypeChange(sortType) {

    if (this._currenSortType === sortType) {
      return;
    }

    switch (sortType) {
      case SortType.DATE_UP:
        this._tasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._tasks.sort(sortTaskDown);
        break;
      default:
        this._tasks = [...this._receivedTasks];
    }
    this._currenSortType = sortType;

    // this._taskListComponent.getElement().innerHTML = ``;
    this._clearTaskList();
    this._renderTaskList();
  }

  _handleTaskChange(updatedTask) {
    this._tasks = updateArrayItem(this._tasks, updatedTask);
    this._receivedTasks = updateArrayItem(this._receivedTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearTaskList() {
    Object.values(this._taskPresenter).forEach((presenter) => {
      presenter.destroy();
    });
    this._taskPresenter = {};
    this._loadedTasksCount = TASKS_PER_LOAD;
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
