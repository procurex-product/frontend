import React, { useState, useEffect } from 'react';

const ProductStatus = ({ productId }) => {
  const [productStatus, setProductStatus] = useState({
    // is_assigned_for_advertising: false,
    // is_live: false,
  });

  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchProductStatus();
  }, [productId]); // Fetch product status whenever the productId changes

  const fetchProductStatus = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/product/status/${productId}`);
      const data = await response.json();
      setProductStatus(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product status:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setProductStatus({
      ...productStatus,
      [name]: newValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/product/status/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productStatus),
      });
      const data = await response.json();
      setProductStatus(data);
      setNotification('Product status updated successfully!');
    } catch (error) {
      console.error('Error updating product status:', error);
      setNotification('Error updating product status. Please try again.');
    }
  };

  const renderNotification = () => {
    if (!notification) return null;

    return <div className="notification">{notification}</div>;
  };

  const renderProductStatusForm = () => {
    if (loading) return <p>Loading...</p>;

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3 form-check">
        
          <input
            type="checkbox"
            className="form-check-input"
            id="is_assigned_for_advertising"
            name="is_assigned_for_advertising"
            checked={productStatus.is_assigned_for_advertising}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="is_assigned_for_advertising">
            Is Assigned for Advertising
          </label>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="is_live"
            name="is_live"
            checked={productStatus.is_live}
            onChange={handleInputChange}
          />
          <label className="form-check-label" htmlFor="is_live">
            Is Live
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Update Product Status
        </button>
      </form>
    );
  };

  return (
    <div className="container product-status-container">
      <h2 className="my-4">Product Status</h2>
      {renderNotification()}
      {renderProductStatusForm()}
    </div>
  );
};

export default ProductStatus;
