const apikey = "2c4271aa73cbd98b9f055b7cd063ff34";
// const endpoint = "https://api.themoviedb.org/3/search/movie?api_key=2c4271aa73cbd98b9f055b7cd063ff34";

let allmovies = document.querySelector("#allmovies");
let movieName = document.querySelector("#movieName");

let btn = document.querySelector("#search");

function generateurl(path){
    return `https://api.themoviedb.org/3${path}?api_key=2c4271aa73cbd98b9f055b7cd063ff34`;
}

function handleError(error){
    console.log(error);
}

function requestMovies(url,onSuccess,onError){
    fetch(url)
    .then((res) => res.json())
    .then(onSuccess)
    .catch(onError)
}


function searchMovie(value){
    let path = "/search/movie";
    let url = generateurl(path) + "&query="+movieName.value;

    requestMovies(url,setMovies,handleError);
    
}

btn.onclick = function getMovie(event){
    event.preventDefault();
    searchMovie(movieName.value);
    
    movieName.value = "";
}

function setMovies(data){
    console.log(data.results)
    allmovies.innerHTML = "";
    const movies = data.results;
    let getter = getMovies(movies);
    allmovies.append(getter);
    console.log(movies.poster_path);
}

let imgurl = "https://image.tmdb.org/t/p/w500";

function getMoviesHelper(movies){
    // console.log("2");
    return movies.map((movie) => {
        if(movie.poster_path){
            return `<img src=${imgurl + movie.poster_path} data-movie-id=${movie.id}>`;
        }
    })
}

function getMovies(movies){
    // console.log("1");
    let movieContainer = document.createElement("div");
    movieContainer.classList.add("movie");
    let movieDetails = `
    <section class="section">
            ${getMoviesHelper(movies)}
        </section>
        <div class="content">
            <p id="close">X</p>
        </div>
    `
    movieContainer.innerHTML = movieDetails;
    return movieContainer
}



document.onclick = function(event){
    let Target = event.target;
    if(Target.tagName.toLowerCase() == "img"){
        
        let section = Target.parentElement;
        let content = section.nextElementSibling;
        content.classList.add("content-show");

        const movieId = event.target.dataset.movieId;
        const path = `/movie/${movieId}/videos`;
        let url = generateurl(path) ;
        fetch(url)
            .then((res) => res.json())
            .then((data) => createVideos(data,content))
            .catch((error) => {
                console.error(error);
            })
    }

    console.log(event.target.dataset.movieId);

    if(Target.id == "close"){
        Target.parentElement.classList.remove("content-show");
    }
}

function getiFrame(video){
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.height = 315;
    iframe.width = 360;
    iframe.allowFullscreen = true;

    return iframe;
}

function createVideos(data,content){
    content.innerHTML = '<p id="close">X</p>';

    const viedeos = data.results;
    let length = viedeos.length > 4 ? 4 : viedeos.length;
    const iframecontainer = document.createElement("div");
    for(let i=0;i<length;i++){
        const iframe = getiFrame(viedeos[i]);
        iframecontainer.appendChild(iframe);
        content.appendChild(iframecontainer);
    }
}