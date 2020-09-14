import TaskEditView from '../view/task-edit';
import {remove, render, RenderPosition} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class NewTask {
  constructor(container, changeData) {
    this._container = container;
    this._changeData = changeData;

    this._taskCreateComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._destroyCallback = null;
  }

  init(callback) {
    this._destroyCallback = callback;
    if (this._taskCreateComponent) {
      return;
    }

    this._taskCreateComponent = new TaskEditView();
    this._taskCreateComponent.setSubmitHandler(this._handleFormSubmit);
    this._taskCreateComponent.setDeleteClickHandler(this._handleDeleteClick);
    render(this._container, this._taskCreateComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._taskCreateComponent === null) {
      return;
    }

    if (this._destroyCallback) {
      this._destroyCallback();
    }

    remove(this._taskCreateComponent);
    this._taskCreateComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setStateToSaving() {
    this._taskCreateComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setStateToError() {
    const setStateToDefault = () => {
      this._taskCreateComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._taskCreateComponent.shake(setStateToDefault);
  }


  _handleFormSubmit(task) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        task);
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
