// hooks/useExcelData.js
import { useState, useEffect, useCallback } from 'react';
import excelService from '../services/excelService';
import websocketService from '../services/websocketService';
import toast from 'react-hot-toast';

const useExcelData = () => {
  const [capacityData, setCapacityData] = useState([]);
  const [machineStatus, setMachineStatus] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [hourlyData, setHourlyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [capacity, machines, downtime, attendance] = await Promise.all([
        excelService.getCapacityUtilization(),
        excelService.getMachineStatus(),
        excelService.getDowntimeMonitoring(),
        excelService.getAttendance()
      ]);
      
      setCapacityData(capacity);
      setMachineStatus(machines);
      setDowntimeData(downtime);
      setAttendanceData(attendance);
      setLastUpdate(new Date());
    } catch (error) {
      toast.error('Failed to fetch Excel data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload Excel file
  const uploadExcel = async (file) => {
    setLoading(true);
    try {
      const sheets = await excelService.parseExcelFile(file);
      
      // Parse all sheets
      const capacity = excelService.parseCapacityUtilization(sheets);
      const machines = excelService.parseMachineStatus(sheets);
      
      setCapacityData(capacity);
      setMachineStatus(machines);
      setLastUpdate(new Date());
      
      toast.success('Excel file uploaded successfully');
      
      // Emit via WebSocket
      websocketService.emit('excel-updated', {
        capacity,
        machines,
        timestamp: new Date()
      });
      
    } catch (error) {
      toast.error('Failed to parse Excel file');
    } finally {
      setLoading(false);
    }
  };

  // Get hourly production for specific machine
  const getHourlyProduction = async (plant, machine) => {
    try {
      const data = await excelService.getHourlyProduction(plant, machine);
      setHourlyData(prev => ({
        ...prev,
        [`${plant}-${machine}`]: data
      }));
      return data;
    } catch (error) {
      toast.error('Failed to fetch hourly data');
      return null;
    }
  };

  // WebSocket setup for real-time updates
  useEffect(() => {
    websocketService.connect();
    
    websocketService.on('excel-updated', (data) => {
      if (data.capacity) setCapacityData(data.capacity);
      if (data.machines) setMachineStatus(data.machines);
      setLastUpdate(new Date());
      toast.success('Excel data updated in real-time');
    });

    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  return {
    capacityData,
    machineStatus,
    downtimeData,
    attendanceData,
    hourlyData,
    loading,
    lastUpdate,
    uploadExcel,
    fetchAllData,
    getHourlyProduction
  };
};

export default useExcelData;