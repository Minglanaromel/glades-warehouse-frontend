// services/excelService.js
import * as XLSX from 'xlsx';
import api from './api';

class ExcelService {
  // Upload Excel file
  async uploadExcelFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading Excel:', error);
      throw error;
    }
  }

  // Get Capacity Utilization data
  async getCapacityUtilization() {
    try {
      const response = await api.get('/excel/capacity-utilization');
      return response.data;
    } catch (error) {
      console.error('Error fetching capacity data:', error);
      throw error;
    }
  }

  // Get Machine Status
  async getMachineStatus() {
    try {
      const response = await api.get('/excel/machine-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching machine status:', error);
      throw error;
    }
  }

  // Get Downtime Monitoring
  async getDowntimeMonitoring() {
    try {
      const response = await api.get('/excel/downtime');
      return response.data;
    } catch (error) {
      console.error('Error fetching downtime:', error);
      throw error;
    }
  }

  // Get Employee Attendance
  async getAttendance() {
    try {
      const response = await api.get('/excel/attendance');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  // Get Hourly Production Data (Sheet1)
  async getHourlyProduction(plant = 'PLANT 1', machine = 'KMD1') {
    try {
      const response = await api.get('/excel/hourly-production', {
        params: { plant, machine }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hourly production:', error);
      throw error;
    }
  }

  // Parse Excel file locally
  parseExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = {};
          workbook.SheetNames.forEach(sheetName => {
            sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              header: 1,
              defval: ''
            });
          });
          
          resolve(sheets);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  // Extract specific data from Capacity Utilization sheet
  parseCapacityUtilization(sheets) {
    const capacitySheet = sheets['Capacity Utilization'];
    if (!capacitySheet) return [];
    
    const machines = [];
    let currentPlant = '';
    
    capacitySheet.forEach((row, index) => {
      if (row[0] === 'PLANT 1' || row[0] === 'PLANT 2') {
        currentPlant = row[0];
      }
      
      if (row[1] && row[2] && !row[0]) { // Machine rows
        machines.push({
          plant: currentPlant,
          process: row[1],
          machine: row[2],
          fgCode: row[3],
          productDesc: row[4],
          dailyCap: row[5],
          octVolume: row[8],
          novVolume: row[9],
          decVolume: row[10],
          totalVolume: row[11],
          machineUtil: {
            oct: row[15],
            nov: row[16],
            dec: row[17]
          }
        });
      }
    });
    
    return machines;
  }

  // Parse Machine Status
  parseMachineStatus(sheets) {
    const machineSheet = sheets['Machine Status'];
    if (!machineSheet) return [];
    
    const machines = [];
    machineSheet.forEach((row, index) => {
      if (index > 1 && row[0] && row[1] && row[2]) { // Skip headers
        machines.push({
          plant: row[0],
          process: row[1],
          machine: row[2],
          status: row[3],
          operator: row[4],
          remarks: row[5],
          downtimeStart: row[6],
          downtimeEnd: row[7],
          duration: row[8],
          sku: row[9]
        });
      }
    });
    
    return machines;
  }
}

export default new ExcelService();