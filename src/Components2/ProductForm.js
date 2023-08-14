import React, { useState } from "react";

const ProductForm = ({ addProduct }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://procurex-backend.onrender.com/api/productAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        addProduct(data);
        setFormData({
          name: "",
          description: "",
        }); // Reset the form fields to empty after successful submission
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="productName" className="form-label">
          Product Name
        </label>
        <input
          type="text"
          className="form-control"
          id="productName"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productDescription" className="form-label">
          Product Description
        </label>
        <textarea
          className="form-control"
          id="productDescription"
          rows="3"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
