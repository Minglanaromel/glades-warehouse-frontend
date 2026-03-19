import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const useExcelData = () => {
  const [loading, setLoading] = useState(false);
  const [capacityData, setCapacityData] = useState([]);
  const [machineStatus, setMachineStatus] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchExcelData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/excel/data');
      
      setCapacityData(response.data.capacityData || []);
      setMachineStatus(response.data.machineStatus || []);
      setDowntimeData(response.data.downtimeData || []);
      setAttendanceData(response.data.attendanceData || []);
      setProductionData(response.data.productionData || []);
      setLastUpdate(new Date());
      
      console.log('Excel data loaded:', response.data);
    } catch (error) {
      console.error('Failed to fetch Excel data:', error);
      // Don't show error toast - use fallback data instead
    } finally {
      setLoading(false);
    }
  };

  const uploadExcel = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/excel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Excel file uploaded successfully');
      await fetchExcelData(); // Refresh data after upload
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getHourlyProduction = (plant, machine) => {
    // Generate mock hourly data for charts
    const hours = [];
    const values = [];
    
    for (let i = 6; i <= 18; i++) {
      hours.push(`${i}:00`);
      // Random production between 70-130
      values.push(Math.floor(Math.random() * 60 + 70));
    }
    
    return Promise.resolve({ hours, values });
  };

  useEffect(() => {
    fetchExcelData();
  }, []);

  return {
    capacityData,
    machineStatus,
    downtimeData,
    attendanceData,
    productionData,
    loading,
    lastUpdate,
    uploadExcel,
    getHourlyProduction,
    refreshData: fetchExcelData
  };
};

export default useExcelData;