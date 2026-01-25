import React from 'react';

function MovieCard({ movie, onLike, isLiked }) {
    return (
        <div className="movie-card">
            <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
            <button className='like-button' onClick={() => onLike(movie)} title={isLiked ? "Unlike" : "Like"}>
                {isLiked ? "❤" : "🤍"}
            </button>
        </div>
    );
}

export default MovieCard;