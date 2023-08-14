import React, { useState, useEffect } from "react";

const VendorTable = ({ productId }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, [productId]);

  const fetchVendors = async () => {
    try {
      const response = await fetch(
        `https://procurex-backend.onrender.com/api/vendors/${productId}`
      );
      const data = await response.json();
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const handleFinalizeToggle = async (vendorId, finalized) => {
    try {
      await fetch(
        `https://procurex-backend.onrender.com/api/vendors/${vendorId}/finalize`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ finalized }),
        }
      );

      // Update the vendors state to reflect the new finalized status
      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.vendor_id === vendorId
            ? { ...vendor, finalized: finalized ? 1 : 0 }
            : vendor
        )
      );
    } catch (error) {
      console.error("Error updating finalized status:", error);
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      await fetch(
        `https://procurex-backend.onrender.com/api/vendors/${vendorId}`,
        {
          method: "DELETE",
        }
      );

      // Remove the deleted vendor from the vendors state
      setVendors((prevVendors) =>
        prevVendors.filter((vendor) => vendor.vendor_id !== vendorId)
      );
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  return (
    <div className="table-responsive">
      <h3>Vendors</h3>
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
            <th>Finalized</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
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
                <input
                  type="checkbox"
                  checked={vendor.finalized === 1}
                  onChange={() =>
                    handleFinalizeToggle(vendor.vendor_id, !vendor.finalized)
                  }
                />
              </td>
              <td>
                <button
                  onClick={() => handleDelete(vendor.vendor_id)}
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

export default VendorTable;
