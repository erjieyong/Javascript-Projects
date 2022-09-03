export const elements = {
    searchForm: document.querySelector(".search"),
    searchInput : document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader:'loader',
}

export const renderLoader = parent => {
    //we pass in the parent element as an argument because we want it to be usable across different module. And then the loader can just appear accordingly in the different parts of the website.
    const loader = `
        <div class ='${elementStrings.loader}'>
            <svg>
                <use href='img/icons.svg#icon-cw'></use>
            </svg>
        </div>
    `;
    //the magic happens in the css using @keyframes rotate

    parent.insertAdjacentHTML('afterbegin',loader);
}

export const clearLoader = ()=>{
    const loader = document.querySelector(`.${elementStrings.loader}`);
    //we cannot just put them in the elements variable because when elements is run, loader may not be inserted yet. so it will return error. As such we can only search for the loader css when we are trying to clear loader.
    if(loader){
        loader.parentElement.removeChild(loader);
    }
}