const Sequelize = require('sequelize');
const fs = require('fs');
const ExcelJS = require('exceljs');
const sequelize = new Sequelize('world', 'root', 'root555', {
  host: 'localhost',
  dialect: 'mysql',
});
const EmpDetails = sequelize.define('emp_Details', {
  EEID: {
    type: Sequelize.STRING,
    primaryKey : true,
    allowNull: false,
  },
  Full_Name: {
    type: Sequelize.STRING,
  },
  
  Job_Title: {
    type: Sequelize.STRING,
  },
  Department: {
    type: Sequelize.STRING,
    
  },
});
const readExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    await sequelize.sync();
    worksheet.eachRow({ includeEmpty: false, skipHeader: true, from: 2 }, async (row, rowNumber) => {
      const rowData = row.values;
      try {
        const createdempDetails = await EmpDetails.create({
          EEID: rowData[1],
          Full_Name: rowData[2],
          Job_Title: rowData[3],
          Department: rowData[4],
          });
          console.log(`Row inserted into EmpDetailswith ID: ${createdempDetails.EEID}`);
      } catch (error) {
        console.error(`Error inserting row: ${error.message}`);
      }
    });

    console.log('Data successfully inserted into userDetails and user_country tables');
  } catch (error) {
    console.error('Error:', error.message);
  } 
};
// Specify the path to your Excel file
const excelFilePath = 'C:\\Users\\Asus\\Downloads\\emp1.xlsx';

readExcel(excelFilePath);