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
let elBookmarkTemplate = document.querySelector('#bookmarked-list').content;
let elMovieModal = document.querySelector('.movie-modal')
let elMovieAlert = document.querySelector('.movie-alert')

// Get movies list 

let sliceMovies = movies.slice(0, 10)

let normalizedMovieList = sliceMovies.map((movieItem, index) => {

    return {

        id: ++index,
        title: movieItem.Title.toString(),
        year: movieItem.movie_year,
        category: movieItem.Categories,
        rating: movieItem.imdb_rating,
        summary: movieItem.summary,
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
        templateDiv.querySelector('.modal-btn').dataset.movieModal = movie.id;

        elFragment.appendChild(templateDiv)

    });

    wrapper.appendChild(elFragment);

    let movieList = movieArray.length
    elResult.textContent = movieList;

    if (movieList === 0) {
        elMovieAlert.classList.add('alert-danger');
        elMovieAlert.textContent = "No movie was found"
    } else {
        elMovieAlert.classList.remove('alert-danger');
        elMovieAlert.textContent = 'Use the form on the left to search for a movie'
    }

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


// bookmarks stored in memory
let storage = window.localStorage;
let bookmarkedMovies = JSON.parse(storage.getItem('movieArrayList')) || [];

elWrapper.addEventListener('click', evt => {
    let movieId = evt.target.dataset.movieItemId;

    if (movieId) {
         let foundMovie = normalizedMovieList.find( item => item.id == movieId)

         let doesInclude = bookmarkedMovies.findIndex( item => item.id === foundMovie.id)

         if (doesInclude === -1) {
             bookmarkedMovies.push(foundMovie)
             storage.setItem('movieArray', JSON.stringify(bookmarkedMovies))
             
             renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)
            }
    }
})

// Render bookmarked movies

function renderBookmarkedMovies(array, wrapper) {
    wrapper.innerHTML = null;
    let elFragment = document.createDocumentFragment()
    array.forEach(item => {
        let templateBookmark = elBookmarkTemplate.cloneNode(true)

        templateBookmark.querySelector('.movie-title').textContent = item.title
        templateBookmark.querySelector('.btn-remove').dataset.markedId = item.id

        elFragment.appendChild(templateBookmark)
    })

    wrapper.appendChild(elFragment)
}

renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList)


elBookmarkedList.addEventListener("click", evt => {
    let removedMovieId = evt.target.dataset.markedId;
    
    if (removedMovieId) {
        let indexOfMovie = bookmarkedMovies.findIndex(item => item.id == removedMovieId
        )
        
        bookmarkedMovies.splice(indexOfMovie, 1)
        storage.setItem("movieArray", JSON.stringify(bookmarkedMovies))
       
        storage.clear()
        
        renderBookmarkedMovies(bookmarkedMovies, elBookmarkedList);
    }
    
})

// Movieid for modal

elWrapper.addEventListener('click', evt => {
    let moreInfoModal = evt.target.dataset.movieModal
    
    if (moreInfoModal) {
        let findMovie = normalizedMovieList.find( item => item.id == moreInfoModal)

        elMovieModal.querySelector('.movie-heading-title').textContent = findMovie.title;
        elMovieModal.querySelector('.movie-modal-text').textContent = findMovie.summary;
   }
})