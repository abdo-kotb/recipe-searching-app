import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipes = async function () {
  // getting the id
  const id = location.hash.slice(1);
  // const id = '5ed6604591c37cdc054bc886';
  if (!id) return;

  // loading spinner
  recipeView.renderSpinner();

  // Loading recipe
  try {
    await model.loadRecipe(id);

    // update results
    resultsView.update(model.getSearchResultsPage());

    // update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // rendering recipe
    recipeView.render(model.state.recipe);

    controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  // loading spinner
  resultsView.renderSpinner();

  try {
    // get search query
    const query = searchView.getQuery();

    // load search results
    await model.loadSearchResults(query);

    // render search results
    resultsView.render(model.getSearchResultsPage());
    // render pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPaginationBtns = function (goToPage) {
  // render search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  paginationView.addHandlerBtn(controlPaginationBtns);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
