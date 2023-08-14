import React from 'react';
import { useParams } from "react-router-dom";
import ProductMonthlyMetrics from './ProductMonthlyMetrics';
import ProductStatus from './ProductStatus';
import MonthlyMetrics from './MonthlyMetrics';

const  GrowthManager=() =>{
    const { productId } = useParams();
  return (
    <>
    <ProductStatus productId={productId}/>
    <ProductMonthlyMetrics productId={productId}/>
    {/* <MonthlyMetrics/> */}

</>
  )
}

export default GrowthManager