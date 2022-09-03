import Search from "./Models/Search";
import Recipe from "./Models/Recipe";
import List from "./Models/List";
import Likes from "./Models/Likes";
import { elements, renderLoader, clearLoader } from "./Views/base";
import * as searchView from "./Views/searchView";
import * as recipeView from "./Views/recipeView";
import * as listView from "./Views/listView";
import * as likeView from "./Views/likesView";

/**Global state of the app
 * - Search Object
 * - Current recipe object
 * - Shopping list objet
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  //1) get the query from view
  const query = searchView.getInput();

  if (query) {
    // 2) new search object and add to state
    state.search = new Search(query);

    //3) prepare UI for results (clear the last search or show loading spinner)
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      //4) search for the recipes
      await state.search.getResults();

      //5) render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("Something went wrong with the search...");
      clearLoader();
    }
  }
};

//event listener for the search button
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

//event listner for the pagination
elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  //we can use console.log(e.target) first to find out how the browser register these clicks
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); //this is how we make use of the new data-goto attribute that we set up in the btn-inline class just now
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
  //get ID from URL
  const id = window.location.hash.replace("#", "");

  if (id) {
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //highlight selected search result
    if (state.search) searchView.highlightSelected(id);
    //create new recipe object
    state.recipe = new Recipe(id);
    try {
      //get recipe data
      await state.recipe.getRecipe();
      //calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert("Error processing recipe");
    }
  }
};

//we need to add the load event in case user loads the url with a specific recipe url such as http://localhost:8080/#36453. IN this case, we can then deliver the correct content upon loading.
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

/**
 * LIST CONTROLLER
 */

const controlList = () => {
  //create a new list if there is none yet
  if (!state.list) state.list = new List();

  //Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //delete from state
    state.list.deleteItem(id);
    //delete from UI
    listView.deleteItem(id);
  }

  //Handle update list item
  if (e.target.matches(".shopping__count-value")) {
    //update state
    const val = parseInt(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //user has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    //Add like to state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle like button to LIKED
    likeView.toggleLikeBtn(true);
    //Add like to UI list
    likeView.renderLike(newLike);
    //user HAS liked current recipe
  } else {
    //Remove like to state
    state.likes.deleteLike(currentID);
    //toggle like button to UNLIKED
    likeView.toggleLikeBtn(false);
    //Remove like to UI list
    likeView.deleteLike(currentID);
  }
  likeView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore Liked recipes on page load
window.addEventListener('load',()=>{
  state.likes = new Likes();
  //Restore likes
  state.likes.readStorage();

  //Toggle like menu button
  likeView.toggleLikeMenu(state.likes.getNumLikes());

  state.likes.likes.forEach(el=>likeView.renderLike(el));
})

//Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  //decerase button is clicked
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //Add ingredient to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Like Controller
    controlLike();
  }
});
