import React, { useState, useEffect } from 'react';
import './AllotmentContent.css';

const AllotmentContent = ({ productId }) => {
  const [allotments, setAllotments] = useState([]);
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
    fetchAllotments();
  }, [productId]); // Fetch allotments whenever the productId changes

  const fetchAllotments = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/allotment/content/${productId}`);
      const data = await response.json();
      setAllotments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching allotments:', error);
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
        await fetch(`https://procurex-backend.onrender.com/api/allotment/content/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setNotification('Allotment updated successfully!');
        setEditMode(false);
        setEditId(null);
      } else {
        const response = await fetch('https://procurex-backend.onrender.com/api/allotment/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        setAllotments([...allotments, data]);
        setNotification('Allotment added successfully!');
      }

      setFormData({
        product_id: productId, // Keep the productId from props
        allotted_date: '',
        timeline_deadline: '',
        submission_date: '',
        comments: '',
      });
    } catch (error) {
      console.error('Error adding/updating allotment:', error);
      setNotification('Error adding/updating allotment. Please try again.');
    }
  };

  const handleEdit = (allotment) => {
    setFormData({
      product_id: productId, // Keep the productId from props
      allotted_date: allotment.allotted_date,
      timeline_deadline: allotment.timeline_deadline,
      submission_date: allotment.submission_date,
      comments: allotment.comments,
    });
    setEditMode(true);
    setEditId(allotment.allotment_id);
  };

  const handleDelete = async (allotmentId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/allotment/content/${allotmentId}`, {
        method: 'DELETE',
      });
      setAllotments(allotments.filter((allotment) => allotment.allotment_id !== allotmentId));
      setNotification('Allotment deleted successfully!');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting allotment:', error);
      setNotification('Error deleting allotment. Please try again.');
    }
  };

  const confirmDelete = (allotmentId) => {
    setShowConfirmation(true);
    setEditId(allotmentId);
  };

  const renderConfirmation = () => {
    if (!showConfirmation) return null;

    return (
      <div className="confirmation">
        <p>Are you sure you want to delete this allotment?</p>
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

  const renderAllotments = () => {
    if (loading) return <p>Loading...</p>;

    if (allotments.length === 0) return <p>No allotments found.</p>;

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
          {allotments.map((allotment) => (
            <tr key={allotment.allotment_id}>
              <td>{allotment.allotted_date}</td>
              <td>{allotment.timeline_deadline}</td>
              <td>{allotment.submission_date}</td>
              <td>{allotment.comments}</td>
              <td>
                <button onClick={() => handleEdit(allotment)} className="btn btn-primary">
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => confirmDelete(allotment.allotment_id)} className="btn btn-danger">
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
    <div className="container allotment-content-container">
      <h2 className="my-4">Allotment Content</h2>
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
          {editMode ? 'Update Allotment Content' : 'Add Allotment Content'}
        </button>
      </form>

      {renderNotification()}
      {renderConfirmation()}
      {renderAllotments()}
    </div>
  );
};

export default AllotmentContent;
