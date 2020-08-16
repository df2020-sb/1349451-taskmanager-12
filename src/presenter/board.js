import LoadMoreButton from '../view/button';
import Board from '../view/board';
import NoTask from '../view/no-task';
import Sort from '../view/sort';
import Task from '../view/task';
import TaskList from '../view/task-list';
import TaskEdit from '../view/task-edit';
import {RenderPosition, render, remove, replace, sortTaskDown, sortTaskUp} from '../utils';
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

    this._handleButtonClick = this._handleButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._renderedTasks = [];
  }

  _renderBoardContainer() {
    render(this._container, this._boardContainer, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeSelectHandler(this._handleSortTypeChange);
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

    const removeEscListener = () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    taskComponent.setRemoveEvtHandler(removeEscListener);

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    this._renderedTasks.push(taskComponent);
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

    this._renderedTasks.forEach((task) => {
      task.removeEvtHandler();
    });

    this._taskListComponent.getElement().innerHTML = ``;
    this._loadedTasksCount = TASKS_PER_LOAD;
    this._renderTaskList();
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
