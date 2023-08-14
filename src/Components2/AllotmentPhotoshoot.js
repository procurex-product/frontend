import React, { useState, useEffect } from 'react';
import './AllotmentPhotoshoot.css';

const AllotmentPhotoshoot = ({ productId }) => {
  const [allotmentPhotoshoots, setAllotmentPhotoshoots] = useState([]);
  const [formData, setFormData] = useState({
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
    fetchAllotmentPhotoshoots();
  }, [productId]); // Fetch allotment photoshoots whenever the productId changes

  const fetchAllotmentPhotoshoots = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/allotment/photoshoot/${productId}`);
      const data = await response.json();
      setAllotmentPhotoshoots(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching allotment photoshoots:', error);
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
        await fetch(`https://procurex-backend.onrender.com/api/allotment/photoshoot/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setNotification('Allotment photoshoot updated successfully!');
        setEditMode(false);
        setEditId(null);
      } else {
        const response = await fetch('https://procurex-backend.onrender.com/api/allotment/photoshoot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, product_id: productId }),
        });
        const data = await response.json();
        setAllotmentPhotoshoots([...allotmentPhotoshoots, data]);
        setNotification('Allotment photoshoot added successfully!');
      }

      setFormData({
        allotted_date: '',
        timeline_deadline: '',
        submission_date: '',
        comments: '',
      });
    } catch (error) {
      console.error('Error adding/updating allotment photoshoot:', error);
      setNotification('Error adding/updating allotment photoshoot. Please try again.');
    }
  };

  const handleEdit = (photoshoot) => {
    setFormData({
      allotted_date: photoshoot.allotted_date,
      timeline_deadline: photoshoot.timeline_deadline,
      submission_date: photoshoot.submission_date,
      comments: photoshoot.comments,
    });
    setEditMode(true);
    setEditId(photoshoot.allotment_id);
  };

  const handleDelete = async (photoshootId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/allotment/photoshoot/${photoshootId}`, {
        method: 'DELETE',
      });
      setAllotmentPhotoshoots(allotmentPhotoshoots.filter((photoshoot) => photoshoot.allotment_id !== photoshootId));
      setNotification('Allotment photoshoot deleted successfully!');
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error deleting allotment photoshoot:', error);
      setNotification('Error deleting allotment photoshoot. Please try again.');
    }
  };

  const confirmDelete = (photoshootId) => {
    setShowConfirmation(true);
    setEditId(photoshootId);
  };

  const renderConfirmation = () => {
    if (!showConfirmation) return null;

    return (
      <div className="confirmation">
        <p>Are you sure you want to delete this allotment photoshoot?</p>
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

  const renderAllotmentPhotoshoots = () => {
    if (loading) return <p>Loading...</p>;

    if (allotmentPhotoshoots.length === 0) return <p>No allotment photoshoots found.</p>;

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
          {allotmentPhotoshoots.map((photoshoot) => (
            <tr key={photoshoot.allotment_id}>
              <td>{photoshoot.allotted_date}</td>
              <td>{photoshoot.timeline_deadline}</td>
              <td>{photoshoot.submission_date}</td>
              <td>{photoshoot.comments}</td>
              <td>
                <button onClick={() => handleEdit(photoshoot)} className="btn btn-primary">
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => confirmDelete(photoshoot.allotment_id)} className="btn btn-danger">
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
    <div className="container allotment-photoshoot-container">
      <h2 className="my-4">Allotment Photoshoot</h2>
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
          {editMode ? 'Update Allotment Photoshoot' : 'Add Allotment Photoshoot'}
        </button>
      </form>

      {renderNotification()}
      {renderConfirmation()}
      {renderAllotmentPhotoshoots()}
    </div>
  );
};

export default AllotmentPhotoshoot;
