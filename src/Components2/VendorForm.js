import React, { useState } from "react";

const VendorForm = ({ productId }) => {
  const [formData, setFormData] = useState({
    productId: productId,
    name: "",
    contact_email: "",
    contact_phone: "",
    company: "",
    details: "",
    attachment: "",
    rates: "",
    notes: "",
    comments: "",
    finalized: false,
  });

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
      const response = await fetch(
        "https://procurex-backend.onrender.com/api/vendors/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Vendor added successfully!");
        // Clear the form after successful addition
        setFormData({
          productId: productId,
          name: "",
          contact_email: "",
          contact_phone: "",
          company: "",
          details: "",
          attachment: "",
          rates: "",
          notes: "",
          comments: "",
          finalized: false,
        });
      } else {
        alert("Failed to add vendor. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("Error adding vendor. Please try again later.");
    }
  };

  return (
    <div>
      <h3>Add New Vendor</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email:</label>
          <input
            type="email"
            className="form-control"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Phone:</label>
          <input
            type="text"
            className="form-control"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Company:</label>
          <input
            type="text"
            className="form-control"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Details:</label>
          <textarea
            className="form-control"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Attachment:</label>
          <input
            type="text"
            className="form-control"
            name="attachment"
            value={formData.attachment}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rates:</label>
          <input
            type="text"
            className="form-control"
            name="rates"
            value={formData.rates}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Notes:</label>
          <textarea
            className="form-control"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comments:</label>
          <textarea
            className="form-control"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="finalized"
            checked={formData.finalized}
            onChange={(e) =>
              setFormData({ ...formData, finalized: e.target.checked })
            }
          />
          <label className="form-check-label">Finalized</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Vendor
        </button>
      </form>
    </div>
  );
};

export default VendorForm;
