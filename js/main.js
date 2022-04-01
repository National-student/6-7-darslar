// Select elements from DOM 

let elWrapper = document.querySelector('#wrapper');
let elBookmarkedList = document.querySelector('.bookmarked-list');
let elForm = document.querySelector('#form');
let elSearchInput = document.querySelector('#search_input');
let elRating = document.querySelector('#rating');
let elCategorySelect = document.querySelector('#category-select');
let elSort = document.querySelector('#rating_sort');
let elBtn = document.querySelector('#btn');
let elResult = document.querySelector('#search-result');
let elTemplate = document.querySelector('#movie_template').content;
let elBookmarkTemplate = document.querySelector('.bookmarked-list').content;

// Get movies list 

let sliceMovies = movies.slice(0, 10);

let normalizedMovieList = sliceMovies.map((movieItem, index) => {

    return {

        id: ++index,
        title: movieItem.Title.toString(),
        year: movieItem.movie_year,
        category: movieItem.Categories,
        rating: movieItem.imdb_rating,
        imageLink: `https://i.ytimg.com/vi/${movieItem.ytid}/mqdefault.jpg`,
        youtubeLink: `https://www.youtube.com/watch?v=${movieItem.ytid}`  

    }
})

// Create categories

function generateCategories(movieArray) {
    
    let categoryArray = [];

    movieArray.forEach(item => {

        let splitItem = item.category.split("|");

        splitItem.forEach(item => {
            if (!categoryArray.includes(item)) {
                categoryArray.push(item);
            }
        })
        
    })

    categoryArray.sort();

    let categoryFragment = document.createDocumentFragment();

    categoryArray.forEach(item => {
        let categoryOption = document.createElement('option');
        categoryOption.value = item;
        categoryOption.textContent = item;
        categoryFragment.appendChild(categoryOption);
    })

    elCategorySelect.appendChild(categoryFragment);
}

generateCategories(normalizedMovieList)

// Create render function

function renderMovies(movieArray, wrapper) {
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment();

    movieArray.forEach(movie => {
        let templateDiv = elTemplate.cloneNode(true);

        templateDiv.querySelector('.card-img-top').src = movie.imageLink;
        templateDiv.querySelector('.card-title').textContent = movie.title;
        templateDiv.querySelector('.card-year').textContent = movie.year;
        templateDiv.querySelector('.card-category').textContent = movie.category.split('|').join(', ');
        templateDiv.querySelector('.card-rate').textContent = movie.rating;
        templateDiv.querySelector('.card-link').href = movie.youtubeLink;
        templateDiv.querySelector('.bookmark-btn').dataset.movieItemId = movie.id;

        elFragment.appendChild(templateDiv)

    });

    wrapper.appendChild(elFragment);

    elResult.textContent = movieArray.length;
}

renderMovies(normalizedMovieList, elWrapper);

// findMovies movie filter

let findMovies = (movie_title, minRating, genre) => {
    let resultArray = normalizedMovieList.filter(movie => {
        let matchCategory = genre === 'All' || movie.category.split('|').includes(genre);

        return movie.title.match(movie_title) && movie.rating >= minRating && matchCategory;
    })

    return resultArray;
}

// form input render
elForm.addEventListener("input", function(evt) {
    evt.preventDefault()

    let searchInput = elSearchInput.value.trim()
    let ratingInput = elRating.value.trim()
    let selectOption = elCategorySelect.value
    let sortingType = elSort.value
    
    let pattern = new RegExp(searchInput, "gi")

    let resultArray = findMovies(pattern, ratingInput, selectOption)

    if (sortingType === "high") {
        resultArray.sort((b, a) => a.rating - b.rating)
    }

    if (sortingType === "low") {
        resultArray.sort((a, b) => a.rating - b.rating)
    }

    renderMovies(resultArray , elWrapper);
})





