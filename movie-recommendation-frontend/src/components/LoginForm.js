import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5001/login", { email, password })
      .then((response) => {
        const { user, token } = response.data; // Extract user and token from response
        alert("Login successful");
        setEmail("");
        setPassword("");

        // Call the onLogin prop to pass user and token back to App.js
        if (onLogin) {
          onLogin(user, token); // Pass user and token back to the parent
        }
      })
      .catch((error) => {
        console.error("Failed to login:", error.message);
        alert("Login failed. Please check your credentials.");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
