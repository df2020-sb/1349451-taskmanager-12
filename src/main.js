import TopMenu from './view/top-menu';
import FilterPresenter from "./presenter/filter";
import BoardPresenter from "./presenter/board";
import {createTask} from './mock/task';
import {RenderPosition, render} from './utils/render';
import TasksModel from "./model/tasks";
import FilterModel from "./model/filter";

const TASK_COUNT = 22;


const tasks = new Array(TASK_COUNT).fill().map(createTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const main = document.querySelector(`.main`);
const topContainer = main.querySelector(`.main__control`);


render(topContainer, new TopMenu(), RenderPosition.BEFOREEND);
const boardPresenter = new BoardPresenter(main, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(main, filterModel, tasksModel);
filterPresenter.init();
boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createNewTask();
});
