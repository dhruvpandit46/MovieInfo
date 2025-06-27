const API_KEY = "62fd5a9c"; // ✅ Your real OMDb API key

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

// Modal Elements
const modal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModal");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalRating = document.getElementById("modalRating");
const modalGenre = document.getElementById("modalGenre");
const modalReleased = document.getElementById("modalReleased");
const modalRuntime = document.getElementById("modalRuntime");
const modalActors = document.getElementById("modalActors");
const modalPlot = document.getElementById("modalPlot");

// ✅ Main Search Function
async function searchMovies(query) {
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      displayResults(data.Search);
    } else {
      resultsContainer.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  } catch (err) {
    console.error("Search error:", err);
    resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

// ✅ Render Basic Cards
function displayResults(movies) {
  resultsContainer.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = movie.Poster !== "N/A" ? movie.Poster : "assets/default.jpg";

    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="getMovieDetails('${movie.imdbID}')">More Info</button>
    `;

    resultsContainer.appendChild(card);
  });
}

// ✅ Fetch Full Movie Details
async function getMovieDetails(imdbID) {
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
    const res = await fetch(url);
    const data = await res.json();

    // Populate modal content
    modalPoster.src = data.Poster !== "N/A" ? data.Poster : "assets/default.jpg";
    modalTitle.textContent = data.Title;
    modalRating.textContent = data.imdbRating;
    modalGenre.textContent = data.Genre;
    modalReleased.textContent = data.Released;
    modalRuntime.textContent = data.Runtime;
    modalActors.textContent = data.Actors;
    modalPlot.textContent = data.Plot;

    modal.classList.remove("hidden");
  } catch (err) {
    console.error("Details fetch error:", err);
    alert("Could not load movie details.");
  }
}

// ✅ Close modal on button click
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ✅ Close modal on background click
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

// ✅ Search button event
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

// ✅ Enter key triggers search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
