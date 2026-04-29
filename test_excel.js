const XLSX = require('xlsx');
const path = require('path');
const nameExcel = 'Tasa_de_Cambio_Referencia_BCV.xls';
const ruta = path.join(__dirname, 'src', 'download', nameExcel);
const workbook = XLSX.readFile(ruta);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

const objExcel1 = [];
data.forEach(item => {
    if (item['BANCO CENTRAL DE VENEZUELA'] == '') {
        objExcel1.push({ column: item });
    }
});
const objecto = objExcel1[0].column;
const clave = Object.keys(objecto);
const claveFecha = clave[clave.length - 1];
console.log("CLAVE_FECHA:", claveFecha);
console.log("CLAVE_FECHA TYPE:", typeof claveFecha);
