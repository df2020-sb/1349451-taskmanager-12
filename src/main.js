import TopMenu from './view/top-menu';
import FilterPresenter from "./presenter/filter";
import BoardPresenter from "./presenter/board";
import {createTask} from './mock/task';
import {RenderPosition, render, remove} from './utils/render';
import TasksModel from "./model/tasks";
import FilterModel from "./model/filter";
import {MenuItem, UpdateType, FilterType} from "./const";
import StatisticsView from "./view/statistics";

const TASK_COUNT = 22;

const handleNewTaskClose = () => {
  menu.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  menu.setMenuItem(MenuItem.TASKS);
};

const tasks = new Array(TASK_COUNT).fill().map(createTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const main = document.querySelector(`.main`);
const topContainer = main.querySelector(`.main__control`);


const menu = new TopMenu();
render(topContainer, menu, RenderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(main, tasksModel, filterModel, handleNewTaskClose);
const filterPresenter = new FilterPresenter(main, filterModel, tasksModel);
filterPresenter.init();
boardPresenter.init();

let statisticsComponent = null;
const handleMenuClick = (menuItem) => {
  switch (menuItem) {

    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createNewTask(handleNewTaskClose);
      menu.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = true;
      break;

    case MenuItem.TASKS:
      remove(statisticsComponent);
      boardPresenter.init();
      break;

    case MenuItem.STATISTICS:
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(main, statisticsComponent, RenderPosition.BEFOREEND);
      boardPresenter.destroy();
      break;
  }
};

menu.setMenuClickHandler(handleMenuClick);


