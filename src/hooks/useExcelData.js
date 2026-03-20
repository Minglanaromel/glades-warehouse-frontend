import { useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const useExcelData = () => {
  const [capacityData, setCapacityData] = useState([]);
  const [machineStatus, setMachineStatus] = useState([]);
  const [downtimeData, setDowntimeData] = useState([]);
  const [attendanceData, setAttendanceData] = useState(null);
  const [productionData, setProductionData] = useState([]);
  const [troubleReports, setTroubleReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  // Process Excel file
  const processExcelFile = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { 
        sheetRows: 500,
        cellDates: true,
        cellNF: false,
        cellText: false
      });
      
      const sheets = {};
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          blankrows: false,
          raw: false
        });
        sheets[sheetName] = jsonData;
      });
      
      // Process Capacity Utilization
      let processedCapacity = [];
      if (sheets['Capacity Utilization']) {
        processedCapacity = sheets['Capacity Utilization'].filter(row => row.Machine).map(row => ({
          plant: row.Plant || (row['PLANT 1'] ? 'PLANT 1' : 'PLANT 2'),
          process: row.Process || '',
          machine: row.Machine || '',
          productDesc: row['Product Desc'] || '',
          dailyCap: row['Daily Cap. pcs'] || 0,
          octUtil: row.Oct || 0,
          novUtil: row.Nov || 0,
          decUtil: row.Dec || 0,
          totalVolume: row.Total || 0
        }));
        setCapacityData(processedCapacity);
        localStorage.setItem('capacityData', JSON.stringify(processedCapacity));
      }
      
      // Process Machine Status
      let processedMachineStatus = [];
      if (sheets['Machine Status']) {
        processedMachineStatus = sheets['Machine Status'].filter(row => row.Machine).map(row => ({
          plant: row.Plant || 'P1',
          process: row.Process || '',
          machine: row.Machine || '',
          status: row.Status || 'Idle',
          operator: row.Operator || '',
          remarks: row.Remarks || '',
          downtimeStart: row['Downtime (start time)'] || '',
          downtimeEnd: row['Downtime (end time'] || '',
          duration: row.Duration || ''
        }));
        setMachineStatus(processedMachineStatus);
        localStorage.setItem('machineStatus', JSON.stringify(processedMachineStatus));
      }
      
      // Process Downtime Monitoring
      let processedDowntime = [];
      if (sheets['Downtime Monitoring']) {
        processedDowntime = sheets['Downtime Monitoring'].filter(row => row['Machine Name']).map(row => ({
          plant: row.Plant || 'P1',
          process: row['Process/Area'] || '',
          machine: row['Machine Name'] || '',
          date: row.Date || '',
          startTime: row['Start Downtime'] || '',
          endTime: row['End Downtime'] || '',
          duration: row.Duration || '0 mins',
          operator: row.Operator || '',
          reason: row['Downtime Reason'] || ''
        }));
        setDowntimeData(processedDowntime);
        localStorage.setItem('downtimeData', JSON.stringify(processedDowntime));
      }
      
      // Process Attendance
      let processedAttendance = null;
      if (sheets['P1&2 Attendance']) {
        const attendance = sheets['P1&2 Attendance'];
        const shiftA = {
          extrusion: { actual: attendance[5]?.G || 0, plan: attendance[5]?.H || 0 },
          thermo: { actual: attendance[5]?.K || 0, plan: attendance[5]?.L || 0 },
          printing: { actual: attendance[5]?.O || 0, plan: attendance[5]?.P || 0 },
          thermoIcm: { actual: attendance[5]?.S || 0, plan: attendance[5]?.T || 0 },
          injection: { actual: attendance[5]?.W || 0, plan: attendance[5]?.X || 0 },
          labeling: { actual: attendance[5]?.AA || 0, plan: attendance[5]?.AB || 0 },
          recycling: { actual: attendance[5]?.AE || 0, plan: attendance[5]?.AF || 0 }
        };
        const shiftB = {
          extrusion: { actual: attendance[19]?.G || 0, plan: attendance[19]?.H || 0 },
          thermo: { actual: attendance[19]?.K || 0, plan: attendance[19]?.L || 0 },
          printing: { actual: attendance[19]?.O || 0, plan: attendance[19]?.P || 0 },
          thermoIcm: { actual: attendance[19]?.S || 0, plan: attendance[19]?.T || 0 },
          injection: { actual: attendance[19]?.W || 0, plan: attendance[19]?.X || 0 },
          labeling: { actual: attendance[19]?.AA || 0, plan: attendance[19]?.AB || 0 },
          recycling: { actual: attendance[19]?.AE || 0, plan: attendance[19]?.AF || 0 }
        };
        
        const totalActual = Object.values(shiftA).reduce((s, d) => s + d.actual, 0) + 
                           Object.values(shiftB).reduce((s, d) => s + d.actual, 0);
        const totalPlanned = Object.values(shiftA).reduce((s, d) => s + d.plan, 0) + 
                            Object.values(shiftB).reduce((s, d) => s + d.plan, 0);
        
        processedAttendance = {
          shiftA,
          shiftB,
          summary: {
            totalActual,
            totalPlanned,
            attendanceRate: totalPlanned > 0 ? (totalActual / totalPlanned * 100).toFixed(1) : 0
          }
        };
        setAttendanceData(processedAttendance);
        localStorage.setItem('attendanceData', JSON.stringify(processedAttendance));
      }
      
      // Process Trouble Reports
      let processedTrouble = [];
      if (sheets['Prodn Trouble Report']) {
        processedTrouble = sheets['Prodn Trouble Report'].filter(row => row.Machine).map(row => ({
          plant: row.Plant || '',
          machine: row.Machine || '',
          sku: row['SKU Affected'] || '',
          dateStarted: row['Date Started'] || '',
          issue: row.Issue || '',
          actions: row.Actions || '',
          status: row.Status || '',
          target: row['Target to up'] || '',
          remarks: row.Remarks || ''
        }));
        setTroubleReports(processedTrouble);
        localStorage.setItem('troubleReports', JSON.stringify(processedTrouble));
      }
      
      // Process Production sheets
      let processedProduction = [];
      if (sheets['Thermo-Print-Extr']) {
        const thermoData = sheets['Thermo-Print-Extr'].filter(row => row.Machine || row['FG CODE / MACHINE']).slice(0, 20).map(row => ({
          machine: row.Machine || row['FG CODE / MACHINE'] || '',
          itemDesc: row['ITEM DESCRIPTION'] || row['Item Description'] || '',
          actual: row.Actual || 0,
          plan: row.Plan || 0,
          percentage: row['% Completion'] || 0
        }));
        processedProduction.push(...thermoData);
      }
      
      if (sheets['INJ.-ICM-Labeling']) {
        const injData = sheets['INJ.-ICM-Labeling'].filter(row => row.Machine || row['FG CODE / MACHINE']).slice(0, 20).map(row => ({
          machine: row.Machine || row['FG CODE / MACHINE'] || '',
          itemDesc: row['ITEM DESCRIPTION'] || row['Item Description'] || '',
          actual: row.Actual || 0,
          plan: row.Plan || 0,
          percentage: row['% Completion'] || 0
        }));
        processedProduction.push(...injData);
      }
      
      setProductionData(processedProduction);
      localStorage.setItem('productionData', JSON.stringify(processedProduction));
      
      setLastUpdate(new Date());
      
      // Dispatch event to notify all components
      const eventData = {
        capacity: processedCapacity,
        machineStatus: processedMachineStatus,
        downtime: processedDowntime,
        attendance: processedAttendance,
        trouble: processedTrouble,
        production: processedProduction,
        timestamp: new Date()
      };
      
      window.dispatchEvent(new CustomEvent('excelDataUpdated', { detail: eventData }));
      
      toast.success('Excel file loaded successfully!');
      return true;
    } catch (err) {
      console.error('Error processing Excel file:', err);
      setError(err.message);
      toast.error('Failed to load Excel file: ' + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      const cachedCapacity = localStorage.getItem('capacityData');
      const cachedMachineStatus = localStorage.getItem('machineStatus');
      const cachedDowntime = localStorage.getItem('downtimeData');
      const cachedAttendance = localStorage.getItem('attendanceData');
      const cachedTrouble = localStorage.getItem('troubleReports');
      const cachedProduction = localStorage.getItem('productionData');
      
      if (cachedCapacity) setCapacityData(JSON.parse(cachedCapacity));
      if (cachedMachineStatus) setMachineStatus(JSON.parse(cachedMachineStatus));
      if (cachedDowntime) setDowntimeData(JSON.parse(cachedDowntime));
      if (cachedAttendance) setAttendanceData(JSON.parse(cachedAttendance));
      if (cachedTrouble) setTroubleReports(JSON.parse(cachedTrouble));
      if (cachedProduction) setProductionData(JSON.parse(cachedProduction));
    };
    
    loadCachedData();
  }, []);

  const uploadExcel = useCallback(async (file) => {
    return await processExcelFile(file);
  }, [processExcelFile]);

  const refreshData = useCallback(() => {
    const cachedCapacity = localStorage.getItem('capacityData');
    const cachedMachineStatus = localStorage.getItem('machineStatus');
    const cachedDowntime = localStorage.getItem('downtimeData');
    const cachedAttendance = localStorage.getItem('attendanceData');
    const cachedTrouble = localStorage.getItem('troubleReports');
    const cachedProduction = localStorage.getItem('productionData');
    
    if (cachedCapacity) setCapacityData(JSON.parse(cachedCapacity));
    if (cachedMachineStatus) setMachineStatus(JSON.parse(cachedMachineStatus));
    if (cachedDowntime) setDowntimeData(JSON.parse(cachedDowntime));
    if (cachedAttendance) setAttendanceData(JSON.parse(cachedAttendance));
    if (cachedTrouble) setTroubleReports(JSON.parse(cachedTrouble));
    if (cachedProduction) setProductionData(JSON.parse(cachedProduction));
    
    setLastUpdate(new Date());
  }, []);

  return {
    capacityData,
    machineStatus,
    downtimeData,
    attendanceData,
    productionData,
    troubleReports,
    loading,
    lastUpdate,
    error,
    uploadExcel,
    refreshData
  };
};

export default useExcelData;