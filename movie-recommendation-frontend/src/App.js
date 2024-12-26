import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";

const App = () => {
  // State for managing form input and movie list
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [popularity, setPopularity] = useState("");
  const [movies, setMovies] = useState([]);

  // State for managing the logged-in user and token
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Fetch movies when the token changes
  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5001/movies", {
          headers: {
            Authorization: `Bearer ${token}`, // Updated
          },
        })
        .then((response) => {
          setMovies(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch movies:", error.message);
        });
    }
  }, [token]);

  // Persist user and token in localStorage when they change
  useEffect(() => {
    if (loggedInUser && token) {
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [loggedInUser, token]);

  // Handle movie form submission
  const handleMovieSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to add movies.");
      return;
    }
    axios
      .post(
        "http://localhost:5001/movies",
        { title, genre, rating, popularity },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Updated
          },
        }
      )
      .then(() => {
        alert("Movie added successfully!");
        setTitle("");
        setGenre("");
        setRating("");
        setPopularity("");
        // Refresh the movie list
        axios
          .get("http://localhost:5001/movies", {
            headers: {
              Authorization: `Bearer ${token}`, // Updated
            },
          })
          .then((response) => {
            setMovies(response.data);
          })
          .catch((error) => {
            console.error("Failed to fetch movies:", error.message);
          });
      })
      .catch((error) => {
        alert("Failed to add movie.");
        console.error(error.message);
      });
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setToken(null);
  };

  return (
    <div>
      <h1>Movie Recommendation Platform</h1>

      {/* Show logged-in user or login form */}
      {loggedInUser ? (
        <div>
          <h2>Welcome, {loggedInUser.name}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <LoginForm
          onLogin={(user, token) => {
            setLoggedInUser(user);
            setToken(token);
          }}
        />
      )}

      {/* Form to add a new movie */}
      {loggedInUser && (
        <form onSubmit={handleMovieSubmit}>
          <h2>Add Movie</h2>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <input
            type="number"
            placeholder="Popularity"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
          />
          <button type="submit">Add Movie</button>
        </form>
      )}

      {/* Display the movie list */}
      <div className="movie-list">
        <h2>Movie List</h2>
        {movies.map((movie, index) => (
          <div key={index} className="movie-item">
            <span className="title">{movie.title}</span> –{" "}
            <span className="genre">{movie.genre}</span> –{" "}
            <span className="rating">Rating: {movie.rating}</span> –{" "}
            <span className="popularity">Popularity: {movie.popularity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

