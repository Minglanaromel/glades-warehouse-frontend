// components/Dashboard/OTIFDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  BuildingOfficeIcon,
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
// Remove this line if no logo:
// import gladesLogo from '../../assets/images/glades-logo.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const OTIFDashboard = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  // Remove logoError state

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          {/* Use BuildingOfficeIcon as logo fallback */}
          <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold tracking-wider">GLADES INTERNATIONAL CORPORATION</h1>
            <p className="text-purple-200 text-sm mt-1 flex items-center">
              <TruckIcon className="h-4 w-4 mr-2" />
              On Time In Full • Customer Service Level Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-purple-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-purple-800/50 px-4 py-2 rounded-lg">
              <ArrowPathIcon className="h-4 w-4 text-purple-300" />
              <span className="text-sm text-purple-200">Real-time Updates</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-800/30 px-4 py-2 rounded-lg">
              <span className="text-sm text-purple-200">{dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex bg-purple-800 rounded-lg p-1">
              <button
                onClick={() => setSelectedPeriod('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === 'weekly' ? 'bg-white text-purple-900' : 'text-white hover:bg-purple-700'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedPeriod('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === 'monthly' ? 'bg-white text-purple-900' : 'text-white hover:bg-purple-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of your component... */}
      <div className="text-center text-sm text-gray-500 py-4 border-t">
        GLADES INTERNATIONAL CORPORATION © {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default OTIFDashboard;