import LoadMoreButton from '../view/button';
import Board from '../view/board';
import NoTask from '../view/no-task';
import Sort from '../view/sort';
import TaskPresenter from './task';
import TaskList from '../view/task-list';
import {RenderPosition, render, remove, sortTaskDown, sortTaskUp} from '../utils/render';
import {SortType, UpdateType, UserAction} from "../const";
import {filter} from "../utils/filter";
import NewTaskPresenter from "./task-new";
import LoadingView from "../view/loading.js";

const TASKS_PER_LOAD = 8;

export default class BoardPresenter {

  constructor(container, tasksModel, filterModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._filterModel = filterModel;
    this._loadedTaskCount = TASKS_PER_LOAD;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._boardContainer = new Board();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTask();
    this._loadingComponent = new LoadingView();


    this._sortComponent = null;
    this._buttonComponent = null;

    this._handleUserAction = this._handleUserAction.bind(this);
    this._handleModelUpdate = this._handleModelUpdate.bind(this);
    this._newTaskPresenter = new NewTaskPresenter(this._taskListComponent, this._handleUserAction);

    this._handleButtonClick = this._handleButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }


  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
    remove(this._taskListComponent);
    remove(this._boardContainer);
    this._tasksModel.removeObserver(this._handleModelUpdate);
    this._filterModel.removeObserver(this._handleModelUpdate);
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filtredTasks = filter[filterType](tasks);

    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return filtredTasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return filtredTasks.sort(sortTaskDown);
    }
    return filtredTasks;
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeSelectHandler(this._handleSortTypeChange);

    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }


  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleUserAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardContainer, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }


  _renderButton() {

    if (this._buttonComponent !== null) {
      this._buttonComponent = null;
    }

    this._buttonComponent = new LoadMoreButton();
    this._buttonComponent.setClickHandler(this._handleButtonClick);

    render(this._boardContainer, this._buttonComponent, RenderPosition.BEFOREEND);
  }

  _renderBoard() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._loadedTaskCount)));

    if (taskCount > this._loadedTaskCount) {
      this._renderButton();
    }
  }


  _handleButtonClick() {
    const taskCount = this._getTasks().length;
    const newLoadedTaskCount = Math.min(taskCount, this._loadedTaskCount + TASKS_PER_LOAD);
    const tasks = this._getTasks().slice(this._loadedTaskCount, newLoadedTaskCount);

    this._renderTasks(tasks);
    this._loadedTaskCount = newLoadedTaskCount;

    if (this._loadedTaskCount >= taskCount) {
      remove(this._buttonComponent);
    }
  }

  _handleSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard({resetLoadedTaskCount: true});
    this._renderBoard();
  }

  _handleUserAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        console.log(update.dueDate);
        this._api.updateTask(update).then((response) => {
          this._tasksModel.updateTask(updateType, response);
        });
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelUpdate(updateType, data) {
    switch (updateType) {

      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;

      case UpdateType.MAJOR:
        this._clearBoard({resetLoadedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    this._newTaskPresenter.destroy();
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());

  }

  _clearBoard({resetLoadedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;
    this._newTaskPresenter.destroy();

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._buttonComponent);
    remove(this._loadingComponent);

    if (resetLoadedTaskCount) {
      this._loadedTaskCount = TASKS_PER_LOAD;
    } else {
      this._loadedTaskCount = Math.min(taskCount, this._loadedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  createNewTask(callback) {
    this._newTaskPresenter.init(callback);
  }


  init() {
    render(this._container, this._boardContainer, RenderPosition.BEFOREEND);
    render(this._boardContainer, this._taskListComponent, RenderPosition.BEFOREEND);
    this._tasksModel.addObserver(this._handleModelUpdate);
    this._filterModel.addObserver(this._handleModelUpdate);
    this._renderBoard();
  }
}
