import React, { useState, useEffect } from 'react';
import './VendorManager.css';

const VendorManager = ({ productId }) => {
  const [vendors, setVendors] = useState([]);
  const [finalizedVendors, setFinalizedVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    company: '',
    details: '',
    attachment: '',
    rates: '',
    notes: '',
    comments: '',
    finalized: false,
  });

  useEffect(() => {
    fetchVendors();
    fetchFinalizedVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/vendors`);
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchFinalizedVendors = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/vendors/finalized`);
      const data = await response.json();
      setFinalizedVendors(data);
    } catch (error) {
      console.error('Error fetching finalized vendors:', error);
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
      const response = await fetch('https://procurex-backend.onrender.com/api/vendors/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData,product_id: productId}),
      });
      const data = await response.json();
      setVendors([...vendors, data]);
      setFormData({
        name: '',
        contact_email: '',
        contact_phone: '',
        company: '',
        details: '',
        attachment: '',
        rates: '',
        notes: '',
        comments: '',
        finalized: false,
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });
      setVendors(vendors.filter((vendor) => vendor.vendor_id !== vendorId));
      setFinalizedVendors(finalizedVendors.filter((vendor) => vendor.vendor_id !== vendorId));
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const handleFinalize = async (vendorId, finalized) => {
    try {
      await fetch(`/api/vendors/${vendorId}/finalize`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finalized }),
      });
      setVendors(
        vendors.map((vendor) =>
          vendor.vendor_id === vendorId ? { ...vendor, finalized } : vendor
        )
      );
      if (finalized) {
        const finalizedVendor = vendors.find((vendor) => vendor.vendor_id === vendorId);
        setFinalizedVendors([...finalizedVendors, finalizedVendor]);
      } else {
        setFinalizedVendors(finalizedVendors.filter((vendor) => vendor.vendor_id !== vendorId));
      }
    } catch (error) {
      console.error('Error finalizing vendor:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Vendor Manager</h2>
      <form onSubmit={handleSubmit}>
        {/* ... (Rest of the form fields) ... */}
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
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact_email" className="form-label">
            Contact Email
          </label>
          <input
            type="email"
            className="form-control"
            id="contact_email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact_phone" className="form-label">
            Contact Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="contact_phone"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="details" className="form-label">
            Details
          </label>
          <textarea
            className="form-control"
            id="details"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="attachment" className="form-label">
            Attachment
          </label>
          <input
            type="text"
            className="form-control"
            id="attachment"
            name="attachment"
            value={formData.attachment}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rates" className="form-label">
            Rates
          </label>
          <input
            type="text"
            className="form-control"
            id="rates"
            name="rates"
            value={formData.rates}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        {/* Add the Comments field to the form */}
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
          Add Vendor
        </button>
      </form>

      <h3 className="my-4">Vendors</h3>
      <table className="table table-bordered">
        <thead>
          {/* ... (Table header columns) ... */}
          <tr>
            <th>Name</th>
            {/* ... (rest of the table headers) */}
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Company</th>
            <th>Details</th>
            <th>Attachment</th>
            <th>Rates</th>
            <th>Notes</th>
            {/* Add the Comments column to the table */}
            <th>Comments</th>
            <th>Finalized</th>
            
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.vendor_id}>
                <td>{vendor.name}</td>
                {/* ... (rest of the table data) */}
                <td>{vendor.contact_email}</td>
              <td>{vendor.contact_phone}</td>
              <td>{vendor.company}</td>
              <td>{vendor.details}</td>
              <td>{vendor.attachment}</td>
              <td>{vendor.rates}</td>
              <td>{vendor.notes}</td>
                <td>
                  <button onClick={() => handleDelete(vendor.vendor_id)} className="btn btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>

      <h3 className="my-4">Finalized Vendors</h3>
      <table className="table table-bordered">
        <thead>
          {/* ... (Table header columns for finalized vendors) ... */}
          <tr>
          <th>Name</th>
            {/* ... (rest of the table headers) */}
            <th>Contact Email</th>
            <th>Contact Phone</th>
            <th>Company</th>
            <th>Details</th>
            <th>Attachment</th>
            <th>Rates</th>
            <th>Notes</th>
            {/* Add the Comments column to the table */}
            <th>Comments</th>
            <th>Delete</th>
            </tr>
        </thead>

        <tbody>
          {finalizedVendors.map((vendor) => (
            <tr key={vendor.vendor_id}>
              {/* ... (Table row data for finalized vendors) ... */}
                <td>{vendor.name}</td>
                {/* ... (rest of the table data) */}
              <td>{vendor.contact_email}</td>
              <td>{vendor.contact_phone}</td>
              <td>{vendor.company}</td>
              <td>{vendor.details}</td>
              <td>{vendor.attachment}</td>
              <td>{vendor.rates}</td>
              <td>{vendor.notes}</td>
              {/* Display the Comments value in the table */}
              <td>{vendor.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorManager;
