import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';

const MonthlyMetrics = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchYearOptions();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);

  const fetchYearOptions = async () => {
    try {
      // Fetch year options from backend API or use a predefined list of years
      const response = await axios.get('https://procurex-backend.onrender.com/api/year-options');
      const years = response.data;
      setYearOptions(years.map(year => ({ value: year, label: year })));
    } catch (error) {
      console.error('Error fetching year options:', error);
    }
  };

  const fetchData = async (year) => {
    try {
      // Fetch monthly data for the selected year from backend API
      const response = await axios.get(`https://procurex-backend.onrender.com/api/monthly-metrics?year=${year}`);
      const data = response.data;
      setMonthlyData(data);

      // Calculate total revenue and total expense
      let totalRev = 0;
      let totalExp = 0;
      data.forEach((entry) => {
        totalRev += entry.revenue_amount;
        totalExp += entry.spent_amount;
      });
      setTotalRevenue(totalRev);
      setTotalExpense(totalExp);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  // Chart.js configuration for monthly revenue chart
  const revenueChartConfig = {
    labels: monthlyData.map((entry) => entry.month),
    datasets: [
      {
        label: 'Revenue',
        data: monthlyData.map((entry) => entry.revenue_amount),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Chart.js configuration for monthly expense chart
  const expenseChartConfig = {
    labels: monthlyData.map((entry) => entry.month),
    datasets: [
      {
        label: 'Expense',
        data: monthlyData.map((entry) => entry.spent_amount),
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  return (
    <div>
      <h2>Monthly Metrics</h2>
      <Select
        options={yearOptions}
        onChange={(selectedOption) => setSelectedYear(selectedOption.value)}
        placeholder="Select Year"
      />

      <div>
        <h3>Revenue Chart</h3>
        <Line data={revenueChartConfig} />
      </div>

      <div>
        <h3>Expense Chart</h3>
        <Line data={expenseChartConfig} />
      </div>

      <div>
        <h3>Total Revenue: {totalRevenue}</h3>
        <h3>Total Expense: {totalExpense}</h3>
      </div>
    </div>
  );
};

export default MonthlyMetrics;
