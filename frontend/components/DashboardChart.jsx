"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardChart({ leads }) {

  // ✅ Chart 1: Leads by Category (Bus/Truck count)
  const categoryCounts = leads.reduce((acc, lead) => {
    acc[lead.category] = (acc[lead.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      label: 'Leads by Category',
      data: Object.values(categoryCounts),
      backgroundColor: ['#007bff', '#28a745']
    }]
  };

  // ✅ Chart 2: AI Lead Score per Lead
  const leadScoreData = {
    labels: leads.map((lead) => lead.schoolName || lead.collegeName),
    datasets: [{
      label: 'AI Lead Score',
      data: leads.map((lead) => lead.leadScore),
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h3>Lead Distribution by Category</h3>
      <Bar options={{ ...options, title: { text: 'Lead Distribution' } }} data={categoryData} />

      <h3>AI Lead Score Chart</h3>
      <Bar options={{ ...options, title: { text: 'AI Lead Score per Lead' } }} data={leadScoreData} />
    </div>
  );
}