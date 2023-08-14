import React, { useState, useEffect } from "react";

const ReceiptForm = ({ vendorId }) => {
  const [receipts, setReceipts] = useState([]);
  const [formData, setFormData] = useState({
    vendor_id: "",
    receipt_date: "",
    quantity_received: "",
    comments: "",
  });
  const [updatingReceiptId, setUpdatingReceiptId] = useState(null); // State to store the receipt ID being updated

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vendor_id: vendorId, // Prefill the form with the received vendorId
    }));
    fetchReceipts();
  }, [vendorId]);

  const fetchReceipts = async () => {
    try {
      const response = await fetch(
        `https://procurex-backend.onrender.com/api/receipts/${vendorId}`
      );
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
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
      if (updatingReceiptId) {
        // If updatingReceiptId is present, it means we are updating an existing receipt
        await fetch(
          `https://procurex-backend.onrender.com/api/receipts/${updatingReceiptId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        setUpdatingReceiptId(null); // Clear updatingReceiptId after update
      } else {
        // If updatingReceiptId is not present, it means we are adding a new receipt
        const response = await fetch(
          "https://procurex-backend.onrender.com/api/receipts/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        console.log("Receipt added:", data);
      }
      // Clear the form fields after submission
      setFormData({
        vendor_id: vendorId,
        receipt_date: "",
        quantity_received: "",
        comments: "",
      });
      fetchReceipts(); // Fetch the updated receipts after submission
    } catch (error) {
      console.error("Error adding/updating receipt:", error);
    }
  };

  const handleUpdate = (receipt) => {
    // Set the form data with the receipt values for updating
    setFormData({
      vendor_id: receipt.vendor_id,
      receipt_date: receipt.receipt_date,
      quantity_received: receipt.quantity_received,
      comments: receipt.comments,
    });
    setUpdatingReceiptId(receipt.receipt_id); // Set the receipt ID being updated
  };

  const handleDelete = async (receiptId) => {
    try {
      await fetch(
        `https://procurex-backend.onrender.com/api/receipts/${receiptId}`,
        {
          method: "DELETE",
        }
      );
      fetchReceipts(); // Fetch the updated receipts after deletion
    } catch (error) {
      console.error("Error deleting receipt:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Add Receipt</h2>
      <form onSubmit={handleSubmit}>
        {/* Hidden field to store the vendorId */}
        <input type="hidden" name="vendor_id" value={formData.vendor_id} />
        <div className="mb-3">
          <label htmlFor="receipt_date" className="form-label">
            Receipt Date
          </label>
          <input
            type="date"
            className="form-control"
            id="receipt_date"
            name="receipt_date"
            value={formData.receipt_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity_received" className="form-label">
            Quantity Received
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity_received"
            name="quantity_received"
            value={formData.quantity_received}
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
          {updatingReceiptId ? "Update Receipt" : "Add Receipt"}
        </button>
      </form>

      <h2 className="my-4">Receipts</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Receipt Date</th>
            <th>Quantity Received</th>
            <th>Comments</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.receipt_id}>
              <td>{receipt.receipt_date}</td>
              <td>{receipt.quantity_received}</td>
              <td>{receipt.comments}</td>
              <td>
                <button
                  onClick={() => handleUpdate(receipt)}
                  className="btn btn-primary me-2"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(receipt.receipt_id)}
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

export default ReceiptForm;
