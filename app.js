const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const searchIcon = document.getElementById('searchIcon');
const container = document.querySelector('.container');
let searchQuery = '';
const APP_ID = '6b945be2';
const APP_key = 'a35009994c499f9bc5f695f019e15f31';
let fromIndex = 0; 
const resultsPerPage = 12;

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value;

    fetchAPI();
});

searchIcon.addEventListener('click', () => {
    searchQuery = searchForm.querySelector('input').value; 
    fetchAPI(); 
});

async function fetchAPI(){
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_key}&to=${fromIndex + resultsPerPage}`;
    const response = await fetch(baseURL);
    const data = await response.json();

    generateHTML(data.hits);
    // console.log(data);
    
    if (data.count > fromIndex + resultsPerPage) {
        displayLoadMoreButton();
    } else {
        hideLoadMoreButton();
    }
}

function generateHTML(results){
    let generatedHTML = '';
    results.map(result => {
        const imageSrc = result.recipe.image;
        generatedHTML += `
        <div class="item">
            <img src="${result.recipe.image}" alt=""onload="bufferImageLoaded(this)" onerror="bufferImageError(this)">
            <div class="flex-container">
                <h1 class="title">${result.recipe.label}</h1>
                <a class = "view-button" href="${result.recipe.url}" target="_blank">View Recipe</a>
            </div>
            <p class="item-data">Calories: ${result.recipe.calories.toFixed(0)}</p>
            <p class="item-data">Cuisine Type: ${result.recipe.cuisineType}</p>
            <p class="item-data">Ingredients: ${formatIngredients(result.recipe.ingredients)}</p>
            <p class="item-data">Meal Type: ${result.recipe.mealType}</p>
        </div>
        `
    })
    searchResultDiv.innerHTML = generatedHTML;
}

function formatIngredients(ingredients) {
    if (!ingredients || ingredients.length === 0) {
        return 'N/A';
    }

    return ingredients.map(ingredient => ingredient.food).join(', ');
}

function bufferImageLoaded(image) {
    console.log(`Image loaded: ${image.src}`);
}

function bufferImageError(image) {
    console.log(`Image failed to load: ${image.src}`);
}

function displayLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreButton');

    if (loadMoreButton && loadMoreButton.style) {
        loadMoreButton.style.display = 'block';
    } else {
        createLoadMoreButton();
    }
}

function hideLoadMoreButton() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    if (loadMoreButton) {
        loadMoreButton.style.display = 'none';
    }
}

function createLoadMoreButton() {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Load More >>';
    loadMoreButton.id = 'loadMoreButton';
    loadMoreButton.addEventListener('click', nextPage);

    container.appendChild(loadMoreButton);
}

function nextPage() {
    fromIndex += resultsPerPage;
    fetchAPI();
}

// Initially hide the "Load More" button
hideLoadMoreButton();