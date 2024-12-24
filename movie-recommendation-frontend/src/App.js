import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [popularity, setPopularity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMovie = { title, genre, rating, popularity };

    try {
      const response = await fetch('http://localhost:5001/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      });

      if (response.ok) {
        alert('Movie added successfully!');
        setTitle('');
        setGenre('');
        setRating('');
        setPopularity('');
      } else {
        alert('Failed to add movie.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movie Recommendation Platform</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Genre: </label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rating: </label>
          <input
            type="number"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Popularity: </label>
          <input
            type="number"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default App;


