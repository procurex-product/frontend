import React, { useState } from 'react';

const Home = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      name: productName,
      description: productDescription,
    };
  
    try {
      const response = await fetch('https://procurex-backend.onrender.com/api/productAdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
  
      // Handle successful response here, e.g., show a success message
      console.log('Product added successfully!');
    } catch (error) {
      // Handle error here, e.g., show an error message
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Product Launcher</h2>
      <hr/>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">Product Description</label>
          <textarea
            className="form-control"
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Home;
