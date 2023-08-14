import React, { useState } from "react";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import Home from "./Components2/Home";
import ProductList from "./Components2/ProductList";
import ProductDetail from "./Components2/ProductDetail";
import VendorDetails from "./Components2/VendorDetails";
import NotesManager from "./Components2/NotesManager";
import GrowthManager from "./Components2/GrowthManager";
import SignIn from "./Components2/SignIn";
import SignUp from "./Components2/SignUp";

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleSignIn = async (formData) => {
    try {
      const response = await fetch(
        "https://procurex-backend.onrender.com/api/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Sign-in successful, update the isAuthenticated state
        setIsAuthenticated(true);
        return response.status;
      } else {
        // Sign-in failed, display an error message or handle as needed
        console.error("Sign-in failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand font-weight-bold fs-4" to="/">
            Procurex
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/products">
                      Products
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => setIsAuthenticated(false)}
                    >
                      LogOut
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetail/>} />
        <Route path="/products/notes/:productId" element={<NotesManager/>} />
        <Route path="/products/growth/:productId" element={<GrowthManager/>} />
        <Route path="/vendors/:vendorId" element={<VendorDetails/>} />
      </Routes> */}

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/signin" />}
        />

        <Route
          path="/products"
          element={
            isAuthenticated ? <ProductList /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/products/:productId"
          element={
            isAuthenticated ? <ProductDetail /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/vendors/:vendorId"
          element={
            isAuthenticated ? <VendorDetails /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/products/notes/:productId"
          element={
            isAuthenticated ? <NotesManager /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/products/growth/:productId"
          element={
            isAuthenticated ? <GrowthManager /> : <Navigate to="/signin" />
          }
        />

        <Route
          path="/signin"
          element={<SignIn handleSignIn={handleSignIn} />}
        />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
