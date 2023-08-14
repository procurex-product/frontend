import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import VendorManager from "./VendorManager";
import AllotmentPhotoshoot from "./AllotmentPhotoshoot";
import AllotmentListing from "./AllotmentListing";
import AllotmentContent from "./AllotmentContent";
import ProductInformation from "./ProductInformation";
import VendorForm from "./VendorForm";
import VendorTable from "./VendorTable";
import FinalizedVendorTable from "./FinalizedVendorTable";
function ProductDetail() {
  const [product, setProduct] = useState({});
  const [deleted, setDeleted] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the product detail using the productId
    fetch(`https://procurex-backend.onrender.com/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log("Error fetching product:", error));
  }, [productId]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Delete the product using fetch
      fetch(`https://procurex-backend.onrender.com/api/products/${productId}`, {
        method: "DELETE",
      })
        .then(() => {
          alert("Product deleted successfully");
          setDeleted(true);
          navigate("/products"); // Redirect to the Products page
        })
        .catch((error) => console.log("Error deleting product:", error));
    }
  };

  const updateProduct = (formData) => {
    // Update the product using fetch
    fetch(`https://procurex-backend.onrender.com/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.log("Error updating product:", error));
  };

  return (
    <div className="container mt-4">
      {deleted ? (
        <h2>Product has been deleted.</h2>
      ) : (
        <>
          <ProductInformation
            product={product}
            updateProduct={updateProduct}
            handleDelete={handleDelete}
          />
          <hr />
          <VendorForm productId={productId} />
          <hr></hr>
          <VendorTable productId={productId} />
          <hr></hr>
          <FinalizedVendorTable productId={productId} />
          {/* <VendorManager productId={productId} /> */}
          <hr />
          <AllotmentPhotoshoot productId={productId} />
          <hr />
          <AllotmentListing productId={productId} />
          <hr />
          <AllotmentContent productId={productId} />
        </>
      )}
    </div>
  );
}

export default ProductDetail;
