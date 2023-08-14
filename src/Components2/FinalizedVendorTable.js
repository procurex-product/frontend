import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FinalizedVendorTable = ({ productId }) => {
  const [finalizedVendors, setFinalizedVendors] = useState([]);

  useEffect(() => {
    fetchFinalizedVendors();
  }, [productId]);

  const fetchFinalizedVendors = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/api/vendors/finalized/${productId}`);
      const data = await response.json();
      setFinalizedVendors(data);
    } catch (error) {
      console.error('Error fetching finalized vendors:', error);
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });
      setFinalizedVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor.vendor_id !== vendorId)
      );
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  return (
    <div className="table-responsive">
    <h3>Finalized Vendors</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Details</th>
            <th>Attachment</th>
            <th>Rates</th>
            <th>Notes</th>
            <th>Comments</th>
            <th>View</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {finalizedVendors.map((vendor) => (
            <tr key={vendor.vendor_id}>
              <td>{vendor.name}</td>
              <td>{vendor.contact_email}</td>
              <td>{vendor.contact_phone}</td>
              <td>{vendor.company}</td>
              <td>{vendor.details}</td>
              <td>{vendor.attachment}</td>
              <td>{vendor.rates}</td>
              <td>{vendor.notes}</td>
              <td>{vendor.comments}</td>
              <td>
              <Link to={`/vendors/${vendor.vendor_id}`}>
                <button className="btn btn-primary me-2">View</button>
              </Link>
              </td>
              <td>
                <button onClick={() => handleDelete(vendor.vendor_id)} className="btn btn-danger">
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

export default FinalizedVendorTable;

