import React, { useState, useEffect } from 'react';

const ShipmentForm = ({ vendorId }) => {
  const [shipments, setShipments] = useState([]);
  const [formData, setFormData] = useState({
    vendor_id: '',
    tracking_id: '',
    dispatch: false,
    tracker: '',
    comments: '',
  });
  const [updatingShipmentId, setUpdatingShipmentId] = useState(null); // State to store the shipment ID being updated

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vendor_id: vendorId, // Prefill the form with the received vendorId
    }));
    fetchShipments();
  }, [vendorId]);

  const fetchShipments = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/shipments/${vendorId}`);
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (updatingShipmentId) {
        // If updatingShipmentId is present, it means we are updating an existing shipment
        await fetch(`https://procurex-backend.onrender.com/api/shipments/${updatingShipmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setUpdatingShipmentId(null); // Clear updatingShipmentId after update
      } else {
        // If updatingShipmentId is not present, it means we are adding a new shipment
        const response = await fetch('https://procurex-backend.onrender.com/api/shipments/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log('Shipment added:', data);
      }
      // Clear the form fields after submission
      setFormData({
        vendor_id: vendorId,
        tracking_id: '',
        dispatch: false,
        tracker: '',
        comments: '',
      });
      fetchShipments(); // Fetch the updated shipments after submission
    } catch (error) {
      console.error('Error adding/updating shipment:', error);
    }
  };

  const handleUpdate = (shipment) => {
    // Set the form data with the shipment values for updating
    setFormData({
      vendor_id: shipment.vendor_id,
      tracking_id: shipment.tracking_id,
      dispatch: shipment.dispatch,
      tracker: shipment.tracker,
      comments: shipment.comments,
    });
    setUpdatingShipmentId(shipment.shipment_id); // Set the shipment ID being updated
  };

  const handleDelete = async (shipmentId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/shipments/${shipmentId}`, {
        method: 'DELETE',
      });
      fetchShipments(); // Fetch the updated shipments after deletion
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Add Shipment</h2>
      <form onSubmit={handleSubmit}>
        {/* Hidden field to store the vendorId */}
        <input type="hidden" name="vendor_id" value={formData.vendor_id} />
        <div className="mb-3">
          <label htmlFor="tracking_id" className="form-label">
            Tracking ID
          </label>
          <input
            type="text"
            className="form-control"
            id="tracking_id"
            name="tracking_id"
            value={formData.tracking_id}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dispatch" className="form-label">
            Dispatch
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="dispatch"
            name="dispatch"
            checked={formData.dispatch}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tracker" className="form-label">
            Tracker
          </label>
          <input
            type="text"
            className="form-control"
            id="tracker"
            name="tracker"
            value={formData.tracker}
            onChange={handleInputChange}
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
          {updatingShipmentId ? 'Update Shipment' : 'Add Shipment'}
        </button>
      </form>

      <h2 className="my-4">Shipments</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Dispatch</th>
            <th>Tracker</th>
            <th>Comments</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.shipment_id}>
              <td>{shipment.tracking_id}</td>
              <td>{shipment.dispatch ? 'Yes' : 'No'}</td>
              <td>{shipment.tracker}</td>
              <td>{shipment.comments}</td>
              <td>
                <button
                  onClick={() => handleUpdate(shipment)}
                  className="btn btn-primary me-2"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(shipment.shipment_id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentForm;
