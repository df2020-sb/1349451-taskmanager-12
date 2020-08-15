import AbstractView from "./abstract";

const createBoardTemplate = () => {
  return `<section class="board container"></section>`;
};

export default class Board extends AbstractView {
  _getTemplate() {
    return createBoardTemplate();
  }
}
