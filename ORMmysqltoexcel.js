const fs = require('fs');
const ExcelJS = require('exceljs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('world', 'root', 'root555', {
  host: 'localhost',
  dialect: 'mysql',
});
const empdetails = sequelize.define('empdetails', {
  EEID: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  Full_Name: {
    type: DataTypes.STRING,
  },
  Job_Title:{
    type:DataTypes.STRING,
  },
  Department:{
    type:DataTypes.STRING,
  },
  }, {
    tableName: 'empdetails',
  });
async function exportDataToExcel() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const data = await empdetails.findAll({
      attributes: ['EEID','Full_Name','Job_Title', 'Department'],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
     const headers = Object.keys(empdetails.rawAttributes);
     worksheet.addRow(headers);
    for (const row of data) {
      worksheet.addRow(Object.values(row.dataValues));
    }
    const excelFilePath = 'C:/Users/Asus/Desktop/file3.xlsx';
    await workbook.xlsx.writeFile(excelFilePath);

    console.log('Data exported to Excel successfully.');
  } catch (error) {
    console.error('Error exporting data to Excel:', error);
  } finally {
    await sequelize.close();
  }
}


exportDataToExcel()