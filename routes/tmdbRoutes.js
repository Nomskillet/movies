const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error("TMDB_API_KEY is not set in the environment variables.");
}

// Route for searching movies on TMDb
router.get("/search", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: TMDB_API_KEY,
          query,
        },
      }
    );

    if (response.data && response.data.results) {
      res.status(200).json(response.data.results);
    } else {
      res.status(404).json({ message: "No movies found" });
    }
  } catch (error) {
    console.error("Error fetching data from TMDb:", error.message);

    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.status_message || "TMDb error occurred",
      });
    } else {
      res.status(500).json({ message: "Failed to fetch data from TMDb" });
    }
  }
});

// Route for fetching details of a specific movie by ID
router.get("/movie/:id", async (req, res) => {
  const movieId = req.params.id;

  if (!movieId) {
    return res.status(400).json({ message: "Movie ID parameter is required" });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      }
    );

    if (response.data) {
      res.status(200).json(response.data);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.error("Error fetching movie details from TMDb:", error.message);

    if (error.response) {
      res.status(error.response.status).json({
        message: error.response.data.status_message || "TMDb error occurred",
      });
    } else {
      res.status(500).json({ message: "Failed to fetch movie details from TMDb" });
    }
  }
});

module.exports = router;

