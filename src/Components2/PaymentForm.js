import React, { useState, useEffect } from 'react';

const PaymentForm = ({ vendorId }) => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    vendor_id: '',
    mail_sent: false,
    approval: false,
    upload_success: false,
    payment_date: '',
    transaction_number: '',
    comments: '',
  });
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null); // State to store the payment ID being updated

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vendor_id: vendorId, // Prefill the form with the received vendorId
    }));
    fetchPayments();
  }, [vendorId]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`https://procurex-backend.onrender.com/payments/${vendorId}`);
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
      if (updatingPaymentId) {
        // If updatingPaymentId is present, it means we are updating an existing payment
        await fetch(`https://procurex-backend.onrender.com/api/payments/${updatingPaymentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        setUpdatingPaymentId(null); // Clear updatingPaymentId after update
      } else {
        // If updatingPaymentId is not present, it means we are adding a new payment
        const response = await fetch('https://procurex-backend.onrender.com/api/payments/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log('Payment added:', data);
      }
      // Clear the form fields after submission
      setFormData({
        vendor_id: vendorId,
        mail_sent: false,
        approval: false,
        upload_success: false,
        payment_date: '',
        transaction_number: '',
        comments: '',
      });
      fetchPayments(); // Fetch the updated payments after submission
    } catch (error) {
      console.error('Error adding/updating payment:', error);
    }
  };

  const handleUpdate = (payment) => {
    // Set the form data with the payment values for updating
    setFormData({
      vendor_id: payment.vendor_id,
      mail_sent: payment.mail_sent,
      approval: payment.approval,
      upload_success: payment.upload_success,
      payment_date: payment.payment_date,
      transaction_number: payment.transaction_number,
      comments: payment.comments,
    });
    setUpdatingPaymentId(payment.payment_id); // Set the payment ID being updated
  };

  const handleDelete = async (paymentId) => {
    try {
      await fetch(`https://procurex-backend.onrender.com/api/payments/${paymentId}`, {
        method: 'DELETE',
      });
      fetchPayments(); // Fetch the updated payments after deletion
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Add Payment</h2>
      <form onSubmit={handleSubmit}>
        {/* Hidden field to store the vendorId */}
        <input type="hidden" name="vendor_id" value={formData.vendor_id} />
        <div className="mb-3">
          <label htmlFor="payment_date" className="form-label">
            Payment Date
          </label>
          <input
            type="date"
            className="form-control"
            id="payment_date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="transaction_number" className="form-label">
            Transaction Number
          </label>
          <input
            type="text"
            className="form-control"
            id="transaction_number"
            name="transaction_number"
            value={formData.transaction_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mail_sent" className="form-label">
            Mail Sent
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="mail_sent"
            name="mail_sent"
            checked={formData.mail_sent}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="approval" className="form-label">
            Approval
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="approval"
            name="approval"
            checked={formData.approval}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="upload_success" className="form-label">
            Upload Success
          </label>
          <input
            type="checkbox"
            className="form-check-input"
            id="upload_success"
            name="upload_success"
            checked={formData.upload_success}
            onChange={handleCheckboxChange}
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
          {updatingPaymentId ? 'Update Payment' : 'Add Payment'}
        </button>
      </form>

      <h2 className="my-4">Payments</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Payment Date</th>
            <th>Transaction Number</th>
            <th>Mail Sent</th>
            <th>Approval</th>
            <th>Upload Success</th>
            <th>Comments</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id}>
              <td>{payment.payment_date}</td>
              <td>{payment.transaction_number}</td>
              <td>{payment.mail_sent ? 'Yes' : 'No'}</td>
              <td>{payment.approval ? 'Yes' : 'No'}</td>
              <td>{payment.upload_success ? 'Yes' : 'No'}</td>
              <td>{payment.comments}</td>
              <td>
                <button
                  onClick={() => handleUpdate(payment)}
                  className="btn btn-primary me-2"
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(payment.payment_id)}
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

export default PaymentForm;
