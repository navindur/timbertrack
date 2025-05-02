import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data: {
    period: string;
    total_sales: number;
    order_count: number;
  }[];
  currency?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, currency = 'LKR' }) => {
  const chartData = {
    labels: data.map(item => item.period),
    datasets: [
      {
        label: `Sales (${currency})`,
        data: data.map(item => item.total_sales),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Order Count',
        data: data.map(item => item.order_count),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: `Sales (${currency})`,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Order Count',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SalesChart;