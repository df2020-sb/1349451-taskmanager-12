import TopMenu from './view/top-menu';
import Filter from './view/filter';
import BoardPresenter from "./presenter/board.js";
import {createFilters} from './mock/filter';
import {createTask} from './mock/task';
import {RenderPosition, render} from './utils';

const TASK_COUNT = 22;

const tasks = new Array(TASK_COUNT).fill().map(createTask);
const filters = createFilters(tasks);

const main = document.querySelector(`.main`);
const topContainer = main.querySelector(`.main__control`);
const boardPresenter = new BoardPresenter(main, tasks);

render(topContainer, new TopMenu(), RenderPosition.BEFOREEND);
render(main, new Filter(filters), RenderPosition.BEFOREEND);
boardPresenter.init();
