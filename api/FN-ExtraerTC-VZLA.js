const path = require('path');
const XLSX = require('xlsx');
const { getDataExcel } = require('./ObjExcel'); 

module.exports = function (tipoCambio) {
    try {
        //Definición de Variablkes
        let 
            //Definición de Objecto
            objExcel1 = [],
            objExcel2 = []
        ;

        //Definición de Constantes
        const 
            //Definición de la Ruta del Archivo en Servidor
            ruta = path.join(path.resolve(__dirname, '..'), `/download/${getDataExcel()}`),
            //Leer el archivo LA RUTA del archivo
            workbook = XLSX.readFile(ruta),
            //Obtener el nombre de la primera hoja
            sheetName = workbook.SheetNames[0]
        ;

        // Convertir los datos de la hoja en JSON
        const 
            sheet = workbook.Sheets[sheetName],
            data = XLSX.utils.sheet_to_json(sheet)
        ;

        data.map(item => {
            if ( item['BANCO CENTRAL DE VENEZUELA'] == '' ) {
                objExcel1.push({
                    column: item
                });
            };
        });

        const 
            objecto = objExcel1[0].column,
            clave = Object.keys(objecto),
            claveFecha = clave[clave.length - 1]
        ;

        /**Validar la selecciòn correcta de la Hoja del TC
         *console.log(claveFecha);
        *Fin de la prueba de Validación del Nombre de la Hoja
        */

        //Ejemplo de Lectura
        data.map(item => {
            if (item['BANCO CENTRAL DE VENEZUELA'] == tipoCambio) {
                objExcel2.push({
                    'Moneda/País':item.__EMPTY,
                    'Compra1':item.__EMPTY_1,
                    'Venta1':item.__EMPTY_2,
                    'Compra2':item.__EMPTY_3,
                    'Venta2':item[`${claveFecha}`]
                });
            };
        });

        //Returno del Objecto
        return {
            Moneda: objExcel2[0]['Moneda/País'],
            Compra: objExcel2[0].Compra2,
            Venta:  objExcel2[0].Venta2,
        };

    } catch(err) {
        return {
            Moneda:'',
            Compra: '',
            Venta: '',
        };
    };
};