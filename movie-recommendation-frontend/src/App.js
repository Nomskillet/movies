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

  // State for managing registration form input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // State for managing the logged-in user
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(null);


  // Fetch movies and load user from localStorage when the component loads
  useEffect(() => {
    // Load the logged-in user from localStorage
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser)); // Update state with saved user
    }

    // Fetch movies
    axios
      .get("http://localhost:5001/movies")
      .then((response) => {
        setMovies(response.data); // Update state with fetched movies
      })
      .catch((error) => {
        console.error("Failed to fetch movies:", error.message);
      });
  }, []);

  // Handle movie form submission
  const handleMovieSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/movies", { title, genre, rating, popularity })
      .then(() => {
        alert("Movie added successfully!");
        setTitle("");
        setGenre("");
        setRating("");
        setPopularity("");
        // Refresh the movie list
        axios
          .get("http://localhost:5001/movies")
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

  // Handle user registration form submission
  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/register", {
        username,
        email,
        password,
        name,
      })
      .then(() => {
        alert("User registered successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        setName("");
      })
      .catch((error) => {
        console.error("Failed to register user:", error.message);
        alert("Failed to register user.");
      });
  };

  // Handle logout
  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <div>
      <h1>Movie Recommendation Platform</h1>

      {/* Welcome or Logout Section */}
      {loggedInUser ? (
        <div>
          <h2>Welcome, {loggedInUser.name}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : null}

      {/* User Registration Form */}
      {!loggedInUser && (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
      )}

      {/* Login Form */}
      {!loggedInUser && (
        <LoginForm setLoggedInUser={setLoggedInUser} />
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
            <span className="title">{movie.title}</span> – 
            <span className="genre">{movie.genre}</span> – 
            <span className="rating">Rating: {movie.rating}</span> – 
            <span className="popularity">Popularity: {movie.popularity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

