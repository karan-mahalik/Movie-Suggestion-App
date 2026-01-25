import React, { useState, useEffect } from 'react';
import MovieCard from './components/Moviecard';
import SearchBar from './components/Searchbar';
import './App.css';

const API_KEY = "726edaee";

const genreKeywords = {
  Action: ["action", "fight", "hero", "war", "battle"],
  Comedy: ["comedy", "funny", "laugh", "clown"],
  Drama: ["drama", "life", "story", "emotional"],
  Romance: ["love", "romance", "relationship", "heart"],
  "Sci-Fi": ["sci-fi", "future", "space", "alien"],
  Thriller: ["thriller", "mystery", "chase", "suspense"],
  Horror: ["horror", "ghost", "killer", "scary"]
};

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedMovies, setLikedMovies] = useState([]);
  const [randomUsedKeyword, setRandomUsedKeyword] = useState(null);
  const [previousMovies, setPreviousMovies] = useState([]);
  const [fullMovieDetails, setFullMovieDetails] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("default")

  const fetchMovies = async (title) => {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}`);
    const data = await res.json();

    if (data.Search) {
      const detailedMovies = await Promise.all(
        data.Search.map(async (movie) => {
          const res2 = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
          return await res2.json();
        })
      );
      setFullMovieDetails(detailedMovies);
      setMovies(data.Search);
    } else {
      setFullMovieDetails([]);
      setMovies([]);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setRandomUsedKeyword(null);
    fetchMovies(term);
  };

  const handleRandomMovie = async () => {
    const keywords = ["action", "love", "dark", "hero", "future", "space", "war", "spy"];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    setRandomUsedKeyword(randomKeyword);
    setPreviousMovies(movies);
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${randomKeyword}`);
    const data = await res.json();

    if (data.Search) {
      const detailedMovies = await Promise.all(
        data.Search.map(async (movie) => {
          const res2 = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
          return await res2.json();
        })
      );
      setFullMovieDetails(detailedMovies);
      setMovies(data.Search);
    } else {
      setFullMovieDetails([]);
      setMovies([]);
    }
  };

  const handleBackToResults = () => {
    setMovies(previousMovies);
    setRandomUsedKeyword(null);
  };

  const handleLike = (movie) => {
    const title = movie.Title;

    setLikedMovies((prev) => {
      let updatedLikes;
      if (prev.includes(title)) {
        updatedLikes = prev.filter((t) => t !== title);
      } else {
        updatedLikes = [...prev, title];
      }
      localStorage.setItem("likedMovieTitles", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  const clearLikedMovies = () => {
    setLikedMovies([])
    localStorage.removeItem("likedMovieTitles")
  }


  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre)
  }

  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const res1 = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=batman&type=movie&page=1`);
        const res2 = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=batman&type=movie&page=2`);

        const data1 = await res1.json();
        const data2 = await res2.json();

        const combinedResults = [...(data1.Search || []), ...(data2.Search || [])].slice(0, 30);

        const detailedMovies = await Promise.all(
          combinedResults.map(async (movie) => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
            return await res.json();
          })
        );

        setMovies(combinedResults);
        setFullMovieDetails(detailedMovies);
      } catch (error) {
        console.error("Error fetching initial movies:", error);
      }
    };

    fetchInitialMovies();
  }, []);


  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (selectedGenre === "All") return;

      const keywords = genreKeywords[selectedGenre] || [];

      try {
        const searchResults = await Promise.all(
          keywords.map(async (keyword) => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${keyword}&type=movie&page=1`);
            const data = await res.json();
            return data.Search || [];
          })
        );
        const combined = searchResults.flat();
        const uniqueMovies = Array.from(new Map(combined.map(m => [m.imdbID, m])).values()).slice(0, 20);
        const detailed = await Promise.all(
          uniqueMovies.map(async (movie) => {
            const res2 = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
            return await res2.json();
          })
        );

        setFullMovieDetails(detailed);
        setMovies(uniqueMovies);
      } catch (err) {
        console.error("Error fetching genre movies:", err);
      }
    };

    if (selectedGenre !== "All") {
      fetchMoviesByGenre();
    }
  }, [selectedGenre]);

  let displayedMovies = [...fullMovieDetails];

  if (sortOption === "imdbHigh") {
    displayedMovies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
  }
  else if (sortOption === "imdbLow") {
    displayedMovies.sort((a, b) => parseFloat(a.imdbRating) - parseFloat(b.imdbRating));
  }
  else if (sortOption === "newest") {
    displayedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }
  else if (sortOption === "oldest") {
    displayedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }

  useEffect(() => {
    const savedLikes = JSON.parse(localStorage.getItem("likedMovieTitles")) || [];
    setLikedMovies(savedLikes);
  }, []);
  return (
    <div className="controls">

      <div className="top">
        <div className="app">
          <h1>🎬 Movie Suggestion App</h1>
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="genre">🎭 Filter by Genre: </label>
            <select
              id="genre"
              value={selectedGenre}
              onChange={(e) => handleGenreSelect(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Thriller">Thriller</option>
              <option value="Horror">Horror</option>
            </select>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="sort">📊 Sort by: </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="imdbHigh">IMDb Rating ⬆</option>
              <option value="imdbLow">IMDb Rating ⬇</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {randomUsedKeyword ? (
            <>
              <p>🎲 Suggestion from: <strong>{randomUsedKeyword}</strong></p>
              <button className="back-btn" onClick={handleBackToResults}>⬅ Back to Search Results</button>
            </>
          ) : (
            <>
              <button className="random-btn" onClick={handleRandomMovie}>🎲 Suggest Random</button>
              {likedMovies.length > 0 && (
                <button className="clear-liked-btn" onClick={clearLikedMovies}>
                  🗑 Clear All Liked Movies
                </button>
              )}
            </>
          )}

          <div className="movie-list">
            {displayedMovies.length > 0 ? (
              displayedMovies
                .filter((movie) =>
                  selectedGenre === "All"
                    ? true
                    : movie.Genre?.includes(selectedGenre)
                )
                .map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onLike={handleLike}
                    isLiked={likedMovies.includes(movie.Title)}
                  />
                ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                {/* 🔍 Search something or use Random to get movie suggestions. */}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;