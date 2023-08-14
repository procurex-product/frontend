import React, { useState, useEffect } from 'react';
import './AllotmentListing.css';

const AllotmentListing = ({ productId }) => {
  const [allotmentListings, setAllotmentListings] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    allotted_date: '',
    timeline_deadline: '',
    submission_date: '',
    comments: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchAllotmentListings();
  }, [productId]); // Fetch allotment listings whenever the productId changes

  const fetchAllotmentListings = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/allotment/listing/${productId}`);
      const data = await response.json();
      setAllotmentListings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching allotment listings:', error);
      setLoading(false);
    }
  };

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
        await fetch(`https://procurex-backend.onrender.com/api/allotment/listing/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setNotification('Allotment listing updated successfully!');
        setEditMode(false);
        setEditId(null);
      } else {
        const response = await fetch('https://procurex-backend.onrender.com/api/allotment/listing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        setAllotmentListings([...allotmentListings, data]);
        setNotification('Allotment listing added successfully!');
      }

      setFormData({
        product_id: productId, // Keep the productId from props
        allotted_date: '',
        timeline_deadline: '',
        submission_date: '',
        comments: '',
      });
    } catch (error) {
      console.error('Error adding/updating allotment listing:', error);
      setNotification('Error adding/updating allotment listing. Please try again.');
    }
  };

  const handleEdit = (listing) => {
    setFormData({
      product_id: productId, // Keep the productId from props
      allotted_date: listing.allotted_date,
      timeline_deadline: listing.timeline_deadline,
      submission_date: listing.submission_date,
      comments: listing.comments,
    });
    setEditMode(true);
    setEditId(listing.allotment_id);
  };

  const handleDelete = async (listingId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/allotment/listing/${listingId}`, {
        method: 'DELETE',
      });
      setAllotmentListings(allotmentListings.filter((listing) => listing.allotment_id !== listingId));
      setNotification('Allotment listing deleted successfully!');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting allotment listing:', error);
      setNotification('Error deleting allotment listing. Please try again.');
    }
  };

  const confirmDelete = (listingId) => {
    setShowConfirmation(true);
    setEditId(listingId);
  };

  const renderConfirmation = () => {
    if (!showConfirmation) return null;

    return (
      <div className="confirmation">
        <p>Are you sure you want to delete this allotment listing?</p>
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

  const renderAllotmentListings = () => {
    if (loading) return <p>Loading...</p>;

    if (allotmentListings.length === 0) return <p>No allotment listings found.</p>;

    return (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Allotted Date</th>
            <th>Timeline Deadline</th>
            <th>Submission Date</th>
            <th>Comments</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {allotmentListings.map((listing) => (
            <tr key={listing.allotment_id}>
              <td>{listing.allotted_date}</td>
              <td>{listing.timeline_deadline}</td>
              <td>{listing.submission_date}</td>
              <td>{listing.comments}</td>
              <td>
                <button onClick={() => handleEdit(listing)} className="btn btn-primary">
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => confirmDelete(listing.allotment_id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container allotment-listing-container">
      <h2 className="my-4">Allotment Listing</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="allotted_date" className="form-label">
            Allotted Date
          </label>
          <input
            type="date"
            className="form-control"
            id="allotted_date"
            name="allotted_date"
            value={formData.allotted_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timeline_deadline" className="form-label">
            Timeline Deadline
          </label>
          <input
            type="date"
            className="form-control"
            id="timeline_deadline"
            name="timeline_deadline"
            value={formData.timeline_deadline}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="submission_date" className="form-label">
            Submission Date
          </label>
          <input
            type="date"
            className="form-control"
            id="submission_date"
            name="submission_date"
            value={formData.submission_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="comments" className="form-label">
            Comments
          </label>
          <textarea
            className="form-control"
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Update Allotment Listing' : 'Add Allotment Listing'}
        </button>
      </form>

      {renderNotification()}
      {renderConfirmation()}
      {renderAllotmentListings()}
    </div>
  );
};

export default AllotmentListing;
