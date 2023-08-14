import React, { useState, useEffect } from 'react';
// import './ProductMonthlyMetrics.css';

const ProductMonthlyMetrics = ({ productId }) => {
  // ... (existing code)
  const [monthlyMetrics, setMonthlyMetrics] = useState([]);
  const [formData, setFormData] = useState({
    month: '',
    year: '',
    spent_amount: '',
    revenue_amount: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [monthOptions, setMonthOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    fetchProductMonthlyMetrics();
    fetchMonthOptions();
    fetchYearOptions();
  }, [productId]);

  const fetchProductMonthlyMetrics = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/product/monthly-metrics/${productId}`);
      const data = await response.json();
      setMonthlyMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product monthly metrics:', error);
      setLoading(false);
    }
  };
  const fetchMonthOptions = () => {
    // Create an array of month options, you can modify this according to your requirements
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    setMonthOptions(months);
  };

  const fetchYearOptions = () => {
    // Create an array of year options, you can modify this according to your requirements
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
    setYearOptions(years);
  };

  // ... (existing code)
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
      if (editMode && editId) {
        await fetch(`https://procurex-backend.onrender.com/api/product/monthly-metrics/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setNotification('Product monthly metrics updated successfully!');
        setEditMode(false);
        setEditId(null);
      } else {
        const response = await fetch(`https://procurex-backend.onrender.com/api/product/monthly-metrics/${productId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, product_id: productId }),
        });
        const data = await response.json();
        setMonthlyMetrics([...monthlyMetrics, data]);
        setNotification('Product monthly metrics added successfully!');
      }

      setFormData({
        month: '',
        year: '',
        spent_amount: '',
        revenue_amount: '',
      });
    } catch (error) {
      console.error('Error adding/updating product monthly metrics:', error);
      setNotification('Error adding/updating product monthly metrics. Please try again.');
    }
  };

  const handleEdit = (metrics) => {
    setFormData({
      month: metrics.month,
      year: metrics.year,
      spent_amount: metrics.spent_amount,
      revenue_amount: metrics.revenue_amount,
    });
    setEditMode(true);
    setEditId(metrics.metric_id);
  };

  const handleDelete = async (metricsId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/product/monthly-metrics/${metricsId}`, {
        method: 'DELETE',
      });
      setMonthlyMetrics(monthlyMetrics.filter((metrics) => metrics.metric_id !== metricsId));
      setNotification('Product monthly metrics deleted successfully!');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting product monthly metrics:', error);
      setNotification('Error deleting product monthly metrics. Please try again.');
    }
  };

  const confirmDelete = (metricsId) => {
    setShowConfirmation(true);
    setEditId(metricsId);
  };

  const renderConfirmation = () => {
    if (!showConfirmation) return null;

    return (
      <div className="confirmation">
        <p>Are you sure you want to delete this product monthly metrics?</p>
        <button className="btn btn-danger mr-2" onClick={() => handleDelete(editId)}>
          Yes
        </button>
        <button className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
          No
        </button>
      </div>
    );
  };

  const renderNotification = () => {
    if (!notification) return null;

    return <div className="notification">{notification}</div>;
  };

  const renderProductMonthlyMetrics = () => {
    if (loading) return <p>Loading...</p>;

    if (monthlyMetrics.length === 0) return <p>No product monthly metrics found.</p>;

    return (
        <>
        <hr/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Spent Amount</th>
            <th>Revenue Amount</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {monthlyMetrics.map((metrics) => (
            <tr key={metrics.metric_id}>
              <td>{metrics.month}</td>
              <td>{metrics.year}</td>
              <td>{metrics.spent_amount}</td>
              <td>{metrics.revenue_amount}</td>
              <td>
                <button onClick={() => handleEdit(metrics)} className="btn btn-primary">
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => confirmDelete(metrics.metric_id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
    );
  };


  return (
    <div className="container product-monthly-metrics-container">
      <h2 className="my-4">Product Monthly Metrics</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="month" className="form-label">
            Month
          </label>
          <select
            className="form-control"
            id="month"
            name="month"
            value={formData.month}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="year" className="form-label">
            Year
          </label>
          <select
            className="form-control"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Year</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="spent_amount" className="form-label">
            Spent Amount
          </label>
          <input
            type="number"
            className="form-control"
            id="spent_amount"
            name="spent_amount"
            value={formData.spent_amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="revenue_amount" className="form-label">
            Revenue Amount
          </label>
          <input
            type="number"
            className="form-control"
            id="revenue_amount"
            name="revenue_amount"
            value={formData.revenue_amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Update Metrics' : 'Add Metrics'}
        </button>
      </form>

      {/* ... (existing code) */}
      {renderNotification()}
      {renderConfirmation()}
      {renderProductMonthlyMetrics()}
     
    </div>
  );
};

export default ProductMonthlyMetrics;
