import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const MoodChart = ({ data, type = 'doughnut' }) => {
  const emotionColors = {
    joy: '#10b981',
    sadness: '#3b82f6',
    anger: '#ef4444',
    fear: '#8b5cf6',
    surprise: '#f59e0b',
    neutral: '#6b7280'
  };

  // Validate data
  if (!data || !data.labels || !data.values) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    );
  }

  // Check if we have valid data
  const labels = Array.isArray(data.labels) ? data.labels.filter(Boolean) : [];
  const values = Array.isArray(data.values) ? data.values.filter(v => v > 0) : [];
  
  if (labels.length === 0 || values.length === 0 || labels.length !== values.length) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">No chart data available</p>
      </div>
    );
  }

  if (type === 'doughnut') {
    try {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      const chartData = {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map(label => emotionColors[label.toLowerCase()] || emotionColors.neutral),
            borderColor: isDarkMode ? '#1f2937' : '#ffffff',
            borderWidth: 2
          }
        ]
      };
      
      const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              },
              color: isDarkMode ? '#f3f4f6' : '#374151'
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            titleColor: isDarkMode ? '#f3f4f6' : '#374151',
            bodyColor: isDarkMode ? '#f3f4f6' : '#374151',
            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                try {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  if (total === 0) return `${label}: 0%`;
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${percentage}%`;
                } catch (err) {
                  console.error('Error in tooltip callback:', err);
                  return '';
                }
              }
            }
          }
        }
      };

      return (
        <div className="w-full h-64">
          <Doughnut data={chartData} options={options} />
        </div>
      );
    } catch (err) {
      console.error('Error rendering doughnut chart:', err);
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Error rendering chart</p>
        </div>
      );
    }
  }

  if (type === 'line') {
    const chartData = {
      labels: data.labels || [],
      datasets: data.datasets?.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: emotionColors[dataset.label.toLowerCase()] || emotionColors.neutral,
        backgroundColor: `${emotionColors[dataset.label.toLowerCase()] || emotionColors.neutral}20`,
        tension: 0.4,
        fill: true
      })) || []
    };

    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDarkMode ? '#f3f4f6' : '#374151'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          titleColor: isDarkMode ? '#f3f4f6' : '#374151',
          bodyColor: isDarkMode ? '#f3f4f6' : '#374151',
          borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
          borderWidth: 1,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          },
          grid: {
            color: isDarkMode ? '#374151' : '#e5e7eb'
          }
        },
        x: {
          ticks: {
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          },
          grid: {
            color: isDarkMode ? '#374151' : '#e5e7eb'
          }
        }
      }
    };

    return (
      <div className="w-full h-64">
        <Line data={chartData} options={options} />
      </div>
    );
  }

  return null;
};

export default MoodChart;
