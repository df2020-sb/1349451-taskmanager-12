/* eslint-disable indent */
import TaskView from "../view/task";
import TaskEditView from "../view/task-edit";
import {render, RenderPosition, replace, remove} from "../utils/render";
import {isTaskRepeating, isDatesEqual} from "../utils/date";
import {UserAction, UpdateType} from "../const";


const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ERROR: `ERROR`
};

export default class TaskPresenter {
  constructor(container, changeData, changeMode) {
    this._changeMode = changeMode;
    this._changeData = changeData;
    this._container = container;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(task) {
    this._task = task;
    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskView(task);
    this._taskEditComponent = new TaskEditView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);
    this._taskComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._taskComponent.setArchiveClickHandler(this._handleArchiveClick);
    this._taskEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._taskEditComponent.setSubmitHandler(this._handleFormSubmit);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._taskComponent, prevTaskComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._taskEditComponent, prevTaskEditComponent);
      this.resetView();
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._taskEditComponent.reset(this._task);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      Object.assign({}, this._task, {isFavorite: !this._task.isFavorite})
    );
  }

  _handleArchiveClick() {
    this._changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      Object.assign({}, this._task, {isArchive: !this._task.isArchive})
    );
  }

  _handleFormSubmit(update) {

    const isMinorUpdate =
      !isDatesEqual(this._task.dueDate, update.dueDate) ||
      isTaskRepeating(this._task) !== isTaskRepeating(update);

    this._changeData(
      UserAction.UPDATE_TASK,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  }


  _handleDeleteClick(task) {
    this._changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      task
    );
  }

  destroyPicker() {
    this._taskEditComponent.destroyPicker();
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  setState(state) {
    const setStateToDefault = () => {
      this._taskEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    switch (state) {
      case State.SAVING:
        this._taskEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._taskEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ERROR:
        this._taskComponent.shake(setStateToDefault);
        this._taskEditComponent.shake(setStateToDefault);
        break;
    }
  }
}
