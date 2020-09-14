import TopMenu from './view/top-menu';
import FilterPresenter from './presenter/filter';
import BoardPresenter from "./presenter/board";
import {RenderPosition, render, remove} from './utils/render';
import TasksModel from './model/tasks';
import FilterModel from './model/filter';
import {MenuItem, UpdateType, FilterType} from './const';
import StatisticsView from "./view/statistics";
import Api from '../src/api/index';
import Store from "./api/store.js";
import Provider from './api/provider';

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const main = document.querySelector(`.main`);
const topContainer = main.querySelector(`.main__control`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const tasksModel = new TasksModel();
const filterModel = new FilterModel();
const menu = new TopMenu();
const boardPresenter = new BoardPresenter(main, tasksModel, filterModel, apiWithProvider);
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

apiWithProvider.getTasks()
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


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
