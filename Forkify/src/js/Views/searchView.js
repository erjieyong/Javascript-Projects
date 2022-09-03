import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};

export const highlightSelected = id =>{
  //we loop through all the 'results__link' class first to remove the results__link--active class
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el=>{
    el.classList.remove('results__link--active');
  })
  
  //can't do it in base.js element variable because when page is loaded, the selected might not have appeared.
  document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}

//course's function to reduce text
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    return `${newTitle.join(" ")} ...`;
  }
  return title;
};

//my own option 2 to reduce text
const limitRecipeTitle2 = (title, limit = 17) => {
  let textCount = 0;
  let textIndex;
  let newTitle = "";
  let splitTitle = title.split(" ");
  for (let i = 0; i < splitTitle.length; i++) {
    textCount += splitTitle[i].length;
    if (textCount > limit) {
      newTitle = newTitle + "...";
      break;
    } else {
      newTitle = newTitle + splitTitle[i] + " ";
    }
  }
  return newTitle;
};

//my own option 3 to reduce text
const limitRecipeTitle3 = (title, limit = 17) => {
  if (title.length > limit) {
    let newTitle = title.slice(0, limit);
    let lastSpaceNo = newTitle.lastIndexOf(" ");
    let finalTitle = newTitle.slice(0, lastSpaceNo);
    return finalTitle + "...";
  }
  return title;
};

const renderRecipe = (recipe) => {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
    `;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};

//type can be 'prev' or 'next'
//we create our own attribute 'data-goto' so that we can attach event handler to them later on
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
      <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${
          type === "prev" ? "left" : "right"
        }"></use>
      </svg>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    //only display button to go the next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // display both next and prev button
    button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}`;
  } else if (page === pages) {
    //only display button to go to prev page
    button = createButton(page, "prev");
  }
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  //render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  /**we can write the normal way as follows:
   * recipes.foreach(el,renderRecipe(el))
   * but we can just do like below also can
   */

  //we slice it to reduce the number of results per page. Take note that slice will only display up TILL the end. It will not include end.
  recipes.slice(start, end).forEach(renderRecipe);

  //render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};
