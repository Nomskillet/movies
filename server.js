const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


const mysql = require('mysql2');

const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define a port
const PORT = 3000;


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Movie Recommendation Platform!');
});


app.post('/movies', (req, res) => {
    const { title, genre, rating, popularity } = req.body;

    const query = 'INSERT INTO movies (title, genre, rating, popularity) VALUES (?, ?, ?, ?)';
    const values = [title, genre, rating, popularity];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Failed to insert movie:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Movie added successfully', movieId: results.insertId });
    });
});



app.get('/movies', (req, res) => {
    const query = 'SELECT * FROM movies';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch movies:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});
