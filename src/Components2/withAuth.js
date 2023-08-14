import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent, isAuthenticated) => {
  return (props) => {
    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/signin" />;
    }
  };
};

export default withAuth;
