import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend using fetch
    fetch("https://procurex-backend.onrender.com/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Product List</h2>
      <div className="row row-cols-3">
        {products.map((product) => (
          <div key={product.id} className="col mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                {/* <a href={`/products/${product.id}`} className="btn btn-primary">View Details</a> */}
                <Link to={`/products/${product.id}`}>View Details</Link>
                <div></div>
                <Link to={`/products/notes/${product.id}`}>Notes</Link>
                <div></div>
                <Link to={`/products/growth/${product.id}`}>Growth</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
