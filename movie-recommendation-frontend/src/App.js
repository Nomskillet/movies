import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [popularity, setPopularity] = useState("");
  const [movies, setMovies] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(null);

  // Registration state and toggle
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (savedToken && savedUser) {
      setToken(savedToken);
      setLoggedInUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5001/movies", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setMovies(response.data))
        .catch((error) => console.error("Failed to fetch movies:", error.message));
    }
  }, [token]);

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
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Movie added successfully!");
        setTitle("");
        setGenre("");
        setRating("");
        setPopularity("");
        return axios.get("http://localhost:5001/movies", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((response) => setMovies(response.data))
      .catch((error) => alert("Failed to add movie:", error.message));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
  };

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
        alert("Registration successful! Please log in.");
        setIsRegisterMode(false);
      })
      .catch((error) => {
        alert("Registration failed. Please try again.");
        console.error(error.message);
      });
  };

  return (
    <div className="app-container">
      <h1 className="title">Movie Recommendation Platform</h1>

      {loggedInUser ? (
        <div className="header">
          <h2>Welcome, {loggedInUser.name}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : isRegisterMode ? (
        <form className="movie-form" onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsRegisterMode(false)}
              className="toggle-mode"
            >
              Log In
            </button>
          </p>
        </form>
      ) : (
        <>
          <LoginForm
            onLogin={(user, token) => {
              setLoggedInUser(user);
              setToken(token);
              localStorage.setItem("token", token);
              localStorage.setItem("loggedInUser", JSON.stringify(user));
            }}
          />
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsRegisterMode(true)}
              className="toggle-mode"
            >
              Register
            </button>
          </p>
        </>
      )}

      {loggedInUser && (
        <form className="movie-form" onSubmit={handleMovieSubmit}>
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

      <div className="movie-list">
        <h2>Movie List</h2>
        <table className="movie-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Popularity</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={index}>
                <td className="title">{movie.title}</td>
                <td className="genre">{movie.genre}</td>
                <td className="rating">Rating: {movie.rating}</td>
                <td className="popularity">Popularity: {movie.popularity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

