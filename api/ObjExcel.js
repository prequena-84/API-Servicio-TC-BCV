let excelData = {
    name:''
};

function setDataExcel(nombre) {
    excelData.name = nombre;
};

function getDataExcel() {
    return excelData.name;
};

module.exports = {
    setDataExcel,
    getDataExcel
};