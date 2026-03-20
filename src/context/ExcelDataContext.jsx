// src/context/ExcelDataContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ExcelDataContext = createContext();

export const useExcelData = () => {
  const context = useContext(ExcelDataContext);
  if (!context) {
    throw new Error('useExcelData must be used within ExcelDataProvider');
  }
  return context;
};

export const ExcelDataProvider = ({ children }) => {
  const [excelData, setExcelData] = useState({
    capacityUtilization: [],
    machineStatus: [],
    downtime: [],
    attendance: null,
    productionStatus: [],
    troubleReports: [],
    productionSheets: {}
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Process Excel file
  const uploadExcel = useCallback(async (file) => {
    if (!file) return false;

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { sheetRows: 1000 });
      
      const sheets = {};
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: '', blankrows: false });
      });

      // Process Capacity Utilization
      let capacityData = [];
      if (sheets['Capacity Utilization']) {
        capacityData = sheets['Capacity Utilization'].filter(row => row.Machine).map(row => ({
          process: row.Process || '',
          machine: row.Machine || '',
          productDesc: row['Product Desc'] || '',
          dailyCap: row['Daily Cap. pcs'] || 0,
          octUtil: row.Oct || 0,
          novUtil: row.Nov || 0,
          decUtil: row.Dec || 0,
          totalVolume: row.Total || 0
        }));
      }

      // Process Machine Status
      let machineStatusData = [];
      if (sheets['Machine Status']) {
        machineStatusData = sheets['Machine Status'].filter(row => row.Machine).map(row => ({
          plant: row.Plant || 'P1',
          process: row.Process || '',
          machine: row.Machine || '',
          status: row.Status || 'Idle',
          operator: row.Operator || '',
          remarks: row.Remarks || '',
          duration: row.Duration || ''
        }));
      }

      // Process Downtime Monitoring
      let downtimeData = [];
      if (sheets['Downtime Monitoring']) {
        downtimeData = sheets['Downtime Monitoring'].filter(row => row['Machine Name']).map(row => ({
          plant: row.Plant || 'P1',
          process: row['Process/Area'] || '',
          machine: row['Machine Name'] || '',
          date: row.Date || '',
          startTime: row['Start Downtime'] || '',
          endTime: row['End Downtime'] || '',
          duration: row.Duration || '',
          operator: row.Operator || '',
          reason: row['Downtime Reason'] || ''
        }));
      }

      // Process Attendance
      let attendanceData = null;
      if (sheets['P1&2 Attendance']) {
        const attendance = sheets['P1&2 Attendance'];
        attendanceData = {
          shiftA: {
            extrusion: { actual: attendance[5]?.G || 0, plan: attendance[5]?.H || 0 },
            thermo: { actual: attendance[5]?.K || 0, plan: attendance[5]?.L || 0 },
            printing: { actual: attendance[5]?.O || 0, plan: attendance[5]?.P || 0 },
            thermoIcm: { actual: attendance[5]?.S || 0, plan: attendance[5]?.T || 0 },
            injection: { actual: attendance[5]?.W || 0, plan: attendance[5]?.X || 0 },
            labeling: { actual: attendance[5]?.AA || 0, plan: attendance[5]?.AB || 0 },
            recycling: { actual: attendance[5]?.AE || 0, plan: attendance[5]?.AF || 0 }
          },
          shiftB: {
            extrusion: { actual: attendance[19]?.G || 0, plan: attendance[19]?.H || 0 },
            thermo: { actual: attendance[19]?.K || 0, plan: attendance[19]?.L || 0 },
            printing: { actual: attendance[19]?.O || 0, plan: attendance[19]?.P || 0 },
            thermoIcm: { actual: attendance[19]?.S || 0, plan: attendance[19]?.T || 0 },
            injection: { actual: attendance[19]?.W || 0, plan: attendance[19]?.X || 0 },
            labeling: { actual: attendance[19]?.AA || 0, plan: attendance[19]?.AB || 0 },
            recycling: { actual: attendance[19]?.AE || 0, plan: attendance[19]?.AF || 0 }
          }
        };
      }

      // Process Trouble Reports
      let troubleData = [];
      if (sheets['Prodn Trouble Report']) {
        troubleData = sheets['Prodn Trouble Report'].filter(row => row.Machine).map(row => ({
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
      }

      // Process Production data from various sheets
      let productionStatus = [];
      if (sheets['Thermo-Print-Extr']) {
        const thermoData = sheets['Thermo-Print-Extr'].filter(row => row['FG CODE / MACHINE'] || row.Machine).slice(0, 20).map(row => ({
          machine: row['FG CODE / MACHINE'] || row.Machine || '',
          itemDesc: row['ITEM DESCRIPTION'] || '',
          actual: row.Actual || 0,
          plan: row.Plan || 0,
          percentage: row['% Completion'] || 0,
          remarks: row.Remarks || ''
        }));
        productionStatus.push(...thermoData);
      }
      
      if (sheets['INJ.-ICM-Labeling']) {
        const injData = sheets['INJ.-ICM-Labeling'].filter(row => row['FG CODE / MACHINE'] || row.Machine).slice(0, 20).map(row => ({
          machine: row['FG CODE / MACHINE'] || row.Machine || '',
          itemDesc: row['ITEM DESCRIPTION'] || '',
          actual: row.Actual || 0,
          plan: row.Plan || 0,
          percentage: row['% Completion'] || 0,
          remarks: row.Remarks || ''
        }));
        productionStatus.push(...injData);
      }

      // Save all data
      const newExcelData = {
        capacityUtilization: capacityData,
        machineStatus: machineStatusData,
        downtime: downtimeData,
        attendance: attendanceData,
        productionStatus: productionStatus.slice(0, 15),
        troubleReports: troubleData,
        productionSheets: sheets
      };
      
      setExcelData(newExcelData);
      setLastUpdate(new Date());
      
      // Save to localStorage for persistence
      localStorage.setItem('excelDashboardData', JSON.stringify({
        ...newExcelData,
        lastUpdate: new Date().toISOString()
      }));
      
      toast.success('Excel file loaded successfully!');
      return true;
    } catch (err) {
      console.error('Error loading Excel:', err);
      toast.error('Failed to load Excel file');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cached data on mount
  const loadCachedData = useCallback(() => {
    const cached = localStorage.getItem('excelDashboardData');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setExcelData({
          capacityUtilization: data.capacityUtilization || [],
          machineStatus: data.machineStatus || [],
          downtime: data.downtime || [],
          attendance: data.attendance || null,
          productionStatus: data.productionStatus || [],
          troubleReports: data.troubleReports || [],
          productionSheets: {}
        });
        if (data.lastUpdate) {
          setLastUpdate(new Date(data.lastUpdate));
        }
      } catch (e) {
        console.error('Error loading cached data:', e);
      }
    }
  }, []);

  return (
    <ExcelDataContext.Provider value={{
      excelData,
      loading,
      lastUpdate,
      uploadExcel,
      loadCachedData
    }}>
      {children}
    </ExcelDataContext.Provider>
  );
};