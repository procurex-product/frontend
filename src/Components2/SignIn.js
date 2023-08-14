import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const SignIn = ({ handleSignIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notification, setNotification] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Call the handleSignIn function to perform sign-in logic
      const response = await handleSignIn(formData);
      console.log(response);
      if (response==200) {
        setIsAuthenticated(true);
        
        setFormData({
          email: "",
          password: "",
        });
        
      } else {
        const data = await response.json();
        setNotification(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setNotification("Error signing in. Please try again.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default SignIn;
