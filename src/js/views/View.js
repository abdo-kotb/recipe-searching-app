import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._insertIntoParent(markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);

    const newElements = newDom.querySelectorAll('*');
    const curElements = this._parentElement.querySelectorAll('*');

    // update changed text
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (!newEl.isEqualNode(curEl)) {
        if (newEl.firstChild?.nodeValue.trim() !== '')
          curEl.textContent = newEl.textContent;

        const attrs = Array.from(newEl.attributes);
        attrs.forEach(attr => curEl.setAttribute(attr.name, attr.value));
      }
    });
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._insertIntoParent(markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._insertIntoParent(markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-check"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._insertIntoParent(markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _insertIntoParent(el) {
    this._parentElement.insertAdjacentHTML('afterbegin', el);
  }
}
