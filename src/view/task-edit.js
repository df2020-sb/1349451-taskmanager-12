/* eslint-disable indent */
import {COLORS} from '../const.js';
import {isTaskRepeating, formatDueDate} from '../utils/date';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import he from 'he';

const EMPTY_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createDueDateTemplate = (dueDate, isDueDate, isDisabled) => {
  return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>

    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${dueDate ? formatDueDate(dueDate) : ``}"
           ${isDisabled ? `disabled` : ``}
        />
      </label>
    </fieldset>` : ``}
  `;
};

const createRepeatingTemplate = (repeating, isRepeating, isDisabled) => {
  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
  </button>

  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join(``)}
    </div>
  </fieldset>` : ``}`;
};

const createColorsTemplate = (currentColor) => {
  return COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label
    for="color-${color}"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join(``);
};

const createTaskEditTemplate = (data) => {
  const {color, description, dueDate, repeating, isDueDate, isRepeating, isDisabled, isSaving, isDeleting} = data;

  const repeatClassName = isRepeating
    ? `card--repeat`
    : ``;

  const dueDateTemplate = createDueDateTemplate(dueDate, isDueDate, isDisabled);
  const repeatTemplate = createRepeatingTemplate(repeating, isRepeating, isDisabled);
  const colorsTemplate = createColorsTemplate(color);
  const isSubmitDisabled = isDueDate && dueDate === null || isRepeating && !isTaskRepeating(repeating);

  return (
    `<article class="card card--edit card--${color} ${repeatClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>
          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
                ${isDisabled ? `disabled` : ``}
              >${he.encode(description)}</textarea>
            </label>
          </div>
          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
              ${dueDateTemplate}
               ${repeatTemplate}
              </div>
            </div>
            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${colorsTemplate}
              </div>
            </div>
          </div>
          <div class="card__status-btns">
          <button class="card__save" type="submit" ${isSubmitDisabled || isDisabled ? `disabled` : ``}>
            ${isSaving ? `saving...` : `save`}
          </button>
          <button class="card__delete" type="button" ${isDisabled ? `disabled` : ``}>
            ${isDeleting ? `deleting...` : `delete`}
          </button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends SmartView {
  constructor(task = EMPTY_TASK) {
    super();
    this._data = TaskEdit.parseTaskToData(task);
    this._datepicker = null;

    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);


    this._setInnerHandlers();
    this._setDatepicker();
  }

  _getTemplate() {
    return createTaskEditTemplate(this._data);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, this._dueDateToggleHandler);
    this.getElement()
      .querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, this._repeatingToggleHandler);
    this.getElement()
      .querySelector(`.card__text`)
      .addEventListener(`input`, this._descriptionInputHandler);

    if (this._data.isRepeating) {
      this.getElement()
        .querySelector(`.card__repeat-days-inner`)
        .addEventListener(`change`, this._repeatingChangeHandler);
    }

    this.getElement()
      .querySelector(`.card__colors-wrap`)
      .addEventListener(`change`, this._colorChangeHandler);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this.destroyPicker();
    this._callback.submit(this._data);
  }


  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false
    });
  }

  _dueDateChangeHandler(selectedDates) {
    this.updateData({
      dueDate: selectedDates[0]
    });
  }

  _setDatepicker() {
    this.destroyPicker();

    if (this._data.isDueDate) {
      this._datepicker = flatpickr(this.getElement()
        .querySelector(`.card__date`),
        {dateFormat: `j F`, defaultDate: this._data.dueDate, onChange: this._dueDateChangeHandler}
      );
    }
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false
    });
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _repeatingChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      repeating: Object.assign({}, this._data.repeating, {[evt.target.value]: evt.target.checked})
    });
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(TaskEdit.parseDataToTask(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, this._formDeleteClickHandler);
  }


  static parseTaskToData(task) {
    return Object.assign({}, task,
      {
        isDueDate: task.dueDate !== null,
        isRepeating: isTaskRepeating(task.repeating),
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      }
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  destroyPicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  removeElement() {
    super.removeElement();
    this.destroyPicker();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setSubmitHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  reset(task) {
    this.updateData(TaskEdit.parseTaskToData(task)
    );
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._submitHandler);
  }
}
