import TopMenu from './view/top-menu';
import FilterPresenter from "./presenter/filter";
import BoardPresenter from "./presenter/board";
import {RenderPosition, render, remove} from './utils/render';
import TasksModel from "./model/tasks";
import FilterModel from "./model/filter";
import {MenuItem, UpdateType, FilterType} from "./const";
import StatisticsView from "./view/statistics";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const main = document.querySelector(`.main`);
const topContainer = main.querySelector(`.main__control`);

const api = new Api(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();
const filterModel = new FilterModel();
const menu = new TopMenu();
const boardPresenter = new BoardPresenter(main, tasksModel, filterModel, api);
const filterPresenter = new FilterPresenter(main, filterModel, tasksModel);

const handleNewTaskClose = () => {
  menu.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  menu.setMenuItem(MenuItem.TASKS);
};


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

filterPresenter.init();
boardPresenter.init();

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(UpdateType.INIT, tasks);
    render(topContainer, menu, RenderPosition.BEFOREEND);
    menu.setMenuClickHandler(handleMenuClick);
  })
  .catch(() => {
    tasksModel.setTasks(UpdateType.INIT, []);
    render(topContainer, menu, RenderPosition.BEFOREEND);
    menu.setMenuClickHandler(handleMenuClick);
  });

