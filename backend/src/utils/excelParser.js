// src/utils/excelParser.js
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

class ExcelParser {
  constructor() {
    this.currentData = {
      capacity: [],
      machines: [],
      downtime: [],
      attendance: { shiftA: [], shiftB: [] },
      hourlyProduction: [],
      troubleReports: [],
      otif: {},
      dashboardStats: {},
      lastUpdate: new Date()
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const dataPath = path.join(__dirname, '../data/excel-data.json');
      if (fs.existsSync(dataPath)) {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        this.currentData = { ...this.currentData, ...data };
        console.log('✅ Data loaded from file');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  saveToFile() {
    try {
      const dataDir = path.join(__dirname, '../data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(dataDir, 'excel-data.json'),
        JSON.stringify(this.currentData, null, 2)
      );
      console.log('💾 Data saved to file');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  parseExcelFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets = {};

      workbook.SheetNames.forEach(sheetName => {
        sheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
          defval: '',
          blankrows: false,
          raw: false
        });
      });

      const parsedData = {
        capacity: this.parseCapacityUtilization(sheets),
        machines: this.parseMachineStatus(sheets),
        downtime: this.parseDowntime(sheets),
        attendance: this.parseAttendance(sheets),
        hourlyProduction: this.parseHourlyProduction(sheets),
        troubleReports: this.parseTroubleReports(sheets),
        otif: this.parseOTIF(sheets),
        dashboardStats: this.calculateDashboardStats(sheets),
        lastUpdate: new Date()
      };

      this.currentData = { ...this.currentData, ...parsedData };
      this.saveToFile();

      return parsedData;
    } catch (error) {
      console.error('Error parsing Excel:', error);
      throw error;
    }
  }

  parseCapacityUtilization(sheets) {
    const sheet = sheets['Capacity Utilization'];
    if (!sheet || sheet.length === 0) return [];

    const capacities = [];
    let currentPlant = '';
    let currentProcess = '';

    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      
      if (row[0] === 'PLANT 1') {
        currentPlant = 'PLANT 1';
        continue;
      }
      if (row[0] === 'PLANT 2') {
        currentPlant = 'PLANT 2';
        continue;
      }
      
      if (row[1] === 'THERMO' || row[1] === 'PRINTING' || row[1] === 'INJECTION' || 
          row[1] === 'LABELING' || row[1] === 'THERMO LIDS' || row[1] === 'PAPER CUPS') {
        currentProcess = row[1];
        continue;
      }
      
      if (row[1] && row[2] && !row[0] && row[1] !== 'Process') {
        capacities.push({
          plant: currentPlant,
          process: currentProcess,
          machine: row[2],
          fgCode: row[3] || '',
          productDesc: row[4] || '',
          dailyCap: this.parseNumber(row[5]),
          octVolume: this.parseNumber(row[8]),
          novVolume: this.parseNumber(row[9]),
          decVolume: this.parseNumber(row[10]),
          totalVolume: this.parseNumber(row[11]),
          machineUtil: {
            oct: this.parseNumber(row[15]),
            nov: this.parseNumber(row[16]),
            dec: this.parseNumber(row[17])
          }
        });
      }
    }
    return capacities;
  }

  parseMachineStatus(sheets) {
    const sheet = sheets['Machine Status'];
    if (!sheet || sheet.length === 0) return [];

    const machines = [];
    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      if (row && (row[0] === 'P1' || row[0] === 'P2')) {
        machines.push({
          plant: row[0] || '',
          process: row[1] || '',
          machine: row[2] || '',
          status: row[3] || 'Unknown',
          operator: row[4] || '',
          remarks: row[5] || '',
          downtimeStart: row[6] || '',
          downtimeEnd: row[7] || '',
          duration: row[8] || '',
          sku: row[9] || ''
        });
      }
    }
    return machines;
  }

  parseDowntime(sheets) {
    const sheet = sheets['Downtime Monitoring'];
    if (!sheet || sheet.length === 0) return [];

    const downtime = [];
    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      if (row && row[0] && row[1] && row[2] && row[0] !== 'Plant' && row[0] !== '') {
        if (row[6] && row[6].includes('IF')) continue;
        
        downtime.push({
          plant: row[0],
          process: row[1],
          machine: row[2],
          date: row[3] || '',
          startTime: row[4] || '',
          endTime: row[5] || '',
          duration: this.parseDuration(row[6]),
          operator: row[7] || '',
          reason: row[8] || ''
        });
      }
    }
    return downtime;
  }

  parseAttendance(sheets) {
    const sheet = sheets['P1&2 Attendance'];
    const attendance = { shiftA: [], shiftB: [] };

    if (!sheet || sheet.length === 0) return attendance;

    for (let i = 5; i < Math.min(15, sheet.length); i++) {
      const row = sheet[i];
      if (row && row[0] && row[0] !== 'DO NOT DELETE' && row[0] !== 'Attendance Rate') {
        attendance.shiftA.push({
          department: row[0] || '',
          planned: this.parseNumber(row[3]),
          actual: this.parseNumber(row[2]),
          ll: this.parseNumber(row[4]),
          process: this.parseNumber(row[5]),
          inspector: this.parseNumber(row[6]),
          mh: this.parseNumber(row[7])
        });
      }
    }

    for (let i = 20; i < Math.min(30, sheet.length); i++) {
      const row = sheet[i];
      if (row && row[0] && row[0] !== 'DO NOT DELETE' && row[0] !== 'Attendance Rate') {
        attendance.shiftB.push({
          department: row[0] || '',
          planned: this.parseNumber(row[3]),
          actual: this.parseNumber(row[2]),
          ll: this.parseNumber(row[4]),
          process: this.parseNumber(row[5]),
          inspector: this.parseNumber(row[6]),
          mh: this.parseNumber(row[7])
        });
      }
    }
    return attendance;
  }

  parseHourlyProduction(sheets) {
    const sheet = sheets['Sheet1'];
    if (!sheet || sheet.length === 0) return [];

    const production = [];
    const machineNames = ['KMD1', 'KMD2', 'KMD3', 'KMD4', '70K1', '70K2', '70K3', '70K5', 
                          'R8', 'R14', 'R16', 'R22', 'ICM1', 'ICM3', 'ICM4', 'ICM5', 'ICM6', 'ICM7', 'ICM8'];
    
    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      if (row && row[0] && machineNames.includes(row[0])) {
        const nextRow = sheet[i + 1];
        if (nextRow && nextRow[3] !== undefined && nextRow[3] !== '') {
          production.push({
            machine: row[0],
            itemDesc: row[1] || '',
            type: row[2] || 'Actual',
            hourly: {
              '07:00': this.parseNumber(nextRow[3]),
              '08:00': this.parseNumber(nextRow[4]),
              '09:00': this.parseNumber(nextRow[5]),
              '10:00': this.parseNumber(nextRow[6]),
              '11:00': this.parseNumber(nextRow[7]),
              '12:00': this.parseNumber(nextRow[8]),
              '13:00': this.parseNumber(nextRow[9]),
              '14:00': this.parseNumber(nextRow[10]),
              '15:00': this.parseNumber(nextRow[11]),
              '16:00': this.parseNumber(nextRow[12]),
              '17:00': this.parseNumber(nextRow[13]),
              '18:00': this.parseNumber(nextRow[14]),
              '19:00': this.parseNumber(nextRow[15]),
              '20:00': this.parseNumber(nextRow[16]),
              '21:00': this.parseNumber(nextRow[17]),
              '22:00': this.parseNumber(nextRow[18]),
              '23:00': this.parseNumber(nextRow[19])
            },
            total: this.parseNumber(nextRow[27]),
            shiftA: this.parseNumber(nextRow[28]),
            shiftB: this.parseNumber(nextRow[29])
          });
        }
      }
    }
    return production;
  }

  parseTroubleReports(sheets) {
    const sheet = sheets['Prodn Trouble Report'];
    if (!sheet || sheet.length === 0) return [];

    const reports = [];
    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      if (row && row[1] && row[0] !== 'Plant' && row[0] !== '') {
        reports.push({
          plant: row[0],
          machine: row[1],
          skuAffected: row[2] || '',
          dateStarted: row[3] || '',
          issue: row[4] || '',
          actions: row[5] || '',
          status: row[6] || '',
          target: row[7] || '',
          remarks: row[8] || ''
        });
      }
    }
    return reports;
  }

  parseOTIF(sheets) {
    const sheet = sheets['OTIF'];
    const otif = { plannedSKU: {}, completedSKU: {}, plant1OTIF: 0, plant2OTIF: 0, overallOTIF: 0 };

    if (!sheet || sheet.length === 0) return otif;

    for (let i = 0; i < sheet.length; i++) {
      const row = sheet[i];
      if (row && row[1] === 'PLANT 1') otif.plannedSKU.plant1 = this.parseNumber(row[2]);
      if (row && row[1] === 'PLANT 2') otif.plannedSKU.plant2 = this.parseNumber(row[2]);
      if (row && row[1] === 'PLANT 1' && row[4] === 'PLANT 1') {
        otif.completedSKU.plant1 = this.parseNumber(row[2]);
        otif.plant1OTIF = this.parseNumber(row[5]);
      }
      if (row && row[1] === 'PLANT 2') {
        otif.completedSKU.plant2 = this.parseNumber(row[2]);
        otif.plant2OTIF = this.parseNumber(row[4]);
      }
    }

    const totalPlanned = (otif.plannedSKU.plant1 || 0) + (otif.plannedSKU.plant2 || 0);
    const totalCompleted = (otif.completedSKU.plant1 || 0) + (otif.completedSKU.plant2 || 0);
    otif.overallOTIF = totalPlanned > 0 ? (totalCompleted / totalPlanned) * 100 : 0;
    return otif;
  }

  calculateDashboardStats(sheets) {
    const machines = this.parseMachineStatus(sheets);
    const capacity = this.parseCapacityUtilization(sheets);
    const downtime = this.parseDowntime(sheets);
    const attendance = this.parseAttendance(sheets);
    const hourlyProduction = this.parseHourlyProduction(sheets);
    const troubleReports = this.parseTroubleReports(sheets);

    const totalMachines = machines.length;
    const runningMachines = machines.filter(m => m.status === 'Running/Operating').length;
    const idleMachines = machines.filter(m => m.status === 'Idle / Waiting').length;
    const breakdownMachines = machines.filter(m => m.status === 'Breakdown').length;
    const maintenanceMachines = machines.filter(m => m.status === 'Under Maintenance').length;

    const plant1Machines = machines.filter(m => m.plant === 'P1').length;
    const plant2Machines = machines.filter(m => m.plant === 'P2').length;
    const plant1Running = machines.filter(m => m.plant === 'P1' && m.status === 'Running/Operating').length;
    const plant2Running = machines.filter(m => m.plant === 'P2' && m.status === 'Running/Operating').length;

    const totalOutput = capacity.reduce((sum, c) => sum + (c.totalVolume || 0), 0);
    const avgUtilization = capacity.reduce((sum, c) => {
      const avg = ((c.machineUtil?.oct || 0) + (c.machineUtil?.nov || 0) + (c.machineUtil?.dec || 0)) / 3;
      return sum + avg;
    }, 0) / (capacity.length || 1) * 100;

    const totalDowntimeHours = downtime.reduce((sum, d) => {
      const hours = parseInt(d.duration?.split(' ')[0] || '0');
      return sum + (isNaN(hours) ? 0 : hours);
    }, 0);

    const totalPlanned = [...attendance.shiftA, ...attendance.shiftB].reduce((sum, d) => sum + (d.planned || 0), 0);
    const totalActual = [...attendance.shiftA, ...attendance.shiftB].reduce((sum, d) => sum + (d.actual || 0), 0);
    const attendanceRate = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
    const hourlyTotal = hourlyProduction.reduce((sum, p) => sum + (p.total || 0), 0);

    return {
      machines: {
        total: totalMachines,
        running: runningMachines,
        idle: idleMachines,
        breakdown: breakdownMachines,
        maintenance: maintenanceMachines,
        availability: totalMachines > 0 ? (runningMachines / totalMachines * 100).toFixed(1) : 0
      },
      plants: {
        plant1: { total: plant1Machines, running: plant1Running },
        plant2: { total: plant2Machines, running: plant2Running }
      },
      production: {
        totalOutput,
        avgUtilization: avgUtilization.toFixed(1),
        hourlyTotal,
        capacityCount: capacity.length
      },
      downtime: { total: totalDowntimeHours, events: downtime.length },
      attendance: { totalPlanned, totalActual, rate: attendanceRate.toFixed(1), shiftA: attendance.shiftA, shiftB: attendance.shiftB },
      troubleReports: { total: troubleReports.length, critical: troubleReports.filter(r => r.status === 'Not running').length }
    };
  }

  parseNumber(value) {
    if (value === undefined || value === null || value === '') return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.toString().replace(/,/g, '').trim();
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  parseDuration(durationStr) {
    if (!durationStr || typeof durationStr !== 'string') return '0 mins';
    if (durationStr.includes('hr') || durationStr.includes('mins')) return durationStr;
    const num = parseFloat(durationStr);
    if (!isNaN(num)) return `${num} hrs`;
    return '0 mins';
  }

  getCurrentData() {
    return this.currentData;
  }
}

module.exports = new ExcelParser();