let categoriesContainer = document.querySelector('.categories_container-list');
let favouritesContainer = document.querySelector('.favourites_list');
let dishesContainer = document.querySelector('.dishes');
let cartCount = 0;

async function getDishes() {
    const response = await fetch('http://temp.dash.zeta.in/food.php');
    const dishes = await response.json();
    return dishes;
}
getDishes()
    .then(dishes => {
        displayCategories(dishes.categories);
        displayFavourites(dishes.recipes);
        displayDishes(dishes.recipes);
    })
    .catch(e => console.log(e));
// Display categories list
function displayCategories(categories) {
    let allCategories = '';
    categories.forEach(category => {
        let html = `<button class="category_button">
                        <img class="category_list-image"
                            src="${category.image}"
                            alt="${category.name}">
                        <p class="category_name">${category.name}</p>
                    </button>`;
        allCategories += html;
    });
    categoriesContainer.insertAdjacentHTML('beforeend', allCategories);
}

function displayFavourites(favourites) {
    let allFavourites = '';
    favouriteDishes = favourites.filter(recipe => {
        return recipe.isFavourite;
    })
    favouriteDishes.forEach(favourite => {
        let html = `<div class="favourites_list-item">
        <div class="favourites_list-item-image">
            <img src="${favourite.image}"
                alt="${favourite.name}">
        </div>
        <div class="favourites_list-item-description">
            <div class="details">
                <h4>${favourite.name}</h4>
                <h4>₹ ${favourite.price}</h4>
            </div>
            <button class="btn reorder-btn">
                REORDER
            </button>
        </div>
    </div>`;
        allFavourites += html;
    });
    favouritesContainer.insertAdjacentHTML('beforeend', allFavourites);
}

function displayDishes(recipes) {
    let allRecipes = '';
    if (recipes.length > 0) {
        recipes.forEach(recipe => {
            let html = `<div class="single_dish">
            <img class="single_dish-image"
                src="${recipe.image}"
                alt="${recipe.name}">
            <div class="single_dish-detail">
                <div class="single_dish-description">
                    <h3 class="single_dish-name">${recipe.name}</h3>
                    <h3 class="single_dish-cost">₹ ${recipe.price}</h3>
                </div>
                <button class="btn add-btn">
                    ADD TO BAG
                </button>
            </div>
        </div>`;
            allRecipes += html;
        });
    } else {
        allRecipes = '<p style="font-size:26px;margin:0 auto;">No Recipes available</p>'
    }
    dishesContainer.textContent = '';
    dishesContainer.insertAdjacentHTML('beforeend', allRecipes);
}
let isCategorySelected = false;
let selectedCategory = 'all';

document.addEventListener('click', commonRouter);
document.querySelector('.search_input-text').addEventListener('keyup', search);

function commonRouter(e) {
    let parent;
    if (e.target.classList[0] === 'category_list-image') {
        parent = e.target.parentElement;
        categoryBtn(parent);
    } else if (e.target.classList[0] === 'category_name') {
        parent = e.target.parentElement;
        categoryBtn(parent);
    } else {
        parent = e.target;
        categoryBtn(parent);
    }
    if (e.target.classList[1] === 'add-btn') {
        addToBag(e);
    }
}

function categoryBtn(parent) {

    if (parent.classList.contains('category_button')) {
        const filterIcon = document.querySelector('.categories_filter-icon');
        const categoryButtons = document.querySelectorAll('.category_button');
        categoryButtons.forEach(singleButton => {
            singleButton.classList.remove('category_button-animation');
        });
        filterIcon.classList.remove('categories_filter-icon-enabled');
        parent.classList.add('category_button-animation');
        if (!filterIcon.classList.contains('categories_filter-icon-enabled')) {
            filterIcon.classList.add('categories_filter-icon-enabled');
        }

        const category = parent.querySelector('.category_name').textContent;
        getDishes()
            .then(dishes => {
                let categoryRecipes = dishes.recipes.filter(recipe => recipe.category == category);
                displayDishes(categoryRecipes);
                isCategorySelected = true;
                selectedCategory = category;
            })
            .catch(e => console.log(e));
    }
}

function search(e) {
    let word = e.target.value;
    let recipes = [];
    getDishes()
        .then(dishes => {
            let searchedRecipes
            if (isCategorySelected) {
                recipes = dishes.recipes.filter(recipe => recipe.category == selectedCategory);
            } else {
                recipes = dishes.recipes;
            }
            searchedRecipes = recipes.filter(recipe => {
                let nameInLC = recipe.name.toLowerCase();
                let wordInLC = word.toLowerCase();
                return nameInLC.indexOf(wordInLC) >= 0;
            });
            displayDishes(searchedRecipes);
        })
        .catch(e => console.log(e));
}


function addToBag(e) {
    // console.log(e.target.parentElement);
    cartCount = cartCount + 1;
    setCartCount();
    showCount();
}

function getCartCount() {
    if (localStorage.getItem('count') === null) {
        cartCount = 0;
    } else {
        // count = JSON.parse(localStorage.getItem('count'));
        cartCount = JSON.parse(localStorage.getItem('count'));
    }
}

function showCount() {
    if (cartCount > 0) {
        document.querySelector('.bag_color').classList.add('bag_color_item');
        document.querySelector('.item_count').textContent = cartCount;
    }
}

function setCartCount() {
    let count;
    if (localStorage.getItem('count') === null) {
        count = 0;
    } else {
        count = JSON.parse(localStorage.getItem('count'));
        // count = cartCount;
    }
    count = cartCount;

    localStorage.setItem('count', JSON.stringify(count));
}
getCartCount();
setCartCount();
showCount();