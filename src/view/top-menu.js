import AbstractView from "./abstract";
import {MenuItem} from "../const";


const createTopMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
          <input
            type="radio"
            name="control"
            id="control__new-task"
            class="control__input visually-hidden"
            value="${MenuItem.ADD_NEW_TASK}"
          />
          <label for="control__new-task" class="control__label control__label--new-task">+ ADD NEW TASK</label>

          <input
            type="radio"
            name="control"
            id="control__task"
            class="control__input visually-hidden"
            checked
            value="${MenuItem.TASKS}"
          />

          <label for="control__task" class="control__label">TASKS</label>
          <input
            type="radio"
            name="control"
            id="control__statistic"
            class="control__input visually-hidden"
            value="${MenuItem.STATISTICS}"
          />
          <label for="control__statistic" class="control__label"
            >STATISTICS</label
          >
        </section>`
  );
};

export default class TopMenu extends AbstractView {

  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }


  _getTemplate() {
    return createTopMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);
    if (item) {
      item.checked = true;
    }
  }
}
