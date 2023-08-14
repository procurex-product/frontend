import React from 'react';

const ProductCard = ({ product, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://procurex-backend.onrender.com/api/products/${product.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        // Handle successful deletion, e.g., show a success message
        console.log('Product deleted successfully');
        // Call the onDelete prop to update the parent component
        onDelete(product.id);
      } else {
        // Handle errors, e.g., show an error message
        console.error('Error deleting product:', response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default ProductCard;
