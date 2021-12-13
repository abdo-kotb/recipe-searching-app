import { API_URL, KEY, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObj = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    img: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObj(data);

    // to save the bookmarked recipe
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(function (rec) {
      return {
        id: rec.id,
        img: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    console.log(err);
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings = state.recipe.servings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1])
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the right format :)'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.img,
      ingredients: ingredients,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObj(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

init();

// localStorage.removeItem('bookmarks');
