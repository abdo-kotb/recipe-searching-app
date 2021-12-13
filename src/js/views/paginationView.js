import icons from 'url:../../img/icons.svg';

import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // if page 1, other pages
    if (curPage === 1 && numPages > 1)
      return this._renderNextBtn() + this._renderTotalPages();

    // last page
    if (curPage === numPages && curPage > 1)
      return this._renderPrevBtn() + this._renderTotalPages();

    // other pages
    if (curPage < numPages)
      return (
        this._renderPrevBtn() + this._renderNextBtn() + this._renderTotalPages()
      );

    // page 1, no other pages
    return '';
  }

  addHandlerBtn(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _renderPrevBtn() {
    return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        this._data.page - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>
    `;
  }

  _renderNextBtn() {
    return `
      <button class="btn--inline pagination__btn--next" data-goto="${
        this._data.page + 1
      }">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _renderTotalPages() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    return `
      <p class="pagination__total"> Page ${this._data.page} of ${numPages}</p>
    `;
  }
}

export default new PaginationView();
