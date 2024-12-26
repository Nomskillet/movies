const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const app = express();

const cors = require("cors");


const JWT_SECRET = "Password"; // Replace with a strong secret key

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user; // Attach user info to request
        next();
    });
};



// Middleware
app.use(cors());


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Atlas",
    database: "movie_platform",
  });
  

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

// Routes

// User Registration Endpoint
app.post("/register", async (req, res) => {
  const { username, password, email, name } = req.body;

  if (!username || !password || !email || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password, email, name) VALUES (?, ?, ?, ?)";
    db.query(query, [username, hashedPassword, email, name], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Username or email already exists" });
        }
        return res.status(500).json({ message: "Server error", error: err });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a Movie
app.post("/movies", (req, res) => {
  const { title, genre, rating, popularity } = req.body;

  if (!title || !genre || !rating || !popularity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO movies (title, genre, rating, popularity) VALUES (?, ?, ?, ?)";
  db.query(query, [title, genre, rating, popularity], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error adding movie", error: err });
    }
    res.status(201).json({ message: "Movie added successfully" });
  });
});

// Fetch All Movies
app.get("/movies", authenticateToken, (req, res) => {
    const query = "SELECT * FROM movies";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching movies", error: err });
        }
        res.status(200).json(results);
    });
});


// Start Server
const PORT = 5001; // Ensure this matches the port you're using
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// User Login Endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error", error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        res.status(200).json({
            message: "Login successful",
            token, // Send token to client
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
        });
    });
});
