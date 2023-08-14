import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VendorInformation = () => {
  const [vendor, setVendor] = useState({});

  const { vendorId } = useParams();

  useEffect(() => {
    fetch(`https://procurex-backend.onrender.com/api/vendorDetails/${vendorId}`)
      .then((response) => response.json())
      .then((data) => setVendor(data))
      .catch((error) => console.log("Error fetching product:", error));
  }, [vendorId]);

  return (
    <div className="container mt-4">
      <>
        <h3>Vendor Information</h3>
        {/* <p>Product Name: {product.name}</p> */}
        <p>Vendor ID: {vendor.vendor_id}</p>
        <p>Name: {vendor.name}</p>
        <p>Company: {vendor.company}</p>
        <p>Email: {vendor.contact_email}</p>
        <p>Phone: {vendor.contact_phone}</p>
        <p>Rates: {vendor.rates}</p>
      </>
    </div>
  );
};

export default VendorInformation;
