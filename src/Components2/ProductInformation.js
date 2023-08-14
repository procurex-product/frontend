import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductInformation = () => {
  const [product, setProduct] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the product detail using the productId
    fetch(`https://procurex-backend.onrender.com/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log('Error fetching product:', error));
  }, [productId]);

  useEffect(() => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
    });
  }, [product]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleUpdate = () => {
    const updatedProduct = {
      name: formData.name,
      description: formData.description,
    };

    fetch(`https://procurex-backend.onrender.com/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsEditMode(false);
        setProduct(data);
        alert('Product updated successfully');
      })
      .catch((error) => console.log('Error updating product:', error));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`https://procurex-backend.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          alert('Product deleted successfully');
          // Redirect to the Products page after successful delete
          navigate('/products');
        })
        .catch((error) => console.log('Error deleting product:', error));
    }
  };

  return (
    <div className="container mt-4">
      {isEditMode ? (
        <>
          <h3>Edit Product</h3>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button className="btn btn-primary me-2" onClick={handleUpdate}>
            Update Product
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3>Product Information</h3>
          <p>ID: {product.id}</p>
          <p>Name: {product.name}</p>
          <p>Description: {product.description}</p>
          <button className="btn btn-primary me-2" onClick={handleEdit}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ProductInformation;
