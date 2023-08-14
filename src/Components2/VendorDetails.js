import React from 'react';
import { useParams } from "react-router-dom";
import VendorInformation from "./VendorInformation";
import ReceiptForm from './ReceiptForm';
import ShipmentForm from './ShipmentForm';
import PaymentForm from './PaymentForm';
function VendorDetails() {

  const { vendorId } = useParams();



  return (
    <div className="container mt-4">
          <VendorInformation
            vendorId={vendorId}
          />
          <hr />
          <ReceiptForm vendorId={vendorId}/>
          <hr/>
          <hr />
          <ShipmentForm vendorId={vendorId}/>
          <hr/>
          <hr />
          <PaymentForm vendorId={vendorId}/>
          <hr/>
    </div>
  );
}

export default VendorDetails;
